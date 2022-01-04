import Recipes from './pages/Recipes'
import Login from './pages/Login'
import { Container } from '@mui/material'
import CategorySelector from './components/CategorySelector'
import { useSelector } from 'react-redux'

const App = () => {
  const isAuthenticated = useSelector(({ slice: state }: any) => state.isAuthenticated)

  return (
    <Container className="bg-blue-500" maxWidth="xl">
      {isAuthenticated ? (
        <>
          <CategorySelector />
          <Recipes />
        </>
      ) : (
        <Login />
      )}
    </Container>
  )
}

export default App
