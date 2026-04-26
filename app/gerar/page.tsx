"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { generateRecipe, generateRecipeAI, surpriseRecipe } from "@/lib/generateRecipe";
import { INGREDIENTS, INGREDIENT_CATEGORIES } from "@/lib/ingredients";
import { useProfile } from "@/hooks/useProfile";
import { useRecipeHistory } from "@/hooks/useRecipeHistory";
import { Ingredient, IngredientWithQuantity, DietTag, Occasion, Difficulty, GenerationMode, MealType } from "@/lib/types";
import { Sparkles, Shuffle, Refrigerator, ChefHat, X, Search, Bot, AlertCircle } from "lucide-react";

const USE_AI = process.env.NEXT_PUBLIC_USE_AI === "true";


const dietOptions: DietTag[] = [
  "Vegano","Vegetariano","Sem glúten","Sem lactose",
  "Low carb","Cetogênico","Sem açúcar","Sem frutos do mar","Sem nozes",
];
const occasions: { value: Occasion; label: string; emoji: string }[] = [
  { value: "Café da manhã",   label: "Café da manhã",   emoji: "🌅" },
  { value: "Lanche rápido",   label: "Lanche rápido",   emoji: "⚡" },
  { value: "Almoço executivo",label: "Almoço executivo",emoji: "💼" },
  { value: "Jantar romântico",label: "Jantar romântico",emoji: "🌙" },
  { value: "Pós-treino",      label: "Pós-treino",      emoji: "💪" },
  { value: "Festa",           label: "Festa",           emoji: "🎉" },
];

