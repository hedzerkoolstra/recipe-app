import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { fetchRecipes, createRecipe } from '../store/slice'
import Recipe from '../components/Recipe'
import { RecipeModel } from '../models'

export const Recipes = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchRecipes())
  }, [dispatch])

  const activeCategory = useSelector(({ slice: state }: any) => state.activeCategory)
  const recipes = useSelector(({ slice: state }: any) =>
    activeCategory
      ? state.recipes.filter(
          (recipe: RecipeModel) => recipe.Category?.toUpperCase() === activeCategory.toUpperCase()
        )
      : state.recipes
  )

  const dispatchCreateRecipe = () => {
    dispatch(createRecipe())
  }

  return (
    <Grid container spacing={4}>
      {recipes.map((recipe: any) => (
        <Grid key={recipe.Id} item xs={12} md={6} lg={4}>
          <Recipe recipe={recipe} />
        </Grid>
      ))}
      <Grid item xs={12} md={6} lg={4}>
        <IconButton
          onClick={dispatchCreateRecipe}
          className="w-full h-full"
          aria-label="create recipe"
        >
          <AddIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Grid>
    </Grid>
  )
}

export default Recipes
