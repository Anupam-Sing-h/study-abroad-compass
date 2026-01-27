import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Task } from '@/lib/types';
import { toast } from 'sonner';

export interface TaskFilters {
  category: string | null;
  priority: string | null;
  showCompleted: boolean;
  universityId: string | null;
}

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({
    category: null,
    priority: null,
    showCompleted: false,
    universityId: null,
  });

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.category && task.category !== filters.category) {
        return false;
      }
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }
      if (!filters.showCompleted && task.is_completed) {
        return false;
      }
      if (filters.universityId && task.university_id !== filters.universityId) {
        return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const toggleComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.is_completed;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          is_completed: newCompleted,
          completed_at: newCompleted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (error) throw error;

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, is_completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }
            : t
        )
      );

      toast.success(newCompleted ? 'Task completed!' : 'Task reopened');
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    }
  };

  const createTask = async (task: Partial<Task>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: task.title || 'New Task',
          description: task.description,
          category: task.category,
          priority: task.priority || 'medium',
          due_date: task.due_date,
          university_id: task.university_id,
        })
        .select()
        .single();

      if (error) throw error;

      setTasks((prev) => [data as Task, ...prev]);
      toast.success('Task created!');
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (error) throw error;

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
      );

      toast.success('Task updated!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success('Task deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.is_completed).length;
    const pending = total - completed;
    const highPriority = tasks.filter(t => t.priority === 'high' && !t.is_completed).length;
    
    return { total, completed, pending, highPriority };
  }, [tasks]);

  const categories = useMemo(() => {
    return [...new Set(tasks.map(t => t.category).filter(Boolean))] as string[];
  }, [tasks]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    loading,
    filters,
    setFilters,
    toggleComplete,
    createTask,
    updateTask,
    deleteTask,
    stats,
    categories,
    refreshTasks: fetchTasks,
  };
}
