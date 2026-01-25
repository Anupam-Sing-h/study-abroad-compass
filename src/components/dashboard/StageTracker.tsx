import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STAGES, Stage } from '@/lib/types';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StageTrackerProps {
  currentStage: Stage;
}

export default function StageTracker({ currentStage }: StageTrackerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Journey</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(STAGES).map(([stageNum, stage]) => {
            const num = parseInt(stageNum) as Stage;
            const isComplete = num < currentStage;
            const isCurrent = num === currentStage;
            const isPending = num > currentStage;

            return (
              <div key={num} className="flex items-start gap-3">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium',
                    isComplete && 'bg-stage-complete text-success-foreground',
                    isCurrent && 'bg-stage-current text-primary-foreground',
                    isPending && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : num}
                </div>
                <div>
                  <p className={cn(
                    'text-sm font-medium',
                    isPending && 'text-muted-foreground'
                  )}>
                    {stage.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
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
