export interface RecipeModel {
  Name: string
  Id?: string
  Category: string | null
  Ingredients: IngredientModel[]
}

export interface IngredientModel {
  Name: string
  Id?: string
  UnitType: string
  Amount: number
}
