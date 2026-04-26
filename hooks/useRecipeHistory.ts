"use client";
import { useState, useEffect, useCallback } from "react";
import { Recipe } from "@/lib/types";
import { getHistory, addToHistory, clearHistory, updateInHistory } from "@/lib/storage";

export function useRecipeHistory() {
  const [history, setHistory] = useState<Recipe[]>([]);

  useEffect(() => { setHistory(getHistory()); }, []);

  const add = useCallback((recipe: Recipe) => {
    addToHistory(recipe);
    setHistory(getHistory());
  }, []);

  const clear = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  const update = useCallback((recipe: Recipe) => {
    updateInHistory(recipe);
    setHistory(getHistory());
  }, []);

  return { history, add, clear, update };
}
