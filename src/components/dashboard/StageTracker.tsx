import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STAGES, Stage } from '@/lib/types';
import { Check, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StageTrackerProps {
  currentStage: Stage;
}

export default function StageTracker({ currentStage }: StageTrackerProps) {
  return (
    <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Rocket className="h-4 w-4 text-primary" />
          </div>
          Your Journey
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(STAGES).map(([stageNum, stage]) => {
            const num = parseInt(stageNum) as Stage;
            const isComplete = num < currentStage;
            const isCurrent = num === currentStage;
            const isPending = num > currentStage;

            return (
              <div 
                key={num} 
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl transition-all",
                  isComplete && "bg-success/10",
                  isCurrent && "bg-primary/10 ring-1 ring-primary/30",
                  isPending && "bg-muted/50"
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-semibold shadow-sm',
                    isComplete && 'bg-success text-success-foreground',
                    isCurrent && 'bg-primary text-primary-foreground shadow-lg shadow-primary/25',
                    isPending && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : num}
                </div>
                <div>
                  <p className={cn(
                    'text-sm font-semibold',
                    isPending && 'text-muted-foreground'
                  )}>
                    {stage.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
