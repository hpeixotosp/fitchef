"use client";
import { useState, useEffect, useCallback } from "react";
import { WeeklyPlan, WeekDayKey, MealSlot, Recipe } from "@/lib/types";
import { getWeeklyPlan, saveWeeklyPlan } from "@/lib/storage";
import { getWeekKey } from "@/lib/weeklyRecipe";

export function useMealPlan(initialWeekKey?: string) {
  const [weekKey, setWeekKey] = useState(initialWeekKey ?? getWeekKey());
  const [plan, setPlan] = useState<WeeklyPlan>(() => getWeeklyPlan(weekKey));

  useEffect(() => {
    const p = getWeeklyPlan(weekKey);
    setPlan(p);
  }, [weekKey]);

  const setMeal = useCallback((day: WeekDayKey, slot: MealSlot, recipe: Recipe | undefined) => {
    setPlan(prev => {
      const next: WeeklyPlan = {
        ...prev,
        days: {
          ...prev.days,
          [day]: { ...prev.days[day], [slot]: recipe },
        },
      };
      saveWeeklyPlan(next);
      return next;
    });
  }, []);

  const prevWeek = useCallback(() => {
    const [y, w] = weekKey.split("-W").map(Number);
    const d = new Date(y, 0, 1 + (w - 2) * 7);
    setWeekKey(getWeekKey(d));
  }, [weekKey]);

  const nextWeek = useCallback(() => {
    const [y, w] = weekKey.split("-W").map(Number);
    const d = new Date(y, 0, 1 + w * 7);
    setWeekKey(getWeekKey(d));
  }, [weekKey]);

  return { plan, weekKey, setMeal, prevWeek, nextWeek };
}
