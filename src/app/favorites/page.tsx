"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChefHat, Clock, Star, ArrowLeft } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { CATEGORY_CONFIG, DIFFICULTY_CONFIG } from "@/lib/constants/categories";
import { formatTime, calculateTotalTime } from "@/lib/utils/formatters";
import { useFavorites } from "@/context/FavoritesContext";
import FavoriteButton from "@/components/FavoriteButton";
import { useTheme } from "@/context/ThemeContext";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("/api/recipes");
      const data = await response.json();
      if (data.success) {
        setRecipes(data.recipes);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const favoriteRecipes = recipes.filter((r) => favorites.includes(r.id));

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
              </Link>
              <div className="flex items-center space-x-2">
                <Heart className="h-7 w-7 text-red-500 fill-red-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  My <span className="text-primary-500">Favorites</span>
                </h1>
              </div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {favoriteRecipes.length} recipe{favoriteRecipes.length !== 1 ? "s" : ""} saved
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your favorites...</p>
          </div>
        ) : favoriteRecipes.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Heart size={40} className="text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start exploring recipes and tap the heart icon to save your favorites here.
            </p>
            <Link
              href="/"
              className="inline-flex px-6 py-3 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors"
            >
              Browse Recipes
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            <AnimatePresence mode="popLayout">
              {favoriteRecipes.map((recipe, index) => {
                const categoryConfig = CATEGORY_CONFIG[recipe.category];
                const difficultyConfig = DIFFICULTY_CONFIG[recipe.difficulty];
                const totalTime = calculateTotalTime(recipe.prepTime, recipe.cookTime);

                return (
                  <motion.div
                    key={recipe.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative group h-full"
                  >
                    <div className="absolute top-4 left-4 z-10">
                      <FavoriteButton
                        recipeId={recipe.id}
                        recipeName={recipe.title}
                        size="md"
                        className="p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white dark:hover:bg-gray-900"
                      />
                    </div>
                    <Link href={`/recipe/${recipe.slug}`}>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                        <div className="relative h-56 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          <Image
                            src={recipe.image}
                            alt={recipe.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className={`absolute top-4 right-4 ${categoryConfig.bgColor} ${categoryConfig.color} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1`}>
                            <span>{categoryConfig.icon}</span>
                            <span>{categoryConfig.label}</span>
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {recipe.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                            {recipe.description}
                          </p>
                          {recipe.rating && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={i < Math.floor(recipe.rating!) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{recipe.rating}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatTime(totalTime)}</span>
                            </div>
                            <div className={`${difficultyConfig.bgColor} ${difficultyConfig.color} px-3 py-1 rounded-full font-medium`}>
                              {difficultyConfig.label}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
