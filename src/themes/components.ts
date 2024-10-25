import grey from '@mui/material/colors/grey';

const MuiCssBaseline = {
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
};

const MuiButton = {
  defaultProps: {
    disableElevation: true,
  },
  styleOverrides: {
    root: { borderRadius: '0px', fontSize: '1em' },
  },
};
const MuiToggleButtonGroup = {
  defaultProps: {
    size: 'small' as const,
  },
  styleOverrides: {
    root: { borderRadius: '0px' },
  },
};
const MuiToggleButton = {
  defaultProps: {
    size: 'small' as const,
  },
  styleOverrides: {
    root: { borderRadius: '0px' },
  },
};
const MuiOutlinedInput = {
  styleOverrides: {
    root: { borderRadius: '0px' },
  },
};
const MuiTableCell = { styleOverrides: { head: { fontWeight: '600' } } };

/* Vdt theme override examples */

const VdtItemTable = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& th': {
        color: theme.palette.primary.dark,
        fontWeight: 'bold',
      },
    }),
  },
};

// const VdtItemList = {
//   defaultProps: {
//     dense: true,
//     header: 'My item list',
//     componentsProps: {
//       listSubheader: {
//         color: 'primary',
//       },
//     },
//   },
//   styleOverrides: {
//     root: ({ theme }) => {
//       theme.spacing(1);
//     },
//   },
// };

// const VdtCollectionList = {
//   styleOverrides: {
//     root: ({ theme }) => ({
//       border: '1px solid',
//       borderColor: theme.palette.primary.main,
//       paddingTop: 0,
//       paddingBottom: 0,
//       '& .VdtCollectionList-listItem': {
//         padding: 0,
//       },
//     }),
//   },
// };

export default {
  MuiCssBaseline,
  MuiButton,
  MuiToggleButtonGroup,
  MuiToggleButton,
  MuiOutlinedInput,
  MuiTableCell,
  VdtItemTable,
  // VdtItemList,
  // VdtCollectionList,
};
