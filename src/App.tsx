import Recipes from './pages/Recipes'
import Login from './pages/Login'
import { Container } from '@mui/material'
import CategorySelector from './components/CategorySelector'

const App = () => {
  return (
    <Container className="bg-blue-500" maxWidth="xl">
      {/* <CategorySelector />
      <Recipes /> */}
      <Login />
    </Container>
  )
}

export default App
