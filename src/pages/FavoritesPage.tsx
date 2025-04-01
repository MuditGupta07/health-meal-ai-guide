
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { Button } from "@/components/ui/button";
import { getFavoriteRecipes, Recipe, toggleFavoriteRecipe } from "@/services/recipeService";
import { Heart } from "lucide-react";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const recipes = await getFavoriteRecipes();
        setFavorites(recipes);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, []);
  
  const handleToggleFavorite = (recipeId: number) => {
    toggleFavoriteRecipe(recipeId);
    // Remove from UI immediately
    setFavorites(prev => prev.filter(recipe => recipe.id !== recipeId));
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Favorite Recipes</h1>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm h-80 animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <div className="p-4">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-2/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center bg-white rounded-lg shadow-sm py-16">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6">
                Save your favorite recipes to access them quickly later.
              </p>
              <Button asChild>
                <Link to="/recipes">Browse Recipes</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  image={recipe.image}
                  readyInMinutes={recipe.readyInMinutes}
                  healthLabels={recipe.healthLabels}
                  isFavorite={true}
                  onToggleFavorite={() => handleToggleFavorite(recipe.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FavoritesPage;
