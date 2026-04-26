"use client";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";
import { ActivityLevel, BiologicalSex, DietTag, Equipment } from "@/lib/types";
import { Save, CheckCircle2 } from "lucide-react";

const equipmentList: { key: keyof Equipment; label: string; emoji: string }[] = [
  { key: "fogao", label: "Fogão", emoji: "🔥" },
  { key: "forno", label: "Forno", emoji: "📦" },
  { key: "microondas", label: "Micro-ondas", emoji: "📡" },
  { key: "airfryer", label: "Airfryer", emoji: "🌀" },
  { key: "liquidificador", label: "Liquidificador", emoji: "🌊" },
  { key: "batedeira", label: "Batedeira", emoji: "⚙️" },
  { key: "panelaPressao", label: "Panela de pressão", emoji: "💨" },
];
const dietOptions: DietTag[] = ["Vegano","Vegetariano","Sem glúten","Sem lactose","Low carb","Cetogênico","Sem açúcar","Sem frutos do mar","Sem nozes"];

export default function EditProfilePage() {
  const { profile, update } = useProfile();
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const save = () => {
    update({ isConfigured: true });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="section-container max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">✏️ Editar Perfil</h1>

      <div className="flex flex-col gap-8">
        {/* Personal */}
        <div className="card-fitchef p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-lg border-b border-border pb-3">Dados pessoais <span className="text-xs text-muted-foreground font-normal">(opcionais)</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Nome de exibição", key: "displayName", type: "text", placeholder: "Como quer ser chamado?" },
              { label: "Idade", key: "age", type: "number", placeholder: "Ex: 25" },
              { label: "Peso (kg)", key: "weightKg", type: "number", placeholder: "Ex: 70" },
              { label: "Altura (cm)", key: "heightCm", type: "number", placeholder: "Ex: 170" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-sm font-medium text-muted-foreground">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={(profile as any)[f.key] as string ?? ""}
                  onChange={e => update({ [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value } as Parameters<typeof update>[0])}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-fitgreen-400"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Sexo biológico</label>
            <div className="flex gap-2 mt-1">
              {(["Masculino","Feminino"] as BiologicalSex[]).map(s => (
                <button key={s} onClick={() => update({ sex: s })}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm transition-all ${profile.sex === s ? "border-fitblue-800 bg-fitblue-50 dark:bg-fitblue-900/20" : "border-border"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Nível de atividade física</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {(["Sedentário","Levemente ativo","Moderadamente ativo","Muito ativo"] as ActivityLevel[]).map(a => (
                <button key={a} onClick={() => update({ activityLevel: a })}
                  className={`py-2 px-2 rounded-lg border-2 text-xs font-medium transition-all text-left ${profile.activityLevel === a ? "border-fitgreen-500 bg-fitgreen-50 dark:bg-fitgreen-900/20" : "border-border"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Equipamentos */}
        <div className="card-fitchef p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-lg border-b border-border pb-3">Equipamentos</h2>
          <div className="grid grid-cols-2 gap-2">
            {equipmentList.map(e => {
              const active = profile.equipment[e.key];
              return (
                <button key={e.key} onClick={() => update({ equipment: { ...profile.equipment, [e.key]: !active } })}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm transition-all ${active ? "border-fitgreen-500 bg-fitgreen-50 dark:bg-fitgreen-900/20" : "border-border"}`}>
                  <span>{e.emoji}</span><span className="font-medium">{e.label}</span>
                  {active && <CheckCircle2 className="w-4 h-4 text-fitgreen-500 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Diet */}
        <div className="card-fitchef p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-lg border-b border-border pb-3">Restrições alimentares</h2>
          <div className="flex flex-wrap gap-2">
            {dietOptions.map(tag => {
              const active = profile.dietRestrictions.includes(tag);
              return (
                <button key={tag}
                  onClick={() => update({ dietRestrictions: active ? profile.dietRestrictions.filter(d => d !== tag) : [...profile.dietRestrictions, tag] })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${active ? "border-fitgreen-500 bg-fitgreen-500 text-white" : "border-border"}`}>
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => router.back()} className="btn-fitchef-outline flex-1">Cancelar</button>
          <button onClick={save} className={`btn-fitchef-primary flex-1 flex items-center gap-2 justify-center ${saved ? "bg-fitgreen-500" : ""}`}>
            {saved ? <><CheckCircle2 className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> Salvar alterações</>}
          </button>
        </div>
      </div>
    </div>
  );
}
