
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RecipeFilters } from "@/components/recipes/RecipeFilters";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getRecipes, Recipe, RecipeFilters as Filters, getFavoriteRecipeIds, toggleFavoriteRecipe } from "@/services/recipeService";
import { Search, X } from "lucide-react";

const RecipesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [activeFilters, setActiveFilters] = useState<Filters>({
    healthConditions: [],
    allergies: [],
    diet: "",
    query: searchParams.get("query") || ""
  });
  
  useEffect(() => {
    // Initialize search query from URL params
    const queryParam = searchParams.get("query");
    if (queryParam) {
      setSearchQuery(queryParam);
      setActiveFilters(prev => ({ ...prev, query: queryParam }));
    }
    
    // Get favorite recipes
    const favorites = getFavoriteRecipeIds();
    setFavoriteIds(favorites);
    
    // Initial recipes fetch
    fetchRecipes({
      ...activeFilters,
      query: queryParam || undefined
    });
  }, [searchParams]);
  
  const fetchRecipes = async (filters?: Filters) => {
    setIsLoading(true);
    try {
      const fetchedRecipes = await getRecipes(filters);
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFilterChange = (filters: Filters) => {
    setActiveFilters(prev => ({
      ...prev,
      ...filters
    }));
    
    fetchRecipes({
      ...filters,
      query: searchQuery || undefined
    });
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = {
      ...activeFilters,
      query: searchQuery
    };
    
    setActiveFilters(newFilters);
    fetchRecipes(newFilters);
    
    // Update URL search params
    if (searchQuery) {
      setSearchParams({ query: searchQuery });
    } else {
      setSearchParams({});
    }
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    const newFilters = {
      ...activeFilters,
      query: undefined
    };
    setActiveFilters(newFilters);
    fetchRecipes(newFilters);
    setSearchParams({});
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
      
      <main className="flex-grow bg-gray-50">
        <div className="container px-4 py-8 mx-auto">
          <h1 className="text-3xl font-bold mb-8">Recipes</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Filters</h2>
                <RecipeFilters onFilterChange={handleFilterChange} />
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search recipes..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-3"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <Button type="submit" className="bg-health-teal hover:bg-health-teal/90">Search</Button>
              </form>
              
              {/* Results */}
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-muted-foreground">
                    {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} found
                  </p>
                </div>
                
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="bg-white rounded-lg shadow-sm h-80 animate-pulse">
                        <div className="h-48 bg-muted rounded-t-lg" />
                        <div className="p-4">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                          <div className="h-4 bg-muted rounded w-2/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recipes.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium mb-2">No recipes found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search for something else.
                    </p>
                    <Button 
                      onClick={() => {
                        setActiveFilters({
                          healthConditions: [],
                          allergies: [],
                          diet: "",
                          query: ""
                        });
                        setSearchQuery("");
                        setSearchParams({});
                        fetchRecipes();
                      }}
                      variant="outline"
                    >
                      Clear all filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
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
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipesPage;
