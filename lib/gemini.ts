/**
 * lib/gemini.ts
 * Wrapper servidor-side para o Google Gemini API.
 * Este arquivo NUNCA deve ser importado por componentes client-side.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Debug: log first and last 4 characters of API key (for security)
const API_KEY = process.env.GEMINI_API_KEY ?? "";
const trimmedAPIKey = API_KEY.trim();
if (trimmedAPIKey) {
  const masked = trimmedAPIKey.substring(0, 4) + "..." + trimmedAPIKey.slice(-4);
  console.log("[FitChef/Gemini] API Key loaded:", masked);
  console.log("[FitChef/Gemini] API Key length:", trimmedAPIKey.length);
} else {
  console.warn("[FitChef/Gemini] GEMINI_API_KEY não configurada ou vazia após trim. Usando mock.");
}

if (!trimmedAPIKey) {
  console.warn("[FitChef/Gemini] GEMINI_API_KEY não configurada ou vazia após trim. Usando mock.");
}
// Use trimmed key for actual API calls
const API_KEY_FOR_USE = trimmedAPIKey;

// Instância singleton — criada uma vez por processo Node
let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY_FOR_USE);
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
    tools: [
      {
        googleSearchRetrieval: {}
      }
    ],
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
    
    // Log detailed error for debugging
    console.error("[FitChef/Gemini] Detailed error:", err);

    // Quota excedida
    if (msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("Limite de requisições atingido, tente em alguns instantes");
    }
    // Chave inválida
    if (msg.includes("401") || msg.includes("403") || msg.includes("API_KEY_INVALID")) {
      console.error("[Gemini] Actual error:", msg);
      // In development, show more details; in production, keep generic message
      if (process.env.NODE_ENV === "development") {
        throw new Error(`Chave de API inválida: ${msg}. Verifique GEMINI_API_KEY no .env.local`);
      } else {
        throw new Error("Chave de API inválida. Verifique GEMINI_API_KEY no .env.local");
      }
    }
    throw new Error(`Gemini: ${msg}`);
  }
}
