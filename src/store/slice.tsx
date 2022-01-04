import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { RecipeModel, IngredientModel } from '../models'
import { RootState } from './store'

export interface AppState {
  isAuthenticated: boolean
  value: number
  ingredient: string
  recipes: RecipeModel[]
  activeCategory: string | null
}

const createId = () => {
  let id = '1'
  for (let i = 0; i < 14; i++) {
    id = id + Math.floor(Math.random() * 10).toString()
  }
  return Number(id)
}
export const name = 'slice'
const port = 'http://localhost:4000'

export const initialState: AppState = {
  isAuthenticated: false,
  value: 0,
  ingredient: 'Spagethi',
  recipes: [],
  activeCategory: null,
}

export const createIngredient = createAsyncThunk(
  `${name}/createIngredient`,
  async (recipe: RecipeModel, thunkApi) => {
    const { dispatch } = thunkApi
    const emptyIngredient: IngredientModel = {
      Name: 'New ingredient',
      Id: createId(),
      UnitType: '',
      Amount: 0,
    }
    const newRecipe = { ...recipe, Ingredients: [...recipe.Ingredients, emptyIngredient] }
    const res = await axios.put(`${port}/Recipes/${recipe.Id}`, newRecipe)
    dispatch(fetchRecipes())
    return res
  }
)

export const createRecipe = createAsyncThunk(`${name}/createRecipe`, async (_, thunkApi) => {
  const { dispatch, getState } = thunkApi
  const currentState: RootState = getState() as RootState
  const emptyRecipe: RecipeModel = {
    Name: 'New recipe',
    Id: createId(),
    Category: (currentState.slice as AppState).activeCategory,
    Ingredients: [],
  }
  const res = await axios.post(`${port}/Recipes`, emptyRecipe)
  dispatch(fetchRecipes())
  return res
})

export const updateRecipe = createAsyncThunk(
  `${name}/saveRecipe`,
  async (recipe: RecipeModel, thunkApi) => {
    const { dispatch } = thunkApi
    const res = await axios.put(`${port}/Recipes/${recipe.Id}`, recipe)
    dispatch(fetchRecipes())
    return res
  }
)

export const deleteRecipe = createAsyncThunk(
  `${name}/deleteRecipe`,
  async (recipeId: number, thunkApi) => {
    const { dispatch } = thunkApi
    const res = await axios.delete(`${port}/Recipes/${recipeId}`)
    dispatch(fetchRecipes())
    return res
  }
)

export const deleteIngredient = createAsyncThunk(
  `${name}/deleteIngredient`,
  async ({ recipeId, ingredientId }: { recipeId: number; ingredientId: number }, thunkApi) => {
    const { dispatch } = thunkApi
    const res = await axios.delete(`${port}/Recipes/${recipeId}/Ingredients/${ingredientId}`)
    dispatch(fetchRecipes())
    return res
  }
)

export const fetchRecipes = createAsyncThunk(`${name}/fetchRecipes`, async () => {
  return await axios.get(`${port}/Recipes`)
})

const counterSlice: any = createSlice({
  name: 'counter',
  initialState,
  extraReducers: {
    [createIngredient.fulfilled.type]: (state, action) => {
      state.ingredient = action.payload
    },
    [fetchRecipes.fulfilled.type]: (state, action) => {
      state.recipes = action.payload.data
    },
  },
  reducers: {
    setActiveCategory(state, action) {
      state.activeCategory = action.payload
    },
    setAuthenticationStatus(state, action) {
      state.isAuthenticated = action.payload
    },
  },
})

export const { setActiveCategory, setAuthenticationStatus } = counterSlice.actions
export default counterSlice.reducer
