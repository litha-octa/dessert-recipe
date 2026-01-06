// Recipe type definitions

export type RecipeCategory = 'cake' | 'cookie' | 'pastry' | 'pudding' | 'ice-cream' | 'tart'
export type RecipeDifficulty = 'easy' | 'medium' | 'hard'

export interface Ingredient {
  item: string
  amount: string
  unit: string
}

export interface NutritionInfo {
  calories: number
  protein: string
  carbs: string
  fat: string
}

export interface Recipe {
  id: string
  slug: string
  title: string
  description: string
  image: string
  category: RecipeCategory
  difficulty: RecipeDifficulty
  prepTime: number      // in minutes
  cookTime: number      // in minutes
  servings: number
  ingredients: Ingredient[]
  instructions: string[]
  nutritionInfo?: NutritionInfo
  tags: string[]
  author: string
  datePublished: string
}

export interface RecipeFilters {
  category?: RecipeCategory
  difficulty?: RecipeDifficulty
  search?: string
  maxPrepTime?: number
}
