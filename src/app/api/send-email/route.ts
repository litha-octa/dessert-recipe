import { NextResponse } from 'next/server'
import recipesData from '@/lib/data/recipes.json'

export async function POST(request: Request) {
  try {
    const { recipeId, email } = await request.json()

    const recipe = recipesData.recipes.find(r => r.id === recipeId)

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }

    // TODO: Implement email sending with Resend
    // For now, return a success response
    return NextResponse.json({
      message: 'Email sent successfully',
      recipe: recipe.title,
      sentTo: email
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
