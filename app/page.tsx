"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { getRecipeOfTheWeek } from "@/lib/weeklyRecipe";
import { surpriseRecipe, generateRecipeAI } from "@/lib/generateRecipe";

import { useRecipeHistory } from "@/hooks/useRecipeHistory";
import { scoreColor } from "@/lib/nutritionScore";
import {
  Clock, Flame, Star, Sparkles, Shuffle, ChefHat, Filter,
  Refrigerator, Calendar, ShoppingCart, History,
  Heart, Smartphone, Search, ArrowRight, Loader2, Bot
} from "lucide-react";

const USE_AI = process.env.NEXT_PUBLIC_USE_AI === "true";

const weekRecipe = getRecipeOfTheWeek();

const features = [
  { icon: <ChefHat className="w-6 h-6" />, title: "Chefe Virtual", desc: "Nosso chefe virtual cria receitas personalizadas com seus ingredientes" },
  { icon: <Filter className="w-6 h-6" />, title: "Filtros de Dieta", desc: "Vegano, low carb, sem glúten e muito mais" },
  { icon: <Refrigerator className="w-6 h-6" />, title: "Modo Geladeira Vazia", desc: "Aproveite tudo que tem com zero desperdício" },
  { icon: <ChefHat className="w-6 h-6" />, title: "Modo Cozinha", desc: "Passo a passo imersivo com timer integrado" },
  { icon: <Calendar className="w-6 h-6" />, title: "Plano Semanal", desc: "Organize suas refeições para a semana toda" },
  { icon: <ShoppingCart className="w-6 h-6" />, title: "Lista de Compras", desc: "Gerada automaticamente do seu plano" },
  { icon: <History className="w-6 h-6" />, title: "Histórico", desc: "Todas suas receitas em um só lugar" },
  { icon: <Heart className="w-6 h-6" />, title: "Favoritos", desc: "Salve suas receitas preferidas" },
  { icon: <Smartphone className="w-6 h-6" />, title: "App Instalável", desc: "Use como aplicativo no seu celular" },
];

const steps = [
  { n: "1", emoji: "🥗", title: "Informe seus ingredientes", desc: "Diga o que você tem na geladeira ou despensa" },
  { n: "2", emoji: "👨‍🍳", title: "Nosso Chefe cria sua receita", desc: "Filtrando por dieta, ocasião e seu perfil nutricional" },
  { n: "3", emoji: "🍳", title: "Cozinhe com o modo guiado", desc: "Passo a passo detalhado com timer integrado" },
];

