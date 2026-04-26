import { MOCK_RECIPES } from "./generateRecipe";
import { Recipe } from "./types";

// Returns recipes that likely match a dish name search
export function reverseSearch(dishName: string): {
  recipe: Recipe;
  suggestedIngredients: string[];
  score: number;
}[] {
  const q = dishName.toLowerCase().trim();
  if (!q) return [];

  const results = MOCK_RECIPES.map((recipe) => {
    const nameMatch = recipe.name.toLowerCase().includes(q) ? 3 : 0;
    const descMatch = recipe.description.toLowerCase().includes(q) ? 1 : 0;
    const score = nameMatch + descMatch;
    const suggestedIngredients = recipe.ingredients
      .slice(0, 5)
      .map((i) => i.ingredient.name);
    return { recipe, suggestedIngredients, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return results;
}
