
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  healthLabels: string[];
  ingredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
  instructions: {
    step: number;
    description: string;
  }[];
  nutrition: {
    calories: number;
    carbs: {
      name: string;
      amount: number;
      unit: string;
      percentOfDailyNeeds: number;
    };
    protein: {
      name: string;
      amount: number;
      unit: string;
      percentOfDailyNeeds: number;
    };
    fat: {
      name: string;
      amount: number;
      unit: string;
      percentOfDailyNeeds: number;
    };
    fiber: {
      name: string;
      amount: number;
      unit: string;
      percentOfDailyNeeds: number;
    };
    nutrients: {
      name: string;
      amount: number;
      unit: string;
      percentOfDailyNeeds: number;
    }[];
  };
}

export interface RecipeFilters {
  healthConditions?: string[];
  allergies?: string[];
  diet?: string;
  query?: string;
}

export interface HealthProfile {
  healthConditions: string[];
  allergies: string[];
  diet: string;
}

// Mock recipes data - will be used as fallback if API fails
const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: "Mediterranean Chickpea Salad with Lemon Herb Dressing",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
    readyInMinutes: 20,
    servings: 4,
    summary: "A heart-healthy Mediterranean salad packed with fiber and plant-based protein. This dish is great for diabetes management and heart health.",
    healthLabels: ["Heart Healthy", "Low Glycemic", "High Fiber"],
    ingredients: [
      { name: "chickpeas", amount: 1, unit: "can" },
      { name: "cucumber", amount: 1, unit: "medium" },
      { name: "cherry tomatoes", amount: 1, unit: "cup" },
      { name: "red onion", amount: 0.5, unit: "medium" },
      { name: "feta cheese", amount: 0.5, unit: "cup" },
      { name: "olive oil", amount: 3, unit: "tbsp" },
      { name: "lemon juice", amount: 2, unit: "tbsp" },
      { name: "fresh herbs", amount: 0.25, unit: "cup" },
    ],
    instructions: [
      { step: 1, description: "Drain and rinse chickpeas, then place in a large bowl." },
      { step: 2, description: "Dice cucumber, halve tomatoes, and thinly slice red onion; add to bowl." },
      { step: 3, description: "Crumble feta cheese over the vegetables." },
      { step: 4, description: "Whisk together olive oil, lemon juice, and chopped herbs for the dressing." },
      { step: 5, description: "Pour dressing over salad, toss to combine, and serve chilled." },
    ],
    nutrition: {
      calories: 320,
      carbs: { name: "Carbohydrates", amount: 30, unit: "g", percentOfDailyNeeds: 10 },
      protein: { name: "Protein", amount: 12, unit: "g", percentOfDailyNeeds: 24 },
      fat: { name: "Fat", amount: 18, unit: "g", percentOfDailyNeeds: 28 },
      fiber: { name: "Fiber", amount: 8, unit: "g", percentOfDailyNeeds: 32 },
      nutrients: [
        { name: "Vitamin C", amount: 25, unit: "mg", percentOfDailyNeeds: 30 },
        { name: "Calcium", amount: 200, unit: "mg", percentOfDailyNeeds: 20 },
        { name: "Iron", amount: 3, unit: "mg", percentOfDailyNeeds: 17 },
        { name: "Potassium", amount: 450, unit: "mg", percentOfDailyNeeds: 13 },
        { name: "Magnesium", amount: 80, unit: "mg", percentOfDailyNeeds: 19 },
        { name: "Folate", amount: 120, unit: "µg", percentOfDailyNeeds: 30 },
      ]
    }
  },
  {
    id: 2,
    title: "Baked Salmon with Asparagus and Quinoa",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop",
    readyInMinutes: 35,
    servings: 2,
    summary: "This omega-3 rich dish supports heart health and provides anti-inflammatory benefits. The low-glycemic quinoa makes it suitable for diabetic patients.",
    healthLabels: ["Heart Healthy", "Anti-Inflammatory", "Low Glycemic"],
    ingredients: [
      { name: "salmon fillet", amount: 2, unit: "pieces" },
      { name: "asparagus", amount: 1, unit: "bunch" },
      { name: "quinoa", amount: 1, unit: "cup" },
      { name: "lemon", amount: 1, unit: "whole" },
      { name: "olive oil", amount: 2, unit: "tbsp" },
      { name: "garlic", amount: 2, unit: "cloves" },
      { name: "dill", amount: 2, unit: "tbsp" },
    ],
    instructions: [
      { step: 1, description: "Preheat oven to 375°F (190°C)." },
      { step: 2, description: "Rinse quinoa and cook according to package directions." },
      { step: 3, description: "Place salmon fillets on a baking sheet, drizzle with olive oil." },
      { step: 4, description: "Arrange asparagus around salmon, add minced garlic, and squeeze lemon juice over everything." },
      { step: 5, description: "Sprinkle with dill and bake for 15-20 minutes until salmon flakes easily." },
    ],
    nutrition: {
      calories: 450,
      carbs: { name: "Carbohydrates", amount: 40, unit: "g", percentOfDailyNeeds: 13 },
      protein: { name: "Protein", amount: 35, unit: "g", percentOfDailyNeeds: 70 },
      fat: { name: "Fat", amount: 20, unit: "g", percentOfDailyNeeds: 31 },
      fiber: { name: "Fiber", amount: 6, unit: "g", percentOfDailyNeeds: 24 },
      nutrients: [
        { name: "Vitamin D", amount: 15, unit: "µg", percentOfDailyNeeds: 75 },
        { name: "Omega-3", amount: 1.5, unit: "g", percentOfDailyNeeds: 94 },
        { name: "Vitamin K", amount: 60, unit: "µg", percentOfDailyNeeds: 50 },
        { name: "Vitamin B12", amount: 4, unit: "µg", percentOfDailyNeeds: 67 },
        { name: "Selenium", amount: 40, unit: "µg", percentOfDailyNeeds: 73 },
        { name: "Folate", amount: 160, unit: "µg", percentOfDailyNeeds: 40 },
      ]
    }
  },
  {
    id: 3,
    title: "Overnight Chia Pudding with Berries",
    image: "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?q=80&w=800&auto=format&fit=crop",
    readyInMinutes: 10,
    servings: 2,
    summary: "A blood-sugar friendly breakfast option rich in fiber and omega-3 fatty acids. The chia seeds help slow digestion, making it ideal for maintaining stable blood sugar levels.",
    healthLabels: ["Diabetes Friendly", "High Fiber", "Low Glycemic"],
    ingredients: [
      { name: "chia seeds", amount: 4, unit: "tbsp" },
      { name: "almond milk", amount: 1, unit: "cup" },
      { name: "Greek yogurt", amount: 0.5, unit: "cup" },
      { name: "mixed berries", amount: 1, unit: "cup" },
      { name: "vanilla extract", amount: 0.5, unit: "tsp" },
      { name: "cinnamon", amount: 0.25, unit: "tsp" },
      { name: "maple syrup", amount: 1, unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "In a bowl, combine chia seeds, almond milk, yogurt, vanilla, and cinnamon." },
      { step: 2, description: "Stir well to prevent clumping, then cover and refrigerate overnight." },
      { step: 3, description: "In the morning, stir the pudding and add a small amount of maple syrup if desired." },
      { step: 4, description: "Top with fresh berries and serve chilled." },
    ],
    nutrition: {
      calories: 240,
      carbs: { name: "Carbohydrates", amount: 25, unit: "g", percentOfDailyNeeds: 8 },
      protein: { name: "Protein", amount: 10, unit: "g", percentOfDailyNeeds: 20 },
      fat: { name: "Fat", amount: 12, unit: "g", percentOfDailyNeeds: 18 },
      fiber: { name: "Fiber", amount: 12, unit: "g", percentOfDailyNeeds: 48 },
      nutrients: [
        { name: "Calcium", amount: 300, unit: "mg", percentOfDailyNeeds: 30 },
        { name: "Omega-3", amount: 5, unit: "g", percentOfDailyNeeds: 312 },
        { name: "Manganese", amount: 1.3, unit: "mg", percentOfDailyNeeds: 65 },
        { name: "Phosphorus", amount: 200, unit: "mg", percentOfDailyNeeds: 29 },
        { name: "Antioxidants", amount: 150, unit: "mg", percentOfDailyNeeds: 60 },
        { name: "Vitamin C", amount: 15, unit: "mg", percentOfDailyNeeds: 17 },
      ]
    }
  },
  {
    id: 4,
    title: "PCOS-Friendly Turkey and Vegetable Stir Fry",
    image: "https://images.unsplash.com/photo-1512058556646-c4da40fba323?q=80&w=800&auto=format&fit=crop",
    readyInMinutes: 25,
    servings: 3,
    summary: "A low-carb, high-protein meal designed for women with PCOS. This recipe helps manage insulin resistance and provides hormone-balancing nutrients.",
    healthLabels: ["PCOS Friendly", "Low Carb", "High Protein"],
    ingredients: [
      { name: "ground turkey", amount: 1, unit: "lb" },
      { name: "broccoli", amount: 2, unit: "cups" },
      { name: "bell peppers", amount: 2, unit: "medium" },
      { name: "carrots", amount: 2, unit: "medium" },
      { name: "garlic", amount: 3, unit: "cloves" },
      { name: "ginger", amount: 1, unit: "tbsp" },
      { name: "coconut aminos", amount: 3, unit: "tbsp" },
      { name: "sesame oil", amount: 1, unit: "tbsp" },
    ],
    instructions: [
      { step: 1, description: "Heat sesame oil in a large skillet or wok over medium-high heat." },
      { step: 2, description: "Add ground turkey and cook until browned, about 5-7 minutes." },
      { step: 3, description: "Add minced garlic and ginger, sauté for 30 seconds until fragrant." },
      { step: 4, description: "Add chopped vegetables and stir fry for 5-7 minutes until crisp-tender." },
      { step: 5, description: "Pour in coconut aminos, stir to combine, and cook for 2 more minutes." },
    ],
    nutrition: {
      calories: 380,
      carbs: { name: "Carbohydrates", amount: 15, unit: "g", percentOfDailyNeeds: 5 },
      protein: { name: "Protein", amount: 35, unit: "g", percentOfDailyNeeds: 70 },
      fat: { name: "Fat", amount: 22, unit: "g", percentOfDailyNeeds: 34 },
      fiber: { name: "Fiber", amount: 5, unit: "g", percentOfDailyNeeds: 20 },
      nutrients: [
        { name: "Vitamin C", amount: 120, unit: "mg", percentOfDailyNeeds: 133 },
        { name: "Calcium", amount: 80, unit: "mg", percentOfDailyNeeds: 8 },
        { name: "Iron", amount: 3.5, unit: "mg", percentOfDailyNeeds: 19 },
        { name: "Zinc", amount: 4, unit: "mg", percentOfDailyNeeds: 36 },
        { name: "Vitamin B6", amount: 0.8, unit: "mg", percentOfDailyNeeds: 62 },
        { name: "Folate", amount: 120, unit: "µg", percentOfDailyNeeds: 30 },
      ]
    }
  },
  {
    id: 5,
    title: "Low-Sodium Vegetable Soup with Herbs",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop",
    readyInMinutes: 40,
    servings: 6,
    summary: "A heart-healthy, low-sodium soup ideal for people with hypertension or heart disease. This comforting soup is packed with potassium to help regulate blood pressure.",
    healthLabels: ["Low Sodium", "Heart Healthy", "Hypertension Friendly"],
    ingredients: [
      { name: "onion", amount: 1, unit: "large" },
      { name: "carrots", amount: 3, unit: "medium" },
      { name: "celery", amount: 3, unit: "stalks" },
      { name: "potatoes", amount: 2, unit: "medium" },
      { name: "zucchini", amount: 2, unit: "medium" },
      { name: "vegetable broth (low sodium)", amount: 8, unit: "cups" },
      { name: "fresh herbs", amount: 0.25, unit: "cup" },
      { name: "garlic", amount: 3, unit: "cloves" },
    ],
    instructions: [
      { step: 1, description: "Heat olive oil in a large pot over medium heat." },
      { step: 2, description: "Add diced onion, carrots, and celery; cook for 5 minutes until softened." },
      { step: 3, description: "Add minced garlic and cook for 30 seconds until fragrant." },
      { step: 4, description: "Add diced potatoes, zucchini, and low-sodium vegetable broth." },
      { step: 5, description: "Bring to a boil, then reduce heat and simmer for 20-25 minutes until vegetables are tender." },
      { step: 6, description: "Stir in fresh herbs before serving." },
    ],
    nutrition: {
      calories: 150,
      carbs: { name: "Carbohydrates", amount: 30, unit: "g", percentOfDailyNeeds: 10 },
      protein: { name: "Protein", amount: 4, unit: "g", percentOfDailyNeeds: 8 },
      fat: { name: "Fat", amount: 2, unit: "g", percentOfDailyNeeds: 3 },
      fiber: { name: "Fiber", amount: 6, unit: "g", percentOfDailyNeeds: 24 },
      nutrients: [
        { name: "Potassium", amount: 800, unit: "mg", percentOfDailyNeeds: 23 },
        { name: "Vitamin A", amount: 700, unit: "µg", percentOfDailyNeeds: 78 },
        { name: "Vitamin C", amount: 30, unit: "mg", percentOfDailyNeeds: 33 },
        { name: "Sodium", amount: 120, unit: "mg", percentOfDailyNeeds: 5 },
        { name: "Magnesium", amount: 45, unit: "mg", percentOfDailyNeeds: 11 },
        { name: "Folate", amount: 80, unit: "µg", percentOfDailyNeeds: 20 },
      ]
    }
  },
  {
    id: 6,
    title: "Anti-Inflammatory Turmeric Golden Milk",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop",
    readyInMinutes: 10,
    servings: 1,
    summary: "A warming, anti-inflammatory beverage that can help reduce chronic inflammation associated with various health conditions. Perfect for evening relaxation.",
    healthLabels: ["Anti-Inflammatory", "Dairy-Free", "Soothing"],
    ingredients: [
      { name: "coconut milk", amount: 1, unit: "cup" },
      { name: "turmeric", amount: 1, unit: "tsp" },
      { name: "cinnamon", amount: 0.25, unit: "tsp" },
      { name: "ginger", amount: 0.25, unit: "tsp" },
      { name: "black pepper", amount: 1, unit: "pinch" },
      { name: "honey", amount: 1, unit: "tsp" },
      { name: "vanilla extract", amount: 0.25, unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "In a small saucepan, warm the coconut milk over medium heat (do not boil)." },
      { step: 2, description: "Add turmeric, cinnamon, ginger, and a pinch of black pepper." },
      { step: 3, description: "Whisk continuously until well combined and heated through." },
      { step: 4, description: "Remove from heat and stir in honey and vanilla extract." },
      { step: 5, description: "Pour into a mug and enjoy warm." },
    ],
    nutrition: {
      calories: 180,
      carbs: { name: "Carbohydrates", amount: 10, unit: "g", percentOfDailyNeeds: 3 },
      protein: { name: "Protein", amount: 2, unit: "g", percentOfDailyNeeds: 4 },
      fat: { name: "Fat", amount: 16, unit: "g", percentOfDailyNeeds: 25 },
      fiber: { name: "Fiber", amount: 1, unit: "g", percentOfDailyNeeds: 4 },
      nutrients: [
        { name: "Curcumin", amount: 200, unit: "mg", percentOfDailyNeeds: 110 },
        { name: "Vitamin E", amount: 3, unit: "mg", percentOfDailyNeeds: 20 },
        { name: "Manganese", amount: 1.2, unit: "mg", percentOfDailyNeeds: 60 },
        { name: "Copper", amount: 0.3, unit: "mg", percentOfDailyNeeds: 33 },
        { name: "Iron", amount: 2, unit: "mg", percentOfDailyNeeds: 11 },
        { name: "MCTs", amount: 7, unit: "g", percentOfDailyNeeds: 45 },
      ]
    }
  }
];

