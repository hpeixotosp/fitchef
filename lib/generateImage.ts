import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = (process.env.GEMINI_API_KEY ?? "").trim();
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL ?? "imagen-3.0-generate-001";

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
}

export async function generateRecipeImage(recipeName: string): Promise<string | null> {
  if (!API_KEY) {
    console.warn("[FitChef/Image] GEMINI_API_KEY não configurada.");
    return null;
  }

  const prompt = `Professional food photography of ${recipeName}. Overhead shot, natural lighting, clean background, restaurant quality, high resolution, appetizing, vibrant colors. No text, no watermark, no people.`;

  try {
    const model = getClient().getGenerativeModel({
      model: IMAGE_MODEL
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    
    const base64Data = response.candidates?.[0]?.content?.parts?.[0]?.text;
    const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    
    if (inlineData && inlineData.data) {
      return `data:${inlineData.mimeType};base64,${inlineData.data}`;
    }

    if (base64Data && base64Data.length > 100) {
      if (base64Data.startsWith("data:image")) return base64Data;
      return `data:image/png;base64,${base64Data}`;
    }

    throw new Error("Formato de imagem não reconhecido no retorno do Gemini");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[FitChef/Image] Gemini Image falhou, usando Pollinations como fallback:", msg);
    
    // Fallback: Retorna uma URL do Pollinations AI baseada na receita gerada
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true`;
  }
}
