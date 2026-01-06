"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Clock, ChefHat, Star, ChevronDown } from "lucide-react";
import { Recipe, RecipeCategory, RecipeDifficulty } from "@/types/recipe";
import { CATEGORY_CONFIG, DIFFICULTY_CONFIG } from "@/lib/constants/categories";
import { formatTime, calculateTotalTime } from "@/lib/utils/formatters";

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    RecipeCategory | "all"
  >("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    RecipeDifficulty | "all"
  >("all");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isDifficultyDropdownOpen, setIsDifficultyDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const difficultyDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (difficultyDropdownRef.current && !difficultyDropdownRef.current.contains(event.target as Node)) {
        setIsDifficultyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch recipes on mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Filter recipes when filters change
  useEffect(() => {
    filterRecipes();
  }, [searchQuery, selectedCategory, selectedDifficulty, recipes]);

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

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query) ||
          recipe.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (recipe) => recipe.category === selectedCategory
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (recipe) => recipe.difficulty === selectedDifficulty
      );
    }

    setFilteredRecipes(filtered);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-primary-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                Sweet <span className="text-primary-500">Recipes</span>
              </h1>
            </div>
            <nav className="hidden md:flex space-x-6 items-center">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary-500 font-medium"
              >
                Home
              </Link>
              <Link
                href="#recipes"
                className="text-gray-700 hover:text-primary-500 font-medium"
              >
                Recipes
              </Link>
              {/* Categories Dropdown */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="flex items-center gap-1 text-gray-700 hover:text-primary-500 font-medium"
                >
                  Categories
                  <ChevronDown className={`h-4 w-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCategoryDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 ${
                        selectedCategory === "all" ? "bg-primary-50 text-primary-600" : "text-gray-700"
                      }`}
                    >
                      <span className="text-xl">🍰</span>
                      <span className="font-medium">All Categories</span>
                    </button>
                    {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedCategory(key as RecipeCategory);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 ${
                          selectedCategory === key ? "bg-primary-50 text-primary-600" : "text-gray-700"
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
                  className="flex items-center gap-1 text-gray-700 hover:text-primary-500 font-medium"
                >
                  Difficulty
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDifficultyDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDifficultyDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <button
                      onClick={() => {
                        setSelectedDifficulty("all");
                        setIsDifficultyDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 ${
                        selectedDifficulty === "all" ? "bg-primary-50 text-primary-600" : "text-gray-700"
                      }`}
                    >
                      <span className="font-medium">All Levels</span>
                    </button>
                    {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedDifficulty(key as RecipeDifficulty);
                          setIsDifficultyDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 ${
                          selectedDifficulty === key ? "bg-primary-50 text-primary-600" : "text-gray-700"
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
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Delicious
              <span className="block text-primary-500">Dessert Recipes</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              From classic tiramisu to decadent chocolate lava cake, explore our
              collection of international desserts with step-by-step
              instructions and downloadable PDFs.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for recipes, ingredients, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full border-2 text-gray-700 border-gray-200 focus:border-primary-500 focus:outline-none text-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results Info Section */}
      <section className="py-4 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {selectedCategory !== "all" && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium flex items-center gap-1">
                  {CATEGORY_CONFIG[selectedCategory]?.icon} {CATEGORY_CONFIG[selectedCategory]?.label}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="ml-1 hover:text-primary-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedDifficulty !== "all" && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${DIFFICULTY_CONFIG[selectedDifficulty]?.bgColor} ${DIFFICULTY_CONFIG[selectedDifficulty]?.color}`}>
                  {DIFFICULTY_CONFIG[selectedDifficulty]?.label}
                  <button
                    onClick={() => setSelectedDifficulty("all")}
                    className="ml-1 hover:opacity-70"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            <div className="text-gray-600">
              Showing{" "}
              <span className="font-semibold text-primary-500">
                {filteredRecipes.length}
              </span>{" "}
              recipe{filteredRecipes.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section id="recipes" className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading delicious recipes...</p>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No recipes found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedDifficulty("all");
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ChefHat className="h-6 w-6 text-primary-400" />
                <h3 className="text-xl font-bold">Sweet Recipes</h3>
              </div>
              <p className="text-gray-400">
                Discover and share the worlds best dessert recipes. Download
                PDFs and cook like a pro!
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-primary-400">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#recipes" className="hover:text-primary-400">
                    All Recipes
                  </Link>
                </li>
                <li>
                  <Link href="#categories" className="hover:text-primary-400">
                    Categories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <p className="text-gray-400 mb-4">
                Stay updated with new recipes and cooking tips!
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary-400">
                  📘
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-400">
                  📷
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-400">
                  🐦
                </a>
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

// Recipe Card Component
function RecipeCard({ recipe }: { recipe: Recipe }) {
  const categoryConfig = CATEGORY_CONFIG[recipe.category];
  const difficultyConfig = DIFFICULTY_CONFIG[recipe.difficulty];
  const totalTime = calculateTotalTime(recipe.prepTime, recipe.cookTime);

  return (
    <Link href={`/recipe/${recipe.slug}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative h-56 bg-gray-200 overflow-hidden">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover hover:scale-110 transition-transform duration-300"
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
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {recipe.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {recipe.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(totalTime)}</span>
            </div>
            <div
              className={`${difficultyConfig.bgColor} ${difficultyConfig.color} px-3 py-1 rounded-full font-medium`}
            >
              {difficultyConfig.label}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Author */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ChefHat className="h-4 w-4" />
              <span>{recipe.author}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