// Function to map Spoonacular recipe to our app's recipe format
const mapSpoonacularRecipe = (spoonacularRecipe: any): Recipe => {
  // Extract health labels based on diet, nutrition, etc.
  const healthLabels: string[] = [];
  
  if (spoonacularRecipe.veryHealthy) {
    healthLabels.push("Heart Healthy");
  }
  
  if (spoonacularRecipe.veryPopular) {
    healthLabels.push("Popular");
  }
  
  if (spoonacularRecipe.glutenFree) {
    healthLabels.push("Gluten-Free");
  }
  
  if (spoonacularRecipe.vegetarian) {
    healthLabels.push("Vegetarian");
  }
  
  if (spoonacularRecipe.vegan) {
    healthLabels.push("Vegan");
  }
  
  if (spoonacularRecipe.dairyFree) {
    healthLabels.push("Dairy-Free");
  }
  
  const nutrition = spoonacularRecipe.nutrition || { nutrients: [] };
  const nutrients = nutrition.nutrients || [];
  
  if (nutrients.find((n: any) => n.name === "Sugar" && n.amount < 5)) {
    healthLabels.push("Low Glycemic");
  }
  
  if (nutrients.find((n: any) => n.name === "Fiber" && n.amount > 5)) {
    healthLabels.push("High Fiber");
  }
  
  if (nutrients.find((n: any) => n.name === "Sodium" && n.amount < 140)) {
    healthLabels.push("Low Sodium");
  }
  
  // Map ingredients
  const ingredients = spoonacularRecipe.extendedIngredients?.map((ingredient: any) => ({
    name: ingredient.name,
    amount: ingredient.amount,
    unit: ingredient.unit
  })) || [];
  
  // Map instructions
  const instructions = spoonacularRecipe.analyzedInstructions?.[0]?.steps?.map((step: any) => ({
    step: step.number,
    description: step.step
  })) || [];
  
  // Map nutrition
  const mappedNutrition = {
    calories: nutrients.find((n: any) => n.name === "Calories")?.amount || 0,
    carbs: {
      name: "Carbohydrates",
      amount: nutrients.find((n: any) => n.name === "Carbohydrates")?.amount || 0,
      unit: "g",
      percentOfDailyNeeds: nutrients.find((n: any) => n.name === "Carbohydrates")?.percentOfDailyNeeds || 0
    },
    protein: {
      name: "Protein",
      amount: nutrients.find((n: any) => n.name === "Protein")?.amount || 0,
      unit: "g",
      percentOfDailyNeeds: nutrients.find((n: any) => n.name === "Protein")?.percentOfDailyNeeds || 0
    },
    fat: {
      name: "Fat",
      amount: nutrients.find((n: any) => n.name === "Fat")?.amount || 0,
      unit: "g",
      percentOfDailyNeeds: nutrients.find((n: any) => n.name === "Fat")?.percentOfDailyNeeds || 0
    },
    fiber: {
      name: "Fiber",
      amount: nutrients.find((n: any) => n.name === "Fiber")?.amount || 0,
      unit: "g",
      percentOfDailyNeeds: nutrients.find((n: any) => n.name === "Fiber")?.percentOfDailyNeeds || 0
    },
    nutrients: nutrients.map((nutrient: any) => ({
      name: nutrient.name,
      amount: nutrient.amount,
      unit: nutrient.unit,
      percentOfDailyNeeds: nutrient.percentOfDailyNeeds
    }))
  };
  
  return {
    id: spoonacularRecipe.id,
    title: spoonacularRecipe.title,
    image: spoonacularRecipe.image,
    readyInMinutes: spoonacularRecipe.readyInMinutes,
    servings: spoonacularRecipe.servings,
    summary: spoonacularRecipe.summary,
    healthLabels,
    ingredients,
    instructions,
    nutrition: mappedNutrition
  };
};