export default function GeneratorPage() {
  const { profile } = useProfile();
  const { add } = useRecipeHistory();
  const router = useRouter();

  const [mode, setMode] = useState<GenerationMode>("normal");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<IngredientWithQuantity[]>([]);
  const [dietTags, setDietTags] = useState<DietTag[]>(profile.dietRestrictions);
  const [mealType, setMealType] = useState<MealType | undefined>();          // ← NOVO: controlado
  const [occasion, setOccasion] = useState<Occasion | undefined>();
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>();
  const [servings, setServings] = useState(2);
  const [loading, setLoading] = useState(false);
  const [aiWarning, setAiWarning] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<"gemini"|"mock"|null>(null);
  const [openCat, setOpenCat] = useState<string | null>(null);

  /* ── Ingredients ── */
  const filtered = INGREDIENTS.filter(i =>
    !search ||
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );
  const selectedIds = selected.map(s => s.ingredient.id);

  const addIngredient = (ing: Ingredient) => {
    if (selectedIds.includes(ing.id)) return;
    setSelected(prev => [...prev, { ingredient: ing, quantity: 100, unit: "g" }]);
  };
  const removeIngredient = (id: string) =>
    setSelected(prev => prev.filter(s => s.ingredient.id !== id));

  const toggleDiet = (tag: DietTag) =>
    setDietTags(prev =>
      prev.includes(tag) ? prev.filter(d => d !== tag) : [...prev, tag]
    );

  /* ── Generate ── */
  const handleGenerate = async (isSurprise = false) => {
    setLoading(true);
    setAiWarning(null);
    setAiSource(null);
    try {
      if (isSurprise) {
        const r = surpriseRecipe();
        add(r);
        router.push(`/receita/${r.id}`);
        return;
      }

      const opts = {
        mode,
        ingredients: selectedIds,
        filters: { mealType, dietTags, occasion, difficulty, maxPrepMinutes: 999, servings, budgetMode: false, macroFilter: { minProtein:0, maxProtein:200, minCarbs:0, maxCarbs:400, minFat:0, maxFat:200 } },
        equipment: Object.entries(profile.equipment ?? {}).filter(([,v]) => v).map(([k]) => k),
        nutritionGoal: profile.nutritionalGoal ?? "saúde geral",
      };

      if (USE_AI) {
        const { recipe, source, warning } = await generateRecipeAI(opts);
        add(recipe);
        if (warning) setAiWarning(warning);
        setAiSource(source);
        router.push(`/receita/${recipe.id}`);
      } else {
        // pequeno delay para UX
        await new Promise(r => setTimeout(r, 900));
        const recipe = generateRecipe(opts);
        add(recipe);
        router.push(`/receita/${recipe.id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Shared pill button style ── */
  const pill = (active: boolean, variant: "green"|"orange"|"blue" = "green") => {
    const base = "px-3 py-1.5 rounded-full text-xs border-2 transition-all font-medium";
    const colors = {
      green:  active ? "border-fitgreen-500 bg-fitgreen-500 text-white"   : "border-border hover:border-fitgreen-400",
      orange: active ? "border-fitorange-500 bg-fitorange-500 text-white" : "border-border hover:border-fitorange-400",
      blue:   active ? "border-fitblue-700 bg-fitblue-800 text-white"     : "border-border hover:border-fitblue-400",
    };
    return `${base} ${colors[variant]}`;
  };

  return (
    <div className="section-container max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">✨ Gerador de Receitas</h1>

      {/* ── Mode toggle ── */}
      <div className="flex gap-2 mb-8 p-1 bg-muted rounded-xl">
        {[
          { value: "normal"         as GenerationMode, label: "Modo Normal",       icon: <ChefHat className="w-4 h-4" /> },
          { value: "geladeira-vazia"as GenerationMode, label: "Geladeira Vazia",  icon: <Refrigerator className="w-4 h-4" /> },
        ].map(m => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all
              ${mode === m.value
                ? "bg-background shadow text-fitgreen-600"
                : "text-muted-foreground hover:text-foreground"}`}
          >
            {m.icon}{m.label}
          </button>
        ))}
      </div>

      {mode === "geladeira-vazia" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-fitgreen-50 border border-fitgreen-200 text-sm text-fitgreen-700"
        >
          ♻️ <strong>Modo Zero Desperdício:</strong> Informe o que você tem e criaremos a melhor receita aproveitando ao máximo.
        </motion.div>
      )}

      {/* ── Ingredient picker ── */}
      <div className="card-fitchef p-6 mb-5 flex flex-col gap-4">
        <h2 className="font-semibold">🥗 Ingredientes disponíveis</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar ingrediente..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-fitgreen-400"
          />
        </div>

        <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
          {INGREDIENT_CATEGORIES.filter(cat => cat.id !== "Outro").map(cat => {
            const catItems = filtered.filter(i => i.category === cat.id);
            if (catItems.length === 0) return null;
            const isOpen = openCat === cat.id || !!search;
            return (
              <div key={cat.id}>
                <button
                  onClick={() => setOpenCat(isOpen && !search ? null : cat.id)}
                  className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors"
                >
                  <span>{cat.icon} {cat.label}</span>
                  <span className="text-xs text-muted-foreground">{catItems.length}</span>
                </button>
                {isOpen && (
                  <div className="flex flex-wrap gap-1.5 px-3 pb-2">
                    {catItems.map(ing => {
                      const isSel = selectedIds.includes(ing.id);
                      return (
                        <button
                          key={ing.id}
                          onClick={() => addIngredient(ing)}
                          disabled={isSel}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-all
                            ${isSel
                              ? "border-fitgreen-400 bg-fitgreen-100 text-fitgreen-700 opacity-70 cursor-not-allowed"
                              : "border-border hover:border-fitgreen-400 hover:bg-fitgreen-50"}`}
                        >
                          {ing.icon} {ing.name} {isSel && "✓"}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
            {selected.map(s => (
              <div key={s.ingredient.id} className="ingredient-chip">
                {s.ingredient.icon} {s.ingredient.name}
                <button
                  aria-label={`Remover ${s.ingredient.name}`}
                  onClick={() => removeIngredient(s.ingredient.id)}
                  className="ml-1 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        {selected.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-1">
            Selecione pelo menos 1 ingrediente para gerar
          </p>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="card-fitchef p-6 mb-6 flex flex-col gap-5">
        <h2 className="font-semibold">⚙️ Filtros</h2>

        {/* Tipo de prato — CORRIGIDO */}
        <div>
          <p className="text-sm font-medium mb-2 text-muted-foreground">Tipo de prato</p>
          <div className="flex gap-2">
            {(["Doce", "Salgado"] as MealType[]).map(t => (
              <button
                key={t}
                onClick={() => setMealType(prev => prev === t ? undefined : t)}
                className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all
                  ${mealType === t
                    ? "border-fitorange-500 bg-fitorange-50 text-fitorange-700"
                    : "border-border hover:border-fitorange-300 text-muted-foreground"}`}
              >
                {t === "Doce" ? "🍰 Doce" : "🍳 Salgado"}
              </button>
            ))}
          </div>
          {mealType && (
            <button
              onClick={() => setMealType(undefined)}
              className="mt-1.5 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Limpar seleção
            </button>
          )}
        </div>

        {/* Restrições alimentares */}
        <div>
          <p className="text-sm font-medium mb-2 text-muted-foreground">Restrições alimentares</p>
          <div className="flex flex-wrap gap-2">
            {dietOptions.map(tag => (
              <button key={tag} onClick={() => toggleDiet(tag)} className={pill(dietTags.includes(tag), "green")}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Ocasião */}
        <div>
          <p className="text-sm font-medium mb-2 text-muted-foreground">Ocasião</p>
          <div className="flex flex-wrap gap-2">
            {occasions.map(o => (
              <button
                key={o.value}
                onClick={() => setOccasion(prev => prev === o.value ? undefined : o.value)}
                className={pill(occasion === o.value, "blue")}
              >
                {o.emoji} {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Porções */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Porções</p>
            <div className="flex items-center gap-3">
              <button
                aria-label="Diminuir porções"
                onClick={() => setServings(s => Math.max(1, s - 1))}
                className="w-8 h-8 rounded-full border-2 border-fitgreen-300 flex items-center justify-center hover:bg-fitgreen-50 font-bold text-fitgreen-700"
              >−</button>
              <span className="text-xl font-bold w-6 text-center">{servings}</span>
              <button
                aria-label="Aumentar porções"
                onClick={() => setServings(s => Math.min(12, s + 1))}
                className="w-8 h-8 rounded-full border-2 border-fitgreen-300 flex items-center justify-center hover:bg-fitgreen-50 font-bold text-fitgreen-700"
              >+</button>
            </div>
          </div>
        </div>

        {/* Dificuldade */}
        <div>
          <p className="text-sm font-medium mb-2 text-muted-foreground">Dificuldade</p>
          <div className="flex gap-2">
            {(["Fácil", "Médio", "Difícil"] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(prev => prev === d ? undefined : d)}
                className={`flex-1 py-2 rounded-lg border-2 text-xs font-medium transition-all
                  ${difficulty === d
                    ? "border-fitorange-500 bg-fitorange-50 text-fitorange-700"
                    : "border-border hover:border-fitorange-300 text-muted-foreground"}`}
              >
                {d === "Fácil" ? "😊" : d === "Médio" ? "😐" : "😤"} {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── AI badge ── */}
      {USE_AI && (
        <div className="flex items-center gap-2 mb-3 text-xs text-fitgreen-700 bg-fitgreen-50 border border-fitgreen-200 rounded-xl px-4 py-2">
          <Bot className="w-4 h-4 shrink-0" />
          <span><strong>Chefe Virtual ativo:</strong> Receitas geradas especialmente para você pelo nosso Chefe.</span>
        </div>
      )}

      {/* ── Fallback warning toast ── */}
      <AnimatePresence>
        {aiWarning && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-start gap-2 mb-3 text-xs text-fitorange-700 bg-fitorange-50 border border-fitorange-200 rounded-xl px-4 py-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{aiWarning}</span>
            <button onClick={() => setAiWarning(null)} className="ml-auto hover:opacity-70"><X className="w-3 h-3" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Actions ── */}
      <div className="flex gap-3">
        <button onClick={() => handleGenerate(true)} className="btn-fitchef-outline flex items-center gap-2">
          <Shuffle className="w-4 h-4" /> Surpreenda-me
        </button>
        <button
          onClick={() => handleGenerate(false)}
          disabled={selected.length === 0 || loading}
          className="btn-fitchef-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Gerando...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Gerar Receita</>
          )}
        </button>
      </div>
    </div>
  );
}
