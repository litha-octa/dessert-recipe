"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChefHat,
  ChevronDown,
  Sun,
  Moon,
  Heart,
  Shuffle,
  ArrowUpDown,
} from "lucide-react";
import { Recipe, RecipeCategory, RecipeDifficulty, SortOption } from "@/types/recipe";
import { CATEGORY_CONFIG, DIFFICULTY_CONFIG } from "@/lib/constants/categories";
import { calculateTotalTime } from "@/lib/utils/formatters";
import { useTheme } from "@/context/ThemeContext";
import { useFavorites } from "@/context/FavoritesContext";
import RecipeCard from "@/components/RecipeCard";
import { SkeletonGrid } from "@/components/SkeletonCard";
import TrendingSection from "@/components/TrendingSection";

const RECIPES_PER_PAGE = 6;

export default function HomePage() {
  const router = useRouter();
  const { theme, toggleTheme, isDark } = useTheme();
  const { favoritesCount } = useFavorites();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<RecipeDifficulty | "all">("all");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isDifficultyDropdownOpen, setIsDifficultyDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const difficultyDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Infinite scroll state
  const [visibleCount, setVisibleCount] = useState(RECIPES_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Hero text rotation
  const heroWords = ["Discover", "Save", "Cook", "Share"];
  const [heroWordIndex, setHeroWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroWordIndex((prev) => (prev + 1) % heroWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (difficultyDropdownRef.current && !difficultyDropdownRef.current.contains(event.target as Node)) {
        setIsDifficultyDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [searchQuery, selectedCategory, selectedDifficulty, sortOption, recipes]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(RECIPES_PER_PAGE);
  }, [searchQuery, selectedCategory, selectedDifficulty, sortOption]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredRecipes.length) {
          setVisibleCount((prev) => Math.min(prev + RECIPES_PER_PAGE, filteredRecipes.length));
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, filteredRecipes.length]);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("/api/recipes");
      const data = await response.json();
      if (data.success) {
        setRecipes(data.recipes);
        setFilteredRecipes(data.recipes);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = [...recipes];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query) ||
          recipe.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((recipe) => recipe.category === selectedCategory);
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((recipe) => recipe.difficulty === selectedDifficulty);
    }

    // Sort
    switch (sortOption) {
      case "name-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "time-asc":
        filtered.sort((a, b) => calculateTotalTime(a.prepTime, a.cookTime) - calculateTotalTime(b.prepTime, b.cookTime));
        break;
      case "time-desc":
        filtered.sort((a, b) => calculateTotalTime(b.prepTime, b.cookTime) - calculateTotalTime(a.prepTime, a.cookTime));
        break;
      case "difficulty":
        const diffOrder = { easy: 1, medium: 2, hard: 3 };
        filtered.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
        break;
    }

    setFilteredRecipes(filtered);
  };

  const handleSurpriseMe = () => {
    if (recipes.length > 0) {
      const random = recipes[Math.floor(Math.random() * recipes.length)];
      router.push(`/recipe/${random.slug}`);
    }
  };

  const sortLabels: Record<SortOption, string> = {
    default: "Default",
    "name-asc": "Name (A-Z)",
    "name-desc": "Name (Z-A)",
    "time-asc": "Quickest First",
    "time-desc": "Longest First",
    difficulty: "Easiest First",
  };

  const visibleRecipes = filteredRecipes.slice(0, visibleCount);
  const hasMore = visibleCount < filteredRecipes.length;
  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all";

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 transition-colors duration-300">
      {/* Header/Navbar */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-primary-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sweet <span className="text-primary-500">Recipes</span>
              </h1>
            </div>
            <nav className="hidden md:flex space-x-6 items-center">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium">
                Home
              </Link>
              <Link href="#recipes" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium">
                Recipes
              </Link>
              <Link href="/favorites" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium relative">
                Favorites
                {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {favoritesCount}
                  </span>
                )}
              </Link>

              {/* Categories Dropdown */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium"
                >
                  Categories
                  <ChevronDown className={`h-4 w-4 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {isCategoryDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50">
                    <button
                      onClick={() => { setSelectedCategory("all"); setIsCategoryDropdownOpen(false); }}
                      className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        selectedCategory === "all" ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <span className="text-xl">🍰</span>
                      <span className="font-medium">All Categories</span>
                    </button>
                    {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => { setSelectedCategory(key as RecipeCategory); setIsCategoryDropdownOpen(false); }}
                        className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          selectedCategory === key ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span className="text-xl">{config.icon}</span>
                        <span className="font-medium">{config.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Difficulty Dropdown */}
              <div className="relative" ref={difficultyDropdownRef}>
                <button
                  onClick={() => setIsDifficultyDropdownOpen(!isDifficultyDropdownOpen)}
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium"
                >
                  Difficulty
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDifficultyDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {isDifficultyDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50">
                    <button
                      onClick={() => { setSelectedDifficulty("all"); setIsDifficultyDropdownOpen(false); }}
                      className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        selectedDifficulty === "all" ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <span className="font-medium">All Levels</span>
                    </button>
                    {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => { setSelectedDifficulty(key as RecipeDifficulty); setIsDifficultyDropdownOpen(false); }}
                        className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          selectedDifficulty === key ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span className={`px-2 py-0.5 rounded-full text-xs ${config.bgColor} ${config.color}`}>
                          {config.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </motion.div>
              </button>
            </nav>

            {/* Mobile nav */}
            <div className="flex md:hidden items-center gap-2">
              <Link href="/favorites" className="relative p-2">
                <Heart size={20} className="text-gray-700 dark:text-gray-300" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-16 md:py-24 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <AnimatePresence mode="wait">
                <motion.span
                  key={heroWordIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="inline-block text-primary-500"
                >
                  {heroWords[heroWordIndex]}
                </motion.span>
              </AnimatePresence>{" "}
              Delicious
              <span className="block text-primary-500">Dessert Recipes</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
              From classic tiramisu to decadent chocolate lava cake, explore our
              collection of international desserts with step-by-step instructions
              and downloadable PDFs.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for recipes, ingredients, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full border-2 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:outline-none text-lg shadow-lg"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4">
              <a
                href="#recipes"
                className="px-6 py-3 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors shadow-lg"
              >
                Explore Recipes
              </a>
              <button
                onClick={handleSurpriseMe}
                className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2"
              >
                <Shuffle size={18} />
                Surprise Me
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Recipes Section */}
      {!loading && !hasActiveFilters && (
        <TrendingSection recipes={recipes} />
      )}

      {/* Results Info Section */}
      <section className="py-4 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {selectedCategory !== "all" && (
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium flex items-center gap-1">
                  {CATEGORY_CONFIG[selectedCategory]?.icon} {CATEGORY_CONFIG[selectedCategory]?.label}
                  <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-primary-900">
                    x
                  </button>
                </span>
              )}
              {selectedDifficulty !== "all" && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${DIFFICULTY_CONFIG[selectedDifficulty]?.bgColor} ${DIFFICULTY_CONFIG[selectedDifficulty]?.color}`}>
                  {DIFFICULTY_CONFIG[selectedDifficulty]?.label}
                  <button onClick={() => setSelectedDifficulty("all")} className="ml-1 hover:opacity-70">
                    x
                  </button>
                </span>
              )}
              {sortOption !== "default" && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium flex items-center gap-1">
                  {sortLabels[sortOption]}
                  <button onClick={() => setSortOption("default")} className="ml-1 hover:text-blue-900">
                    x
                  </button>
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative" ref={sortDropdownRef}>
                <button
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 font-medium"
                >
                  <ArrowUpDown size={14} />
                  Sort
                  <ChevronDown className={`h-3 w-3 transition-transform ${isSortDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {isSortDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50">
                    {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => { setSortOption(key); setIsSortDropdownOpen(false); }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          sortOption === key ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {sortLabels[key]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                Showing{" "}
                <span className="font-semibold text-primary-500">{filteredRecipes.length}</span>{" "}
                recipe{filteredRecipes.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section id="recipes" className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <SkeletonGrid count={6} />
          ) : filteredRecipes.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No recipes found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedDifficulty("all");
                  setSortOption("default");
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                layout
              >
                <AnimatePresence mode="popLayout">
                  {visibleRecipes.map((recipe, index) => (
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

              {/* Infinite Scroll Sentinel */}
              {hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-10">
                  <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent"></div>
                    <span className="text-sm">Loading more recipes...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ChefHat className="h-6 w-6 text-primary-400" />
                <h3 className="text-xl font-bold">Sweet Recipes</h3>
              </div>
              <p className="text-gray-400">
                Discover and share the worlds best dessert recipes. Download PDFs and cook like a pro!
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-primary-400">Home</Link></li>
                <li><Link href="#recipes" className="hover:text-primary-400">All Recipes</Link></li>
                <li><Link href="/favorites" className="hover:text-primary-400">My Favorites</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <p className="text-gray-400 mb-4">Stay updated with new recipes and cooking tips!</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary-400">📘</a>
                <a href="#" className="text-gray-400 hover:text-primary-400">📷</a>
                <a href="#" className="text-gray-400 hover:text-primary-400">🐦</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Sweet Recipes Hub. Made with ❤️ and Next.js</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
