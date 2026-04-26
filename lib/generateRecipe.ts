import { Recipe, GenerationMode, IngredientWithQuantity, RecipeFilters } from "./types";
import { calculateNutritionScore } from "./nutritionScore";
import { INGREDIENTS } from "./ingredients";

const ing = (id: string, qty: number | string, unit: "g"|"ml"|"xícara"|"colher de sopa"|"colher de chá"|"un"|"a gosto"|"outro" = "g"): IngredientWithQuantity => {
  const ingredient = INGREDIENTS.find(i => i.id === id);
  if (!ingredient) return { ingredient: { id, name: id, category: "Temperos e Condimentos", icon: "🧂" }, quantity: 0, unit };
  return { ingredient, quantity: typeof qty === "number" ? qty : 0, unit };
};

export const MOCK_RECIPES: Recipe[] = [
  {
    id: "frango-grelhado-batata-doce",
    name: "Frango Grelhado com Batata-doce",
    emoji: "🍗",
    description: "Peito de frango temperado e grelhado com batata-doce assada. Refeição completa, nutritiva e fit.",
    imageQuery: "grilled chicken sweet potato",
    dietTags: ["Sem glúten", "Sem lactose"],
    difficulty: "Fácil",
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    servings: 2,
    occasion: ["Almoço executivo", "Pós-treino"],
    mealType: "Salgado",
    nutritionPerServing: { calories: 420, protein: 45, carbs: 35, fat: 8, fiber: 5 },
    nutritionScore: 9.2,
    ingredients: [ing("frango-file-peito",300), ing("batata-doce",200), ing("azeite",15,"ml"), ing("alho",2,"un"), ing("sal","a gosto","a gosto"), ing("pimenta","a gosto","a gosto")],
    steps: [
      { id:"s1", order:1, instruction:"Em um bowl, misture o alho amassado com sal, pimenta-do-reino e um fio de azeite. Adicione o frango e esfregue bem o tempero por toda a superfície. Cubra com plástico filme e deixe marinar por pelo menos 5 minutos (quanto mais tempo, mais saboroso).", equipment:"Bowl", emoji:"🧄" },
      { id:"s2", order:2, instruction:"Lave e descasque a batata-doce. Corte em rodelas uniformes de aproximadamente 1 cm de espessura. Disponha em uma assadeira levemente untada com azeite, tempere com uma pitada de sal e leve ao forno preaquecido a 200°C. Asse por 20 minutos, virando na metade do tempo, até ficarem macias e levemente douradas nas bordas.", equipment:"Forno", durationMinutes:20, emoji:"🥔" },
      { id:"s3", order:3, instruction:"Aqueça uma frigideira antiaderente ou grelha em fogo médio-alto. Quando estiver bem quente, adicione um fio de azeite e coloque o frango. Grelhe por 6 a 7 minutos de cada lado sem mexer, para criar uma crosta dourada. O frango está no ponto quando, ao pressionar com o dedo, ele estiver firme e os sucos saírem claros.", equipment:"Fogão", durationMinutes:14, emoji:"🔥" },
      { id:"s4", order:4, instruction:"Retire o frango da grelha e deixe descansar por 2 minutos antes de fatiar — isso garante que os sucos redistribuam e a carne fique mais suculenta. Fatie em ângulo e sirva ao lado das rodelas de batata-doce. Finalize com um fio de azeite e salsinha picada, se desejar.", emoji:"🍽️" },
    ],
    mode: "normal",
    createdAt: new Date().toISOString(),
  },
  {
    id: "omelete-espinafre-queijo",
    name: "Omelete de Espinafre com Queijo",
    emoji: "🍳",
    description: "Omelete fofa e nutritiva com espinafre fresco e queijo muçarela. Pronta em 10 minutos!",
    imageQuery: "spinach cheese omelette",
    dietTags: ["Sem glúten", "Low carb"],
    difficulty: "Fácil",
    prepTimeMinutes: 5,
    cookTimeMinutes: 8,
    servings: 1,
    occasion: ["Café da manhã", "Lanche rápido"],
    mealType: "Salgado",
    nutritionPerServing: { calories: 310, protein: 24, carbs: 4, fat: 22, fiber: 2 },
    nutritionScore: 7.8,
    ingredients: [ing("ovos-inteiro",3,"un"), ing("espinafre",50), ing("queijo-mucarela",40), ing("manteiga",10), ing("sal","a gosto","a gosto")],
    steps: [
      { id:"s1", order:1, instruction:"Quebre os 3 ovos em um bowl. Bata vigorosamente com um garfo ou fouet por cerca de 1 minuto, até a mistura ficar homogênea e levemente aerada. Tempere com uma pitada de sal e pimenta-do-reino a gosto. Dica: adicionar 1 colher de sopa de água fria deixa a omelete mais levinha.", emoji:"🥚" },
      { id:"s2", order:2, instruction:"Coloque uma frigideira antiaderente de 20 cm em fogo médio. Adicione a manteiga e espere derreter completamente, até começar a borbulhar levemente mas sem dourar — esse é o ponto certo. Incline a frigideira para espalhar a manteiga por toda a superfície.", equipment:"Fogão", durationMinutes:1, emoji:"🧈" },
      { id:"s3", order:3, instruction:"Despeje os ovos batidos de uma só vez. Com uma espátula de silicone, faça movimentos suaves em direção ao centro, puxando as bordas que já estão cozinhando. Quando a superfície ainda estiver levemente úmida (não completamente seca), distribua o espinafre lavado e o queijo muçarela sobre metade da omelete.", durationMinutes:3, emoji:"🌿" },
      { id:"s4", order:4, instruction:"Com cuidado, use a espátula para dobrar a metade sem recheio sobre a outra. Pressione levemente para selar. Deixe mais 30 segundos para o queijo derreter. Deslize a omelete para o prato — não vire de cabeça para baixo. Sirva imediatamente, pois a omelete murcha com o tempo.", emoji:"🍽️" },
    ],
    mode: "normal",
    createdAt: new Date().toISOString(),
  },
  {
    id: "bowl-acai-whey",
    name: "Bowl de Açaí com Whey",
    emoji: "🫐",
    description: "Bowl proteico de açaí com whey protein, banana e aveia. Energia e sabor para o pré ou pós-treino.",
    imageQuery: "acai bowl protein",
    dietTags: ["Sem glúten", "Vegetariano"],
    difficulty: "Fácil",
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    servings: 1,
    occasion: ["Café da manhã", "Pós-treino"],
    mealType: "Doce",
    nutritionPerServing: { calories: 380, protein: 28, carbs: 48, fat: 8, fiber: 7 },
    nutritionScore: 8.5,
    ingredients: [ing("banana",1,"un"), ing("whey-baunilha",30), ing("aveia-flocos",40), ing("mel",10,"ml"), ing("morango",50)],
    steps: [
      { id:"s1", order:1, instruction:"Na véspera, descasque a banana e coloque em um saco plástico no freezer. A banana congelada é o segredo da textura cremosa do bowl. Se não tiver tempo, use a banana normal com 4-5 cubos de gelo.", emoji:"🍌" },
      { id:"s2", order:2, instruction:"No liquidificador, coloque a banana congelada quebrada em pedaços, o whey protein de baunilha e 2 colheres de sopa de água (adicione devagar — a mistura deve ficar espessa, não líquida). Bata em pulsos curtos, parando para raspar as bordas com uma espátula. O resultado deve ser uma base cremosa e firme.", equipment:"Liquidificador", emoji:"🫐" },
      { id:"s3", order:3, instruction:"Despeje a base no bowl com colher, sem derramar. Sobre ela, organize os toppings em fileiras: a aveia em flocos de um lado, os morangos fatiados do outro, e regue com mel em zigue-zague. Sirva imediatamente — o bowl murcha em contato com o calor do ambiente.", emoji:"🥣" },
    ],
    mode: "normal",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tapioca-frango-catupiry",
    name: "Tapioca de Frango com Catupiry",
    emoji: "🫓",
    description: "Tapioca crocante recheada com frango desfiado e catupiry. Clássico brasileiro fit e sem glúten.",
    imageQuery: "tapioca chicken brazilian",
    dietTags: ["Sem glúten"],
    difficulty: "Fácil",
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    servings: 1,
    occasion: ["Café da manhã", "Lanche rápido"],
    mealType: "Salgado",
    nutritionPerServing: { calories: 340, protein: 28, carbs: 38, fat: 9, fiber: 1 },
    nutritionScore: 7.2,
    ingredients: [ing("goma-tapioca",80), ing("frango-file-peito",120), ing("cream-cheese",30), ing("sal","a gosto","a gosto")],
    steps: [
      { id:"s1", order:1, instruction:"Coloque o frango em uma panela, cubra com água e cozinhe em fogo médio por 15 minutos ou até cozinhar completamente. Escorra e deixe esfriar um pouco. Com dois garfos, desfie o frango em fios finos. Tempere com sal, pimenta-do-reino e, se desejar, um fio de azeite. Reserve.", equipment:"Fogão", durationMinutes:15, emoji:"🍗" },
      { id:"s2", order:2, instruction:"Em uma frigideira antiaderente seca (sem óleo!), espalhe a goma de tapioca peneirando sobre toda a superfície em uma camada fina e uniforme. Use fogo médio. Aguarde cerca de 2 minutos — a tapioca estará pronta quando as bordas começarem a se soltar da frigideira e a superfície ficar opaca e sem grumos. Não mexa durante esse processo.", durationMinutes:3, emoji:"🫓" },
      { id:"s3", order:3, instruction:"Com a tapioca ainda quente, espalhe o cream cheese sobre metade dela e adicione o frango desfiado por cima. Dobre a tapioca ao meio, pressionando levemente. Deixe mais 30 segundos na frigideira para aquecer o recheio. Sirva imediatamente — a tapioca endurece quando esfria.", emoji:"🧀" },
    ],
    mode: "normal",
    createdAt: new Date().toISOString(),
  },
  {
    id: "salada-atum-grao-bico",
    name: "Salada de Atum com Grão-de-bico",
    emoji: "🥗",
    description: "Salada proteica com atum, grão-de-bico, tomate e limão. Sem fogo, pronta em 5 minutos.",
    imageQuery: "tuna chickpea salad healthy",
    dietTags: ["Sem glúten", "Sem lactose", "Low carb"],
    difficulty: "Fácil",
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    servings: 2,
    occasion: ["Almoço executivo", "Lanche rápido"],
    mealType: "Salgado",
    nutritionPerServing: { calories: 290, protein: 32, carbs: 22, fat: 7, fiber: 6 },
    nutritionScore: 9.0,
    ingredients: [ing("atum-conserva",160,"g"), ing("grao-de-bico",120,"g"), ing("tomate",1,"un"), ing("limao",1,"un"), ing("azeite",15,"ml"), ing("sal","a gosto","a gosto")],
    steps: [
      { id:"s1", order:1, instruction:"Abra a lata de atum e escorra bem o líquido usando a própria tampa da lata como escorredor. Isso é importante para evitar que a salada fique com excesso de água. Faça o mesmo com o grão-de-bico enlatado — escorra e lave rapidamente em água corrente para retirar o excesso de sódio do líquido de conserva.", emoji:"🐟" },
      { id:"s2", order:2, instruction:"Corte o tomate ao meio, retire as sementes (para não deixar a salada aguada) e pique em cubos médios. Em um bowl grande, coloque o atum desmanchado com um garfo, o grão-de-bico, o tomate picado e misture delicadamente para não esmagar os grãos.", emoji:"🍅" },
      { id:"s3", order:3, instruction:"Esprema o suco de 1 limão sobre a salada, regue com o azeite e tempere com sal e pimenta a gosto. Misture novamente. Prove e ajuste o tempero se necessário. Sirva imediatamente ou leve à geladeira por até 30 minutos para apurar o sabor. Fica ainda melhor bem gelada.", emoji:"🍋" },
    ],
    mode: "normal",
    createdAt: new Date().toISOString(),
  },
  {
    id: "bolo-caneca-aveia",
    name: "Bolo de Caneca de Aveia com Banana",
    emoji: "🍰",
    description: "Bolo saudável de microondas feito com aveia e banana. Sem açúcar, pronto em 3 minutos!",
    imageQuery: "mug cake oat banana healthy",
    dietTags: ["Vegetariano", "Sem açúcar", "Sem lactose"],
    difficulty: "Fácil",
    prepTimeMinutes: 2,
    cookTimeMinutes: 3,
    servings: 1,
    occasion: ["Café da manhã", "Lanche rápido"],
    mealType: "Doce",
    nutritionPerServing: { calories: 220, protein: 9, carbs: 35, fat: 5, fiber: 4 },
    nutritionScore: 7.5,
    ingredients: [ing("aveia-flocos",40), ing("banana",1,"un"), ing("ovos-inteiro",1,"un"), ing("cacau-po",10), ing("fermento-quimico",3)],
    steps: [
      { id:"s1", order:1, instruction:"Escolha uma banana bem madura (com manchas escuras na casca) — ela é mais doce e amassa com facilidade. Descasque e coloque em uma caneca grande (mínimo 400ml) ou em um bowl. Amasse com um garfo até virar um purê liso, sem pedaços.", emoji:"🍌" },
      { id:"s2", order:2, instruction:"Na mesma caneca, adicione o ovo inteiro e misture bem com o purê de banana. Em seguida, acrescente a aveia em flocos, o cacau em pó e o fermento químico. Misture vigorosamente por 1 minuto até obter uma massa homogênea. A massa ficará um pouco mais densa que uma massa de bolo normal — isso é normal.", emoji:"🥚" },
      { id:"s3", order:3, instruction:"Certifique-se de que a caneca esteja no máximo com 2/3 da capacidade (o bolo cresce!). Leve ao micro-ondas em potência alta por 2 minutos. Verifique: espete um palito no centro — se sair limpo, está pronto. Se ainda estiver cru no centro, adicione mais 30 segundos de cada vez. Deixe descansar 1 minuto antes de comer — estará quente!", equipment:"Micro-ondas", durationMinutes:3, emoji:"☕" },
    ],
    mode: "normal",
    createdAt: new Date().toISOString(),
  },
  {
    id: "arroz-feijao-frango-classico",
    name: "Prato Clássico Brasileiro",
    emoji: "🍛",
    description: "Arroz, feijão e frango grelhado. O prato do dia a dia, balanceado e nutritivo.",
    imageQuery: "brazilian rice beans chicken",
    dietTags: ["Sem glúten", "Sem lactose"],
    difficulty: "Médio",
    prepTimeMinutes: 15,
    cookTimeMinutes: 35,
    servings: 4,
    occasion: ["Almoço executivo"],
    mealType: "Salgado",
    nutritionPerServing: { calories: 510, protein: 38, carbs: 65, fat: 9, fiber: 8 },
    nutritionScore: 8.8,
    ingredients: [ing("arroz-branco",200), ing("feijao-carioca",200), ing("frango-file-peito",400), ing("cebola",1,"un"), ing("alho",3,"un"), ing("azeite",20,"ml"), ing("sal","a gosto","a gosto")],
    steps: [
      { id:"s1", order:1, instruction:"Se usar feijão seco, deixe de molho na véspera por 8 horas e escorra. Se usar enlatado, pule esta etapa. Na panela de pressão, adicione o feijão escorrido, cubra com água (2 dedos acima do feijão), 1 dente de alho e uma folha de louro. Tampe e cozinhe em fogo médio por 20 minutos após pegar pressão. Desligue e espere a pressão sair naturalmente antes de abrir.", equipment:"Fogão", durationMinutes:20, emoji:"🫘" },
      { id:"s2", order:2, instruction:"Em uma panela separada, aqueça o azeite em fogo médio. Adicione a cebola picada e refogue mexendo até ficar transparente (3-4 min). Junte o alho amassado e refogue por mais 1 minuto. Adicione o arroz lavado e escorrido e mexa por 2 minutos para 'fritar' levemente. Despeje água quente (proporção 1 xícara de arroz para 1,5 de água), sal a gosto, tampe e cozinhe em fogo baixo por 15 minutos. Desligue e deixe tampado por 5 minutos.", durationMinutes:20, emoji:"🍚" },
      { id:"s3", order:3, instruction:"Tempere os filés de frango com sal, pimenta e alho. Aqueça uma frigideira grande em fogo alto até ficar bem quente. Adicione o azeite e coloque o frango. Não mova por 6 minutos completos — isso cria a crosta dourada. Vire e repita do outro lado. Sirva o prato com arroz, feijão, uma salada fresca e o frango fatiado.", durationMinutes:12, emoji:"🍗" },
    ],
    mode: "normal",
    createdAt: new Date().toISOString(),
  },
  {
    id: "shake-proteico-morango",
    name: "Shake Proteico de Morango",
    emoji: "🥤",
    description: "Shake cremoso de morango com whey e iogurte grego. Pós-treino perfeito.",
    imageQuery: "strawberry protein shake",
    dietTags: ["Sem glúten", "Vegetariano", "Low carb"],
    difficulty: "Fácil",
    prepTimeMinutes: 3,
    cookTimeMinutes: 0,
    servings: 1,
    occasion: ["Pós-treino", "Lanche rápido"],
    mealType: "Doce",
    nutritionPerServing: { calories: 260, protein: 35, carbs: 18, fat: 4, fiber: 2 },
    nutritionScore: 8.2,
    ingredients: [ing("whey-morango",30), ing("iogurte-grego",150,"g"), ing("morango",80), ing("leite-desnatado",150,"ml")],
    steps: [
      { id:"s1", order:1, instruction:"Lave bem os morangos em água corrente e retire os cabinhos. Se quiser um shake mais cremoso e gelado, coloque os morangos no freezer por 30 minutos antes. No copo do liquidificador, adicione primeiro o leite (líquidos sempre primeiro para facilitar a mistura), depois o iogurte grego, os morangos e por último o whey protein.", equipment:"Liquidificador", emoji:"🍓" },
      { id:"s2", order:2, instruction:"Tampe bem o liquidificador e bata em velocidade alta por 1 minuto completo. Pare no meio para raspar as paredes com uma espátula, se necessário. A textura ideal é cremosa e sem pedaços. Ajuste a consistência: se ficar muito grosso, adicione mais leite; se ficar muito líquido, mais iogurte. Sirva imediatamente em copo gelado para manter a temperatura.", durationMinutes:1, emoji:"🥤" },
    ],
    mode: "normal",
    createdAt: new Date().toISOString(),
  },
  {
    id: "macarrao-atum-tomate",
    name: "Macarrão ao Atum com Tomate",
    emoji: "🍝",
    description: "Massa rápida com atum, molho de tomate e um toque de azeite. Econômica e saborosa.",
    imageQuery: "pasta tuna tomato sauce",
    dietTags: ["Sem lactose"],
    difficulty: "Fácil",
    prepTimeMinutes: 5,
    cookTimeMinutes: 15,
    servings: 2,
    occasion: ["Almoço executivo", "Jantar romântico"],
    mealType: "Salgado",
    nutritionPerServing: { calories: 450, protein: 30, carbs: 60, fat: 8, fiber: 4 },
    nutritionScore: 7.0,
    ingredients: [ing("macarrao",200), ing("atum-conserva",160), ing("molho-tomate",200,"ml"), ing("azeite",15,"ml"), ing("alho",2,"un"), ing("sal","a gosto","a gosto")],
    steps: [
      { id:"s1", order:1, instruction:"Coloque uma panela grande com bastante água para ferver (use pelo menos 2 litros para 200g de macarrão). Quando ferver, adicione 1 colher de sopa de sal — a água deve ficar levemente salgada. Acrescente o macarrão e cozinhe conforme o tempo indicado na embalagem, mexendo nos primeiros 2 minutos para não grudar. Reserve 1 concha da água do cozimento antes de escorrer.", equipment:"Fogão", durationMinutes:10, emoji:"🍝" },
      { id:"s2", order:2, instruction:"Enquanto a massa cozinha, aqueça o azeite em uma frigideira grande em fogo médio. Adicione o alho fatiado ou amassado e refogue por 1 minuto, mexendo sempre — cuidado para não queimar. Despeje o molho de tomate, misture bem, tempere com sal, pimenta e um pitada de açúcar (para equilibrar a acidez). Cozinhe por 3 minutos em fogo médio-baixo.", durationMinutes:3, emoji:"🍅" },
      { id:"s3", order:3, instruction:"Escorra o atum e desfaça com um garfo. Adicione ao molho e misture delicadamente. Escorra a massa al dente e adicione diretamente à frigideira com o molho. Misture bem — se o molho estiver seco, adicione um pouco da água do cozimento reservada. Sirva imediatamente com salsinha picada por cima.", emoji:"🐟" },
    ],
    mode: "normal",
    createdAt: new Date().toISOString(),
    specialBadge: "💰 Econômica",
  },
  {
    id: "smoothie-verde-espinafre",
    name: "Smoothie Verde Detox",
    emoji: "🥬",
    description: "Smoothie refrescante de espinafre, banana e limão. Carregado de vitaminas e fibras.",
    imageQuery: "green smoothie detox spinach",
    dietTags: ["Vegano", "Sem glúten", "Sem lactose", "Low carb"],
    difficulty: "Fácil",
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    servings: 1,
    occasion: ["Café da manhã", "Lanche rápido"],
    mealType: "Doce",
    nutritionPerServing: { calories: 160, protein: 4, carbs: 30, fat: 2, fiber: 5 },
    nutritionScore: 8.0,
    ingredients: [ing("espinafre",40), ing("banana",1,"un"), ing("limao",1,"un"), ing("leite-coco",100,"ml"), ing("mel",5,"ml")],
    steps: [
      { id:"s1", order:1, instruction:"Para um smoothie mais cremoso, congele a banana na véspera. Na hora de usar, quebre-a em pedaços menores para facilitar o liquidificador. Lave bem o espinafre em água corrente e escorra — não precisa retirar os talos pequenos.", emoji:"🍌" },
      { id:"s2", order:2, instruction:"No liquidificador, adicione primeiro o leite de coco (líquido primeiro!), depois o espinafre, a banana congelada em pedaços, o suco de limão espremido na hora e o mel. Bata em velocidade alta por 1 minuto, até não restar nenhum pedaço de espinafre visível — o smoothie deve ficar completamente verde e homogêneo. Se precisar, adicione mais leite de coco para ajustar a consistência.", equipment:"Liquidificador", durationMinutes:1, emoji:"🌿" },
      { id:"s3", order:3, instruction:"Sirva imediatamente em copo alto. O smoothie verde oxida rapidamente com o contato do ar, então quanto mais fresco melhor. Se quiser, decore com uma rodela de limão na borda. Consuma em até 20 minutos para aproveitar o máximo de nutrientes e a cor vibrante.", emoji:"🥬" },
    ],
    mode: "normal",
    createdAt: new Date().toISOString(),
  },
];

