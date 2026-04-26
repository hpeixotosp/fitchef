"use client";
import { useState, useCallback } from "react";
import { NutritionInfo } from "@/lib/types";

export function usePortionScaler(baseNutrition: NutritionInfo, baseServings: number) {
  const [servings, setServings] = useState(baseServings);

  const scale = (value: number) => Math.round((value / baseServings) * servings * 10) / 10;

  const nutrition: NutritionInfo = {
    calories: Math.round(scale(baseNutrition.calories)),
    protein: scale(baseNutrition.protein),
    carbs: scale(baseNutrition.carbs),
    fat: scale(baseNutrition.fat),
    fiber: scale(baseNutrition.fiber),
  };

  const increment = useCallback(() => setServings(s => Math.min(s + 1, 20)), []);
  const decrement = useCallback(() => setServings(s => Math.max(s - 1, 1)), []);

  return { servings, nutrition, increment, decrement };
}
