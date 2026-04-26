"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getHistory } from "@/lib/storage";
import { useFavorites } from "@/hooks/useFavorites";
import { Recipe, NutritionInfo } from "@/lib/types";
import { NutritionTable } from "@/components/NutritionTable";
import { NutritionScore } from "@/components/NutritionScore";
import { AllergenAlert } from "@/components/AllergenAlert";
import { detectAllergenConflicts } from "@/lib/allergens";
import { useProfile } from "@/hooks/useProfile";
import { usePortionScaler } from "@/hooks/usePortionScaler";
import { Clock, Flame, ChefHat, Heart, RefreshCw, Timer } from "lucide-react";
import { motion } from "framer-motion";


export default function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toggle, check } = useFavorites();
  const { profile } = useProfile();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [scaledNutrition, setScaledNutrition] = useState<NutritionInfo | null>(null);
  const [scaledServings, setScaledServings] = useState(1);

  useEffect(() => {
    const history = getHistory();
    const found = history.find(r => r.id === id);
    if (found) { setRecipe(found); setScaledServings(found.servings); }
  }, [id]);

  if (!recipe) return (
    <div className="section-container text-center flex flex-col items-center gap-4 py-16">
      <span className="text-6xl">🍽️</span>
      <h2 className="text-xl font-bold">Receita não encontrada</h2>
      <p className="text-muted-foreground text-sm max-w-xs">
        Esta receita não está mais disponível no seu histórico. Que tal criar uma nova?
      </p>
      <button onClick={() => router.push("/gerar")} className="btn-fitchef-primary mt-2">
        Criar nova receita
      </button>
    </div>
  );

  const conflicts = detectAllergenConflicts(
    recipe.ingredients.map(i => i.ingredient.id),
    profile.dietRestrictions
  );
  const isFav = check(recipe.id);
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <div className="section-container max-w-3xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 mb-8">
        <div className="flex flex-wrap gap-2 items-start justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">{recipe.emoji} {recipe.name}</h1>
            <p className="text-muted-foreground mt-1">{recipe.description}</p>
          </div>
          {recipe.specialBadge && <span className="badge-orange text-sm">{recipe.specialBadge}</span>}
        </div>

        <div className="flex flex-wrap gap-2">
          {recipe.dietTags.map(t => <span key={t} className="badge-green">{t}</span>)}
          <span className="badge-blue">{recipe.difficulty}</span>
          <span className="badge-orange">{recipe.occasion[0]}</span>
        </div>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{totalTime} min</span>
          <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-fitorange-500" />{recipe.nutritionPerServing.calories} kcal/porção</span>
          <span>{recipe.servings} porções</span>
        </div>
      </motion.div>

      {/* Hero image */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md mb-8 flex items-center justify-center bg-gradient-hero">
        <span className="text-9xl opacity-20 absolute">{recipe.emoji}</span>
        {recipe.imageBase64 ? (
          <Image
            src={recipe.imageBase64}
            alt={`Foto de ${recipe.name} gerada por IA`}
            fill
            className="object-cover relative z-10"
            unoptimized
          />
        ) : (
          <img
            src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80`}
            alt={recipe.name}
            className="w-full h-full object-cover relative z-10"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
      </div>

      {/* Allergen alert */}
      <div className="mb-6">
        <AllergenAlert conflicts={conflicts} />
      </div>

      {/* Nutrition */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card-fitchef p-6 flex flex-col items-center gap-4">
          <NutritionScore score={recipe.nutritionScore} size={120} />
        </div>
        <div>
          <NutritionTable nutrition={scaledNutrition ?? recipe.nutritionPerServing} servings={scaledServings} />
          <div className="mt-3 flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Porções</span>
            <div className="flex items-center gap-2">
              <button aria-label="Diminuir" onClick={() => setScaledServings(s => Math.max(1, s-1))} className="w-8 h-8 rounded-full border-2 border-fitgreen-300 flex items-center justify-center hover:bg-fitgreen-50">−</button>
              <span className="w-6 text-center font-bold">{scaledServings}</span>
              <button aria-label="Aumentar" onClick={() => setScaledServings(s => s+1)} className="w-8 h-8 rounded-full border-2 border-fitgreen-300 flex items-center justify-center hover:bg-fitgreen-50">+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="card-fitchef p-6 mb-8">
        <h2 className="font-semibold text-lg mb-4">🛒 Ingredientes</h2>
        <ul className="flex flex-col gap-2">
          {recipe.ingredients.map((iw, idx) => (
            <li key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm flex items-center gap-2">
                <span>{iw.ingredient.icon}</span>
                <span>{iw.ingredient.name}</span>
              </span>
              <span className="text-sm text-muted-foreground font-medium">
                {iw.quantity} {iw.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div className="card-fitchef p-6 mb-8">
        <h2 className="font-semibold text-lg mb-4">📋 Modo de Preparo</h2>
        <ol className="flex flex-col gap-4">
          {recipe.steps.map(step => (
            <li key={step.id} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-fitgreen-500 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                {step.order}
              </div>
              <div className="flex-1">
                <p className="text-sm">{step.instruction}</p>
                <div className="flex gap-2 mt-1.5">
                  {step.equipment && <span className="badge-blue">{step.equipment}</span>}
                  {step.durationMinutes && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Timer className="w-3.5 h-3.5" />{step.durationMinutes} min
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => router.push(`/receita/${recipe.id}/cozinhar`)} className="btn-fitchef-primary flex items-center gap-2">
          <ChefHat className="w-4 h-4" /> Modo Cozinha
        </button>
        <button onClick={() => toggle(recipe)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${isFav ? "border-red-400 bg-red-50 text-red-600 dark:bg-red-900/20" : "border-border hover:border-red-300"}`}>
          <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
          {isFav ? "Favoritado" : "Favoritar"}
        </button>
        <button onClick={() => router.push("/gerar")} className="btn-fitchef-outline flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Gerar outra
        </button>
      </div>
    </div>
  );
}
