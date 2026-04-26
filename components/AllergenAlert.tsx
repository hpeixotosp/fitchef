"use client";
import { AlertTriangle } from "lucide-react";

interface Props {
  conflicts: { ingredient: string; allergen: string }[];
  onSubstituteAll?: () => void;
}

export function AllergenAlert({ conflicts, onSubstituteAll }: Props) {
  if (conflicts.length === 0) return null;
  const allergens = [...new Set(conflicts.map(c => c.allergen))];

  return (
    <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
      <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
          ⚠️ Esta receita contém <strong>{allergens.join(", ")}</strong>, que conflita(m) com seu perfil.
        </p>
        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
          {conflicts.length} ingrediente(s) identificado(s).
        </p>
      </div>
      {onSubstituteAll && (
        <button
          onClick={onSubstituteAll}
          className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-300 transition-colors"
        >
          Substituir automaticamente
        </button>
      )}
    </div>
  );
}
