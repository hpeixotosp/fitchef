// ============================================================
// FitChef — TypeScript Interfaces & Types
// ============================================================

export type DietTag =
  | "Vegano"
  | "Vegetariano"
  | "Sem glúten"
  | "Sem lactose"
  | "Low carb"
  | "Cetogênico"
  | "Sem açúcar"
  | "Sem frutos do mar"
  | "Sem nozes";

export type Occasion =
  | "Café da manhã"
  | "Lanche rápido"
  | "Almoço executivo"
  | "Jantar romântico"
  | "Pós-treino"
  | "Festa";

export type Difficulty = "Fácil" | "Médio" | "Difícil";

export type MealType = "Doce" | "Salgado";

export type GenerationMode =
  | "normal"
  | "geladeira-vazia"
  | "surpresa"
  | "orcamento";

export type ActivityLevel =
  | "Sedentário"
  | "Levemente ativo"
  | "Moderadamente ativo"
  | "Muito ativo";

export type BiologicalSex = "Masculino" | "Feminino";

export type NutritionalGoal =
  | "Perda de peso"
  | "Ganho de massa"
  | "Manutenção"
  | "Saúde geral";

export type CookingMethod = "Cozido/ao fogo" | "Sem fogo (frio/mistura)" | "Ambos";

export type QuantityUnit =
  | "g"
  | "ml"
  | "xícara"
  | "colher de sopa"
  | "colher de chá"
  | "un"
  | "a gosto"
  | "outro";

// ─── Ingredient ───────────────────────────────────────────

export type IngredientCategory =
  | "Proteínas Animais"
  | "Vegetais e Legumes"
  | "Frutas"
  | "Grãos, Massas e Farinhas"
  | "Laticínios e Derivados"
  | "Temperos e Condimentos"
  | "Panificação e Doces"
  | "Suplementos"
  | "Outro";

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  icon: string;
  allergens?: string[];
  dietTags?: DietTag[];
}

export interface IngredientWithQuantity {
  ingredient: Ingredient;
  quantity: number;
  unit: QuantityUnit;
  customUnit?: string;
}

// ─── Nutrition ────────────────────────────────────────────

export interface NutritionInfo {
  calories: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber: number; // g
}

// ─── Recipe ───────────────────────────────────────────────

export interface RecipeStep {
  id: string;
  order: number;
  instruction: string;
  equipment?: string;
  durationMinutes?: number;
  emoji?: string;
}

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  description: string;
  imageQuery: string;
  imageUrl?: string;
  imageBase64?: string | null;
  dietTags: DietTag[];
  difficulty: Difficulty;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  occasion: Occasion[];
  mealType: MealType;
  nutritionPerServing: NutritionInfo;
  nutritionScore: number; // 0–10
  ingredients: IngredientWithQuantity[];
  steps: RecipeStep[];
  mode: GenerationMode;
  specialBadge?: "♻️ Zero Desperdício" | "🎲 Surpresa" | "💰 Econômica";
  createdAt: string; // ISO date string
  rating?: number; // 1–5
  ratingComment?: string;
  isFavorite?: boolean;
  isManual?: boolean;
  isAIGenerated?: boolean;
  chefTip?: string;
  scoreExplicacao?: string;
  substituicoesSugeridas?: Array<{
    ingredienteOriginal: string;
    substituto: string;
    motivo: string;
    impactoNutricional: string;
  }>;
}

// ─── User Profile ─────────────────────────────────────────

export interface Equipment {
  fogao: boolean;
  forno: boolean;
  microondas: boolean;
  airfryer: boolean;
  liquidificador: boolean;
  batedeira: boolean;
  panelaPressao: boolean;
}

export interface UserProfile {
  // Step 1 — Equipment
  equipment: Equipment;
  // Step 2 — Culinary preferences
  mealType: MealType | "Ambos";
  cookingMethod: CookingMethod;
  dietRestrictions: DietTag[];
  nutritionalGoal: NutritionalGoal;
  // Optional personal data (Edit Profile page)
  displayName?: string;
  age?: number;
  sex?: BiologicalSex;
  weightKg?: number;
  heightCm?: number;
  activityLevel?: ActivityLevel;
  // Meta
  isConfigured: boolean;
  visitCount: number;
  pwaInstallDismissed?: boolean;
}

// ─── Meal Plan ────────────────────────────────────────────

export type MealSlot = "breakfast" | "lunch" | "snack" | "dinner";

export interface DayMeals {
  breakfast?: Recipe;
  lunch?: Recipe;
  snack?: Recipe;
  dinner?: Recipe;
}

export type WeekDayKey = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";

export interface WeeklyPlan {
  weekKey: string; // "2025-W17"
  days: Record<WeekDayKey, DayMeals>;
}

// ─── Shopping ─────────────────────────────────────────────

export interface ShoppingItem {
  ingredient: Ingredient;
  totalQuantity: number;
  unit: QuantityUnit;
  category: IngredientCategory;
  inStock: boolean;
}

// ─── Substitution ─────────────────────────────────────────

export interface SubstituteOption {
  name: string;
  reason: string;
  deltaCalories: number;
  deltaProtein: number;
  deltaCarbs: number;
  deltaFat: number;
}

// ─── Filters ──────────────────────────────────────────────

export interface RecipeFilters {
  mealType?: MealType;
  dietTags: DietTag[];
  occasion?: Occasion;
  maxPrepMinutes: number;
  difficulty?: Difficulty;
  servings: number;
  budgetMode: boolean;
  budgetBrl?: number;
  macroFilter: {
    minProtein: number;
    maxProtein: number;
    minCarbs: number;
    maxCarbs: number;
    minFat: number;
    maxFat: number;
  };
}

// ─── Undo/Redo ────────────────────────────────────────────

export interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

// ─── Caloric Goal ────────────────────────────────────────

export interface CaloricGoalResult {
  bmr: number;
  tdee: number;
  goal: number;
  goalLabel: string;
}
