import { Science } from '@mui/icons-material';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import { ItemCard } from '@vidispine/vdt-mui';

const StyledItemCard = styled(ItemCard)(() => ({
  '.VdtItemCard-cardActions': {
    justifyContent: 'end',
  },
}));

export default function ItemGrid({ itemListType, onClick, onDemoClick }) {
  const { item = [] } = itemListType;
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, 380px)',
        rowGap: 2,
        columnGap: 1,
        justifyContent: 'space-evenly',
      }}
    >
      {item?.map((itemType) => (
        <StyledItemCard
          key={itemType.id}
          sx={{
            width: '380px',
            height: 'auto',
            alignSelf: 'stretch',
          }}
          itemType={itemType}
          title="title"
          subheader="user"
          content="dsc"
          onClick={onClick}
          onActionClick={(_e, { action }) => {
            if (action.name === 'demo') {
              onDemoClick(itemType.id);
            }
          }}
          actions={[
            {
              name: 'demo',
              Icon: Science,
            },
          ]}
        />
      ))}
    </Box>
  );
}
