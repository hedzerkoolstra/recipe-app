import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RecipeModel, IngredientModel } from '../models'
import {
  getFirestore,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
} from 'firebase/firestore'
import firebase from 'firebase/compat/app'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'recipeapp-431a0.firebaseapp.com',
  projectId: 'recipeapp-431a0',
  storageBucket: 'recipeapp-431a0.appspot.com',
  messagingSenderId: '67063921684',
  appId: '1:67063921684:web:5b5321058eac574ab0bb01',
}

firebase.initializeApp(firebaseConfig)

export interface AppState {
  isAuthenticated: boolean
  uid: string | null
  recipes: RecipeModel[]
  activeCategory: string | null
}

export const initialState: AppState = {
  isAuthenticated: false,
  uid: null,
  recipes: [],
  activeCategory: null,
}

const createId = () => {
  let id = '1'
  for (let i = 0; i < 14; i++) {
    id = id + Math.floor(Math.random() * 10).toString()
  }
  return id
}

export const name = 'slice'
const db = getFirestore()

export const createRecipe = createAsyncThunk(`${name}/createRecipe`, async (_, thunkApi) => {
  const { dispatch, getState } = thunkApi
  const uid = (getState() as { slice: AppState }).slice.uid
  const newDoc = await addDoc(collection(db, 'users', uid!, 'Recipes'), {})
  const emptyRecipe: RecipeModel = {
    Name: 'New recipe',
    Id: newDoc.id,
    Category: '',
    Ingredients: [],
  }
  await setDoc(doc(db, 'users', uid!, 'Recipes', newDoc.id), emptyRecipe)
  dispatch(fetchRecipes())
})

export const deleteRecipe = createAsyncThunk(
  `${name}/deleteRecipe`,
  async (recipeId: string, thunkApi) => {
    const { dispatch, getState } = thunkApi
    const uid = (getState() as { slice: AppState }).slice.uid
    await deleteDoc(doc(db, 'users', uid!, 'Recipes', recipeId))
    dispatch(fetchRecipes())
  }
)

export const saveRecipe = createAsyncThunk(
  `${name}/saveRecipe`,
  async (recipeId: string, thunkApi) => {
    const { dispatch, getState } = thunkApi
    const uid = (getState() as { slice: AppState }).slice.uid
    const recipes = (getState() as { slice: AppState }).slice.recipes
    const updatedRecipe = recipes.find((recipe) => recipe.Id === recipeId)
    if (updatedRecipe) {
      await setDoc(doc(db, 'users', uid!, 'Recipes', recipeId), updatedRecipe)
    }
    dispatch(fetchRecipes())
  }
)

export const createIngredient = createAsyncThunk(
  `${name}/createIngredient`,
  async (recipe: RecipeModel, thunkApi) => {
    const { dispatch, getState } = thunkApi
    const uid = (getState() as { slice: AppState }).slice.uid
    const emptyIngredient: IngredientModel = {
      Name: 'New ingredient',
      Id: createId(),
      UnitType: 'Unit',
      Amount: 0,
    }
    const updatedRecipe = { ...recipe, Ingredients: [...recipe.Ingredients, emptyIngredient] }
    dispatch(updateRecipeUI(updatedRecipe))
    try {
      await setDoc(doc(db, 'users', uid!, 'Recipes', recipe.Id!), updatedRecipe)
    } catch (error) {
      dispatch(updateRecipeUI(recipe))
    }
  }
)

export const deleteIngredient = createAsyncThunk(
  `${name}/deleteIngredient`,
  async ({ recipe, ingredientId }: { recipe: RecipeModel; ingredientId: string }, thunkApi) => {
    const { dispatch, getState } = thunkApi
    const uid = (getState() as { slice: AppState }).slice.uid
    const updatedIngredients = recipe.Ingredients.filter(
      (ingredient) => ingredient.Id !== ingredientId
    )
    const updatedRecipe = {
      ...recipe,
      Ingredients: updatedIngredients,
    }
    dispatch(updateRecipeUI(updatedRecipe))
    try {
      await setDoc(doc(db, 'users', uid!, 'Recipes', recipe.Id!), updatedRecipe)
    } catch (error) {
      dispatch(updateRecipeUI(recipe))
    }
  }
)

export const fetchRecipes = createAsyncThunk(`${name}/fetchRecipes`, async (_, thunkApi) => {
  const { getState } = thunkApi
  const uid = (getState() as { slice: AppState }).slice.uid
  if (uid) {
    return await getDocs(collection(db, 'users', uid, 'Recipes'))
  }
})

const counterSlice: any = createSlice({
  name: 'counter',
  initialState,
  extraReducers: {
    [fetchRecipes.fulfilled.type]: (state, action) => {
      state.recipes = []
      action.payload.forEach((recipe: any) => {
        state.recipes.push(recipe.data())
      })
    },
  },
  reducers: {
    updateRecipeUI(state, action) {
      state.recipes = state.recipes.map((recipe) =>
        recipe.Id === action.payload.Id ? action.payload : recipe
      )
    },
    setActiveCategory(state, action) {
      state.activeCategory = action.payload
    },
    setAuthenticationStatus(state, action) {
      state.isAuthenticated = action.payload
    },
    setUserId(state, action) {
      state.uid = action.payload
    },
  },
})

export const { updateRecipeUI, setActiveCategory, setAuthenticationStatus, setUserId } =
  counterSlice.actions
export default counterSlice.reducer
