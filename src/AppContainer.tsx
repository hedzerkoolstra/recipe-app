import { Provider } from 'react-redux'
import { createTheme, ThemeProvider } from '@mui/material/styles'
// import , theme from './theme'
import App from './App'
import { store } from './store/store'
import './style/style.css'

function AppContainer() {
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

  return (
    <div className="App">
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Provider>
    </div>
  )
}

export default AppContainer
