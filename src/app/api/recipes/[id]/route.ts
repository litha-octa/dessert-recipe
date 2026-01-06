import { NextResponse } from 'next/server'
import recipesData from '@/lib/data/recipes.json'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const recipe = recipesData.recipes.find(r => r.id === id)

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      recipe
    })
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipe' },
      { status: 500 }
    )
  }
}
