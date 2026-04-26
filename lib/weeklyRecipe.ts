import { generateRecipeAI, GenerateRecipeOptions } from "./generateRecipe";
import { Recipe } from "./types";

// Generates recipe of the week via AI using a weekly-seeded theme
const weekThemes = [
  "prato italiano reconfortante",
  "bowl proteico pós-treino",
  "receita vegana criativa",
  "jantar rápido e saudável",
  "café da manhã nutritivo",
  "prato brasileiro saudável",
  "receita low carb saborosa",
  "cozinha asiática leve",
  "salada completa e proteica",
  "prato econômico e nutritivo",
  "receita mediterrânea",
  "lanche fit energizante",
];

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export async function getRecipeOfTheWeekAI(date: Date = new Date()): Promise<Recipe> {
  const week = getISOWeek(date);
  const theme = weekThemes[week % weekThemes.length];

  const opts: GenerateRecipeOptions = {
    mode: "normal",
    ingredients: [],
    filters: { maxPrepMinutes: 999, servings: 2 },
    dishName: `Uma receita saudável e deliciosa de ${theme}`,
  };

  const { recipe } = await generateRecipeAI(opts);
  return recipe;
}

export function getWeekKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const week = getISOWeek(date);
  return `${year}-W${String(week).padStart(2, "0")}`;
}
