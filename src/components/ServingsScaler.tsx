"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

interface Ingredient {
  item: string;
  amount: string;
  unit: string;
}

interface ServingsScalerProps {
  originalServings: number;
  ingredients: Ingredient[];
  children: (props: {
    currentServings: number;
    scaledIngredients: Ingredient[];
    setServings: (n: number) => void;
    scalerUI: React.ReactNode;
  }) => React.ReactNode;
}

function scaleAmount(amount: string, ratio: number): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  const scaled = num * ratio;
  // Round to 1 decimal, remove trailing .0
  const rounded = Math.round(scaled * 10) / 10;
  return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
}

export default function ServingsScaler({
  originalServings,
  ingredients,
  children,
}: ServingsScalerProps) {
  const [currentServings, setCurrentServings] = useState(originalServings);

  const ratio = currentServings / originalServings;

  const scaledIngredients = ingredients.map((ing) => ({
    ...ing,
    amount: scaleAmount(ing.amount, ratio),
  }));

  const setServings = (n: number) => {
    if (n >= 1 && n <= 100) setCurrentServings(n);
  };

  const scalerUI = (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setServings(currentServings - 1)}
        disabled={currentServings <= 1}
        className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center hover:bg-primary-200 dark:hover:bg-primary-900/50 disabled:opacity-30 transition-colors"
      >
        <Minus size={16} />
      </button>
      <span className="text-lg font-bold text-gray-800 dark:text-gray-200 min-w-[3rem] text-center">
        {currentServings}
      </span>
      <button
        onClick={() => setServings(currentServings + 1)}
        disabled={currentServings >= 100}
        className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center hover:bg-primary-200 dark:hover:bg-primary-900/50 disabled:opacity-30 transition-colors"
      >
        <Plus size={16} />
      </button>
    </div>
  );

  return <>{children({ currentServings, scaledIngredients, setServings, scalerUI })}</>;
}
