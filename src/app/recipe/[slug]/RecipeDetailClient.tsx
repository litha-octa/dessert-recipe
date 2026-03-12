"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Users, ChefHat, Star, ArrowLeft, Minus, Plus } from "lucide-react";
import TimerPopup from "@/components/TimerPopup";
import ShoppingListPDF from "@/components/ShoppingListPDF";
import RecipeActions from "@/components/RecipeActions";
import FavoriteButton from "@/components/FavoriteButton";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface Ingredient {
  item: string;
  amount: string;
  unit: string;
}

interface NutritionInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

interface RecipeData {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  difficulty: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  nutritionInfo?: NutritionInfo;
  tags: string[];
  author: string;
  datePublished: string;
  rating?: number;
  reviewCount?: number;
}

function scaleAmount(amount: string, ratio: number): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  const scaled = num * ratio;
  const rounded = Math.round(scaled * 10) / 10;
  return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
}

export default function RecipeDetailClient({ recipe }: { recipe: RecipeData }) {
  const { toggleTheme, isDark, theme } = useTheme();
  const [currentServings, setCurrentServings] = useState(recipe.servings);

  const ratio = currentServings / recipe.servings;
  const scaledIngredients = recipe.ingredients.map((ing) => ({
    ...ing,
    amount: scaleAmount(ing.amount, ratio),
  }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Top Nav Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <FavoriteButton
              recipeId={recipe.id}
              recipeName={recipe.title}
              size="lg"
            />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <motion.div key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Recipe Header */}
      <motion.div
        className="relative h-120 bg-gray-200 dark:bg-gray-800 mt-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${recipe.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-primary-500 text-white rounded-full mb-4">
              {recipe.category}
            </span>
            {recipe.rating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(recipe.rating!)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-white/40"
                      }
                    />
                  ))}
                </div>
                <span className="text-white font-medium">{recipe.rating}</span>
                <span className="text-white/70 text-sm">({recipe.reviewCount} reviews)</span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {recipe.title}
            </h1>
            <p className="text-lg text-white/90">{recipe.description}</p>
          </div>
          <RecipeActions />
        </div>
      </motion.div>

      {/* Recipe Info */}
      <div className="max-w-6xl mx-auto px-5 py-8">
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Time & Servings */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex-1 transition-colors">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <ChefHat size={20} className="text-primary-500" />
              Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-800">
                <Clock size={20} className="mx-auto mb-1 text-primary-600 dark:text-primary-400" />
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Prep Time</p>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {recipe.prepTime}<span className="text-xs font-normal text-gray-600 dark:text-gray-400"> mins</span>
                </p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-800">
                <Clock size={20} className="mx-auto mb-1 text-orange-600 dark:text-orange-400" />
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Cook Time</p>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {recipe.cookTime}<span className="text-xs font-normal text-gray-600 dark:text-gray-400"> mins</span>
                </p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <Users size={20} className="mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Servings</p>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{currentServings}</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <ChefHat size={20} className="mx-auto mb-1 text-purple-600 dark:text-purple-400" />
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Difficulty</p>
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
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex-1 transition-colors">
              <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
                Nutrition Facts
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Calories</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{recipe.nutritionInfo.calories}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Protein</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{recipe.nutritionInfo.protein}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Carbs</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{recipe.nutritionInfo.carbs}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Fat</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{recipe.nutritionInfo.fat}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Main Content - Ingredients & Instructions */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Ingredients - Sticky Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 lg:sticky lg:top-20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Ingredients
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-primary-100 dark:bg-primary-900/30 px-3 py-1 rounded-full">
                  {recipe.ingredients.length} items
                </span>
              </div>

              {/* Servings Scaler */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Servings</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => currentServings > 1 && setCurrentServings(currentServings - 1)}
                    disabled={currentServings <= 1}
                    className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center hover:bg-primary-200 dark:hover:bg-primary-900/50 disabled:opacity-30 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-lg font-bold text-gray-800 dark:text-gray-200 min-w-[2rem] text-center">
                    {currentServings}
                  </span>
                  <button
                    onClick={() => currentServings < 100 && setCurrentServings(currentServings + 1)}
                    disabled={currentServings >= 100}
                    className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center hover:bg-primary-200 dark:hover:bg-primary-900/50 disabled:opacity-30 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              {currentServings !== recipe.servings && (
                <button
                  onClick={() => setCurrentServings(recipe.servings)}
                  className="w-full text-xs text-primary-500 hover:text-primary-600 mb-3 text-center"
                >
                  Reset to original ({recipe.servings} servings)
                </button>
              )}

              <div className="space-y-3">
                {scaledIngredients.map((ingredient, index) => (
                  <label
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-primary-500 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="text-gray-800 dark:text-gray-200 leading-relaxed group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                        <span className="font-semibold text-primary-600 dark:text-primary-400">
                          {ingredient.amount} {ingredient.unit}
                        </span>{" "}
                        {ingredient.item}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <ShoppingListPDF
                  recipeTitle={recipe.title}
                  ingredients={scaledIngredients}
                  servings={currentServings}
                />
              </div>
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 md:p-8 transition-colors">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                Instructions
              </h2>

              <div className="space-y-6">
                {recipe.instructions.map((instruction, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-4 group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                        {instruction}
                      </p>
                      {(instruction.toLowerCase().includes("minutes") ||
                        instruction.toLowerCase().includes("mins")) && (
                        <TimerPopup instruction={instruction} />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Tips Section */}
              <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h3 className="font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-2">
                  💡 Chef&apos;s Tip
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  For best results, make sure all ingredients are at room temperature
                  before starting. This helps everything mix smoothly!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