// Function to fetch recipes from Spoonacular API
export const getRecipes = async (filters?: RecipeFilters): Promise<Recipe[]> => {
  try {
    // Convert filters to Spoonacular API format
    const apiFilters: any = {};
    
    if (filters?.query) {
      apiFilters.query = filters.query;
    }
    
    if (filters?.diet) {
      apiFilters.diet = filters.diet.toLowerCase();
    }
    
    if (filters?.allergies && filters.allergies.length > 0) {
      apiFilters.intolerances = filters.allergies;
    }
    
    if (filters?.healthConditions && filters.healthConditions.length > 0) {
      apiFilters.healthConditions = filters.healthConditions;
    }
    
    // Call Spoonacular API through Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('spoonacular', {
      body: { 
        ...apiFilters,
        endpoint: 'search'
      }
    });
    
    if (error) {
      console.error("API error:", error);
      toast.error("Failed to load recipes from API. Using cached data.");
      return filterMockRecipes(filters);
    }
    
    if (!data.results || data.results.length === 0) {
      return [];
    }
    
    // Map Spoonacular recipes to our app's recipe format
    return data.results.map(mapSpoonacularRecipe);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    toast.error("Failed to load recipes. Using cached data.");
    return filterMockRecipes(filters);
  }
};

// Function to filter mock recipes (fallback if API fails)
const filterMockRecipes = (filters?: RecipeFilters): Recipe[] => {
  if (!filters) return mockRecipes;
    
  let filteredRecipes = [...mockRecipes];
  
  // Filter by health conditions
  if (filters.healthConditions && filters.healthConditions.length > 0) {
    const conditions = filters.healthConditions.map(c => c.toLowerCase());
      
    // Map health conditions to relevant health labels
    const conditionToLabels: Record<string, string[]> = {
      'diabetes': ['Diabetes Friendly', 'Low Glycemic', 'Low Carb'],
      'heart-disease': ['Heart Healthy', 'Low Sodium'],
      'hypertension': ['Low Sodium', 'Hypertension Friendly'],
      'pcos': ['PCOS Friendly', 'Low Carb', 'Anti-Inflammatory'],
      'cholesterol': ['Heart Healthy', 'Low Carb'],
    };
      
    const relevantLabels = conditions.flatMap(c => conditionToLabels[c] || []);
      
    if (relevantLabels.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.healthLabels.some(label => 
          relevantLabels.some(relevantLabel => 
            label.toLowerCase().includes(relevantLabel.toLowerCase())
          )
        )
      );
    }
  }
  
  // Filter by allergies
  if (filters.allergies && filters.allergies.length > 0) {
    const allergies = filters.allergies.map(a => a.toLowerCase());
      
    // Define ingredients to avoid for each allergy
    const allergyIngredients: Record<string, string[]> = {
      'dairy': ['milk', 'cheese', 'yogurt', 'cream', 'butter'],
      'gluten': ['wheat', 'barley', 'rye', 'bread', 'pasta'],
      'nuts': ['almond', 'walnut', 'pecan', 'cashew', 'pistachio', 'hazelnut'],
      'eggs': ['egg', 'omelet', 'mayonnaise'],
      'soy': ['soy', 'tofu', 'edamame', 'soy sauce'],
      'shellfish': ['shrimp', 'crab', 'lobster', 'scallop', 'clam']
    };
      
    // Filter out recipes containing allergenic ingredients
    allergies.forEach(allergy => {
      const ingredientsToAvoid = allergyIngredients[allergy] || [];
      if (ingredientsToAvoid.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          !recipe.ingredients.some(ingredient => 
            ingredientsToAvoid.some(allergen => 
              ingredient.name.toLowerCase().includes(allergen)
            )
          )
        );
      }
    });
  }
  
  // Filter by diet
  if (filters.diet) {
    switch (filters.diet.toLowerCase()) {
      case 'vegetarian':
        filteredRecipes = filteredRecipes.filter(recipe => 
          !recipe.ingredients.some(ingredient => 
            ['chicken', 'beef', 'pork', 'turkey', 'meat', 'fish', 'salmon'].some(meat => 
              ingredient.name.toLowerCase().includes(meat)
            )
          )
        );
        break;
      case 'vegan':
        filteredRecipes = filteredRecipes.filter(recipe => 
          !recipe.ingredients.some(ingredient => 
            ['chicken', 'beef', 'pork', 'turkey', 'meat', 'fish', 'salmon', 'milk', 'cheese', 'yogurt', 'cream', 'egg'].some(animal => 
              ingredient.name.toLowerCase().includes(animal)
            )
          )
        );
        break;
      case 'keto':
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.nutrition.carbs.amount < 20 && recipe.nutrition.fat.amount > 15
        );
        break;
      case 'mediterranean':
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.ingredients.some(ingredient => 
            ['olive oil', 'fish', 'legume', 'vegetable', 'fruit', 'nut', 'seed', 'herb'].some(med => 
              ingredient.name.toLowerCase().includes(med)
            )
          )
        );
        break;
      case 'dash':
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.healthLabels.some(label => 
            label.toLowerCase().includes('low sodium') || label.toLowerCase().includes('heart healthy')
          )
        );
        break;
    }
  }
  
  // Search by query
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filteredRecipes = filteredRecipes.filter(recipe => 
      recipe.title.toLowerCase().includes(query) || 
      recipe.ingredients.some(ingredient => ingredient.name.toLowerCase().includes(query))
    );
  }
  
  return filteredRecipes;
};

