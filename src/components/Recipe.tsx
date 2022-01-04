import { useMemo, useState, useCallback } from 'react'
import ContentEditable from 'react-contenteditable'
import { unwrapResult } from '@reduxjs/toolkit'
import { Card, CardHeader, CardContent, CardActions, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import AddIcon from '@mui/icons-material/Add'
import { RecipeModel, IngredientModel } from '../models'
import { updateRecipe, deleteRecipe, deleteIngredient, createIngredient } from '../store/slice'
import { useAppDispatch } from '../store/hooks'

import Ingredient from '../components/Ingredient'

interface IProps {
  recipe: RecipeModel
}
const Recipe = (props: IProps) => {
  const dispatch = useAppDispatch()

  const [isDirty, setIsDirty] = useState(false)
  const [recipeName, setRecipeName] = useState<string>(props.recipe.Name)
  const [recipeCategory, setRecipeCategory] = useState<string | null>(props.recipe.Category)
  const [recipeIngredients, setRecipeIngredients] = useState<IngredientModel[]>(
    props.recipe.Ingredients
  )

  const updateRecipeName = (evt: any) => {
    setIsDirty(true)
    setRecipeName(evt.target.value)
  }

  const updateRecipeCategory = (evt: any) => {
    setIsDirty(true)
    setRecipeCategory(evt.target.value)
  }

  const updateIngredient = useCallback(
    (updatedIngredient: IngredientModel) => {
      setIsDirty(true)
      const updatedIngredients = props.recipe.Ingredients.map((ingredient) => {
        return ingredient.Id === updatedIngredient.Id ? updatedIngredient : ingredient
      })
      setRecipeIngredients(updatedIngredients)
    },
    [props]
  )

  const dispatchSaveRecipe = async () => {
    const updatedRecipe: RecipeModel = {
      ...props.recipe,
      Name: recipeName,
      Category: recipeCategory,
      Ingredients: recipeIngredients,
    }
    try {
      await dispatch(updateRecipe(updatedRecipe)).then(unwrapResult)
      setIsDirty(false)
    } catch (error) {
      console.log('fail')
    }
  }

  const dispatchDeleteRecipe = async () => {
    try {
      await dispatch(deleteRecipe(props.recipe.Id!)).then(unwrapResult)
    } catch (error) {
      console.log('fail')
    }
  }

  const dispatchDeleteIngredient = async (ingredientId: number) => {
    try {
      await dispatch(
        deleteIngredient({ recipeId: props.recipe.Id!, ingredientId: ingredientId })
      ).then(unwrapResult)
    } catch (error) {
      console.log('fail')
    }
  }

  const dispatchAddIngredient = async () => {
    try {
      await dispatch(createIngredient(props.recipe)).then(unwrapResult)
    } catch (error) {
      console.log('fail')
    }
  }

  const ingredientList = useMemo(() => {
    return (
      <CardContent>
        {props.recipe.Ingredients.map((ingredient: any) => (
          <Ingredient
            key={ingredient.Id}
            Ingredient={ingredient}
            emitUpdateIngredient={updateIngredient}
            emitDeleteIngredient={dispatchDeleteIngredient}
          />
        ))}

        <Button
          variant="contained"
          sx={{ ml: 2 }}
          onClick={dispatchAddIngredient}
          aria-label="add ingredient"
          startIcon={<AddIcon />}
        >
          Add ingredient
        </Button>
      </CardContent>
    )
    // TODO: Fix this properly
    // eslint-disable-next-line
  }, [props, updateIngredient])

  return (
    <Card raised={isDirty ? true : false}>
      <CardHeader
        title={<ContentEditable html={recipeName} disabled={false} onChange={updateRecipeName} />}
        subheader={
          <ContentEditable
            html={recipeCategory || 'No category'}
            disabled={false}
            onChange={updateRecipeCategory}
          />
        }
      ></CardHeader>

      {ingredientList}

      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <IconButton
          onClick={dispatchSaveRecipe}
          aria-label="save recipe"
          disabled={!isDirty || !recipeName}
        >
          <SaveIcon />
        </IconButton>
        <IconButton onClick={dispatchDeleteRecipe} aria-label="delete recipe">
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default Recipe
