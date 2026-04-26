"use client";
import { useState, useEffect, useCallback } from "react";
import { Recipe } from "@/lib/types";
import { getFavorites, toggleFavorite, isFavorited } from "@/lib/storage";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => { setFavorites(getFavorites()); }, []);

  const toggle = useCallback((recipe: Recipe) => {
    const isNowFav = toggleFavorite(recipe);
    setFavorites(getFavorites());
    return isNowFav;
  }, []);

  const check = useCallback((id: string) => isFavorited(id), []);

  return { favorites, toggle, check };
}
