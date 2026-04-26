import { Ingredient, IngredientCategory, QuantityUnit } from "./types";

// ============================================================
// FitChef — Complete Ingredient List by Category
// ============================================================

export const INGREDIENT_CATEGORIES: {
  id: IngredientCategory;
  icon: string;
  label: string;
}[] = [
  { id: "Proteínas Animais", icon: "🥩", label: "Proteínas Animais" },
  { id: "Vegetais e Legumes", icon: "🥦", label: "Vegetais e Legumes" },
  { id: "Frutas", icon: "🍎", label: "Frutas" },
  { id: "Grãos, Massas e Farinhas", icon: "🌾", label: "Grãos, Massas e Farinhas" },
  { id: "Laticínios e Derivados", icon: "🥛", label: "Laticínios e Derivados" },
  { id: "Temperos e Condimentos", icon: "🧂", label: "Temperos e Condimentos" },
  { id: "Panificação e Doces", icon: "🍬", label: "Panificação e Doces" },
  { id: "Suplementos", icon: "💊", label: "Suplementos" },
  { id: "Outro", icon: "➕", label: "Outro" },
];

const makeIngredient = (
  id: string,
  name: string,
  category: IngredientCategory,
  icon: string,
  allergens: string[] = [],
): Ingredient => ({ id, name, category, icon, allergens });

