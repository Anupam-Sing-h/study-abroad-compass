import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight, ListTodo, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const toggleTask = async (taskId: string, completed: boolean) => {
    await supabase
      .from('tasks')
      .update({ 
        is_completed: completed,
        completed_at: completed ? new Date().toISOString() : null
      })
      .eq('id', taskId);
    
    queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
  };

  const pendingTasks = tasks.filter(t => !t.is_completed).slice(0, 5);

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return { variant: 'destructive' as const, bg: 'bg-destructive/5' };
      case 'medium':
        return { variant: 'default' as const, bg: 'bg-warning/5' };
      default:
        return { variant: 'secondary' as const, bg: 'bg-muted/50' };
    }
  };

  return (
    <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <ListTodo className="h-4 w-4 text-primary" />
          </div>
          To-Do List
        </CardTitle>
        <Link 
          to="/tasks" 
          className="text-sm text-primary hover:underline flex items-center gap-1 font-medium"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        {pendingTasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <p className="text-sm font-medium text-foreground">All caught up!</p>
            <p className="text-xs text-muted-foreground mt-1">
              No pending tasks. Start by talking to your AI Counsellor!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {pendingTasks.map(task => {
              const styles = getPriorityStyles(task.priority);
              return (
                <div 
                  key={task.id} 
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl border border-border/50 transition-all hover:shadow-sm",
                    styles.bg
                  )}
                >
                  <Checkbox
                    checked={task.is_completed}
                    onCheckedChange={(checked) => toggleTask(task.id, !!checked)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{task.description}</p>
                    )}
                  </div>
                  <Badge 
                    variant={styles.variant}
                    className="text-xs shrink-0 shadow-sm"
                  >
                    {task.priority}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
