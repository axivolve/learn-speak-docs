import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} text-brand-accent animate-spin`} />
        <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-brand-accent/20 rounded-full`}></div>
      </div>
      <p className="text-sm text-muted-foreground font-medium">{text}</p>
    </div>
  );
};
