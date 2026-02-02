import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Building2, Lock, FileText, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  currentStage: number;
  shortlistCount: number;
  lockedCount: number;
}

export default function QuickActions({ currentStage, shortlistCount, lockedCount }: QuickActionsProps) {
  const actions = [
    {
      icon: MessageSquare,
      label: 'Talk to AI Counsellor',
      description: 'Get personalized guidance',
      path: '/counsellor',
      primary: true,
      gradient: 'from-accent to-primary',
    },
    {
      icon: Building2,
      label: 'Browse Universities',
      description: `${shortlistCount} shortlisted`,
      path: '/universities',
      primary: currentStage === 2,
      gradient: 'from-primary to-info',
    },
    {
      icon: Lock,
      label: 'Lock Universities',
      description: `${lockedCount} locked`,
      path: '/universities?tab=shortlist',
      primary: currentStage === 3 && shortlistCount > 0,
      disabled: shortlistCount === 0,
      gradient: 'from-info to-success',
    },
    {
      icon: FileText,
      label: 'Application Tasks',
      description: 'View your to-dos',
      path: '/tasks',
      primary: currentStage === 4,
      disabled: lockedCount === 0,
      gradient: 'from-success to-warning',
    },
  ];

  return (
    <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/10">
            <Zap className="h-4 w-4 text-accent" />
          </div>
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {actions.map((action, i) => (
          <Link 
            key={i} 
            to={action.disabled ? '#' : action.path}
            className={action.disabled ? 'pointer-events-none' : ''}
          >
            <Button
              variant={action.primary ? 'default' : 'outline'}
              className={cn(
                "w-full justify-between gap-3 h-auto py-3 px-4 rounded-xl group",
                action.primary && "shadow-lg shadow-primary/25",
                action.disabled && "opacity-50"
              )}
              disabled={action.disabled}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  action.primary ? "bg-primary-foreground/20" : "bg-muted"
                )}>
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">{action.label}</p>
                  <p className="text-xs opacity-80">{action.description}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
