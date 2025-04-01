
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getRecipes, Recipe, getHealthProfile, getFavoriteRecipeIds, toggleFavoriteRecipe } from "@/services/recipeService";
import { Search, Heart, ArrowRight } from "lucide-react";

const Index = () => {
  const [topRecipes, setTopRecipes] = useState<Recipe[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Check if user has a health profile
        const profile = getHealthProfile();
        setHasProfile(!!profile);
        
        // Get user's favorite recipe IDs
        const favorites = getFavoriteRecipeIds();
        setFavoriteIds(favorites);
        
        // Fetch recipes
        const recipes = await getRecipes();
        setTopRecipes(recipes.slice(0, 4)); // Show top 4 recipes on homepage
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      const recipes = await getRecipes({ query: searchQuery });
      if (recipes.length === 0) {
        // No results found
        console.log("No recipes found for query:", searchQuery);
      } else {
        // Redirect to recipes page with search query
        window.location.href = `/recipes?query=${encodeURIComponent(searchQuery)}`;
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  };
  
  const handleToggleFavorite = (recipeId: number) => {
    const isFavorite = toggleFavoriteRecipe(recipeId);
    if (isFavorite) {
      setFavoriteIds(prev => [...prev, recipeId]);
    } else {
      setFavoriteIds(prev => prev.filter(id => id !== recipeId));
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-health-light to-white py-16 md:py-24">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-health-dark">
                  Healthy Recipes Tailored to Your Medical Needs
                </h1>
                <p className="text-lg mb-6 text-muted-foreground">
                  Discover doctor-approved meals designed for your specific health conditions, allergies, and dietary preferences.
                </p>
                
                <form onSubmit={handleSearch} className="flex w-full max-w-md mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search for recipes..."
                      className="pl-10 pr-4 py-6 rounded-l-lg rounded-r-none border-r-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="rounded-l-none bg-health-teal hover:bg-health-teal/90 px-6"
                  >
                    Search
                  </Button>
                </form>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {hasProfile ? (
                    <Button className="bg-health-blue hover:bg-health-blue/90" asChild>
                      <Link to="/recipes">Browse Recipes</Link>
                    </Button>
                  ) : (
                    <Button className="bg-health-teal hover:bg-health-teal/90" asChild>
                      <Link to="/health-profile">Create Health Profile</Link>
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop" 
                  alt="Healthy food" 
                  className="rounded-lg shadow-xl w-full"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="health-card text-center">
                <CardContent className="pt-6">
                  <div className="bg-health-light w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                    <span className="text-health-teal text-xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Create Your Health Profile</h3>
                  <p className="text-muted-foreground">
                    Enter your medical conditions, allergies, and dietary preferences to get personalized recommendations.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="health-card text-center">
                <CardContent className="pt-6">
                  <div className="bg-health-light w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                    <span className="text-health-teal text-xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Discover Tailored Recipes</h3>
                  <p className="text-muted-foreground">
                    Browse recipes specifically chosen to support your health needs and avoid problematic ingredients.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="health-card text-center">
                <CardContent className="pt-6">
                  <div className="bg-health-light w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                    <span className="text-health-teal text-xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Cook With Confidence</h3>
                  <p className="text-muted-foreground">
                    Enjoy detailed nutritional information and medical benefits for each recipe you prepare.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Featured Recipes Section */}
        <section className="py-16 bg-health-light">
          <div className="container px-4 mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Recipes</h2>
              <Link to="/recipes" className="text-health-teal hover:text-health-blue flex items-center gap-1">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="recipe-card h-80 animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg" />
                    <CardContent className="pt-4">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-2/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {topRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    id={recipe.id}
                    title={recipe.title}
                    image={recipe.image}
                    readyInMinutes={recipe.readyInMinutes}
                    healthLabels={recipe.healthLabels}
                    isFavorite={favoriteIds.includes(recipe.id)}
                    onToggleFavorite={() => handleToggleFavorite(recipe.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Benefits of HealthyPlate</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="bg-health-light p-3 rounded-lg">
                  <Heart className="h-6 w-6 text-health-teal" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Personalized Health Recommendations</h3>
                  <p className="text-muted-foreground">
                    Get recipes tailored to your specific health conditions and dietary requirements, backed by medical research.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-health-light p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-health-teal">
                    <path d="M8.56 2.9A7 7 0 0 1 19 9v4a1 1 0 0 0 1 1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-16a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1V9a7 7 0 0 1 .56-2.1"/>
                    <path d="M12 18v4"/>
                    <path d="M8 18h8"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Allergy-Safe Recipes</h3>
                  <p className="text-muted-foreground">
                    Automatic filtering of recipes containing your allergens, with safe ingredient substitutions when possible.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-health-light p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-health-teal">
                    <path d="M4.18 4.18C2.8 5.6 2 7.7 2 10c0 5.5 4.5 10 10 10 2.3 0 4.4-.8 6-2.2"/>
                    <path d="M10.2 2.2C10.14 2.2 10.07 2.2 10 2.2c-5.5 0-10 4.5-10 10 0 .07 0 .14.07.2"/>
                    <path d="M22 12c0-5.5-4.5-10-10-10-.07 0-.14 0-.2.07"/>
                    <path d="M21.8 13.8c0-.07.2-.14.2-.2"/>
                    <path d="m21.4 18.6-4.3-2.5"/>
                    <path d="m8.5 14.1-5.4-1.1"/>
                    <path d="m15.9 8.5 1.1-5.4"/>
                    <path d="M2 12h2"/>
                    <path d="M20 12h2"/>
                    <path d="M12 2v2"/>
                    <path d="M12 20v2"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Complete Nutritional Information</h3>
                  <p className="text-muted-foreground">
                    Detailed breakdown of calories, macronutrients, and essential vitamins and minerals for each recipe.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-health-light p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-health-teal">
                    <path d="M20 7h-3a2 2 0 0 1-2-2V2"/>
                    <path d="M9 18a2 2 0 0 1-2-2v-1.4a2 2 0 0 0-1.4-.6H4a2 2 0 0 1-2-2v-1"/>
                    <path d="M18 2h-5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7.5a.5.5 0 0 0-.5-.5"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Doctor-Approved Recipes</h3>
                  <p className="text-muted-foreground">
                    All recipes are vetted to ensure they align with medical guidelines for various health conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-health-dark text-white">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Start Your Health Journey Today</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Create your health profile and discover delicious recipes tailored to your specific medical needs.
            </p>
            <Button 
              size="lg" 
              className="bg-health-teal hover:bg-health-teal/90 text-white"
              asChild
            >
              <Link to="/health-profile">Create Your Health Profile</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
