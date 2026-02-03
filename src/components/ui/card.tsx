import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

// Modern card variant with enhanced shadow and hover effects
const CardModern = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-border/50 bg-card text-card-foreground",
        "shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10",
        "transition-all duration-300 hover:border-primary/20",
        className
      )}
      {...props}
    />
  )
);
CardModern.displayName = "CardModern";

// Glass effect card with backdrop blur
const CardGlass = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-border/30 bg-card/80 backdrop-blur-md text-card-foreground",
        "shadow-2xl",
        className
      )}
      {...props}
    />
  )
);
CardGlass.displayName = "CardGlass";

// Stats card with icon support
interface CardStatsProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
}

const CardStats = React.forwardRef<HTMLDivElement, CardStatsProps>(
  ({ className, gradient = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl p-6 text-card-foreground",
        gradient 
          ? "stats-gradient text-primary-foreground shadow-lg shadow-primary/25" 
          : "border border-border/50 bg-card shadow-md",
        className
      )}
      {...props}
    />
  )
);
CardStats.displayName = "CardStats";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardModern, CardGlass, CardStats, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
