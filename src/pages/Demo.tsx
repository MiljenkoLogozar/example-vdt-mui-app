import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { Item as ItemApi } from '@vidispine/api';
import { createMetadataType, parseMetadataType } from '@vidispine/vdt-js';
import { TextInput } from '@vidispine/vdt-mui';

function Demo() {
  const { itemId } = useParams();

  const queryParams = {
    content: ['metadata'],
    field: ['title', 'dsc'],
  };
  const { data: itemType, isFetching } = useQuery(['getItem', { queryParams }], async () => {
    const { data } = await ItemApi.getItem({ pathParams: { itemId }, queryParams });
    return data;
  });

  const { title, dsc } = parseMetadataType(itemType?.metadata, {
    flat: true,
    joinValue: ',',
  });

  return isFetching ? null : (
    <div style={{ width: 600, margin: 'auto' }}>
      <h2 style={{ textAlign: 'center' }}>Demo | Update Metadata</h2>
      <div style={{ display: 'grid', gridGap: 16, gridAutoFlow: 'column' }}>
        <TextInput
          label="Title"
          defaultValue={title as unknown as string}
          onChange={(_event, { value }) => {
            ItemApi.putItemMetadata({
              pathParams: {
                itemId,
              },
              data: createMetadataType({ title: value }),
            });
          }}
        />
        <TextInput
          label="Description"
          defaultValue={dsc as unknown as string}
          onChange={(_event, { value }) => {
            ItemApi.putItemMetadata({
              pathParams: {
                itemId,
              },
              data: createMetadataType({ dsc: value }),
            });
          }}
        />
      </div>
    </div>
  );
}

export default Demo;
