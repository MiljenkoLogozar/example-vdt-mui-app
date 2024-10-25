import { grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

import { vsPurple, vsBlue, vsTeal, vsTealLight, gradient1, gradient2 } from './colors';
import components from './components';
import { typography } from './typography';

const light = createTheme({
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
            backgroundColor: grey[300],
            minHeight: 24,
            border: `4px solid white`,
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
    mode: 'light',
    primary: {
      main: vsBlue,
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
      default: '#f2f5f8',
      paper: '#fff',
    },
  },
});

export default light;
