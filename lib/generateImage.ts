import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY ?? "";
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";

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

  const prompt = `Professional food photography of ${recipeName}. Overhead shot, natural lighting, clean white background, garnished and plated beautifully, restaurant quality, high resolution, appetizing, vibrant colors. No text, no watermark, no people.`;

  try {
    const model = getClient().getGenerativeModel({
      model: IMAGE_MODEL,
      generationConfig: {
        temperature: 0.4,
      },
    });

    const result = await model.generateContent(prompt);
    // Para modelos de imagem no Gemini API padrão que retornam texto/código com base64 ou
    // se estivermos usando a flag de modalidade (na nova versão):
    const response = result.response;
    
    // O SDK padrão atual de Node para Gemini retorna texto, mas se o modelo for 
    // um modelo de imagem que devolve JSON ou objeto específico, tentamos extrair.
    // Como a API de imagem do Gemini geralmente retorna a imagem em base64 dentro dos candidates:
    const base64Data = response.candidates?.[0]?.content?.parts?.[0]?.text;
    
    // Se o SDK / API injetar inlineData (formato padrão de imagens do Gemini):
    const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    
    if (inlineData && inlineData.data) {
      return `data:${inlineData.mimeType};base64,${inlineData.data}`;
    }

    if (base64Data && base64Data.length > 100) {
      // Se já vier formatado ou for apenas o base64
      if (base64Data.startsWith("data:image")) return base64Data;
      return `data:image/png;base64,${base64Data}`;
    }

    return null;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[FitChef/Image] Erro ao gerar imagem do prato:", msg);
    return null;
  }
}
