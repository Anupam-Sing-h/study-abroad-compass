import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">To-Do List</CardTitle>
        <Link 
          to="/tasks" 
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {pendingTasks.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No pending tasks. Start by talking to your AI Counsellor!
          </p>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map(task => (
              <div key={task.id} className="flex items-start gap-3">
                <Checkbox
                  checked={task.is_completed}
                  onCheckedChange={(checked) => toggleTask(task.id, !!checked)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{task.title}</p>
                  {task.description && (
                    <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                  )}
                </div>
                <Badge 
                  variant={
                    task.priority === 'high' ? 'destructive' : 
                    task.priority === 'medium' ? 'default' : 'secondary'
                  }
                  className="text-xs"
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
