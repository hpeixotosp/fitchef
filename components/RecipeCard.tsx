"use client";
import { Recipe } from "@/lib/types";
import { Heart, Clock, Flame, Star, ChefHat } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { scoreColor } from "@/lib/nutritionScore";
import { useFavorites } from "@/hooks/useFavorites";

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
}

export function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  const router = useRouter();
  const { toggle, check } = useFavorites();
  const isFav = check(recipe.id);

  const difficultyColor: Record<string, string> = {
    "Fácil": "badge-green",
    "Médio": "badge-orange",
    "Difícil": "bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-fitchef group cursor-pointer"
      onClick={() => router.push(`/receita/${recipe.id}`)}
    >
      {/* Image */}
      <div className="relative h-44 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-30">
          {recipe.emoji}
        </div>
        <img
          src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80`}
          alt={recipe.name}
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        {/* Badges top */}
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {recipe.specialBadge && (
            <span className="badge-orange">{recipe.specialBadge}</span>
          )}
          {recipe.isManual && <span className="badge-blue">📝 Manual</span>}
        </div>
        {/* Favorite button */}
        <button
          aria-label={isFav ? "Desfavoritar" : "Favoritar"}
          onClick={e => { e.stopPropagation(); toggle(recipe); }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-black/50 hover:scale-110 transition-transform"
        >
          <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3 className="font-semibold text-base line-clamp-1">{recipe.emoji} {recipe.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{recipe.description}</p>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{recipe.prepTimeMinutes + recipe.cookTimeMinutes}min</span>
          <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-fitorange-500" />{recipe.nutritionPerServing.calories} kcal</span>
          {recipe.rating && <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />{recipe.rating}</span>}
        </div>

        {/* Diet tags */}
        <div className="flex flex-wrap gap-1">
          {recipe.dietTags.slice(0, 3).map(tag => (
            <span key={tag} className="badge-green">{tag}</span>
          ))}
          <span className={difficultyColor[recipe.difficulty]}>{recipe.difficulty}</span>
        </div>

        {/* Score */}
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <span className="text-xs text-muted-foreground">Score nutricional</span>
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${recipe.nutritionScore * 10}%`, backgroundColor: scoreColor(recipe.nutritionScore) }}
              />
            </div>
            <span className="text-xs font-semibold" style={{ color: scoreColor(recipe.nutritionScore) }}>
              {recipe.nutritionScore.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
