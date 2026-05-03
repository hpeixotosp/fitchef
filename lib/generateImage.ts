/**
 * lib/generateImage.ts
 * Gera imagem do prato usando Pollinations.ai (gratuito, rápido, sem API key).
 * Fallback: Unsplash genérico.
 */

export async function generateRecipeImage(recipeName: string): Promise<string | null> {
  // Prompt otimizado para foto de comida
  const prompt = `delicious ${recipeName}, professional food photography, overhead shot, vibrant colors, appetizing, restaurant quality`;

  // Pollinations.ai — gera imagem rápido, sem custo, sem API key
  // Usamos resolução moderada (600x450) para velocidade
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=450&nologo=true&seed=${Date.now()}`;

  return url;
}
