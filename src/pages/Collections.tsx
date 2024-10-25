import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { Collection as CollectionApi } from '@vidispine/api';
import { parseMetadataType } from '@vidispine/vdt-js';
import { CollectionList as VdtCollectionList } from '@vidispine/vdt-mui';

// styled example
const CollectionList = styled(VdtCollectionList)(({ theme }) => ({
  '& .VdtCollectionList-listItem': {
    backgroundColor: theme.palette.background.paper,
    '& .VdtEntityAvatar-root': {
      backgroundColor: 'unset',
      '& .VdtEntityIcon-collectionIcon': {
        color: theme.palette.primary.main,
      },
    },
  },
}));

function Collections() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const number = 10;
  const searchCollectionProps = {
    data: {},
    queryParams: {
      content: ['metadata'],
      number,
    },
  };
  const { data: collectionListType, isLoading } = useQuery(
    ['searchItem', searchCollectionProps],
    async () => {
      const { data } = await CollectionApi.searchCollection(searchCollectionProps);
      return data;
    },
  );

  return (
    <Container maxWidth="sm" sx={{ height: 'calc(100vh - 58px)', paddingTop: 4, paddingBottom: 4 }}>
      <CollectionList
        collectionListType={collectionListType}
        primary="title"
        secondary={({ collectionType }) => {
          const { user } = parseMetadataType(collectionType.metadata, {
            flat: true,
            joinValue: ',',
          });
          return `${t('Created by')} ${user}`;
        }}
        onListItemClick={(e, { collectionType }) => {
          navigate(`/collection/${collectionType?.id}`);
        }}
        isLoading={isLoading}
        amountLoading={number}
      />
    </Container>
  );
}

export default Collections;
