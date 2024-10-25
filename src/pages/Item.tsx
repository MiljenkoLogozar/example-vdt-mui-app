import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useQuery, useQueryClient, useMutation, useQueries } from 'react-query';
import { useParams } from 'react-router-dom';

import { Item as ItemApi, MetadataField as MetadataFieldApi } from '@vidispine/api';
import type { MetadataType } from '@vidispine/types';
import { parseMetadataType } from '@vidispine/vdt-js';
import { MetadataForm } from '@vidispine/vdt-mui';

import { ItemPlayer as VdtItemPlayer } from '../components/ItemPlayer';

const ItemPlayer = styled(VdtItemPlayer)(() => ({
  flex: '1 1 auto',
  width: '50vw',
}));

const useEditMetadataFieldList = ({
  fieldNames,
  dataKeys,
}: {
  fieldNames: string[];
  dataKeys: string[];
}) => {
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

  // Sort in the order fieldNames are sent in
  const fieldList = filterFieldQueries
    .map((q) => q.data)
    .sort((a, b) => fieldNames.indexOf(a.name) - fieldNames.indexOf(b.name));

  return {
    fieldList,
    isLoading: filterFieldQueries.some((q) => q.isLoading),
  };
};

function Item() {
  const { itemId } = useParams();

  const searchParams = {
    pathParams: { itemId },
    queryParams: {
      content: ['thumbnail', 'metadata', 'shape'],
      methodMetadata: { format: 'SIGNED-AUTO' },
      noauthUrl: true,
    },
  };

  const queryClient = useQueryClient();

  const { data: itemType, isLoading } = useQuery(['getItem', searchParams], async () => {
    const { data } = await ItemApi.getItem(searchParams);
    return data;
  });

  const updateMetadata = useMutation(
    (metadata: MetadataType) => ItemApi.putItemMetadata({ pathParams: { itemId }, data: metadata }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('getItem');
      },
    },
  );

  const handleSubmit = (_, { metadata }: { metadata: MetadataType }) => {
    updateMetadata.mutate(metadata);
  };

  const { fieldList, isLoading: isLoadingFields } = useEditMetadataFieldList({
    fieldNames: [
      'title',
      'dsc',
      'created',
      'mediaType',
      'mimeType',
      'originalHeight',
      'originalWidth',
      'itemId',
    ],
    dataKeys: ['label'],
  });

  const { title } = parseMetadataType(itemType?.metadata, { flat: true }) as {
    title: string;
    [name: string]: any;
  };

  return (
    <Box sx={{ marginLeft: 2, marginRight: 2 }}>
      <Typography variant="h4" marginBottom={2} marginTop={2}>
        {itemId} | {title}
      </Typography>
      <div style={{ display: 'flex' }}>
        <ItemPlayer itemType={itemType} isLoading={isLoading} />
        {!isLoadingFields && !isLoading && itemType && fieldList?.length && (
          <Paper
            elevation={0}
            sx={{
              flexGrow: 1,
              minWidth: '300px',
              padding: 3,
              paddingBottom: 1,
              marginBottom: 1,
              borderRadius: 0,
            }}
          >
            <Typography variant="h6" pb={3}>
              Edit Metadata
            </Typography>
            <MetadataForm
              fieldList={fieldList}
              metadata={itemType?.metadata}
              onSubmit={handleSubmit}
              onReset={() => null}
              componentsProps={{
                form: {
                  variant: 'outlined',
                  size: 'small',
                },
              }}
            />
          </Paper>
        )}
      </div>
    </Box>
  );
}

export default Item;
