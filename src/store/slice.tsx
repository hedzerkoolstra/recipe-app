import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RecipeModel, IngredientModel } from '../models'
import { RootState } from './store'
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
    const newRecipe = { ...recipe, Ingredients: [...recipe.Ingredients, emptyIngredient] }
    await setDoc(doc(db, 'users', uid!, 'Recipes', recipe.Id!), newRecipe)
    dispatch(fetchRecipes())
  }
)

export const createRecipe = createAsyncThunk(`${name}/createRecipe`, async (_, thunkApi) => {
  const { dispatch, getState } = thunkApi
  const uid = (getState() as { slice: AppState }).slice.uid
  const currentState: RootState = getState() as RootState
  const newDoc = await addDoc(collection(db, 'users', uid!, 'Recipes'), {})
  const emptyRecipe: RecipeModel = {
    Name: 'New recipe',
    Id: newDoc.id,
    Category: (currentState.slice as AppState).activeCategory,
    Ingredients: [],
  }
  await setDoc(doc(db, 'users', uid!, 'Recipes', newDoc.id), emptyRecipe)
  dispatch(fetchRecipes())
})

export const updateRecipe = createAsyncThunk(
  `${name}/saveRecipe`,
  async (recipe: RecipeModel, thunkApi) => {
    const { dispatch, getState } = thunkApi
    const uid = (getState() as { slice: AppState }).slice.uid
    await setDoc(doc(db, 'users', uid!, 'Recipes', recipe.Id!), recipe)
    dispatch(fetchRecipes())
  }
)

export const deleteRecipe = createAsyncThunk(
  `${name}/deleteRecipe`,
  async (recipeId: string, thunkApi) => {
    const { dispatch, getState } = thunkApi
    const uid = (getState() as { slice: AppState }).slice.uid
    await deleteDoc(doc(db, 'users', uid!, 'Recipes', recipeId))
    dispatch(fetchRecipes())
  }
)

export const deleteIngredient = createAsyncThunk(
  `${name}/deleteIngredient`,
  async ({ recipeId, ingredientId }: { recipeId: string; ingredientId: string }, thunkApi) => {
    const { dispatch, getState } = thunkApi
    const recipes = (getState() as { slice: AppState }).slice.recipes
    const uid = (getState() as { slice: AppState }).slice.uid
    for (const recipe of recipes) {
      if (recipe.Id === recipeId) {
        const updatedIngredients = recipe.Ingredients.filter(
          (ingredient) => ingredient.Id !== ingredientId
        )
        await setDoc(doc(db, 'users', uid!, 'Recipes', recipe.Id!), {
          ...recipe,
          Ingredients: updatedIngredients,
        })
      }
    }
    dispatch(fetchRecipes())
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

export const { setActiveCategory, setAuthenticationStatus, setUserId } = counterSlice.actions
export default counterSlice.reducer