// Function to get a specific recipe by ID
export const getRecipeById = async (id: number): Promise<Recipe | null> => {
  try {
    // Call Spoonacular API through Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('spoonacular', {
      body: { 
        endpoint: 'recipe',
        id
      }
    });
    
    if (error) {
      console.error("API error:", error);
      toast.error("Failed to load recipe from API. Using cached data.");
      // Fallback to mock data
      return mockRecipes.find(r => r.id === id) || null;
    }
    
    // Map Spoonacular recipe to our app's recipe format
    return mapSpoonacularRecipe(data);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    toast.error("Failed to load recipe details. Using cached data.");
    // Fallback to mock data
    return mockRecipes.find(r => r.id === id) || null;
  }
};

// Generate recipe based on user preferences and ingredients
export const generateRecipe = async (preferences: {
  ingredients: string[];
  mealType?: string;
  diet?: string;
  intolerances?: string[];
}): Promise<Recipe[]> => {
  try {
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;
    
    // Call Spoonacular API through Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('spoonacular', {
      body: { 
        endpoint: 'generate',
        ...preferences,
        userId
      }
    });
    
    if (error) {
      console.error("API error:", error);
      toast.error("Failed to generate recipe. Please try again.");
      return [];
    }
    
    if (!data.results || data.results.length === 0) {
      toast.error("No recipes found with these criteria. Try adjusting your preferences.");
      return [];
    }
    
    // Map Spoonacular recipes to our app's recipe format
    return data.results.map(mapSpoonacularRecipe);
  } catch (error) {
    console.error("Error generating recipe:", error);
    toast.error("Failed to generate recipe. Please try again later.");
    return [];
  }
};

