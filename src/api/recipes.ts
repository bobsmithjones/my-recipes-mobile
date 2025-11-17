export type Recipe = {
  id: number;
  title: string;
  description?: string;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  ingredients?: string[];
  steps?: string[];
  notes?: string;
};

const MOCK_RECIPES: Recipe[] = [
  {
    id: 1,
    title: "Garlic Noodles",
    description: "Rich, buttery garlic noodles with parmesan and umami.",
    prep_time_minutes: 15,
    cook_time_minutes: 15,
    ingredients: [
      "200g spaghetti or Chinese egg noodles",
      "4 cloves garlic, finely minced",
      "3 tbsp butter",
      "1 tbsp soy sauce",
      "1 tbsp oyster sauce",
      "2 tbsp grated parmesan",
      "Pinch of sugar",
    ],
    steps: [
      "Cook noodles in salted water until just al dente.",
      "Melt butter in a pan on low heat and gently cook garlic until fragrant (do not brown).",
      "Stir in soy sauce, oyster sauce, and a pinch of sugar.",
      "Add drained noodles to the pan and toss to coat.",
      "Turn off heat, add parmesan, and toss again.",
      "Adjust seasoning and serve immediately.",
    ],
    notes: "Great with a squeeze of lime and some chili crisp on top.",
  },
  {
    id: 2,
    title: "Butternut Squash Soup",
    description: "Creamy roasted butternut squash soup with brown butter.",
    prep_time_minutes: 20,
    cook_time_minutes: 40,
    ingredients: [
      "1 medium butternut squash, peeled and cubed",
      "1 onion, sliced",
      "3 cloves garlic",
      "3 tbsp butter (for browning)",
      "3–4 cups chicken or veggie stock",
      "Salt and pepper",
      "Splash of cream (optional)",
    ],
    steps: [
      "Roast squash, onion, and garlic at 400°F until soft and caramelized.",
      "Brown butter in a pot until nutty and golden.",
      "Add roasted veggies and enough stock to cover.",
      "Simmer 10–15 minutes, then blend until smooth.",
      "Adjust thickness with more stock, then season.",
      "Finish with a splash of cream if desired.",
    ],
    notes:
      "Top with toasted pumpkin seeds, a drizzle of brown butter, or chili oil.",
  },
  {
    id: 3,
    title: "Matcha Genmaicha Ice Cream",
    description: "Toasty rice and green tea ice cream, super creamy.",
    prep_time_minutes: 30,
    cook_time_minutes: 0,
    ingredients: [
      "2 cups heavy cream",
      "1 cup whole milk",
      "4 egg yolks",
      "120g sugar",
      "2–3 tbsp matcha genmaicha (tea)",
      "Pinch of salt",
    ],
    steps: [
      "Warm milk and cream with the tea, then steep 15–20 minutes.",
      "Strain out tea, then reheat gently.",
      "Whisk egg yolks with sugar until pale.",
      "Temper yolks with warm dairy, then cook to nappe (about 170°F).",
      "Chill completely, then churn in ice cream maker.",
    ],
    notes: "Adjust tea amount based on how roasty/bitter you like it.",
  },
];

export async function getRecipes(q?: string): Promise<Recipe[]> {
  await new Promise((r) => setTimeout(r, 300));

  if (!q) return MOCK_RECIPES;

  const lower = q.toLowerCase();
  return MOCK_RECIPES.filter(
    (r) =>
      r.title.toLowerCase().includes(lower) ||
      (r.description ?? "").toLowerCase().includes(lower)
  );
}
