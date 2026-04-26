import { WeeklyPlan, ShoppingItem, IngredientCategory } from "./types";
import { INGREDIENTS } from "./ingredients";

export const CATEGORY_ORDER: IngredientCategory[] = [
  "Proteínas Animais",
  "Laticínios e Derivados",
  "Vegetais e Legumes",
  "Frutas",
  "Grãos, Massas e Farinhas",
  "Temperos e Condimentos",
  "Panificação e Doces",
  "Suplementos",
  "Outro",
];

export const CATEGORY_ICONS: Record<IngredientCategory, string> = {
  "Proteínas Animais": "🥩",
  "Laticínios e Derivados": "🥛",
  "Vegetais e Legumes": "🥦",
  "Frutas": "🍎",
  "Grãos, Massas e Farinhas": "🌾",
  "Temperos e Condimentos": "🧂",
  "Panificação e Doces": "🍬",
  "Suplementos": "💊",
  "Outro": "➕",
};

export function generateShoppingList(
  plan: WeeklyPlan,
  stockIngredientIds: string[] = []
): Map<IngredientCategory, ShoppingItem[]> {
  const totals = new Map<string, ShoppingItem>();

  for (const day of Object.values(plan.days)) {
    const meals = [day.breakfast, day.lunch, day.snack, day.dinner].filter(Boolean);
    for (const meal of meals) {
      if (!meal) continue;
      for (const iw of meal.ingredients) {
        const id = iw.ingredient.id;
        if (totals.has(id)) {
          const existing = totals.get(id)!;
          // Simple addition if same unit
          if (existing.unit === iw.unit) {
            existing.totalQuantity += iw.quantity;
          }
        } else {
          totals.set(id, {
            ingredient: iw.ingredient,
            totalQuantity: iw.quantity,
            unit: iw.unit,
            category: iw.ingredient.category,
            inStock: stockIngredientIds.includes(id),
          });
        }
      }
    }
  }

  // Group by category in order
  const grouped = new Map<IngredientCategory, ShoppingItem[]>();
  for (const cat of CATEGORY_ORDER) {
    const items = [...totals.values()].filter((i) => i.category === cat && !i.inStock);
    if (items.length > 0) grouped.set(cat, items);
  }

  return grouped;
}

export function shoppingListToText(grouped: Map<IngredientCategory, ShoppingItem[]>): string {
  let text = "🛒 Lista de Compras — FitChef\n\n";
  for (const [cat, items] of grouped) {
    const icon = CATEGORY_ICONS[cat] ?? "➕";
    text += `${icon} ${cat}\n`;
    for (const item of items) {
      text += `  • ${item.ingredient.name} — ${item.totalQuantity} ${item.unit}\n`;
    }
    text += "\n";
  }
  return text;
}
