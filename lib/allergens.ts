// Maps ingredient ID to allergen labels
export const ALLERGEN_MAP: Record<string, string[]> = {
  // Lactose
  "leite-integral": ["lactose"],
  "leite-desnatado": ["lactose"],
  "leite-semidesnatado": ["lactose"],
  "leite-condensado": ["lactose"],
  "creme-leite": ["lactose"],
  "manteiga": ["lactose"],
  "iogurte-natural": ["lactose"],
  "iogurte-grego": ["lactose"],
  "iogurte-desnatado": ["lactose"],
  "coalhada": ["lactose"],
  "queijo-mucarela": ["lactose"],
  "queijo-prato": ["lactose"],
  "queijo-ricota": ["lactose"],
  "cream-cheese": ["lactose"],
  "requeijao": ["lactose"],
  "chocolate-meio-amargo": ["lactose"],
  "whey-baunilha": ["lactose"],
  "whey-chocolate": ["lactose"],
  "whey-morango": ["lactose"],
  "whey-natural": ["lactose"],
  // Glúten
  "farinha-trigo": ["glúten"],
  "macarrao": ["glúten"],
  "pao-integral": ["glúten"],
  "pao-normal": ["glúten"],
  "pao-frances": ["glúten"],
  // Frutos do mar
  "atum-conserva": ["frutos do mar"],
  "peixe-merluza": ["frutos do mar"],
  "peixe-polaca": ["frutos do mar"],
  "peixe-tilapia": ["frutos do mar"],
  "peixe-cacao": ["frutos do mar"],
  "peixe-salmao": ["frutos do mar"],
  "sardinha-conserva": ["frutos do mar"],
};

export type RestrictionKey = "Sem lactose" | "Sem glúten" | "Sem frutos do mar" | "Sem nozes";

export const RESTRICTION_TO_ALLERGEN: Record<RestrictionKey, string> = {
  "Sem lactose": "lactose",
  "Sem glúten": "glúten",
  "Sem frutos do mar": "frutos do mar",
  "Sem nozes": "nozes",
};

export function detectAllergenConflicts(
  ingredientIds: string[],
  restrictions: string[]
): { ingredient: string; allergen: string }[] {
  const conflicts: { ingredient: string; allergen: string }[] = [];
  for (const id of ingredientIds) {
    const allergens = ALLERGEN_MAP[id] ?? [];
    for (const allergen of allergens) {
      const conflictsWithRestriction = restrictions.some((r) => {
        const mapped = RESTRICTION_TO_ALLERGEN[r as RestrictionKey];
        return mapped === allergen;
      });
      if (conflictsWithRestriction) {
        conflicts.push({ ingredient: id, allergen });
      }
    }
  }
  return conflicts;
}
