
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-health-light border-t py-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">HealthyPlate</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered recipe recommendations for your health conditions and dietary needs.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/recipes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Recipes
                </Link>
              </li>
              <li>
                <Link to="/health-profile" className="text-muted-foreground hover:text-foreground transition-colors">
                  My Health Profile
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Help & Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button  className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button  className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button  className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </button>
                
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Subscribe for healthy recipes and updates.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-3 py-2 border rounded-md text-sm flex-1"
              />
              <button className="bg-health-teal hover:bg-opacity-90 text-white px-4 py-2 rounded-md text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} HealthyPlate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