export const INGREDIENTS: Ingredient[] = [
  // ─── 🥩 Proteínas Animais ─────────────────────────────────────
  makeIngredient("atum-conserva", "Atum em Conserva", "Proteínas Animais", "🐟", ["frutos do mar"]),
  makeIngredient("bacon", "Bacon", "Proteínas Animais", "🥓"),
  makeIngredient("carne-bovina-gorda", "Carne Bovina Gorda", "Proteínas Animais", "🥩"),
  makeIngredient("carne-bovina-magra", "Carne Bovina Magra", "Proteínas Animais", "🥩"),
  makeIngredient("clara-ovo", "Clara de Ovo", "Proteínas Animais", "🥚"),
  makeIngredient("frango-coxa", "Frango: Coxa", "Proteínas Animais", "🍗"),
  makeIngredient("frango-coxa-sobrecoxa", "Frango: Coxa e Sobrecoxa", "Proteínas Animais", "🍗"),
  makeIngredient("frango-file-peito", "Frango: Filé de Peito", "Proteínas Animais", "🍗"),
  makeIngredient("frango-sobrecoxa", "Frango: Sobrecoxa", "Proteínas Animais", "🍗"),
  makeIngredient("gema-ovo", "Gema de Ovo", "Proteínas Animais", "🥚"),
  makeIngredient("linguica", "Linguiça", "Proteínas Animais", "🌭"),
  makeIngredient("ovos-inteiro", "Ovos (inteiro)", "Proteínas Animais", "🥚"),
  makeIngredient("ovo-codorna", "Ovo de Codorna", "Proteínas Animais", "🥚"),
  makeIngredient("peixe-merluza", "Peixe: Filé de Merluza", "Proteínas Animais", "🐟", ["frutos do mar"]),
  makeIngredient("peixe-polaca", "Peixe: Filé de Polaca", "Proteínas Animais", "🐟", ["frutos do mar"]),
  makeIngredient("peixe-tilapia", "Peixe: Filé de Tilápia", "Proteínas Animais", "🐟", ["frutos do mar"]),
  makeIngredient("peixe-cacao", "Peixe: Posta de Cação", "Proteínas Animais", "🐟", ["frutos do mar"]),
  makeIngredient("peixe-salmao", "Peixe: Posta de Salmão", "Proteínas Animais", "🐟", ["frutos do mar"]),
  makeIngredient("peito-peru", "Peito de Peru", "Proteínas Animais", "🦃"),
  makeIngredient("presunto", "Presunto", "Proteínas Animais", "🥩"),
  makeIngredient("sardinha-conserva", "Sardinha em Conserva", "Proteínas Animais", "🐟", ["frutos do mar"]),

  // ─── 🥦 Vegetais e Legumes ────────────────────────────────────
  makeIngredient("abobrinha", "Abobrinha", "Vegetais e Legumes", "🥒"),
  makeIngredient("abobora", "Abóbora", "Vegetais e Legumes", "🎃"),
  makeIngredient("alface", "Alface", "Vegetais e Legumes", "🥬"),
  makeIngredient("batata-doce", "Batata-doce", "Vegetais e Legumes", "🍠"),
  makeIngredient("batata-inglesa", "Batata-inglesa", "Vegetais e Legumes", "🥔"),
  makeIngredient("berinjela", "Berinjela", "Vegetais e Legumes", "🍆"),
  makeIngredient("beterraba", "Beterraba", "Vegetais e Legumes", "🫚"),
  makeIngredient("brocolis", "Brócolis", "Vegetais e Legumes", "🥦"),
  makeIngredient("cenoura", "Cenoura", "Vegetais e Legumes", "🥕"),
  makeIngredient("chuchu", "Chuchu", "Vegetais e Legumes", "🥦"),
  makeIngredient("couve-flor", "Couve-flor", "Vegetais e Legumes", "🥦"),
  makeIngredient("espinafre", "Espinafre", "Vegetais e Legumes", "🌿"),
  makeIngredient("mandioca", "Mandioca", "Vegetais e Legumes", "🍠"),
  makeIngredient("milho-verde", "Milho Verde", "Vegetais e Legumes", "🌽"),
  makeIngredient("pepino", "Pepino", "Vegetais e Legumes", "🥒"),
  makeIngredient("pimentao", "Pimentão", "Vegetais e Legumes", "🌶️"),
  makeIngredient("tomate", "Tomate", "Vegetais e Legumes", "🍅"),
  makeIngredient("vagem", "Vagem", "Vegetais e Legumes", "🫛"),

  // ─── 🍎 Frutas ────────────────────────────────────────────────
  makeIngredient("abacate", "Abacate", "Frutas", "🥑"),
  makeIngredient("abacaxi", "Abacaxi", "Frutas", "🍍"),
  makeIngredient("banana", "Banana", "Frutas", "🍌"),
  makeIngredient("laranja", "Laranja", "Frutas", "🍊"),
  makeIngredient("limao", "Limão", "Frutas", "🍋"),
  makeIngredient("maca", "Maçã", "Frutas", "🍎"),
  makeIngredient("mamao", "Mamão", "Frutas", "🍈"),
  makeIngredient("manga", "Manga", "Frutas", "🥭"),
  makeIngredient("morango", "Morango", "Frutas", "🍓"),
  makeIngredient("uva", "Uva", "Frutas", "🍇"),

  // ─── 🌾 Grãos, Massas e Farinhas ────────────────────────────
  makeIngredient("arroz-branco", "Arroz Branco", "Grãos, Massas e Farinhas", "🍚"),
  makeIngredient("arroz-integral", "Arroz Integral", "Grãos, Massas e Farinhas", "🍚"),
  makeIngredient("aveia-farao", "Aveia em Farelo", "Grãos, Massas e Farinhas", "🌾"),
  makeIngredient("aveia-flocos", "Aveia em Flocos", "Grãos, Massas e Farinhas", "🌾"),
  makeIngredient("ervilha", "Ervilha", "Grãos, Massas e Farinhas", "🫛"),
  makeIngredient("farinha-mandioca", "Farinha de Mandioca", "Grãos, Massas e Farinhas", "🌾"),
  makeIngredient("farinha-milho", "Farinha de Milho", "Grãos, Massas e Farinhas", "🌽"),
  makeIngredient("farinha-trigo", "Farinha de Trigo", "Grãos, Massas e Farinhas", "🌾", ["glúten"]),
  makeIngredient("feijao-branco", "Feijão Branco", "Grãos, Massas e Farinhas", "🫘"),
  makeIngredient("feijao-carioca", "Feijão Carioca", "Grãos, Massas e Farinhas", "🫘"),
  makeIngredient("feijao-preto", "Feijão Preto", "Grãos, Massas e Farinhas", "🫘"),
  makeIngredient("goma-tapioca", "Goma de Tapioca", "Grãos, Massas e Farinhas", "🌾"),
  makeIngredient("grao-de-bico", "Grão-de-bico", "Grãos, Massas e Farinhas", "🫘"),
  makeIngredient("lentilha", "Lentilha", "Grãos, Massas e Farinhas", "🫘"),
  makeIngredient("macarrao", "Macarrão", "Grãos, Massas e Farinhas", "🍝", ["glúten"]),
  makeIngredient("pao-integral", "Pão de Forma Integral", "Grãos, Massas e Farinhas", "🍞", ["glúten"]),
  makeIngredient("pao-normal", "Pão de Forma Normal", "Grãos, Massas e Farinhas", "🍞", ["glúten"]),
  makeIngredient("pao-frances", "Pão Francês", "Grãos, Massas e Farinhas", "🥖", ["glúten"]),

  // ─── 🥛 Laticínios e Derivados ────────────────────────────────
  makeIngredient("coalhada", "Coalhada", "Laticínios e Derivados", "🥛", ["lactose"]),
  makeIngredient("cream-cheese", "Cream Cheese", "Laticínios e Derivados", "🧀", ["lactose"]),
  makeIngredient("creme-leite", "Creme de Leite", "Laticínios e Derivados", "🥛", ["lactose"]),
  makeIngredient("iogurte-desnatado", "Iogurte Desnatado", "Laticínios e Derivados", "🥛", ["lactose"]),
  makeIngredient("iogurte-grego", "Iogurte Grego", "Laticínios e Derivados", "🥛", ["lactose"]),
  makeIngredient("iogurte-natural", "Iogurte Natural", "Laticínios e Derivados", "🥛", ["lactose"]),
  makeIngredient("leite-condensado", "Leite Condensado", "Laticínios e Derivados", "🥛", ["lactose"]),
  makeIngredient("leite-coco", "Leite de Coco", "Laticínios e Derivados", "🥥"),
  makeIngredient("leite-desnatado", "Leite Desnatado", "Laticínios e Derivados", "🥛", ["lactose"]),
  makeIngredient("leite-integral", "Leite Integral", "Laticínios e Derivados", "🥛", ["lactose"]),
  makeIngredient("leite-semidesnatado", "Leite Semidesnatado", "Laticínios e Derivados", "🥛", ["lactose"]),
  makeIngredient("manteiga", "Manteiga", "Laticínios e Derivados", "🧈", ["lactose"]),
  makeIngredient("margarina", "Margarina", "Laticínios e Derivados", "🧈"),
  makeIngredient("queijo-mucarela", "Queijo Muçarela", "Laticínios e Derivados", "🧀", ["lactose"]),
  makeIngredient("queijo-prato", "Queijo Prato", "Laticínios e Derivados", "🧀", ["lactose"]),
  makeIngredient("queijo-ricota", "Queijo Ricota", "Laticínios e Derivados", "🧀", ["lactose"]),
  makeIngredient("requeijao", "Requeijão", "Laticínios e Derivados", "🧀", ["lactose"]),

  // ─── 🧂 Temperos e Condimentos ────────────────────────────────
  makeIngredient("acucar", "Açúcar", "Temperos e Condimentos", "🍚"),
  makeIngredient("acucar-mascavo", "Açúcar Mascavo", "Temperos e Condimentos", "🍚"),
  makeIngredient("alho", "Alho", "Temperos e Condimentos", "🧄"),
  makeIngredient("azeite", "Azeite de Oliva", "Temperos e Condimentos", "🫒"),
  makeIngredient("cebola", "Cebola", "Temperos e Condimentos", "🧅"),
  makeIngredient("extrato-tomate", "Extrato de Tomate", "Temperos e Condimentos", "🍅"),
  makeIngredient("mel", "Mel", "Temperos e Condimentos", "🍯"),
  makeIngredient("molho-tomate", "Molho de Tomate", "Temperos e Condimentos", "🍅"),
  makeIngredient("oleo-soja", "Óleo de Soja", "Temperos e Condimentos", "🫙"),
  makeIngredient("pimenta", "Pimenta-do-reino", "Temperos e Condimentos", "🌶️"),
  makeIngredient("sal", "Sal", "Temperos e Condimentos", "🧂"),
  makeIngredient("shoyu", "Shoyu", "Temperos e Condimentos", "🍶"),
  makeIngredient("vinagre", "Vinagre", "Temperos e Condimentos", "🫙"),

  // ─── 🍬 Panificação e Doces ──────────────────────────────────
  makeIngredient("cacau-po", "Cacau em Pó", "Panificação e Doces", "🍫"),
  makeIngredient("chocolate-meio-amargo", "Chocolate Meio Amargo", "Panificação e Doces", "🍫", ["lactose"]),
  makeIngredient("coco-ralado", "Coco Ralado", "Panificação e Doces", "🥥"),
  makeIngredient("fermento-biologico", "Fermento Biológico", "Panificação e Doces", "🧫"),
  makeIngredient("fermento-quimico", "Fermento Químico", "Panificação e Doces", "🧫"),

  // ─── 💊 Suplementos ─────────────────────────────────────────
  makeIngredient("whey-baunilha", "Whey Protein Baunilha", "Suplementos", "💊", ["lactose"]),
  makeIngredient("whey-chocolate", "Whey Protein Chocolate", "Suplementos", "💊", ["lactose"]),
  makeIngredient("whey-morango", "Whey Protein Morango", "Suplementos", "💊", ["lactose"]),
  makeIngredient("whey-natural", "Whey Protein Natural", "Suplementos", "💊", ["lactose"]),
];

