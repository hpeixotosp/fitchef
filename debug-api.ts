import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

config({ path: ".env.local" });

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.8,
    maxOutputTokens: 2048,
  },
  tools: [{ googleSearch: {} } as any],
});

async function run() {
  const prompt = `Você é um chef nutricional especialista brasileiro. Gere uma receita criativa e deliciosa em português brasileiro.
Responda APENAS com um JSON válido.
PRATO EXATO SOLICITADO: "lasanha". Você DEVE gerar uma versão saudável ou tradicional exatamente deste prato.

FONTES DE REFERÊNCIA (Use estas fontes para buscar ideias criativas):
https://www.youtube.com/@Cakepedia
https://www.youtube.com/@ReceitasLowCarbparaDiabéticos

INGREDIENTES DISPONÍVEIS: variados
EQUIPAMENTOS: fogão
TIPO DE PRATO: qualquer
RESTRIÇÕES ALIMENTARES: nenhuma
OCASIÃO: qualquer
DIFICULDADE: Fácil
PORÇÕES: 2
MODO: normal
OBJETIVO NUTRICIONAL: saúde geral

Instruções adicionais:
- Retorne EXATAMENTE este JSON:
{
  "nome": "string",
  "emoji": "string",
  "descricao": "string",
  "porcoes": 2,
  "tempoPreparo": 30,
  "dificuldade": "Fácil",
  "ocasiao": "string",
  "dietas": ["string"],
  "equipamentos": ["string"],
  "modo": "string",
  "scoreNutricional": 10,
  "scoreExplicacao": "string",
  "ingredientes": [ { "nome": "string", "quantidade": 1, "unidade": "string" } ],
  "passosPreparo": [ { "numero": 1, "descricao": "string", "equipamento": "string", "tempoMinutos": 10 } ],
  "nutricaoPorPorcao": { "calorias": 100, "proteinas": 10, "carboidratos": 10, "gorduras": 10, "fibras": 10 },
  "dicaChef": "string",
  "substituicoesSugeridas": []
}`;

  try {
    const result = await model.generateContent(prompt);
    console.log("RESPONSE SUCCESS:", result.response.text().substring(0, 500));
  } catch (e: any) {
    console.error("RESPONSE ERROR:", e.message || e);
  }
}

run();
