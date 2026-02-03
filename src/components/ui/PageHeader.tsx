import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ 
  icon: Icon, 
  title, 
  subtitle, 
  badge,
  actions,
  className 
}: PageHeaderProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl hero-gradient p-6 md:p-8 mb-6", className)}>
      {/* Decorative blur elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Icon Badge */}
          <div className="p-3 rounded-xl bg-primary shadow-lg shadow-primary/25">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
              {badge && (
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                  {badge}
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="text-sm md:text-base text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
