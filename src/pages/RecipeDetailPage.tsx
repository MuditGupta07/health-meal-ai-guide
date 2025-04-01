
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NutritionLabel } from "@/components/recipes/NutritionLabel";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getRecipeById, Recipe, toggleFavoriteRecipe, getFavoriteRecipeIds } from "@/services/recipeService";
import { Clock, User, Heart, ChevronLeft } from "lucide-react";

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const recipeData = await getRecipeById(parseInt(id));
        setRecipe(recipeData);
        
        // Check if recipe is in favorites
        const favorites = getFavoriteRecipeIds();
        setIsFavorite(favorites.includes(parseInt(id)));
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecipe();
  }, [id]);
  
  const handleToggleFavorite = () => {
    if (!recipe) return;
    
    const newIsFavorite = toggleFavoriteRecipe(recipe.id);
    setIsFavorite(newIsFavorite);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container px-4 mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-8 bg-muted rounded w-3/4 mb-6" />
              <div className="h-64 bg-muted rounded mb-6" />
              <div className="h-4 bg-muted rounded w-1/2 mb-4" />
              <div className="h-4 bg-muted rounded w-2/3 mb-4" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!recipe) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Recipe Not Found</h1>
            <p className="mb-6">The recipe you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/recipes">Browse Recipes</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container px-4 mx-auto">
          {/* Back button and actions */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" asChild>
              <Link to="/recipes" className="flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Recipes
              </Link>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleToggleFavorite}
              className="flex items-center gap-1"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
            </Button>
          </div>
          
          {/* Recipe header */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="relative h-64 md:h-80">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-5 w-5" />
                  <span>{recipe.readyInMinutes} minutes</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <User className="mr-2 h-5 w-5" />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {recipe.healthLabels.map((label, index) => (
                  <Badge key={index} variant="outline" className="bg-health-light text-health-dark">
                    {label}
                  </Badge>
                ))}
              </div>
              
              <p className="text-muted-foreground">{recipe.summary}</p>
            </div>
          </div>
          
          {/* Recipe content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="ingredients">
                <TabsList className="mb-4 w-full">
                  <TabsTrigger value="ingredients" className="flex-1">Ingredients</TabsTrigger>
                  <TabsTrigger value="instructions" className="flex-1">Instructions</TabsTrigger>
                  <TabsTrigger value="health-info" className="flex-1">Health Info</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ingredients" className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-health-teal rounded-full mr-3" />
                        <span>
                          {ingredient.amount} {ingredient.unit} {ingredient.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                
                <TabsContent value="instructions" className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                  <ol className="space-y-6">
                    {recipe.instructions.map((instruction) => (
                      <li key={instruction.step} className="flex">
                        <div className="flex-shrink-0 mr-4">
                          <div className="bg-health-light w-8 h-8 rounded-full flex items-center justify-center text-health-teal font-medium">
                            {instruction.step}
                          </div>
                        </div>
                        <div>
                          <p>{instruction.description}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </TabsContent>
                
                <TabsContent value="health-info" className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Health Benefits</h2>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Recipe Benefits</h3>
                    <p className="text-muted-foreground mb-4">{recipe.summary}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {recipe.healthLabels.map((label, index) => (
                        <div key={index} className="bg-health-light rounded-lg p-4">
                          <h4 className="font-medium mb-1">{label}</h4>
                          <p className="text-sm text-muted-foreground">
                            {getHealthLabelDescription(label)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Key Nutrients</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recipe.nutrition.nutrients.slice(0, 4).map((nutrient, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-1">{nutrient.name}</h4>
                          <p className="text-sm mb-1">
                            {nutrient.amount} {nutrient.unit} ({nutrient.percentOfDailyNeeds.toFixed(0)}% daily value)
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getNutrientBenefit(nutrient.name)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="lg:col-span-1">
              <NutritionLabel
                calories={recipe.nutrition.calories}
                carbs={recipe.nutrition.carbs}
                protein={recipe.nutrition.protein}
                fat={recipe.nutrition.fat}
                fiber={recipe.nutrition.fiber}
                nutrients={recipe.nutrition.nutrients}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Helper functions to provide health information
const getHealthLabelDescription = (label: string): string => {
  const descriptions: Record<string, string> = {
    "Heart Healthy": "Low in saturated fat and sodium, helps maintain healthy cholesterol levels and blood pressure.",
    "Low Glycemic": "Contains complex carbohydrates that digest slowly, preventing blood sugar spikes.",
    "High Fiber": "Rich in dietary fiber that aids digestion and helps control blood sugar and cholesterol.",
    "Anti-Inflammatory": "Contains ingredients that help reduce inflammation in the body.",
    "Diabetes Friendly": "Balanced carbohydrates and high in fiber to help manage blood sugar levels.",
    "Low Carb": "Reduced carbohydrate content, suitable for those monitoring carb intake.",
    "High Protein": "Rich in protein to support muscle health and provide longer satiety.",
    "PCOS Friendly": "Low glycemic index foods that help manage insulin resistance associated with PCOS.",
    "Low Sodium": "Reduced salt content to support healthy blood pressure.",
    "Hypertension Friendly": "Contains potassium-rich foods that help regulate blood pressure.",
    "Soothing": "Contains ingredients that may help reduce discomfort and promote relaxation.",
    "Dairy-Free": "Contains no milk or dairy products, suitable for lactose intolerance or dairy allergies.",
  };
  
  return descriptions[label] || "Supports overall health and wellbeing.";
};

const getNutrientBenefit = (nutrient: string): string => {
  const benefits: Record<string, string> = {
    "Vitamin A": "Supports eye health and immune function.",
    "Vitamin C": "Antioxidant that supports immune health and collagen production.",
    "Vitamin D": "Essential for bone health and immune function.",
    "Vitamin E": "Antioxidant that protects cells from damage.",
    "Vitamin K": "Important for blood clotting and bone health.",
    "Calcium": "Builds and maintains strong bones and supports nerve function.",
    "Iron": "Essential for oxygen transport in the blood.",
    "Potassium": "Helps regulate blood pressure and fluid balance.",
    "Magnesium": "Supports muscle and nerve function, and bone health.",
    "Zinc": "Supports immune function and wound healing.",
    "Folate": "Essential for cell division and DNA synthesis.",
    "Omega-3": "Supports heart and brain health, reduces inflammation.",
    "Fiber": "Promotes digestive health and helps control blood sugar.",
    "Protein": "Builds and repairs tissues, supports immune function.",
    "Antioxidants": "Protects cells from damage by free radicals.",
    "Selenium": "Supports thyroid function and acts as an antioxidant.",
    "Vitamin B12": "Essential for nerve function and red blood cell formation.",
    "Manganese": "Supports bone formation and metabolism of proteins and carbs.",
    "Copper": "Helps form red blood cells and maintain nerve cells.",
    "Phosphorus": "Works with calcium for bone and teeth formation.",
    "MCTs": "Medium-chain triglycerides are easily digested and provide quick energy.",
    "Curcumin": "Active compound in turmeric with potent anti-inflammatory properties.",
  };
  
  return benefits[nutrient] || "Contributes to overall health and wellbeing.";
};

export default RecipeDetailPage;
