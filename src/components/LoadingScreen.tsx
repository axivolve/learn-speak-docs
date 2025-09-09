import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  isFadingOut?: boolean;
}

export const LoadingScreen = ({ isFadingOut = false }: LoadingScreenProps) => {
  return (
    <div className={`min-h-screen bg-background flex items-center justify-center transition-opacity duration-1000 ease-out ${
      isFadingOut ? 'opacity-0' : 'opacity-100'
    }`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Logo */}
        <div className="w-64 h-64 flex items-center justify-center">
          <img 
            src="/A-Shridhar logo-black.svg" 
            alt="A.Shridhar Logo" 
            className="w-full h-full object-contain opacity-80"
          />
        </div>
        
        {/* Loading Animation */}
        <div className="relative">
          <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
          <div className="absolute inset-0 w-8 h-8 border-2 border-brand-accent/20 rounded-full"></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-brand-primary">Loading Documents</p>
          <p className="text-sm text-muted-foreground">Please wait while we fetch your documents...</p>
        </div>
      </div>
    </div>
  );
};
