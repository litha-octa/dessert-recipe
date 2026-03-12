"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Star, ChefHat } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { CATEGORY_CONFIG, DIFFICULTY_CONFIG } from "@/lib/constants/categories";
import { formatTime, calculateTotalTime } from "@/lib/utils/formatters";
import FavoriteButton from "@/components/FavoriteButton";

interface RecipeCardProps {
  recipe: Recipe;
  compact?: boolean;
}

export default function RecipeCard({ recipe, compact = false }: RecipeCardProps) {
  const categoryConfig = CATEGORY_CONFIG[recipe.category];
  const difficultyConfig = DIFFICULTY_CONFIG[recipe.difficulty];
  const totalTime = calculateTotalTime(recipe.prepTime, recipe.cookTime);

  if (!categoryConfig || !difficultyConfig) return null;

  return (
    <div className="relative group h-full">
      {/* Favorite Button */}
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
          {/* Image */}
          <div className={`relative ${compact ? "h-44" : "h-56"} bg-gray-200 dark:bg-gray-700 overflow-hidden`}>
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Category Badge */}
            <div
              className={`absolute top-4 right-4 ${categoryConfig.bgColor} ${categoryConfig.color} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1`}
            >
              <span>{categoryConfig.icon}</span>
              <span>{categoryConfig.label}</span>
            </div>
          </div>

          {/* Content */}
          <div className={`${compact ? "p-4" : "p-6"} flex-1 flex flex-col`}>
            <h3 className={`${compact ? "text-lg" : "text-xl"} font-bold text-gray-900 dark:text-white mb-2 line-clamp-2`}>
              {recipe.title}
            </h3>
            {!compact && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                {recipe.description}
              </p>
            )}

            {/* Rating */}
            {recipe.rating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(recipe.rating!)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {recipe.rating}
                </span>
                {!compact && (
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    ({recipe.reviewCount} reviews)
                  </span>
                )}
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatTime(totalTime)}</span>
              </div>
              <div className={`${difficultyConfig.bgColor} ${difficultyConfig.color} px-3 py-1 rounded-full font-medium`}>
                {difficultyConfig.label}
              </div>
            </div>

            {/* Tags */}
            {!compact && (
              <div className="flex flex-wrap gap-2">
                {recipe.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author */}
            {!compact && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <ChefHat className="h-4 w-4" />
                  <span>{recipe.author}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-500">
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
