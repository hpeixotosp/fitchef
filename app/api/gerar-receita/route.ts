/**
 * app/api/gerar-receita/route.ts
 * Route Handler Next.js — roda exclusivamente no servidor.
 * A GEMINI_API_KEY nunca é exposta ao cliente.
 */

import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import { generateRecipeImage } from "@/lib/generateImage";
import { MOCK_RECIPES } from "@/lib/generateRecipe";

// ─── Rate Limiting simples (memória por processo) ─────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;      // requisições
const RATE_WINDOW = 60_000; // 1 minuto em ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ─── Sanitização básica de string ─────────────────────────────────────────────
function sanitize(value: unknown, maxLen = 200): string {
  if (typeof value !== "string") return "";
  return value.replace(/[<>{}]/g, "").slice(0, maxLen).trim();
}

// ─── Receita mock de fallback ─────────────────────────────────────────────────
function getFallbackRecipe() {
  return MOCK_RECIPES[Math.floor(Math.random() * MOCK_RECIPES.length)];
}

// ─── Montar prompt ─────────────────────────────────────────────────────────────
function buildPrompt(body: Record<string, unknown>): string {
  const ingredients   = Array.isArray(body.ingredients)   ? (body.ingredients as string[]).map(s => sanitize(s)).join(", ") : "variados";
  const equipment     = Array.isArray(body.equipment)     ? (body.equipment   as string[]).map(s => sanitize(s)).join(", ") : "fogão";
  const mealType      = sanitize(body.mealType      as string) || "qualquer";
  const dietTags      = Array.isArray(body.dietTags) ? (body.dietTags as string[]).map(s => sanitize(s)).join(", ") : "nenhuma";
  const occasion      = sanitize(body.occasion      as string) || "qualquer";
  const difficulty    = sanitize(body.difficulty    as string) || "Fácil";
  const servings      = Number(body.servings)  > 0 ? Number(body.servings)  : 2;
  const mode          = sanitize(body.mode          as string) || "normal";
  const nutritionGoal = sanitize(body.nutritionGoal as string) || "saúde geral";
  const dishName      = sanitize(body.dishName      as string);

  const dishInstruction = dishName 
    ? `\nPRATO EXATO SOLICITADO: "${dishName}". Você DEVE gerar uma versão saudável ou tradicional exatamente deste prato.`
    : "";

  return `Você é um chef nutricional especialista brasileiro. Gere uma receita criativa e deliciosa em português brasileiro com base nas informações abaixo.
Responda APENAS com um JSON válido, sem texto adicional, sem markdown, sem blocos de código, sem explicações.
${dishInstruction}

INGREDIENTES DISPONÍVEIS: ${ingredients}
EQUIPAMENTOS: ${equipment}
TIPO DE PRATO: ${mealType}
RESTRIÇÕES ALIMENTARES: ${dietTags}
OCASIÃO: ${occasion}
DIFICULDADE: ${difficulty}
PORÇÕES: ${servings}
MODO: ${mode}
OBJETIVO NUTRICIONAL: ${nutritionGoal}

Instruções adicionais:
- Crie uma receita que USE os ingredientes informados (não apenas os cite)
- No modo "geladeira-vazia", use o máximo possível dos ingredientes informados
- Cada passo deve ser detalhado, com técnicas, temperaturas e pontos de cozimento
- O score nutricional deve ser honesto (0=ruim, 10=excelente)
- A dica do chef deve ser única e prática

Retorne EXATAMENTE este JSON (sem campos extras, sem comentários):
{
  "nome": "string",
  "emoji": "string (1 emoji temático)",
  "descricao": "string (1 frase apetitosa, máx 120 chars)",
  "porcoes": number,
  "tempoPreparo": number,
  "dificuldade": "Fácil" | "Médio" | "Difícil",
  "ocasiao": "string",
  "dietas": ["string"],
  "equipamentos": ["string"],
  "modo": "string",
  "scoreNutricional": number,
  "scoreExplicacao": "string (1 frase)",
  "ingredientes": [
    { "nome": "string", "quantidade": number, "unidade": "string" }
  ],
  "passosPreparo": [
    { "numero": number, "descricao": "string (detalhado)", "equipamento": "string | null", "tempoMinutos": number | null }
  ],
  "nutricaoPorPorcao": {
    "calorias": number, "proteinas": number, "carboidratos": number, "gorduras": number, "fibras": number
  },
  "dicaChef": "string (dica prática única)",
  "substituicoesSugeridas": [
    { "ingredienteOriginal": "string", "substituto": "string", "motivo": "string", "impactoNutricional": "string" }
  ]
}`;
}