// Local storage keys
const FAVORITES_STORAGE_KEY = 'healthyplate_favorites';
const HEALTH_PROFILE_STORAGE_KEY = 'healthyplate_health_profile';

// Health profile management
export const saveHealthProfile = (profile: HealthProfile): void => {
  try {
    localStorage.setItem(HEALTH_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    toast.success("Health profile saved successfully!");
  } catch (error) {
    console.error("Error saving health profile:", error);
    toast.error("Failed to save health profile");
  }
};

export const getHealthProfile = (): HealthProfile | null => {
  try {
    const profileStr = localStorage.getItem(HEALTH_PROFILE_STORAGE_KEY);
    if (!profileStr) return null;
    return JSON.parse(profileStr) as HealthProfile;
  } catch (error) {
    console.error("Error retrieving health profile:", error);
    return null;
  }
};

// Favorites management
export const toggleFavoriteRecipe = (recipeId: number): boolean => {
  try {
    const favorites = getFavoriteRecipeIds();
    const isFavorite = favorites.includes(recipeId);
    
    let newFavorites: number[];
    if (isFavorite) {
      // Remove from favorites
      newFavorites = favorites.filter(id => id !== recipeId);
      toast.success("Recipe removed from favorites");
    } else {
      // Add to favorites
      newFavorites = [...favorites, recipeId];
      toast.success("Recipe added to favorites");
    }
    
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    return !isFavorite; // Return the new state
  } catch (error) {
    console.error("Error toggling favorite:", error);
    toast.error("Failed to update favorites");
    return false;
  }
};

export const getFavoriteRecipeIds = (): number[] => {
  try {
    const favoritesStr = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!favoritesStr) return [];
    return JSON.parse(favoritesStr) as number[];
  } catch (error) {
    console.error("Error retrieving favorites:", error);
    return [];
  }
};

export const getFavoriteRecipes = async (): Promise<Recipe[]> => {
  const favoriteIds = getFavoriteRecipeIds();
  if (favoriteIds.length === 0) return [];
  
  // For each favorite ID, fetch the recipe details
  const recipePromises = favoriteIds.map(id => getRecipeById(id));
  const recipes = await Promise.all(recipePromises);
  
  // Filter out any null results
  return recipes.filter((recipe): recipe is Recipe => recipe !== null);
};

// Future implementation: save favorites to Supabase database when authentication is implemented
// This would replace the local storage implementation
const saveRecipeToDb = async (recipe: Recipe): Promise<boolean> => {
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    
    if (!userId) {
      toast.error("You must be logged in to save recipes");
      return false;
    }
    
    const { error } = await supabase.from('saved_recipes').insert({
      user_id: userId,
      recipe_id: recipe.id,
      recipe_data: recipe as unknown as Json
    });
    
    if (error) {
      console.error("Error saving recipe:", error);
      toast.error("Failed to save recipe to database. Please try again.");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error saving recipe to database:", error);
    return false;
  }
};
