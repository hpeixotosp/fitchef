"use client";
import { useState } from "react";
import { useMealPlan } from "@/hooks/useMealPlan";
import { useRecipeHistory } from "@/hooks/useRecipeHistory";
import { Recipe, WeekDayKey, MealSlot } from "@/lib/types";
import { ChevronLeft, ChevronRight, X, ShoppingCart, Plus } from "lucide-react";
import { generateShoppingList, shoppingListToText } from "@/lib/shoppingList";
import { motion } from "framer-motion";

const DAYS: { key: WeekDayKey; label: string }[] = [
  { key: "seg", label: "Seg" }, { key: "ter", label: "Ter" }, { key: "qua", label: "Qua" },
  { key: "qui", label: "Qui" }, { key: "sex", label: "Sex" }, { key: "sab", label: "Sáb" }, { key: "dom", label: "Dom" },
];
const SLOTS: { key: MealSlot; label: string; emoji: string }[] = [
  { key: "breakfast", label: "Café da manhã", emoji: "🌅" },
  { key: "lunch", label: "Almoço", emoji: "🌤" },
  { key: "snack", label: "Lanche", emoji: "🍎" },
  { key: "dinner", label: "Jantar", emoji: "🌙" },
];

export default function PlanoPage() {
  const { plan, prevWeek, nextWeek, setMeal } = useMealPlan();
  const { history } = useRecipeHistory();
  const [picking, setPicking] = useState<{ day: WeekDayKey; slot: MealSlot } | null>(null);
  const [showShopping, setShowShopping] = useState(false);

  const shoppingList = generateShoppingList(plan);
  const shoppingText = shoppingListToText(shoppingList);

  return (
    <div className="section-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">📅 Plano de Refeições</h1>
        <div className="flex items-center gap-3">
          <button onClick={prevWeek} aria-label="Semana anterior" className="p-2 rounded-lg border border-border hover:bg-accent"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-sm font-medium text-muted-foreground">{plan.weekKey}</span>
          <button onClick={nextWeek} aria-label="Próxima semana" className="p-2 rounded-lg border border-border hover:bg-accent"><ChevronRight className="w-4 h-4" /></button>
          <button onClick={() => setShowShopping(true)} className="btn-fitchef-secondary flex items-center gap-2 text-sm">
            <ShoppingCart className="w-4 h-4" /> Lista de Compras
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="text-xs text-muted-foreground p-2" />
            {DAYS.map(d => (
              <div key={d.key} className="text-center text-xs font-semibold text-muted-foreground py-2">{d.label}</div>
            ))}
          </div>

          {SLOTS.map(slot => (
            <div key={slot.key} className="grid grid-cols-8 gap-1 mb-2">
              <div className="flex flex-col items-center justify-center p-2 text-xs text-muted-foreground text-center gap-1">
                <span className="text-lg">{slot.emoji}</span>
                <span className="leading-tight">{slot.label}</span>
              </div>
              {DAYS.map(day => {
                const meal = (plan.days[day.key] as Record<string, Recipe | undefined>)[slot.key];
                return (
                  <div key={day.key}
                    className={`week-slot ${meal ? "filled" : ""} cursor-pointer`}
                    onClick={() => setPicking({ day: day.key, slot: slot.key })}
                  >
                    {meal ? (
                      <div className="relative h-full">
                        <p className="text-xs font-medium leading-tight">{meal.emoji} {meal.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{meal.nutritionPerServing.calories}kcal</p>
                        <button
                          aria-label="Remover refeição"
                          onClick={e => { e.stopPropagation(); setMeal(day.key, slot.key, undefined); }}
                          className="absolute top-0 right-0 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <Plus className="w-4 h-4 text-muted-foreground opacity-40" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Recipe picker modal */}
      {picking && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0">
          <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-background rounded-2xl p-6 w-full max-w-sm max-h-[70vh] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Selecionar receita</h3>
              <button aria-label="Fechar" onClick={() => setPicking(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex flex-col gap-2 flex-1">
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma receita no histórico.</p>
              ) : history.map(r => (
                <button key={r.id}
                  onClick={() => { setMeal(picking.day, picking.slot, r); setPicking(null); }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent text-left transition-colors">
                  <span className="text-2xl">{r.emoji}</span>
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.nutritionPerServing.calories} kcal · {r.prepTimeMinutes + r.cookTimeMinutes} min</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Shopping list modal */}
      {showShopping && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0">
          <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-background rounded-2xl p-6 w-full max-w-md max-h-[80vh] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">🛒 Lista de Compras</h3>
              <button aria-label="Fechar" onClick={() => setShowShopping(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 text-sm">
              {shoppingList.size === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhum ingrediente no plano desta semana.</p>
              ) : [...shoppingList.entries()].map(([cat, items]) => (
                <div key={cat} className="mb-4">
                  <p className="font-semibold text-muted-foreground mb-1.5">{cat}</p>
                  <ul className="flex flex-col gap-1 pl-2">
                    {items.map(item => (
                      <li key={item.ingredient.id} className="flex justify-between">
                        <span>{item.ingredient.icon} {item.ingredient.name}</span>
                        <span className="text-muted-foreground">{item.totalQuantity} {item.unit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <button onClick={() => navigator.clipboard?.writeText(shoppingText)} className="btn-fitchef-primary flex items-center justify-center gap-2">
              📋 Copiar lista
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
