/* eslint-disable @typescript-eslint/no-unused-vars */
import { Container } from '@mui/material';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { Search as SearchApi } from '@vidispine/api';
import { EventList, EventListItem } from '@vidispine/vdt-mui';

import { PropsFrom } from '../_types';

export default function Timespans({ serverUrl }) {
  const navigate = useNavigate();
  const number = 100;
  const searchTimespanProps = {
    data: {},
    queryParams: {
      content: ['metadata', 'thumbnail'],
      number,
      methodType: 'AUTO',
      'noauth-url': true,
    },
  };
  const { data: searchResultType = {} } = useQuery(
    ['searchTimespans', searchTimespanProps],
    async () => {
      const { data } = await SearchApi.putSearchItemByMetadataGroup(searchTimespanProps);
      return data;
    },
  );
  const handleOpenClick: PropsFrom<typeof EventListItem>['onOpenClick'] = (
    _event,
    { itemType, collectionType },
  ) => {
    if (itemType) {
      navigate(`/item/${itemType?.id}`);
    } else if (collectionType) {
      navigate(`/collection/${collectionType?.id}`);
    }
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <EventList
        searchResultType={searchResultType}
        baseUrl={serverUrl}
        estimateItemSize={184}
        horizontalItemHeight={111}
        componentsProps={{
          listItem: { onOpenClick: handleOpenClick },
        }}
      />
    </Container>
  );
}