export default function HomePage() {
  const { profile } = useProfile();
  const { add } = useRecipeHistory();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string; name: string; emoji: string; description: string; prepTimeMinutes: number; cookTimeMinutes: number; nutritionPerServing: { calories: number } }[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Busca via API em tempo real
  useEffect(() => {
    if (query.trim().length < 2) { setSearchResults([]); setShowResults(false); return; }

    const timer = setTimeout(async () => {
      if (!USE_AI) {
        setShowResults(true);
        return;
      }
      setIsSearching(true);
      try {
        const opts = {
          mode: "normal" as const,
          ingredients: [],
          filters: { maxPrepMinutes: 999, servings: 2 } as any,
          dishName: query.trim(),
        };
        const { recipe } = await generateRecipeAI(opts);
        setSearchResults([recipe]);
        setShowResults(true);
      } catch (err) {
        console.error("Erro na busca:", err);
        setSearchResults([]);
        setShowResults(true);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleStart = () => {
    if (!profile.isConfigured) router.push("/perfil");
    else router.push("/gerar");
  };

  const handleSurprise = () => {
    if (!profile.isConfigured) { router.push("/perfil"); return; }
    const r = surpriseRecipe();
    add(r);
    router.push(`/receita/${r.id}`);
  };

  const handleSelectResult = (recipe: typeof searchResults[0]) => {
    add(recipe as any);
    router.push(`/receita/${recipe.id}`);
    setShowResults(false);
    setQuery("");
  };



  const handleSearchEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      handleSelectResult(searchResults[0]);
    }
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative hero-gradient overflow-hidden py-20 md:py-32">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-fitgreen-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-fitorange-300/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 text-center flex flex-col items-center gap-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Image src="/logo.jpeg" alt="FitChef" width={180} height={72} className="h-28 w-auto object-contain mx-auto" priority />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="flex flex-col gap-3">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Transforme o que você tem em{" "}
              <span className="gradient-text">algo delicioso</span>
            </h1>
            <p className="text-lg md:text-xl text-fitblue-800 dark:text-fitblue-300 font-medium italic">
              Sabor e Saúde na Sua Rotina
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleStart} className="btn-fitchef-primary flex items-center gap-2 text-base">
              <Sparkles className="w-5 h-5" /> Começar Agora
            </button>
            <button onClick={handleSurprise} className="btn-fitchef-outline flex items-center gap-2 text-base">
              <Shuffle className="w-5 h-5" /> Surpreenda-me
            </button>
          </motion.div>

          {/* ── Busca com dropdown ── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="w-full max-w-lg" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleSearchEnter}
                placeholder="O que você quer cozinhar hoje? Ex: lasanha, panqueca..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-fitgreen-200 dark:border-fitgreen-800 bg-background text-sm focus:outline-none focus:border-fitgreen-500 transition-colors"
              />

              {/* Dropdown de resultados */}
              <AnimatePresence>
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full mt-2 left-0 right-0 bg-background border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    {isSearching ? (
                      <div className="px-4 py-8 text-sm text-muted-foreground flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-fitgreen-500" />
                        <p>Nosso Chefe está preparando sua <strong>{query}</strong>...</p>
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="px-4 py-6 text-sm text-muted-foreground text-center flex flex-col gap-3">
                        <p>Nenhuma receita encontrada para &quot;<strong>{query}</strong>&quot;.</p>
                          <button
                            onClick={() => router.push("/gerar")}
                            className="mt-2 text-fitgreen-600 hover:underline font-medium flex items-center gap-1 mx-auto"
                          >
                            Ir para o Gerador de Receitas <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                      </div>
                    ) : (
                      <ul>
                        {searchResults.map((recipe) => (
                          <li key={recipe.id}>
                            <button
                              onClick={() => handleSelectResult(recipe)}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                            >
                              <span className="text-2xl">{recipe.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{recipe.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{recipe.description}</p>
                              </div>
                              <div className="flex flex-col items-end text-xs text-muted-foreground shrink-0">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {recipe.prepTimeMinutes + recipe.cookTimeMinutes}min
                                </span>
                                <span className="flex items-center gap-1">
                                  <Flame className="w-3 h-3 text-fitorange-500" />
                                  {recipe.nutritionPerServing.calories}kcal
                                </span>
                              </div>
                            </button>
                          </li>
                        ))}
                        <li className="border-t border-border">
                          <button
                            onClick={() => router.push("/gerar")}
                            className="w-full px-4 py-2.5 text-xs text-fitgreen-600 hover:bg-fitgreen-50 transition-colors font-medium flex items-center justify-center gap-1"
                          >
                            Ver todas as receitas no Gerador <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Receita da Semana ── */}
      <section className="section-container">
        <div className="flex flex-col items-center gap-2 mb-10 text-center">
          <span className="badge-orange">⭐ Destaque da Semana</span>
          <h2 className="text-2xl md:text-3xl font-bold">Receita da Semana</h2>
          <p className="text-sm text-muted-foreground">Escolhida pelo nosso Chefe para você</p>
        </div>

        <div className="max-w-2xl mx-auto card-fitchef p-0 overflow-hidden relative group">
          <div className="h-52 bg-gradient-hero flex items-center justify-center text-8xl relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-30">
              {weekRecipe.emoji}
            </div>
            {weekRecipe.imageBase64 ? (
              <Image
                src={weekRecipe.imageBase64}
                alt={weekRecipe.name}
                fill
                className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
            ) : (
              <img
                src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80`}
                alt={weekRecipe.name}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 flex gap-2">
              {weekRecipe.dietTags.slice(0, 2).map(t => (
                <span key={t} className="badge-green">{t}</span>
              ))}
              <span className="badge-orange">{weekRecipe.difficulty}</span>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <h3 className="text-xl font-bold">{weekRecipe.emoji} {weekRecipe.name}</h3>
            <p className="text-sm text-muted-foreground">{weekRecipe.description}</p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{weekRecipe.prepTimeMinutes + weekRecipe.cookTimeMinutes} min</span>
              <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-fitorange-500" />{weekRecipe.nutritionPerServing.calories} kcal</span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" style={{ color: scoreColor(weekRecipe.nutritionScore) }} />
                {weekRecipe.nutritionScore.toFixed(1)}
              </span>
            </div>
            <button
              onClick={() => { add(weekRecipe); router.push(`/receita/${weekRecipe.id}`); }}
              className="btn-fitchef-primary self-start"
            >
              Ver receita completa
            </button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="badge-green mb-3 inline-block">Recursos</span>
            <h2 className="text-2xl md:text-3xl font-bold">Tudo que você precisa na cozinha</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card-fitchef p-5 flex items-start gap-4"
              >
                <div className="p-2.5 rounded-xl bg-fitgreen-100 text-fitgreen-600 shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{f.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Como funciona ── */}
      <section className="section-container">
        <div className="text-center mb-12">
          <span className="badge-blue mb-3 inline-block">Como funciona</span>
          <h2 className="text-2xl md:text-3xl font-bold">3 passos para o prato perfeito</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fitgreen-400 to-fitgreen-600 flex items-center justify-center text-3xl shadow-lg">
                  {s.emoji}
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-fitorange-500 text-white text-xs font-bold flex items-center justify-center">
                  {s.n}
                </div>
              </div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button onClick={handleStart} className="btn-fitchef-primary flex items-center gap-2 text-base px-8 py-4">
            <Sparkles className="w-5 h-5" /> Começar Agora — é grátis!
          </button>
        </div>
      </section>
    </div>
  );
}
