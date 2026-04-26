"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { DietTag, Equipment } from "@/lib/types";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

const equipmentList: { key: keyof Equipment; label: string; emoji: string }[] = [
  { key: "fogao", label: "Fogão", emoji: "🔥" },
  { key: "forno", label: "Forno convencional", emoji: "📦" },
  { key: "microondas", label: "Micro-ondas", emoji: "📡" },
  { key: "airfryer", label: "Airfryer", emoji: "🌀" },
  { key: "liquidificador", label: "Liquidificador", emoji: "🌊" },
  { key: "batedeira", label: "Batedeira", emoji: "⚙️" },
  { key: "panelaPressao", label: "Panela de pressão", emoji: "💨" },
];

const dietOptions: DietTag[] = ["Vegano","Vegetariano","Sem glúten","Sem lactose","Low carb","Cetogênico","Sem açúcar","Sem frutos do mar","Sem nozes"];

export default function ProfilePage() {
  const { profile, update } = useProfile();
  const router = useRouter();
  const [step, setStep] = useState(1);

  const toggleEquip = (key: keyof Equipment) => {
    update({ equipment: { ...profile.equipment, [key]: !profile.equipment[key] } });
  };

  const toggleDiet = (tag: DietTag) => {
    const has = profile.dietRestrictions.includes(tag);
    update({ dietRestrictions: has ? profile.dietRestrictions.filter(d => d !== tag) : [...profile.dietRestrictions, tag] });
  };

  const finish = () => {
    update({ isConfigured: true });
    router.push("/gerar");
  };

  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Passo {step} de 2</span>
            <span>{step === 1 ? "Equipamentos" : "Preferências"}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-fitgreen-500 rounded-full"
              animate={{ width: step === 1 ? "50%" : "100%" }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="card-fitchef p-8 flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold">Quais equipamentos você tem? 🍳</h1>
                <p className="text-muted-foreground text-sm mt-1">Selecione todos os disponíveis na sua cozinha</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {equipmentList.map(e => {
                  const active = profile.equipment[e.key];
                  return (
                    <button
                      key={e.key}
                      aria-label={e.label}
                      onClick={() => toggleEquip(e.key)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${active ? "border-fitgreen-500 bg-fitgreen-50 dark:bg-fitgreen-900/20" : "border-border hover:border-fitgreen-300"}`}
                    >
                      <span className="text-2xl">{e.emoji}</span>
                      <span className="text-sm font-medium">{e.label}</span>
                      {active && <CheckCircle2 className="w-4 h-4 text-fitgreen-500 ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setStep(2)} className="btn-fitchef-primary flex items-center gap-2 justify-center">
                Próximo <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="card-fitchef p-8 flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold">Suas preferências 🥗</h1>
                <p className="text-muted-foreground text-sm mt-1">Personalize sua experiência culinária</p>
              </div>

              {/* Meal type */}
              <div>
                <p className="text-sm font-semibold mb-2">Tipo de prato preferido</p>
                <div className="flex gap-2">
                  {(["Doce","Salgado","Ambos"] as const).map(t => (
                    <button key={t} onClick={() => update({ mealType: t })}
                      className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${profile.mealType === t ? "border-fitorange-500 bg-fitorange-50 dark:bg-fitorange-900/20 text-fitorange-600" : "border-border"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Objective */}
              <div>
                <p className="text-sm font-semibold mb-2">Objetivo nutricional</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["Perda de peso","Ganho de massa","Manutenção","Saúde geral"] as const).map(g => (
                    <button key={g} onClick={() => update({ nutritionalGoal: g })}
                      className={`py-2.5 px-3 rounded-xl border-2 text-xs font-medium transition-all text-left ${profile.nutritionalGoal === g ? "border-fitblue-800 bg-fitblue-50 dark:bg-fitblue-900/20 text-fitblue-800 dark:text-fitblue-300" : "border-border"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Restrictions */}
              <div>
                <p className="text-sm font-semibold mb-2">Restrições alimentares</p>
                <div className="flex flex-wrap gap-2">
                  {dietOptions.map(tag => {
                    const active = profile.dietRestrictions.includes(tag);
                    return (
                      <button key={tag} onClick={() => toggleDiet(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${active ? "border-fitgreen-500 bg-fitgreen-500 text-white" : "border-border hover:border-fitgreen-300"}`}>
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-fitchef-outline flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </button>
                <button onClick={finish} className="btn-fitchef-primary flex-1 flex items-center gap-2 justify-center">
                  Concluir <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
