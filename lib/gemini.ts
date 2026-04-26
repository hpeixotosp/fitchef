/**
 * lib/gemini.ts
 * Wrapper servidor-side para o Google Gemini API.
 * Este arquivo NUNCA deve ser importado por componentes client-side.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY ?? "";

if (!API_KEY) {
  console.warn("[FitChef/Gemini] GEMINI_API_KEY não configurada. Usando mock.");
}

// Instância singleton — criada uma vez por processo Node
let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
}

export async function callGemini(prompt: string): Promise<string> {
  if (!API_KEY) throw new Error("GEMINI_API_KEY não configurada");

  const model = getClient().getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
  });

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (!text) throw new Error("Resposta vazia do Gemini");
    return text;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);

    // Quota excedida
    if (msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("Limite de requisições atingido, tente em alguns instantes");
    }
    // Chave inválida
    if (msg.includes("401") || msg.includes("403") || msg.includes("API_KEY_INVALID")) {
      throw new Error("Chave de API inválida. Verifique GEMINI_API_KEY no .env.local");
    }
    throw new Error(`Gemini: ${msg}`);
  }
}
