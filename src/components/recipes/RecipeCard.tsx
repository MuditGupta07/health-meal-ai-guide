
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export interface RecipeCardProps {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  healthLabels: string[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function RecipeCard({ 
  id, 
  title, 
  image, 
  readyInMinutes, 
  healthLabels,
  isFavorite = false,
  onToggleFavorite
}: RecipeCardProps) {
  return (
    <Card className="recipe-card overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        {onToggleFavorite && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite();
            }}
            className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
            />
          </button>
        )}
      </div>
      
      <CardContent className="pt-4 flex-grow">
        <Link to={`/recipe/${id}`}>
          <h3 className="font-medium text-lg mb-2 line-clamp-2 hover:text-health-teal transition-colors">
            {title}
          </h3>
        </Link>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <Clock className="mr-1 h-4 w-4" />
          <span>{readyInMinutes} mins</span>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {healthLabels.map((label, i) => (
            <Badge key={i} variant="outline" className="bg-health-light text-health-dark">
              {label}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <Link 
          to={`/recipe/${id}`} 
          className="w-full text-center text-sm font-medium text-health-teal hover:text-health-blue transition-colors"
        >
          View Recipe
        </Link>
      </CardFooter>
    </Card>
  );
}
