import { useDeadlineReminders } from '@/hooks/useDeadlineReminders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function DeadlineReminders() {
  const { reminders, loading, criticalCount, warningCount } = useDeadlineReminders();

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Deadline Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (reminders.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Deadline Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No upcoming deadlines</p>
            <p className="text-xs mt-1">Lock universities to track their deadlines</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getUrgencyStyles = (urgency: 'critical' | 'warning' | 'upcoming') => {
    switch (urgency) {
      case 'critical':
        return {
          bg: 'bg-destructive/10 border-destructive/30',
          icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
          badge: 'destructive' as const,
        };
      case 'warning':
        return {
          bg: 'bg-accent/20 border-accent/40',
          icon: <Clock className="h-4 w-4 text-accent-foreground" />,
          badge: 'default' as const,
        };
      default:
        return {
          bg: 'bg-muted border-border',
          icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
          badge: 'secondary' as const,
        };
    }
  };

  const formatDaysRemaining = (days: number) => {
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Deadline Reminders
          </CardTitle>
          <div className="flex gap-2">
            {criticalCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {criticalCount} urgent
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="default" className="text-xs">
                {warningCount} soon
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {reminders.slice(0, 5).map((reminder) => {
          const styles = getUrgencyStyles(reminder.urgency);
          return (
            <div
              key={reminder.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg border',
                styles.bg
              )}
            >
              <div className="flex items-center gap-3">
                {styles.icon}
                <div>
                  <p className="font-medium text-sm">{reminder.universityName}</p>
                  <p className="text-xs text-muted-foreground">{reminder.deadline}</p>
                </div>
              </div>
              <Badge variant={styles.badge} className="text-xs whitespace-nowrap">
                {formatDaysRemaining(reminder.daysRemaining)}
              </Badge>
            </div>
          );
        })}

        {reminders.length > 5 && (
          <Link to="/universities">
            <Button variant="ghost" className="w-full mt-2" size="sm">
              View all {reminders.length} deadlines
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
