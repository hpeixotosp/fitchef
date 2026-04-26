"use client";
import { useState } from "react";
import { useRecipeHistory } from "@/hooks/useRecipeHistory";
import { RecipeCard } from "@/components/RecipeCard";
import { Search, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Recipe } from "@/lib/types";

export default function HistoricoPage() {
  const { history, clear } = useRecipeHistory();
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const filtered: Recipe[] = history.filter(r =>
    !search || r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="section-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">📚 Histórico de Receitas</h1>
        {history.length > 0 && (
          <button onClick={() => setShowConfirm(true)} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors">
            <Trash2 className="w-4 h-4" /> Limpar histórico
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar receita..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-fitgreen-400"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <p className="text-5xl mb-4">📭</p>
          <p className="font-medium">{search ? "Nenhuma receita encontrada." : "Seu histórico está vazio."}</p>
          {!search && <a href="/gerar" className="text-fitgreen-500 hover:underline text-sm mt-2 inline-block">Gerar minha primeira receita →</a>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-background rounded-2xl p-6 max-w-sm w-full shadow-xl flex flex-col gap-4">
            <h3 className="font-bold text-lg">⚠️ Confirmar exclusão</h3>
            <p className="text-sm text-muted-foreground">Esta ação removerá todas as {history.length} receitas do histórico. Ela não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="btn-fitchef-outline flex-1">Cancelar</button>
              <button onClick={() => { clear(); setShowConfirm(false); }} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors">Limpar</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
