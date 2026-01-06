import { notFound } from "next/navigation";
import recipesData from "@/lib/data/recipes.json";
import { Clock } from "lucide-react";

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
    return {
      title: "Recipe Not Found",
    };
  }

  return {
    title: `${recipe.title} - Sweet Recipes Hub`,
    description: recipe.description,
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = recipesData.recipes.find((r) => r.slug === slug);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-primary-50">
      {/* Recipe Header */}
      <div className="relative h-120 bg-gray-200">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${recipe.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl ">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-primary-500 text-white rounded-full mb-4">
              {recipe.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {recipe.title}
            </h1>
            <p className="text-lg text-white/90">{recipe.description}</p>
          </div>
          <div className="mt-8 flex gap-4">
            <button className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
              Download PDF
            </button>
            <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Share on WhatsApp
            </button>
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Share on Email
            </button>
          </div>
        </div>
      </div>

      {/* Recipe Info */}
      <div className="max-w-5xl px-5 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Time & Servings */}
          <div className="p-6 bg-white rounded-xl shadow-card flex-1">
            <h2 className="text-lg font-bold text-gray-700 mb-3">Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Prep Time</p>
                <p className="text-md font-semibold text-gray-700">
                  {recipe.prepTime} mins
                </p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Cook Time</div>
                <p className="text-md font-semibold text-gray-700">
                  {recipe.cookTime} mins
                </p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Servings</p>
                <p className="text-md font-semibold text-gray-700">
                  {recipe.servings}
                </p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className={`text-xs text-gray-500 `}>Difficulty</p>
                <p
                  className={`text-sm font-normal ${
                    recipe.difficulty === "hard"
                      ? "bg-red-300 text-red-700"
                      : recipe.difficulty === "medium"
                      ? "bg-yellow-300 text-yellow-700"
                      : "bg-green-300 text-green-700"
                  } rounded-full inline-block px-2 py-1 capitalize`}
                >
                  {recipe.difficulty}
                </p>
              </div>
            </div>
          </div>
          {/* Nutrition Info */}
          {recipe.nutritionInfo && (
            <div className="p-6 bg-white rounded-xl shadow-card flex-1">
              <h2 className="text-lg font-bold mb-3 text-gray-700">
                Nutrition
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Calories</p>
                  <p className="text-md font-semibold text-gray-700">
                    {recipe.nutritionInfo.calories}
                  </p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Protein</p>
                  <p className="text-md font-semibold text-gray-700">
                    {recipe.nutritionInfo.protein}
                  </p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Carbs</p>
                  <p className="text-md font-semibold text-gray-700">
                    {recipe.nutritionInfo.carbs}
                  </p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Fat</p>
                  <p className="text-md font-semibold text-gray-700">
                    {recipe.nutritionInfo.fat}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-primary-700">
                    {ingredient.amount} {ingredient.unit} {ingredient.item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">
              Instructions
            </h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <p className="text-black font-bold">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Share Buttons */}
      </div>
    </main>
  );
}
