import DarkIcon from '@mui/icons-material/Brightness4';
import SystemIcon from '@mui/icons-material/Brightness6';
import LightIcon from '@mui/icons-material/Brightness7';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';

export default function ThemeToggle({ value = 'system', onChange = () => null }) {
  return (
    <ToggleButtonGroup value={value} exclusive fullWidth onChange={onChange}>
      <ToggleButton value="dark">
        <Tooltip title="Dark">
          <DarkIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="system">
        <Tooltip title="System">
          <SystemIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="light">
        <Tooltip title="Light">
          <LightIcon />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
