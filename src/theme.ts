import { createTheme } from '@mui/material/styles'

const primary = '#FBD051'
const primaryDark = '#AF9138'
const black = '#232B2B'
const theme = createTheme({
  typography: {
    fontFamily: ['Satoshi', 'sans-serif'].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&.MuiButton-outlined': {
            //   backgroundColor: '#fff',
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          backgroundColor: black,
          color: '#fff',
        },
        title: {
          fontWeight: 'bold',
        },
        subheader: {
          color: '#fff',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          backgroundColor: primary,
          color: black,
          '&.Mui-disabled': {
            backgroundColor: primary,
          },
          '&:hover': {
            backgroundColor: primaryDark,
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: primary,
    },
  },
})

export default theme
