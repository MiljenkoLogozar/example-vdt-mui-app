import { GridView, List as ListIcon, TableRows as TableRowsIcon } from '@mui/icons-material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

export const DEFAULT_LAYOUT = 'LIST';

export function SearchHeader({ layout, onChangeLayout }) {
  return (
    <ToggleButtonGroup
      exclusive
      onChange={(_e, value) => {
        onChangeLayout(value || 'TABLE');
      }}
      value={layout}
      size="small"
    >
      <ToggleButton value="TABLE">
        <TableRowsIcon />
      </ToggleButton>
      <ToggleButton value="GRID">
        <GridView />
      </ToggleButton>
      <ToggleButton value="LIST">
        <ListIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
