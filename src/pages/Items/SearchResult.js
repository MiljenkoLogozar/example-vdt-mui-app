import { Science as ScienceIcon } from '@mui/icons-material';
import { IconButton, LinearProgress, ListItemSecondaryAction } from '@mui/material';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { parseMetadataType } from '@vidispine/vdt-js';
import { ItemList as VdtItemList, ItemTable } from '@vidispine/vdt-mui';

import ItemGrid from '../ItemGrid';

// styled example
const ItemList = styled(VdtItemList)(({ theme }) => ({
  '& .VdtItemList-listItem': {
    '& .VdtEntityAvatar-root': {
      backgroundColor: theme.palette.background.paper,
      '& .VdtMediaIcon-root': {
        color: theme.palette.primary.main,
      },
    },
  },
}));

function CustomListItemSecondaryAction({ itemType, onClick }) {
  const { id } = itemType || {};
  return (
    <ListItemSecondaryAction>
      <IconButton onClick={() => onClick && onClick(id)}>
        <ScienceIcon />
      </IconButton>
    </ListItemSecondaryAction>
  );
}

export function SearchResult({
  itemListType,
  layout,
  isLoading,
  isFetching,
  amountLoading,
  onClick,
  onDemoClick,
}) {
  const { t } = useTranslation();

  const labels = {
    title: t('Title'),
    mediaType: t('Media Type'),
    mimeType: t('Mime Type'),
    user: t('User'),
    created: t('Created'),
    __metadata_last_modified: t('Last Modified'),
  };

  const handleClick = (e, { itemType: { id } }) => {
    onClick(id);
  };

  const getCreatedRelativeTime = ({ itemType }) => {
    const { created } = parseMetadataType(itemType.metadata, {
      flat: true,
      joinValue: ', ',
    });
    return created ? dayjs(created).fromNow() : '-';
  };

  const getLastModifiedRelativeTime = ({ itemType }) => {
    const { __metadata_last_modified: lastModified } = parseMetadataType(itemType.metadata, {
      flat: true,
      joinValue: ', ',
    });
    return lastModified ? dayjs(lastModified).fromNow() : '-';
  };

  return (
    <div
      style={{
        height: 'inherit',
      }}
    >
      {isLoading || isFetching ? (
        <LinearProgress />
      ) : (
        <span style={{ display: 'block', height: 4, width: '100%' }} />
      )}
      <div
        style={{
          height: 'inherit',
          overflowY: 'scroll',
          paddingLeft: 16,
        }}
      >
        {layout === 'LIST' && (
          <ItemList
            itemListType={itemListType}
            primary="title"
            secondary={getCreatedRelativeTime}
            onListItemClick={handleClick}
            isLoading={isLoading}
            amountLoading={amountLoading}
            componentsProps={{
              listItem: {
                components: {
                  ListItemSecondaryAction: CustomListItemSecondaryAction,
                },
                componentsProps: {
                  listItemSecondaryAction: { onClick: onDemoClick },
                },
              },
            }}
          />
        )}
        {layout === 'TABLE' && (
          <ItemTable
            itemListType={itemListType}
            isLoading={isLoading}
            amountLoading={amountLoading}
            rows={[
              {
                label: labels.title,
                value: 'title',
              },
              {
                label: labels.mediaType,
                value: 'mediaType',
              },
              {
                label: labels.mimeType,
                value: 'mimeType',
              },
              {
                label: labels.user,
                value: 'user',
              },
              {
                label: labels.created,
                value: getCreatedRelativeTime,
              },
              {
                // eslint-disable-next-line no-underscore-dangle
                label: labels.__metadata_last_modified,
                value: getLastModifiedRelativeTime,
              },
            ]}
            onRowClick={handleClick}
            onCheck={() => null}
          />
        )}
        {layout === 'GRID' && (
          <ItemGrid itemListType={itemListType} onClick={handleClick} onDemoClick={onDemoClick} />
        )}
      </div>
    </div>
  );
}
