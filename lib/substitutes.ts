import { SubstituteOption } from "./types";

// Map: ingredientId → up to 3 substitutes with reason + macro delta
export const SUBSTITUTES: Record<string, SubstituteOption[]> = {
  "leite-integral": [
    { name: "Leite de Coco", reason: "Sem lactose, mais cremoso", deltaCalories: 30, deltaProtein: -2, deltaCarbs: 2, deltaFat: 4 },
    { name: "Leite de Amêndoas", reason: "Sem lactose, menos calorias", deltaCalories: -40, deltaProtein: -4, deltaCarbs: -1, deltaFat: -1 },
    { name: "Leite Desnatado", reason: "Menos gordura, mesmo sabor", deltaCalories: -20, deltaProtein: 0, deltaCarbs: 0, deltaFat: -3 },
  ],
  "manteiga": [
    { name: "Óleo de Coco", reason: "Sem lactose, sabor tropical", deltaCalories: 5, deltaProtein: 0, deltaCarbs: 0, deltaFat: 1 },
    { name: "Azeite de Oliva", reason: "Mais saudável, sem lactose", deltaCalories: -10, deltaProtein: 0, deltaCarbs: 0, deltaFat: 0 },
    { name: "Margarina", reason: "Mais barato, sem lactose", deltaCalories: 0, deltaProtein: 0, deltaCarbs: 0, deltaFat: 0 },
  ],
  "farinha-trigo": [
    { name: "Farinha de Aveia", reason: "Sem glúten (aveia pura), mais fibras", deltaCalories: -20, deltaProtein: 2, deltaCarbs: -5, deltaFat: 1 },
    { name: "Farinha de Amêndoas", reason: "Sem glúten, low carb", deltaCalories: 30, deltaProtein: 5, deltaCarbs: -20, deltaFat: 8 },
    { name: "Polvilho Doce", reason: "Sem glúten, textura leve", deltaCalories: -10, deltaProtein: -2, deltaCarbs: 2, deltaFat: 0 },
  ],
  "acucar": [
    { name: "Mel", reason: "Natural, mais nutritivo", deltaCalories: 20, deltaProtein: 0, deltaCarbs: 5, deltaFat: 0 },
    { name: "Adoçante Eritritol", reason: "Sem açúcar, zero calorias", deltaCalories: -64, deltaProtein: 0, deltaCarbs: -16, deltaFat: 0 },
    { name: "Açúcar Mascavo", reason: "Menos processado, mesmo sabor", deltaCalories: 5, deltaProtein: 0, deltaCarbs: 1, deltaFat: 0 },
  ],
  "creme-leite": [
    { name: "Leite de Coco", reason: "Sem lactose, cremoso", deltaCalories: -50, deltaProtein: -1, deltaCarbs: 2, deltaFat: -5 },
    { name: "Iogurte Grego", reason: "Menos gordura, mais proteína", deltaCalories: -80, deltaProtein: 8, deltaCarbs: 3, deltaFat: -18 },
    { name: "Creme de Caju", reason: "Vegano, sem lactose", deltaCalories: -30, deltaProtein: 2, deltaCarbs: 1, deltaFat: -6 },
  ],
  "frango-file-peito": [
    { name: "Peito de Peru", reason: "Mais magro, mesmo perfil proteico", deltaCalories: -20, deltaProtein: 2, deltaCarbs: 0, deltaFat: -2 },
    { name: "Peixe: Filé de Tilápia", reason: "Mais leve, ômega-3", deltaCalories: -30, deltaProtein: 1, deltaCarbs: 0, deltaFat: -3 },
    { name: "Grão-de-bico", reason: "Vegano, mais fibras", deltaCalories: -40, deltaProtein: -15, deltaCarbs: 20, deltaFat: -5 },
  ],
  "queijo-mucarela": [
    { name: "Queijo Ricota", reason: "Menos gordura, mais proteína", deltaCalories: -60, deltaProtein: 2, deltaCarbs: 1, deltaFat: -8 },
    { name: "Tofu Firme", reason: "Vegano, sem lactose", deltaCalories: -70, deltaProtein: -2, deltaCarbs: 2, deltaFat: -10 },
    { name: "Queijo Prato", reason: "Mesmo estilo, levemente diferente", deltaCalories: 10, deltaProtein: 1, deltaCarbs: 0, deltaFat: 1 },
  ],
  "ovos-inteiro": [
    { name: "Linhaça + Água (1 col = 1 ovo)", reason: "Vegano, rico em ômega-3", deltaCalories: -40, deltaProtein: -5, deltaCarbs: 2, deltaFat: 1 },
    { name: "Banana Madura (½ und)", reason: "Vegano, mais doce", deltaCalories: -30, deltaProtein: -5, deltaCarbs: 12, deltaFat: -4 },
    { name: "Clara de Ovo (2 claras)", reason: "Menos gordura, mais proteína", deltaCalories: -30, deltaProtein: 2, deltaCarbs: 0, deltaFat: -5 },
  ],
  "arroz-branco": [
    { name: "Arroz Integral", reason: "Mais fibras, índice glicêmico menor", deltaCalories: 5, deltaProtein: 1, deltaCarbs: -2, deltaFat: 0 },
    { name: "Quinoa", reason: "Proteína completa, sem glúten", deltaCalories: 15, deltaProtein: 4, deltaCarbs: -3, deltaFat: 2 },
    { name: "Couve-flor Ralada", reason: "Low carb, mais leve", deltaCalories: -120, deltaProtein: -2, deltaCarbs: -28, deltaFat: 0 },
  ],
  "macarrao": [
    { name: "Macarrão de Arroz", reason: "Sem glúten, mesmo preparo", deltaCalories: 5, deltaProtein: -1, deltaCarbs: 2, deltaFat: 0 },
    { name: "Espaguete de Abobrinha", reason: "Low carb, fresh, sem glúten", deltaCalories: -150, deltaProtein: -3, deltaCarbs: -35, deltaFat: 0 },
    { name: "Macarrão de Grão-de-bico", reason: "Mais proteína, mais fibras", deltaCalories: 10, deltaProtein: 8, deltaCarbs: -5, deltaFat: 1 },
  ],
};

export function getSubstitutes(ingredientId: string): SubstituteOption[] {
  return SUBSTITUTES[ingredientId] ?? [
    { name: "Ingrediente similar", reason: "Substituição genérica", deltaCalories: 0, deltaProtein: 0, deltaCarbs: 0, deltaFat: 0 },
  ];
}
