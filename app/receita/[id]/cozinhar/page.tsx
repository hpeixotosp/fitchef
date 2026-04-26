"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getHistory } from "@/lib/storage";
import { Recipe } from "@/lib/types";
import { useCookingMode } from "@/hooks/useCookingMode";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useTimer } from "@/hooks/useTimer";
import { MOCK_RECIPES } from "@/lib/generateRecipe";
import { ChevronLeft, ChevronRight, Timer, Play, Pause, RotateCcw, CheckCircle2, Star } from "lucide-react";

function TimerBlock({ minutes }: { minutes: number }) {
  const t = useTimer(minutes * 60);
  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-black/30 rounded-2xl">
      <div className="timer-display text-white">{t.minutes}:{t.seconds}</div>
      <div className="flex gap-2">
        {!t.running && !t.finished && <button onClick={t.start} className="flex items-center gap-1.5 px-4 py-2 bg-fitgreen-500 text-white rounded-xl text-sm font-medium"><Play className="w-4 h-4" />Iniciar Timer</button>}
        {t.running && <button onClick={t.pause} className="flex items-center gap-1.5 px-4 py-2 bg-yellow-500 text-white rounded-xl text-sm font-medium"><Pause className="w-4 h-4" />Pausar</button>}
        <button onClick={t.reset} className="p-2 rounded-xl bg-white/20 text-white hover:bg-white/30"><RotateCcw className="w-4 h-4" /></button>
      </div>
      {t.finished && <p className="text-green-400 font-semibold">✅ Concluído!</p>}
    </div>
  );
}

export default function CookingModePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    const history = getHistory();
    const found = history.find(r => r.id === id) ?? MOCK_RECIPES.find(r => r.id === id);
    if (found) setRecipe(found);
  }, [id]);

  useWakeLock(true);

  const cm = useCookingMode(recipe?.steps ?? []);

  if (!recipe) return <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">Carregando...</div>;

  if (cm.completed) return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-8 px-4 text-white">
      <div className="text-8xl animate-bounce">🎉</div>
      <h1 className="text-3xl font-bold text-center">Receita concluída!</h1>
      <p className="text-gray-300 text-center">Bom apetite! Como ficou?</p>

      {!showRating ? (
        <button onClick={() => setShowRating(true)} className="flex items-center gap-2 px-6 py-3 bg-fitorange-500 hover:bg-fitorange-600 rounded-xl font-semibold transition-colors">
          <Star className="w-5 h-5" /> Avaliar receita
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-300">Como foi sua experiência?</p>
          <div className="flex gap-3">
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setRating(n)} className="text-4xl transition-transform hover:scale-125">
                {n <= rating ? "⭐" : "☆"}
              </button>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => router.push(`/receita/${recipe.id}`)} className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-colors">
        ↩️ Voltar à receita
      </button>
    </div>
  );

  const step = cm.currentStep;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col select-none">
      {/* Progress */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-2 text-sm text-gray-300">
          <span>{recipe.emoji} {recipe.name}</span>
          <span>Passo {cm.currentIndex + 1} de {cm.total}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-fitgreen-500 rounded-full transition-all duration-500"
            style={{ width: `${((cm.currentIndex + 1) / cm.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 gap-8 max-w-2xl mx-auto w-full">
        <div className="text-6xl">{step.emoji ?? "🍳"}</div>

        <div className="flex flex-col items-center gap-4 text-center">
          {step.equipment && <span className="px-3 py-1 rounded-full bg-fitblue-800 text-sm font-medium">{step.equipment}</span>}
          <p className="cooking-mode-text font-medium leading-relaxed">{step.instruction}</p>
        </div>

        {step.durationMinutes && (
          <TimerBlock minutes={step.durationMinutes} />
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 py-6 border-t border-white/10 flex gap-4">
        <button
          aria-label="Passo anterior"
          onClick={cm.prev}
          disabled={cm.isFirst}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed font-semibold transition-colors text-lg"
        >
          <ChevronLeft className="w-6 h-6" /> Anterior
        </button>
        <button
          aria-label="Próximo passo"
          onClick={cm.next}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-fitgreen-500 hover:bg-fitgreen-600 font-semibold transition-colors text-lg"
        >
          {cm.isLast ? <><CheckCircle2 className="w-6 h-6" /> Finalizar</> : <>Próximo <ChevronRight className="w-6 h-6" /></>}
        </button>
      </div>
    </div>
  );
}
