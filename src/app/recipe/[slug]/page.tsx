import { notFound } from "next/navigation";
import recipesData from "@/lib/data/recipes.json";
import { Clock, Users, ChefHat } from "lucide-react";
import TimerPopup from "@/components/TimerPopup";
import ShoppingListPDF from "@/components/ShoppingListPDF";
import RecipeActions from "@/components/RecipeActions";

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
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
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
          <RecipeActions />
        </div>
      </div>

      {/* Recipe Info */}
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Time & Servings */}
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ChefHat size={20} className="text-primary-500" />
              Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200">
                <Clock size={20} className="mx-auto mb-1 text-primary-600" />
                <p className="text-xs text-gray-600 font-medium">Prep Time</p>
                <p className="text-lg font-bold text-gray-800">
                  {recipe.prepTime}
                  <span className="text-xs font-normal text-gray-600">
                    {" "}
                    mins
                  </span>
                </p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <Clock size={20} className="mx-auto mb-1 text-orange-600" />
                <p className="text-xs text-gray-600 font-medium">Cook Time</p>
                <p className="text-lg font-bold text-gray-800">
                  {recipe.cookTime}
                  <span className="text-xs font-normal text-gray-600">
                    {" "}
                    mins
                  </span>
                </p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <Users size={20} className="mx-auto mb-1 text-blue-600" />
                <p className="text-xs text-gray-600 font-medium">Servings</p>
                <p className="text-lg font-bold text-gray-800">
                  {recipe.servings}
                </p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <ChefHat size={20} className="mx-auto mb-1 text-purple-600" />
                <p className="text-xs text-gray-600 font-medium">Difficulty</p>
                <span
                  className={`text-xs font-semibold mt-1 inline-block px-3 py-1 rounded-full ${
                    recipe.difficulty === "hard"
                      ? "bg-red-500 text-white"
                      : recipe.difficulty === "medium"
                      ? "bg-yellow-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {recipe.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Nutrition Info */}
          {recipe.nutritionInfo && (
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1">
              <h2 className="text-lg font-bold mb-4 text-gray-800">
                Nutrition Facts
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 font-medium">Calories</p>
                  <p className="text-lg font-bold text-gray-800">
                    {recipe.nutritionInfo.calories}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 font-medium">Protein</p>
                  <p className="text-lg font-bold text-gray-800">
                    {recipe.nutritionInfo.protein}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 font-medium">Carbs</p>
                  <p className="text-lg font-bold text-gray-800">
                    {recipe.nutritionInfo.carbs}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 font-medium">Fat</p>
                  <p className="text-lg font-bold text-gray-800">
                    {recipe.nutritionInfo.fat}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content - Ingredients & Instructions */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Ingredients - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 lg:sticky lg:top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Ingredients
                </h2>
                <span className="text-sm text-gray-500 bg-primary-100 px-3 py-1 rounded-full">
                  {recipe.ingredients.length} items
                </span>
              </div>

              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <label
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary-50 transition-colors cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="text-gray-800 leading-relaxed group-hover:text-primary-700 transition-colors">
                        <span className="font-semibold text-primary-600">
                          {ingredient.amount} {ingredient.unit}
                        </span>{" "}
                        {ingredient.item}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <ShoppingListPDF
                  recipeTitle={recipe.title}
                  ingredients={recipe.ingredients}
                  servings={recipe.servings}
                />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Instructions
              </h2>

              <div className="space-y-6">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1 pt-1">
                      <p className="text-gray-700 leading-relaxed text-base">
                        {instruction}
                      </p>

                      {/* Add timer button for steps with time mentions */}
                      {(instruction.toLowerCase().includes("minutes") ||
                        instruction.toLowerCase().includes("mins")) && (
                        <TimerPopup instruction={instruction} />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips Section (Optional) */}
              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                  💡 Chefs Tip
                </h3>
                <p className="text-sm text-amber-800">
                  For best results, make sure all ingredients are at room
                  temperature before starting. This helps everything mix
                  smoothly!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
