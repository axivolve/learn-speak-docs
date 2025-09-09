import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-24 h-24 bg-brand-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <FileX className="w-12 h-12 text-brand-accent" />
        </div>
        <h1 className="text-6xl font-bold text-brand-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-brand-primary mb-3">Page not found</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          onClick={() => window.location.href = '/'}
          className="bg-brand-accent hover:bg-brand-accent/90 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-modern"
        >
          <Home className="w-4 h-4 mr-2" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
