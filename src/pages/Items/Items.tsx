import { useEffect, useRef } from 'react';

import { Box, Container } from '@mui/material';
import _debounce from 'lodash.debounce';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import { Item as ItemApi } from '@vidispine/api';
import type { SearchFilterType } from '@vidispine/types';
import { createSearchFacetList } from '@vidispine/vdt-js';
import { TablePagination } from '@vidispine/vdt-mui';

import { useBrowserState } from '../useBrowserState';
import { useQueryState } from '../useQueryState';

import { SEARCH_FILTER_FIELD_NAMES } from './consts';
import { SearchFilter } from './SearchFilter';
import { SearchHeader, DEFAULT_LAYOUT } from './SearchHeader';
import { SearchResult } from './SearchResult';

type SearchState = {
  number: number;
  page: number;
  filter?: SearchFilterType;
  values?: { [key: string]: string };
};

const DEFAULT_SEARCH_STATE: SearchState = { number: 10, page: 0 };

export default function Items() {
  const navigate = useNavigate();
  const location = useLocation();

  const [layout, setLayout] = useBrowserState(DEFAULT_LAYOUT, { key: 'ITEMS_LAYOUT' });
  const [searchState, setSearchState] = useQueryState(DEFAULT_SEARCH_STATE, {
    navigate,
    location,
  });

  const { filter, values, number, page } = searchState;

  const defaultValues = useRef(values).current;

  const facet = createSearchFacetList([
    ...SEARCH_FILTER_FIELD_NAMES.filter((n) => !['originalWidth', 'originalHeight'].includes(n)),
    {
      field: 'originalWidth',
      name: 'originalWidth',
      count: true,
      exclude: ['originalWidth', 'originalHeight'],
    },
    {
      field: 'originalHeight',
      name: 'originalHeight',
      count: true,
      exclude: ['originalHeight', 'originalWidth'],
    },
  ]);

  const searchItemProps: Parameters<typeof ItemApi.searchItem>['0'] = {
    data: { filter, facet },
    queryParams: {
      content: ['metadata', 'poster', 'thumbnail'],
      noauthUrl: true,
      number,
      first: Math.max(1, 1 + page * number),
    },
  };

  const {
    data: itemListType = {},
    isLoading,
    isFetching,
  } = useQuery(
    ['searchItem', searchItemProps],
    async () => {
      const { data } = await ItemApi.searchItem(searchItemProps);
      return data;
    },
    {
      keepPreviousData: true,
    },
  );

  const { hits, facet: facetList } = itemListType;

  useEffect(() => {
    const maxPage = Math.ceil(hits / number) - 1;
    if (page > 0 && page > maxPage) {
      setSearchState((curr) => ({ ...curr, page: maxPage }));
    }
  }, [hits, number, page, setSearchState]);

  const handleSearchFilterChange = (searchFilterState) =>
    setSearchState((curr) => ({ ...curr, ...searchFilterState }));

  const debouncedHandleSearchFilterChange = _debounce(handleSearchFilterChange, 500);

  return (
    <Container
      maxWidth={false}
      sx={{
        height: 'calc(100vh - 58px)',
        overflowY: 'auto',
        paddingTop: 2,
        paddingBottom: 2,
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', height: '100%' }}>
        <Box sx={{ flex: '1 1 100%', height: 40, textAlign: 'right' }}>
          <SearchHeader layout={layout} onChangeLayout={setLayout} />
        </Box>
        <Box sx={{ flex: '1 1 30%', padding: 1, maxHeight: 'calc(100% - 40px)' }}>
          <SearchFilter
            facetList={facetList}
            defaultValues={defaultValues}
            onChange={debouncedHandleSearchFilterChange}
          />
        </Box>
        <Box
          sx={{
            flex: '1 1 70%',
            padding: 1,
            height: 'calc(100% - 40px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <SearchResult
            itemListType={itemListType}
            layout={layout}
            isLoading={isLoading}
            isFetching={isFetching}
            onClick={(id) => navigate(`/item/${id}`)}
            onDemoClick={(id) => navigate(`/demo/${id}`)}
            amountLoading={number}
          />
          <TablePagination
            count={hits}
            page={page}
            rowsPerPage={number}
            onRowsPerPageChange={(_e, { value }) => {
              setSearchState((curr) => ({ ...curr, number: value }));
            }}
            onPageChange={(_e, { value }) => {
              setSearchState((curr) => ({ ...curr, page: value }));
            }}
          />
        </Box>
      </Box>
    </Container>
  );
}
