"use client";
import { useFavorites } from "@/hooks/useFavorites";
import { RecipeCard } from "@/components/RecipeCard";
import { Heart } from "lucide-react";

export default function FavoritosPage() {
  const { favorites } = useFavorites();

  return (
    <div className="section-container">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <Heart className="w-6 h-6 text-red-500 fill-red-500" /> Favoritos
      </h1>
      {favorites.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <p className="text-5xl mb-4">💔</p>
          <p className="font-medium">Você ainda não tem receitas favoritas.</p>
          <a href="/gerar" className="text-fitgreen-500 hover:underline text-sm mt-2 inline-block">Descobrir receitas →</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
        </div>
      )}
    </div>
  );
}
