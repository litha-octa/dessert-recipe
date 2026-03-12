"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowLeft } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { useFavorites } from "@/context/FavoritesContext";
import RecipeCard from "@/components/RecipeCard";
import { SkeletonGrid } from "@/components/SkeletonCard";

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
          <SkeletonGrid count={3} />
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
              {favoriteRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
