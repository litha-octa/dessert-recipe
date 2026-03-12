"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/components/Toast";

interface FavoriteButtonProps {
  recipeId: string;
  recipeName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function FavoriteButton({
  recipeId,
  recipeName,
  size = "md",
  className = "",
}: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showToast } = useToast();
  const favorited = isFavorite(recipeId);

  const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(recipeId);
    showToast(
      favorited
        ? `${recipeName} removed from favorites`
        : `${recipeName} added to favorites`,
      favorited ? "info" : "success"
    );
  };

  return (
    <button
      onClick={handleClick}
      className={`group/fav transition-all duration-200 ${className}`}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        size={iconSize}
        className={`transition-all duration-300 ${
          favorited
            ? "fill-red-500 text-red-500 scale-110"
            : "text-gray-400 hover:text-red-400 group-hover/fav:scale-110"
        }`}
      />
    </button>
  );
}
