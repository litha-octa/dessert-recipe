"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Recipe } from "@/types/recipe";
import RecipeCard from "@/components/RecipeCard";

interface TrendingSectionProps {
  recipes: Recipe[];
}

export default function TrendingSection({ recipes }: TrendingSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Get top-rated recipes sorted by rating and review count
  const trendingRecipes = [...recipes]
    .filter((r) => r.rating && r.reviewCount)
    .sort((a, b) => {
      const scoreA = (a.rating || 0) * Math.log10((a.reviewCount || 1) + 1);
      const scoreB = (b.rating || 0) * Math.log10((b.reviewCount || 1) + 1);
      return scoreB - scoreA;
    })
    .slice(0, 5);

  if (trendingRecipes.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section ref={sectionRef} className="py-12 bg-gradient-to-r from-primary-50/50 via-secondary-50/50 to-accent-50/50 dark:from-gray-900 dark:via-gray-900/80 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                <TrendingUp className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Trending Recipes
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Most popular picks from our community
                </p>
              </div>
            </div>

            {/* Scroll Controls */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Cards */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {trendingRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                className="min-w-[300px] max-w-[320px] snap-start flex-shrink-0"
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative">
                  {/* Trending Badge */}
                  <div className="absolute -top-2 -left-2 z-20 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <TrendingUp size={12} />
                    #{index + 1}
                  </div>
                  <RecipeCard recipe={recipe} compact />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
