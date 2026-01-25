import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Building2, Lock, FileText } from 'lucide-react';

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
    },
    {
      icon: Building2,
      label: 'Browse Universities',
      description: `${shortlistCount} shortlisted`,
      path: '/universities',
      primary: currentStage === 2,
    },
    {
      icon: Lock,
      label: 'Lock Universities',
      description: `${lockedCount} locked`,
      path: '/universities?tab=shortlist',
      primary: currentStage === 3 && shortlistCount > 0,
      disabled: shortlistCount === 0,
    },
    {
      icon: FileText,
      label: 'Application Tasks',
      description: 'View your to-dos',
      path: '/tasks',
      primary: currentStage === 4,
      disabled: lockedCount === 0,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action, i) => (
          <Link 
            key={i} 
            to={action.disabled ? '#' : action.path}
            className={action.disabled ? 'pointer-events-none' : ''}
          >
            <Button
              variant={action.primary ? 'default' : 'outline'}
              className="w-full justify-start gap-3 h-auto py-3"
              disabled={action.disabled}
            >
              <action.icon className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">{action.label}</p>
                <p className="text-xs opacity-80">{action.description}</p>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
