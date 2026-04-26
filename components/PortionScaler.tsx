"use client";
import { Minus, Plus } from "lucide-react";
import { usePortionScaler } from "@/hooks/usePortionScaler";
import { NutritionInfo } from "@/lib/types";

interface Props { baseNutrition: NutritionInfo; baseServings: number; onChange?: (n: NutritionInfo, s: number) => void; }

export function PortionScaler({ baseNutrition, baseServings, onChange }: Props) {
  const { servings, nutrition, increment, decrement } = usePortionScaler(baseNutrition, baseServings);
  if (onChange) onChange(nutrition, servings);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">Porções</span>
        <div className="flex items-center gap-2">
          <button
            aria-label="Diminuir porções"
            onClick={decrement}
            className="w-9 h-9 rounded-full border-2 border-fitgreen-300 flex items-center justify-center hover:bg-fitgreen-50 dark:hover:bg-fitgreen-900/20 transition-colors"
          >
            <Minus className="w-4 h-4 text-fitgreen-600" />
          </button>
          <span className="text-2xl font-bold w-8 text-center">{servings}</span>
          <button
            aria-label="Aumentar porções"
            onClick={increment}
            className="w-9 h-9 rounded-full border-2 border-fitgreen-300 flex items-center justify-center hover:bg-fitgreen-50 dark:hover:bg-fitgreen-900/20 transition-colors"
          >
            <Plus className="w-4 h-4 text-fitgreen-600" />
          </button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Ajuste as porções e os valores se atualizam automaticamente</p>
    </div>
  );
}
