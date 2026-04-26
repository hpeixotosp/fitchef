import { UserProfile, WeeklyPlan, Recipe, WeekDayKey, MealSlot } from "./types";

const KEYS = {
  profile: "fitchef_profile",
  history: "fitchef_history",
  favorites: "fitchef_favorites",
  plan: "fitchef_plan",
  ratings: "fitchef_ratings",
  substitutions: "fitchef_substitutions",
  visitCount: "fitchef_visit_count",
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ─── Profile ──────────────────────────────────────────────
export const defaultProfile: UserProfile = {
  equipment: {
    fogao: false, forno: false, microondas: false,
    airfryer: false, liquidificador: false, batedeira: false, panelaPressao: false,
  },
  mealType: "Ambos",
  cookingMethod: "Ambos",
  dietRestrictions: [],
  nutritionalGoal: "Saúde geral",
  isConfigured: false,
  visitCount: 0,
};

export const getProfile = (): UserProfile =>
  safeGet<UserProfile>(KEYS.profile, defaultProfile);

export const saveProfile = (profile: UserProfile) =>
  safeSet(KEYS.profile, profile);

// ─── Visit Count ──────────────────────────────────────────
export const getVisitCount = (): number => safeGet<number>(KEYS.visitCount, 0);
export const incrementVisitCount = () =>
  safeSet(KEYS.visitCount, getVisitCount() + 1);

// ─── Recipe History ───────────────────────────────────────
export const getHistory = (): Recipe[] => safeGet<Recipe[]>(KEYS.history, []);

export const addToHistory = (recipe: Recipe) => {
  const history = getHistory();
  const exists = history.find((r) => r.id === recipe.id);
  if (!exists) {
    safeSet(KEYS.history, [recipe, ...history].slice(0, 200));
  }
};

export const updateInHistory = (recipe: Recipe) => {
  const history = getHistory();
  safeSet(KEYS.history, history.map((r) => (r.id === recipe.id ? recipe : r)));
};

export const clearHistory = () => safeSet(KEYS.history, []);

// ─── Favorites ────────────────────────────────────────────
export const getFavorites = (): Recipe[] =>
  safeGet<Recipe[]>(KEYS.favorites, []);

export const toggleFavorite = (recipe: Recipe): boolean => {
  const favs = getFavorites();
  const idx = favs.findIndex((r) => r.id === recipe.id);
  if (idx >= 0) {
    favs.splice(idx, 1);
    safeSet(KEYS.favorites, favs);
    // also update history
    updateInHistory({ ...recipe, isFavorite: false });
    return false;
  } else {
    safeSet(KEYS.favorites, [{ ...recipe, isFavorite: true }, ...favs]);
    updateInHistory({ ...recipe, isFavorite: true });
    return true;
  }
};

export const isFavorited = (recipeId: string): boolean =>
  getFavorites().some((r) => r.id === recipeId);

// ─── Meal Plan ────────────────────────────────────────────
export const getWeeklyPlan = (weekKey: string): WeeklyPlan => {
  const plans = safeGet<Record<string, WeeklyPlan>>(KEYS.plan, {});
  return (
    plans[weekKey] ?? {
      weekKey,
      days: {
        seg: {}, ter: {}, qua: {}, qui: {}, sex: {}, sab: {}, dom: {},
      },
    }
  );
};

export const saveWeeklyPlan = (plan: WeeklyPlan) => {
  const plans = safeGet<Record<string, WeeklyPlan>>(KEYS.plan, {});
  plans[plan.weekKey] = plan;
  safeSet(KEYS.plan, plans);
};

export const setMealInPlan = (
  weekKey: string,
  day: WeekDayKey,
  slot: MealSlot,
  recipe: Recipe | undefined,
) => {
  const plan = getWeeklyPlan(weekKey);
  if (!plan.days[day]) plan.days[day] = {};
  (plan.days[day] as Record<string, Recipe | undefined>)[slot] = recipe;
  saveWeeklyPlan(plan);
};

// ─── Ratings ─────────────────────────────────────────────
export const rateRecipe = (recipeId: string, rating: number, comment?: string) => {
  const ratings = safeGet<Record<string, { rating: number; comment?: string }>>(
    KEYS.ratings, {}
  );
  ratings[recipeId] = { rating, comment };
  safeSet(KEYS.ratings, ratings);
  const history = getHistory();
  safeSet(
    KEYS.history,
    history.map((r) => (r.id === recipeId ? { ...r, rating, ratingComment: comment } : r))
  );
};

export const getRating = (recipeId: string) => {
  const ratings = safeGet<Record<string, { rating: number; comment?: string }>>(
    KEYS.ratings, {}
  );
  return ratings[recipeId];
};
