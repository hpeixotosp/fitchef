import { ActivityLevel, BiologicalSex, CaloricGoalResult, NutritionalGoal } from "./types";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  "Sedentário": 1.2,
  "Levemente ativo": 1.375,
  "Moderadamente ativo": 1.55,
  "Muito ativo": 1.725,
};

const GOAL_ADJUSTMENTS: Record<NutritionalGoal, number> = {
  "Perda de peso": -500,
  "Ganho de massa": 400,
  "Manutenção": 0,
  "Saúde geral": 0,
};

// Mifflin-St Jeor equation
export function calculateCaloricGoal(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: BiologicalSex,
  activityLevel: ActivityLevel,
  nutritionalGoal: NutritionalGoal,
): CaloricGoalResult {
  let bmr: number;
  if (sex === "Masculino") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
  const goal = Math.max(1200, tdee + GOAL_ADJUSTMENTS[nutritionalGoal]);

  const goalLabels: Record<NutritionalGoal, string> = {
    "Perda de peso": "Meta de déficit calórico",
    "Ganho de massa": "Meta de superávit calórico",
    "Manutenção": "Meta de manutenção",
    "Saúde geral": "Meta de saúde geral",
  };

  return {
    bmr: Math.round(bmr),
    tdee,
    goal: Math.round(goal),
    goalLabel: goalLabels[nutritionalGoal],
  };
}

export function defaultDailyGoal(): number {
  return 2000;
}
