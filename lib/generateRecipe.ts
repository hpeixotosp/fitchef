import { Recipe, GenerationMode, IngredientWithQuantity, RecipeFilters } from "./types";
import { calculateNutritionScore } from "./nutritionScore";
import { INGREDIENTS } from "./ingredients";

const ing = (id: string, qty: number | string, unit: "g"|"ml"|"xícara"|"colher de sopa"|"colher de chá"|"un"|"a gosto"|"outro" = "g"): IngredientWithQuantity => {
  const ingredient = INGREDIENTS.find(i => i.id === id);
  if (!ingredient) return { ingredient: { id, name: id, category: "Temperos e Condimentos", icon: "🧂" }, quantity: 0, unit };
  return { ingredient, quantity: typeof qty === "number" ? qty : 0, unit };
};



export interface GenerateRecipeOptions {
  mode: GenerationMode;
  ingredients: string[];
  filters: Partial<RecipeFilters>;
  // Contexto extra para o prompt da IA
  equipment?: string[];
  nutritionGoal?: string;
  dishName?: string;
}

export interface AIGenerateResult {
  recipe: Recipe;
  source: "gemini";
}

export async function generateRecipeAI(options: GenerateRecipeOptions): Promise<AIGenerateResult> {
  try {
    const payload = {
      mode:          options.mode,
      ingredients:   options.ingredients,
      mealType:      options.filters.mealType ?? "",
      dietTags:      options.filters.dietTags  ?? [],
      occasion:      options.filters.occasion  ?? "",
      difficulty:    options.filters.difficulty ?? "",
      servings:      options.filters.servings   ?? 2,
      equipment:     options.equipment          ?? [],
      nutritionGoal: options.nutritionGoal      ?? "saúde geral",
      dishName:      options.dishName,
    };

    const res = await fetch("/api/gerar-receita", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error ?? `HTTP ${res.status}`);
    }

    const data = await res.json() as AIGenerateResult;
    return data;

  } catch (err) {
    console.error("[FitChef] generateRecipeAI falhou:", err);
    throw err;
  }
}

// ─── Surpresa ─────────────────────────────────────────────────────────────────
export async function surpriseRecipeAI(): Promise<Recipe> {
  const opts: GenerateRecipeOptions = {
    mode: "surpresa",
    ingredients: [],
    filters: { maxPrepMinutes: 999, servings: 2 },
    dishName: "Uma receita aleatória completamente nova, criativa e surpreendente",
  };
  const { recipe } = await generateRecipeAI(opts);
  return recipe;
}


