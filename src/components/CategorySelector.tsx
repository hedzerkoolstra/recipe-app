import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Stack, Button } from '@mui/material'
import { RecipeModel } from '../models'
import { setActiveCategory } from '../store/slice'
import { unwrapResult } from '@reduxjs/toolkit'
import { useAppDispatch } from '../store/hooks'

const CategorySelector = () => {
  const dispatch = useAppDispatch()

  // TODO: Find right type for the state
  const recipes = useSelector(({ slice: state }: any) => state.recipes)
  const activeCategory = useSelector(({ slice: state }: any) => state.activeCategory?.toUpperCase())

  const uniqueCategories: string[] = useMemo(() => {
    if (!recipes) return []
    const filteredCategories: string[] = recipes
      .map((recipe: RecipeModel) => recipe.Category?.toUpperCase())
      .filter((category: string) => !!category)
    return [...new Set(filteredCategories)]
  }, [recipes])

  const dispatchSetActiveCategory = async (category: string | null) => {
    try {
      await dispatch(setActiveCategory(category)).then(unwrapResult)
    } catch (error) {
      console.log('fail')
      console.log(error)
    }
  }

  return (
    <Stack direction="row" spacing={4} sx={{ my: 4 }}>
      <Button
        onClick={() => dispatchSetActiveCategory(null)}
        variant="contained"
        sx={{ fontWeight: `${!activeCategory ? 'bold' : 'dark'}` }}
      >
        {'all'}
      </Button>

      {uniqueCategories.map((category: string) => {
        return (
          <Button
            key={category}
            onClick={() => dispatchSetActiveCategory(category)}
            variant="contained"
            sx={{ fontWeight: `${activeCategory === category ? 'bold' : 'normal'}` }}
          >
            {category}
          </Button>
        )
      })}
    </Stack>
  )
}

export default CategorySelector
