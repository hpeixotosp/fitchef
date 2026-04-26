import { Recipe } from "./types";
import { MOCK_RECIPES } from "./generateRecipe";

// Returns ISO week number of a date
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function getRecipeOfTheWeek(date: Date = new Date()): Recipe {
  const week = getISOWeek(date);
  const idx = week % MOCK_RECIPES.length;
  return MOCK_RECIPES[idx];
}

export function getWeekKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const week = getISOWeek(date);
  return `${year}-W${String(week).padStart(2, "0")}`;
}