// ─── Mapear resposta Gemini → tipo Recipe ──────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToRecipe(data: any, mode: string) {
  const id = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return {
    id,
    name: data.nome ?? "Receita do Chef",
    emoji: data.emoji ?? "🍽️",
    description: data.descricao ?? "",
    imageQuery: data.nome ?? "receita",
    dietTags: Array.isArray(data.dietas) ? data.dietas : [],
    difficulty: data.dificuldade ?? "Fácil",
    prepTimeMinutes: Math.round((data.tempoPreparo ?? 30) * 0.4),
    cookTimeMinutes: Math.round((data.tempoPreparo ?? 30) * 0.6),
    servings: data.porcoes ?? 2,
    occasion: data.ocasiao ? [data.ocasiao] : ["Almoço executivo"],
    mealType: "Salgado",
    nutritionPerServing: {
      calories:  data.nutricaoPorPorcao?.calorias      ?? 0,
      protein:   data.nutricaoPorPorcao?.proteinas     ?? 0,
      carbs:     data.nutricaoPorPorcao?.carboidratos  ?? 0,
      fat:       data.nutricaoPorPorcao?.gorduras       ?? 0,
      fiber:     data.nutricaoPorPorcao?.fibras         ?? 0,
    },
    nutritionScore: data.scoreNutricional ?? 7,
    ingredients: Array.isArray(data.ingredientes)
      ? data.ingredientes.map((i: { nome: string; quantidade: number; unidade: string }, idx: number) => ({
          ingredient: { id: `ai-ing-${idx}`, name: i.nome, category: "Outro" as const, icon: "🥘" },
          quantity: i.quantidade ?? 0,
          unit: i.unidade ?? "g",
        }))
      : [],
    steps: Array.isArray(data.passosPreparo)
      ? data.passosPreparo.map((p: { numero: number; descricao: string; equipamento: string | null; tempoMinutos: number | null }) => ({
          id: `s${p.numero}`,
          order: p.numero,
          instruction: p.descricao,
          equipment: p.equipamento ?? undefined,
          durationMinutes: p.tempoMinutos ?? undefined,
          emoji: "👨‍🍳",
        }))
      : [],
    mode: mode as "normal" | "geladeira-vazia" | "surpresa" | "orcamento",
    specialBadge:
      mode === "geladeira-vazia" ? "♻️ Zero Desperdício" :
      mode === "surpresa"        ? "🎲 Surpresa" :
      mode === "orcamento"       ? "💰 Econômica" : undefined,
    createdAt: new Date().toISOString(),
    chefTip: data.dicaChef,
    scoreExplicacao: data.scoreExplicacao,
    substituicoesSugeridas: data.substituicoesSugeridas ?? [],
    isAIGenerated: true,
  };
}

// ─── POST Handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // IP para rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Muitas requisições. Aguarde 1 minuto e tente novamente." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const prompt = buildPrompt(body);

  // Timeout de 30 segundos
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const dishNameForImage = sanitize(body.dishName as string) || "delicious healthy dish";

    const [raw, imageBase64] = await Promise.all([
      callGemini(prompt),
      generateRecipeImage(dishNameForImage)
    ]);
    
    clearTimeout(timeout);

    // O Gemini frequentemente retorna com bloco de código Markdown mesmo pedindo para não usar
    const cleanRaw = raw.replace(/```json/i, "").replace(/```/g, "").trim();

    let parsed: unknown;
    try {
      // Tenta achar o JSON isolado caso haja lixo ao redor
      const jsonMatch = cleanRaw.match(/\{[\s\S]*\}/);
      const targetJson = jsonMatch ? jsonMatch[0] : cleanRaw;
      parsed = JSON.parse(targetJson);
    } catch {
      throw new Error("JSON inválido retornado pelo Gemini");
    }

    const recipe = mapToRecipe(parsed, sanitize(body.mode as string) || "normal");
    
    // Adiciona a imagem gerada se existir
    if (imageBase64) {
      recipe.imageBase64 = imageBase64;
    }

    return NextResponse.json({ recipe, source: "gemini" });

  } catch (err: unknown) {
    clearTimeout(timeout);
    const msg = err instanceof Error ? err.message : "Erro inesperado";
    console.error("[FitChef/API] Erro ao chamar Gemini:", msg);

    // Fallback automático com receita do mock
    const fallback = getFallbackRecipe();
    return NextResponse.json(
      { recipe: fallback, source: "mock", warning: msg },
      { status: 200 } // 200 para não quebrar o cliente
    );
  }
}
