export interface RecipeModel {
    Name: string
    Id?: number
    Category: string | null
    Ingredients: IngredientModel[]
}

export interface IngredientModel {
    Name: string
    Id?: number
    UnitType: string
    Amount: number
}
