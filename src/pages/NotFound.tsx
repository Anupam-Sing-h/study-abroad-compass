import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient relative overflow-hidden">
      {/* Decorative blur elements */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 text-center px-6">
        {/* Icon */}
        <div className="mb-8 inline-flex">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse" />
            <div className="relative p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-2xl">
              <AlertCircle className="h-16 w-16 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        {/* Gradient 404 text */}
        <h1 className="text-8xl md:text-9xl font-bold mb-4 gradient-text">404</h1>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
          Page Not Found
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Button asChild size="lg" className="shadow-lg shadow-primary/25 rounded-xl">
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
