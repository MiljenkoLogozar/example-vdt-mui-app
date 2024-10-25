/* eslint-disable no-underscore-dangle */
import { useEffect, useMemo, useRef } from 'react';

import { Paper, useMediaQuery } from '@mui/material';
import _merge from 'lodash.merge';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';

import { MetadataField as MetadataFieldApi } from '@vidispine/api';
import type { FacetType } from '@vidispine/types';
import {
  CheckboxGroupInput,
  DateRangeInput,
  SearchFilterForm,
  SelectInput,
} from '@vidispine/vdt-mui';

import { PropsFrom } from '../../_types';

import { SEARCH_FILTER_FIELD_NAMES } from './consts';

import type { UseFormReturn } from 'react-hook-form';

type SearchFilterInputProp<T extends React.ElementType> = PropsFrom<T> & { Component?: T };

const TRANSIENT_FIELDS = {
  __user: {
    name: '__user',
    type: 'string',
  },
  __metadata_last_modified: {
    name: '__metadata_last_modified',
    type: 'date',
  },
};

const useSearchFilterFieldList = ({ fieldNames: mixedFieldNames, dataKeys }) => {
  const transientFieldNames = mixedFieldNames.filter((n) => n.startsWith('__'));
  const fieldNames = mixedFieldNames.filter((n) => !n.startsWith('__'));
  const filterFieldQueries = useQueries(
    fieldNames.map((name) => ({
      queryKey: ['field', name, dataKeys],
      queryFn: async () => {
        const { data } = await MetadataFieldApi.getMetadataField({
          pathParams: {
            name,
          },
          queryParams: {
            includeValues: true,
            data: dataKeys,
          },
        });
        return data;
      },
    })),
  );

  // Merge and sort in the order fieldNames are sent in
  const fieldList = [
    ...filterFieldQueries.map((q) => q.data),
    ...transientFieldNames.map((name) => TRANSIENT_FIELDS[name]),
  ].sort((a, b) => mixedFieldNames.indexOf(a.name) - mixedFieldNames.indexOf(b.name));

  return {
    fieldList,
    isLoading: filterFieldQueries.some((q) => q.isLoading),
  };
};

const SEARCH_FILTER_DATA_KEYS = ['label', 'placeholder'];

type SearchFilterProps = {
  facetList: FacetType[];
  defaultValues: {
    [name: string]: any;
  };
  onChange: (values: object) => void;
};

export function SearchFilter({ facetList, defaultValues = {}, onChange }: SearchFilterProps) {
  const { fieldList, isLoading: isLoadingFilters } = useSearchFilterFieldList({
    fieldNames: SEARCH_FILTER_FIELD_NAMES,
    dataKeys: SEARCH_FILTER_DATA_KEYS,
  });

  const formReturnRef = useRef<UseFormReturn>();

  const { t } = useTranslation();

  const labels = useMemo(
    () => ({
      mediaType: t('Media Type'),
      mimeType: t('Mime Type'),
      originalHeight: t('Height'),
      originalWidth: t('Width'),
      originalVideoCodec: t('Video Codec'),
      originalAudioCodec: t('Audio Codec'),
      title: t('Title'),
      __user: t('User'),
      created: t('Created'),
      __metadata_last_modified: t('Last Modified'),
    }),
    [t],
  );

  const inputsProps = useMemo(
    () =>
      _merge(
        Object.fromEntries(
          SEARCH_FILTER_FIELD_NAMES.map((name) => [
            name,
            {
              label: labels[name],
              defaultValue: defaultValues[name],
            },
          ]),
        ),
        {
          originalAudioCodec: {
            Component: CheckboxGroupInput,
            orientation: 'vertical',
          } as SearchFilterInputProp<typeof CheckboxGroupInput>,
          created: {
            Component: DateRangeInput,
            disableFuture: true,
          } as SearchFilterInputProp<typeof DateRangeInput>,
          __metadata_last_modified: {
            Component: DateRangeInput,
            disableFuture: true,
          } as SearchFilterInputProp<typeof DateRangeInput>,
          __user: {
            Component: SelectInput,
          } as SearchFilterInputProp<typeof SelectInput>,
        },
      ),
    [defaultValues, labels],
  );

  const heightBelow1100Pixels = useMediaQuery('(max-height:1100px)');

  // Example using formReturn props
  const createdValue = formReturnRef.current?.watch('created');
  useEffect(() => {
    // eslint-disable-next-line no-console
    if (createdValue) console.log(`created changed to: ${JSON.stringify(createdValue)}`);
  }, [createdValue]);

  if (isLoadingFilters) {
    return null;
  }

  return (
    <Paper elevation={0} sx={{ padding: 3, paddingBottom: 1 }}>
      <SearchFilterForm
        fieldList={fieldList}
        facetList={facetList}
        inputsProps={inputsProps}
        onChange={(_, filterState) => onChange(filterState)}
        // Active but don't need to handle externally
        onClear={() => null}
        onReset={() => null}
        componentsProps={{
          form: {
            variant: 'outlined',
            size: heightBelow1100Pixels ? 'small' : 'medium',
            formReturnRef,
          },
        }}
      />
    </Paper>
  );
}
