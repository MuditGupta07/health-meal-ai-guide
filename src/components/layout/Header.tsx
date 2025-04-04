
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Search, User, Menu, X, LogIn } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, profile } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/Healthy-Plate.png" 
              alt="HealthyPlate Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-health-teal font-bold text-xl">HealthyPlate</span>
          </Link>
        </div>
        
        {!isMobile ? (
          <>
            <div className="relative w-1/3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes..."
                className="pl-8 bg-muted/50"
              />
            </div>
            
            <nav className="flex items-center gap-4">
              <Link to="/recipes" className="text-muted-foreground hover:text-foreground transition-colors">
                Recipes
              </Link>
              <Link to="/health-profile" className="text-muted-foreground hover:text-foreground transition-colors">
                My Health Profile
              </Link>
              <Link to="/favorites">
                <Button variant="ghost" size="icon" aria-label="Favorites">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              
              {user ? (
                <Link to="/profile">
                  <Button variant="ghost" size="icon" aria-label="Profile">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.name || "User"} />
                      <AvatarFallback className="text-sm">
                        {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="icon" aria-label="Login">
                    <LogIn className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </nav>
          </>
        ) : (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </>
        )}
      </div>
      
      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="container py-4 bg-white border-b animate-fade-in">
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes..."
              className="pl-8 bg-muted/50"
            />
          </div>
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/recipes" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Recipes
            </Link>
            <Link 
              to="/health-profile" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Health Profile
            </Link>
            <Link 
              to="/favorites" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Favorites
            </Link>
            
            {user ? (
              <Link 
                to="/profile" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Profile
              </Link>
            ) : (
              <Link 
                to="/auth" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
