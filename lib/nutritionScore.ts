import { NutritionInfo } from "./types";

// Score nutricional 0–10 baseado em equilíbrio de macros, fibras e calorias
export function calculateNutritionScore(
  nutrition: NutritionInfo,
  servings: number = 1
): number {
  const n = {
    calories: nutrition.calories / servings,
    protein: nutrition.protein / servings,
    carbs: nutrition.carbs / servings,
    fat: nutrition.fat / servings,
    fiber: nutrition.fiber / servings,
  };

  let score = 0;

  // 1) Calorias por porção (ideal: 300–600 kcal)
  if (n.calories >= 200 && n.calories <= 700) score += 2;
  else if (n.calories < 200 || n.calories > 1000) score += 0;
  else score += 1;

  // 2) Proteína (ideal: ≥ 15g por porção)
  if (n.protein >= 25) score += 2.5;
  else if (n.protein >= 15) score += 2;
  else if (n.protein >= 8) score += 1;
  else score += 0;

  // 3) Carboidratos (ideal: proporcional às calorias, não excessivo)
  const carbRatio = (n.carbs * 4) / (n.calories || 1);
  if (carbRatio <= 0.6 && carbRatio >= 0.2) score += 2;
  else if (carbRatio < 0.2 || carbRatio > 0.7) score += 0.5;
  else score += 1;

  // 4) Gordura (ideal: não excessiva)
  const fatRatio = (n.fat * 9) / (n.calories || 1);
  if (fatRatio <= 0.35 && fatRatio >= 0.15) score += 2;
  else if (fatRatio > 0.5) score += 0;
  else score += 1;

  // 5) Fibras (ideal: ≥ 5g por porção)
  if (n.fiber >= 8) score += 1.5;
  else if (n.fiber >= 5) score += 1;
  else if (n.fiber >= 2) score += 0.5;

  return Math.min(10, Math.round(score * 10) / 10);
}

export function scoreColor(score: number): string {
  if (score >= 8) return "#2db84b";
  if (score >= 6) return "#84cc16";
  if (score >= 4) return "#f47920";
  return "#ef4444";
}

export function scoreLabel(score: number): string {
  if (score >= 9) return "Excelente";
  if (score >= 7) return "Muito bom";
  if (score >= 5) return "Bom";
  if (score >= 3) return "Regular";
  return "Baixo";
}
