"use client";
import { useState, useCallback } from "react";
import { RecipeStep } from "@/lib/types";

export function useCookingMode(steps: RecipeStep[]) {
  const sorted = [...steps].sort((a, b) => a.order - b.order);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const next = useCallback(() => {
    setCurrentIndex(i => {
      if (i >= sorted.length - 1) { setCompleted(true); return i; }
      return i + 1;
    });
  }, [sorted.length]);

  const prev = useCallback(() => {
    setCurrentIndex(i => Math.max(0, i - 1));
  }, []);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setCompleted(false);
  }, []);

  return {
    steps: sorted,
    currentIndex,
    currentStep: sorted[currentIndex],
    total: sorted.length,
    completed,
    next,
    prev,
    reset,
    isFirst: currentIndex === 0,
    isLast: currentIndex === sorted.length - 1,
  };
}
