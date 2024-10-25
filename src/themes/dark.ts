import { grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

import { vsPurple, vsDarkModeBlue, vsTeal, vsTealLight, gradient1, gradient2 } from './colors';
import components from './components';
import { typography } from './typography';

const dark = createTheme({
  typography,
  // @ts-ignore
  components: {
    ...components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${grey[700]} ${grey[900]}`,
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: 'transparent',
            width: '16px',
            height: '16px',
            borderRadius: 10,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 10,
            backgroundColor: grey[700],
            minHeight: 24,
            border: `4px solid ${grey[900]}`,
          },
          '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
            backgroundColor: grey[500],
          },
          '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
            backgroundColor: grey[500],
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: grey[500],
          },
          '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: vsDarkModeBlue,
    },
    secondary: {
      main: vsPurple,
    },
    success: {
      light: vsTealLight,
      main: vsTeal,
    },
    background: {
      // @ts-ignore
      gradient1,
      gradient2,
      default: '#0B121C',
      paper: '#152235',
    },
  },
});

export default dark;
