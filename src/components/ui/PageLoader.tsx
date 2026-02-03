import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageLoaderProps {
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PageLoader({ text, className, size = 'md' }: PageLoaderProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14'
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center bg-background",
      "hero-gradient",
      className
    )}>
      {/* Decorative blur elements */}
      <div className="fixed -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-2xl">
          <Loader2 className={cn(sizeClasses[size], "animate-spin text-primary")} />
        </div>
        {text && (
          <p className="text-muted-foreground text-sm font-medium animate-pulse">{text}</p>
        )}
      </div>
    </div>
  );
}
