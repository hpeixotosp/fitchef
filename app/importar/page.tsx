"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRecipeHistory } from "@/hooks/useRecipeHistory";
import { Recipe, RecipeStep, DietTag, Occasion, Difficulty, MealType } from "@/lib/types";
import { Plus, Trash2, Save } from "lucide-react";

const dietOptions: DietTag[] = ["Vegano","Vegetariano","Sem glúten","Sem lactose","Low carb","Cetogênico","Sem açúcar"];
const occasions: Occasion[] = ["Café da manhã","Lanche rápido","Almoço executivo","Jantar romântico","Pós-treino","Festa"];

export default function ImportarPage() {
  const { add } = useRecipeHistory();
  const router = useRouter();

  const [name, setName] = useState("");
  const [mealType, setMealType] = useState<MealType>("Salgado");
  const [difficulty, setDifficulty] = useState<Difficulty>("Fácil");
  const [occasion, setOccasion] = useState<Occasion>("Almoço executivo");
  const [prepTime, setPrepTime] = useState(30);
  const [servings, setServings] = useState(2);
  const [dietTags, setDietTags] = useState<DietTag[]>([]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [fiber, setFiber] = useState("");

  const addStep = () => setSteps(prev => [...prev, ""]);
  const removeStep = (i: number) => setSteps(prev => prev.filter((_, idx) => idx !== i));
  const updateStep = (i: number, val: string) => setSteps(prev => prev.map((s, idx) => idx === i ? val : s));

  const toggleDiet = (tag: DietTag) =>
    setDietTags(prev => prev.includes(tag) ? prev.filter(d => d !== tag) : [...prev, tag]);

  const handleSave = () => {
    if (!name.trim()) return;
    const recipeSteps: RecipeStep[] = steps
      .filter(s => s.trim())
      .map((s, i) => ({ id: `step-${i}`, order: i + 1, instruction: s }));

    const recipe: Recipe = {
      id: `manual-${Date.now()}`,
      name: name.trim(),
      emoji: "📝",
      description: `Receita manual: ${name.trim()}`,
      imageQuery: name.toLowerCase(),
      dietTags,
      difficulty,
      prepTimeMinutes: prepTime,
      cookTimeMinutes: 0,
      servings,
      occasion: [occasion],
      mealType,
      nutritionPerServing: {
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
        fiber: Number(fiber) || 0,
      },
      nutritionScore: 5,
      ingredients: [],
      steps: recipeSteps,
      mode: "normal",
      createdAt: new Date().toISOString(),
      isManual: true,
    };

    add(recipe);
    router.push(`/receita/${recipe.id}`);
  };

  return (
    <div className="section-container max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">📝 Importar Receita Manual</h1>

      <div className="flex flex-col gap-6">
        <div className="card-fitchef p-6 flex flex-col gap-4">
          <h2 className="font-semibold border-b border-border pb-3">Informações básicas</h2>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Nome da receita *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Lasanha da vovó"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-fitgreen-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo</label>
              <div className="flex gap-2 mt-1">
                {(["Doce","Salgado"] as MealType[]).map(t => (
                  <button key={t} onClick={() => setMealType(t)}
                    className={`flex-1 py-2 rounded-lg border-2 text-xs font-medium transition-all ${mealType === t ? "border-fitorange-500 bg-fitorange-50" : "border-border"}`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Dificuldade</label>
              <div className="flex gap-1 mt-1">
                {(["Fácil","Médio","Difícil"] as Difficulty[]).map(d => (
                  <button key={d} onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 rounded-lg border-2 text-xs font-medium transition-all ${difficulty === d ? "border-fitgreen-500 bg-fitgreen-50" : "border-border"}`}>{d}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tempo de preparo (min)</label>
              <input type="number" value={prepTime} onChange={e => setPrepTime(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-fitgreen-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Porções</label>
              <input type="number" value={servings} onChange={e => setServings(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-fitgreen-400" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Ocasião</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {occasions.map(o => (
                <button key={o} onClick={() => setOccasion(o)}
                  className={`px-3 py-1.5 rounded-full text-xs border-2 transition-all ${occasion === o ? "border-fitblue-800 bg-fitblue-50 text-fitblue-800" : "border-border"}`}>{o}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Dietas</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {dietOptions.map(tag => (
                <button key={tag} onClick={() => toggleDiet(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs border-2 transition-all ${dietTags.includes(tag) ? "border-fitgreen-500 bg-fitgreen-500 text-white" : "border-border"}`}>{tag}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Nutrition */}
        <div className="card-fitchef p-6 flex flex-col gap-4">
          <h2 className="font-semibold border-b border-border pb-3">Informações nutricionais <span className="text-xs text-muted-foreground font-normal">(por porção, opcionais)</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Calorias", val: calories, set: setCalories },
              { label: "Proteínas (g)", val: protein, set: setProtein },
              { label: "Carbos (g)", val: carbs, set: setCarbs },
              { label: "Gorduras (g)", val: fat, set: setFat },
              { label: "Fibras (g)", val: fiber, set: setFiber },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-muted-foreground">{f.label}</label>
                <input type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder="0"
                  className="mt-1 w-full px-2 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-fitgreen-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="card-fitchef p-6 flex flex-col gap-4">
          <h2 className="font-semibold border-b border-border pb-3">Modo de preparo</h2>
          {steps.map((s, i) => (
            <div key={i} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-fitgreen-500 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-2">{i + 1}</div>
              <textarea value={s} onChange={e => updateStep(i, e.target.value)} placeholder={`Passo ${i + 1}...`} rows={2}
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-fitgreen-400 resize-none" />
              <button aria-label="Remover passo" onClick={() => removeStep(i)} className="text-muted-foreground hover:text-red-500 mt-2"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button onClick={addStep} className="flex items-center gap-2 text-sm text-fitgreen-600 hover:text-fitgreen-700 font-medium">
            <Plus className="w-4 h-4" /> Adicionar passo
          </button>
        </div>

        <button onClick={handleSave} disabled={!name.trim()} className="btn-fitchef-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <Save className="w-4 h-4" /> Salvar receita
        </button>
      </div>
    </div>
  );
}