// Get ingredients grouped by category
export function getIngredientsByCategory(): Record<IngredientCategory, Ingredient[]> {
  const grouped = {} as Record<IngredientCategory, Ingredient[]>;
  for (const cat of INGREDIENT_CATEGORIES) {
    grouped[cat.id] = INGREDIENTS.filter((i) => i.category === cat.id);
  }
  return grouped;
}

// Find ingredient by id
export function findIngredientById(id: string): Ingredient | undefined {
  return INGREDIENTS.find((i) => i.id === id);
}

// Search ingredients by name
export function searchIngredients(query: string): Ingredient[] {
  const q = query.toLowerCase().trim();
  if (!q) return INGREDIENTS;
  return INGREDIENTS.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q),
  );
}

export const QUANTITY_UNITS: { value: QuantityUnit; label: string }[] = [
  { value: "g", label: "Grama (g)" },
  { value: "ml", label: "Mililitro (ml)" },
  { value: "xícara", label: "Xícara (240ml)" },
  { value: "colher de sopa", label: "Colher de sopa (15ml)" },
  { value: "colher de chá", label: "Colher de chá (5ml)" },
  { value: "un", label: "Unidade (un)" },
  { value: "a gosto", label: "A gosto" },
  { value: "outro", label: "Outro" },
];

export function getCategoryIcon(category: IngredientCategory): string {
  return INGREDIENT_CATEGORIES.find((c) => c.id === category)?.icon ?? "➕";
}
