import { useMemo, useCallback } from 'react'
import ContentEditable from 'react-contenteditable'
import { unwrapResult } from '@reduxjs/toolkit'
import { Card, CardHeader, CardContent, CardActions, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { RecipeModel, IngredientModel } from '../models'
import {
  saveRecipe,
  updateRecipeUI,
  deleteRecipe,
  createIngredient,
  deleteIngredient,
} from '../store/slice'
import { useAppDispatch } from '../store/hooks'

import Ingredient from '../components/Ingredient'

interface IProps {
  recipe: RecipeModel
}
const Recipe = (props: IProps) => {
  const dispatch = useAppDispatch()

  const updateRecipeName = (evt: any) => {
    dispatch(updateRecipeUI({ ...props.recipe, Name: evt.target.value }))
  }

  const updateRecipeCategory = (evt: any) => {
    dispatch(updateRecipeUI({ ...props.recipe, Category: evt.target.value }))
  }

  const dispatchUpdateIngredient = useCallback(
    (updatedIngredient: IngredientModel) => {
      const updatedIngredients = props.recipe.Ingredients.map((ingredient) => {
        return ingredient.Id === updatedIngredient.Id ? updatedIngredient : ingredient
      })
      dispatch(updateRecipeUI({ ...props.recipe, Ingredients: updatedIngredients }))
    },
    [dispatch, props.recipe]
  )

  const dispatchSaveRecipe = useCallback(async () => {
    try {
      await dispatch(saveRecipe(props.recipe.Id!)).then(unwrapResult)
    } catch (error) {
      console.log('fail')
    }
  }, [dispatch, props])

  const dispatchDeleteRecipe = async () => {
    try {
      await dispatch(deleteRecipe(props.recipe.Id!)).then(unwrapResult)
    } catch (error) {
      console.log('fail')
    }
  }

  const dispatchDeleteIngredient = useCallback(
    async (ingredientId: string) => {
      try {
        await dispatch(deleteIngredient({ recipe: props.recipe, ingredientId: ingredientId })).then(
          unwrapResult
        )
      } catch (error) {
        console.log('fail')
      }
    },
    [dispatch, props]
  )

  const dispatchAddIngredient = useCallback(async () => {
    try {
      await dispatch(createIngredient(props.recipe)).then(unwrapResult)
    } catch (error) {
      console.log('fail')
    }
  }, [dispatch, props])

  const ingredientList = useMemo(() => {
    return (
      <CardContent>
        {props.recipe.Ingredients.map((ingredient: any) => (
          <Ingredient
            key={ingredient.Id}
            Ingredient={ingredient}
            emitUpdateIngredient={dispatchUpdateIngredient}
            emitDeleteIngredient={dispatchDeleteIngredient}
            emitSaveRecipe={dispatchSaveRecipe}
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
  }, [
    props,
    dispatchAddIngredient,
    dispatchDeleteIngredient,
    dispatchSaveRecipe,
    dispatchUpdateIngredient,
  ])

  return (
    <Card>
      <CardHeader
        title={
          <ContentEditable
            html={props.recipe.Name}
            disabled={false}
            onChange={updateRecipeName}
            onBlur={dispatchSaveRecipe}
          />
        }
        subheader={
          <ContentEditable
            html={props.recipe.Category || 'No category'}
            disabled={false}
            onChange={updateRecipeCategory}
            onBlur={dispatchSaveRecipe}
          />
        }
      ></CardHeader>

      {ingredientList}

      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <IconButton onClick={dispatchDeleteRecipe} aria-label="delete recipe">
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default Recipe
