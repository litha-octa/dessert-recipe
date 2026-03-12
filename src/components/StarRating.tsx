"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
  showValue?: boolean;
  reviewCount?: number;
}

export default function StarRating({
  rating,
  onRate,
  size = 16,
  interactive = false,
  showValue = true,
  reviewCount,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value: number) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-0.5 ${interactive ? "cursor-pointer" : ""}`}
        onMouseLeave={() => interactive && setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((value) => {
          const displayRating = hoverRating || rating;
          const isFilled = value <= Math.floor(displayRating);
          const isHalf = !isFilled && value - 0.5 <= displayRating;

          return (
            <button
              key={value}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(value)}
              onMouseEnter={() => interactive && setHoverRating(value)}
              className={`relative ${interactive ? "hover:scale-110 transition-transform" : ""} disabled:cursor-default`}
              aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
            >
              {/* Background star (empty) */}
              <Star
                size={size}
                className="text-gray-300 dark:text-gray-600"
              />
              {/* Filled overlay */}
              {(isFilled || isHalf) && (
                <Star
                  size={size}
                  className="absolute top-0 left-0 fill-yellow-400 text-yellow-400"
                  style={isHalf ? { clipPath: "inset(0 50% 0 0)" } : undefined}
                />
              )}
            </button>
          );
        })}
      </div>
      {showValue && rating > 0 && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-gray-500 dark:text-gray-500">
          ({reviewCount} reviews)
        </span>
      )}
    </div>
  );
}
