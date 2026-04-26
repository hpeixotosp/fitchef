"use client";
import { NutritionInfo } from "@/lib/types";
import { Flame, Beef, Wheat, Droplets, Leaf } from "lucide-react";

interface Props { nutrition: NutritionInfo; servings: number; }

export function NutritionTable({ nutrition, servings }: Props) {
  const s = (v: number) => Math.round((v / servings) * servings * 10) / 10;
  const items = [
    { icon: <Flame className="w-4 h-4 text-fitorange-500" />, label: "Calorias", value: `${nutrition.calories} kcal`, highlight: true },
    { icon: <Beef className="w-4 h-4 text-fitgreen-500" />, label: "Proteínas", value: `${nutrition.protein}g` },
    { icon: <Wheat className="w-4 h-4 text-yellow-500" />, label: "Carboidratos", value: `${nutrition.carbs}g` },
    { icon: <Droplets className="w-4 h-4 text-blue-500" />, label: "Gorduras", value: `${nutrition.fat}g` },
    { icon: <Leaf className="w-4 h-4 text-fitgreen-400" />, label: "Fibras", value: `${nutrition.fiber}g` },
  ];

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="bg-muted/50 px-4 py-2.5 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tabela Nutricional — por porção</p>
      </div>
      <div className="divide-y divide-border">
        {items.map(item => (
          <div key={item.label} className={`flex items-center justify-between px-4 py-2.5 ${item.highlight ? "bg-fitorange-50 dark:bg-fitorange-900/10" : ""}`}>
            <div className="flex items-center gap-2">
              {item.icon}
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
            <span className={`text-sm font-semibold ${item.highlight ? "text-fitorange-600 dark:text-fitorange-400" : ""}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
