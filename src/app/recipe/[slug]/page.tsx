import { notFound } from "next/navigation";
import recipesData from "@/lib/data/recipes.json";
import { Clock, Users, ChefHat, Star } from "lucide-react";
import TimerPopup from "@/components/TimerPopup";
import ShoppingListPDF from "@/components/ShoppingListPDF";
import RecipeActions from "@/components/RecipeActions";
import RecipeDetailClient from "./RecipeDetailClient";

interface RecipePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return recipesData.recipes.map((recipe) => ({
    slug: recipe.slug,
  }));
}

export async function generateMetadata({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = recipesData.recipes.find((r) => r.slug === slug);

  if (!recipe) {
    return { title: "Recipe Not Found" };
  }

  return {
    title: `${recipe.title} - Sweet Recipes Hub`,
    description: recipe.description,
    openGraph: {
      title: `${recipe.title} - Sweet Recipes Hub`,
      description: recipe.description,
      images: [recipe.image],
    },
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = recipesData.recipes.find((r) => r.slug === slug);

  if (!recipe) {
    notFound();
  }

  return <RecipeDetailClient recipe={recipe} />;
}
