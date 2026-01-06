import { NextResponse } from 'next/server'
import recipesData from '@/lib/data/recipes.json'
import { Recipe } from '@/types/recipe'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Get filter parameters
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')
    const maxPrepTime = searchParams.get('maxPrepTime')

    let recipes = recipesData.recipes as Recipe[]
    
    // Apply filters
    if (category) {
      recipes = recipes.filter(recipe => recipe.category === category)
    }
    
    if (difficulty) {
      recipes = recipes.filter(recipe => recipe.difficulty === difficulty)
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      recipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchLower) ||
        recipe.description.toLowerCase().includes(searchLower) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }
    
    if (maxPrepTime) {
      recipes = recipes.filter(recipe => recipe.prepTime <= parseInt(maxPrepTime))
    }
    
    return NextResponse.json({
      success: true,
      count: recipes.length,
      recipes
    })
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}