// Recalculate scores
MOCK_RECIPES.forEach(r => {
  r.nutritionScore = calculateNutritionScore(r.nutritionPerServing, 1);
});

export interface GenerateRecipeOptions {
  mode: GenerationMode;
  ingredients: string[];
  filters: Partial<RecipeFilters>;
  // Contexto extra para o prompt da IA
  equipment?: string[];
  nutritionGoal?: string;
  dishName?: string;
}

// ─── Versão Mock (sempre disponível como fallback) ────────────────────────────
export function generateRecipe(options: GenerateRecipeOptions): Recipe {
  const { mode, ingredients, filters } = options;
  let pool = [...MOCK_RECIPES];

  if (filters.mealType) {
    const f = pool.filter(r => r.mealType === filters.mealType);
    if (f.length > 0) pool = f;
  }
  if (filters.dietTags && filters.dietTags.length > 0) {
    const f = pool.filter(r => filters.dietTags!.every(tag => r.dietTags.includes(tag)));
    if (f.length > 0) pool = f;
  }
  if (filters.occasion) {
    const f = pool.filter(r => r.occasion.includes(filters.occasion!));
    if (f.length > 0) pool = f;
  }
  if (filters.difficulty) {
    const f = pool.filter(r => r.difficulty === filters.difficulty);
    if (f.length > 0) pool = f;
  }
  if (ingredients.length > 0) {
    pool = pool
      .map(r => ({
        recipe: r,
        score: r.ingredients.filter(i => ingredients.includes(i.ingredient.id)).length,
      }))
      .sort((a, b) => b.score - a.score)
      .map(s => s.recipe);
  }

  const base = pool[Math.floor(Math.random() * pool.length)];
  return {
    ...base,
    id: `${base.id}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    servings: filters.servings ?? base.servings,
    mode,
    specialBadge:
      mode === "geladeira-vazia" ? "♻️ Zero Desperdício" :
      mode === "surpresa"        ? "🎲 Surpresa" :
      mode === "orcamento"       ? "💰 Econômica" :
      undefined,
  };
}

// ─── Versão IA (chama /api/gerar-receita) ─────────────────────────────────────
export interface AIGenerateResult {
  recipe: Recipe;
  source: "gemini" | "mock";
  warning?: string; // definido quando Gemini falhou e usou fallback
}

export async function generateRecipeAI(options: GenerateRecipeOptions): Promise<AIGenerateResult> {
  try {
    const payload = {
      mode:          options.mode,
      ingredients:   options.ingredients,
      mealType:      options.filters.mealType ?? "",
      dietTags:      options.filters.dietTags  ?? [],
      occasion:      options.filters.occasion  ?? "",
      difficulty:    options.filters.difficulty ?? "",
      servings:      options.filters.servings   ?? 2,
      equipment:     options.equipment          ?? [],
      nutritionGoal: options.nutritionGoal      ?? "saúde geral",
      dishName:      options.dishName,
    };

    const res = await fetch("/api/gerar-receita", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error ?? `HTTP ${res.status}`);
    }

    const data = await res.json() as AIGenerateResult;
    return data;

  } catch (err) {
    // Fallback client-side caso a rota nem responda
    console.error("[FitChef] generateRecipeAI falhou, usando mock:", err);
    const recipe = generateRecipe(options);
    return {
      recipe,
      source: "mock",
      warning: "Usando receita sugerida — tente gerar novamente em instantes",
    };
  }
}

// ─── Surpresa ─────────────────────────────────────────────────────────────────
export function surpriseRecipe(): Recipe {
  const idx = Math.floor(Math.random() * MOCK_RECIPES.length);
  return {
    ...MOCK_RECIPES[idx],
    id: `${MOCK_RECIPES[idx].id}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    mode: "surpresa",
    specialBadge: "🎲 Surpresa",
  };
}


