import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-6 text-center",
      "rounded-2xl border border-dashed border-border/50",
      "bg-gradient-to-br from-muted/30 to-muted/10",
      className
    )}>
      {/* Icon container with gradient background */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
        <div className="relative p-5 rounded-2xl bg-muted/80 border border-border/50">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      
      {description && (
        <p className="text-muted-foreground text-sm max-w-sm mb-6">{description}</p>
      )}
      
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="shadow-lg shadow-primary/25"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
