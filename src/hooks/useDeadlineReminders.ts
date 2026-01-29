import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { differenceInDays, parseISO, isValid } from 'date-fns';

interface DeadlineReminder {
  id: string;
  universityName: string;
  deadline: string;
  daysRemaining: number;
  urgency: 'critical' | 'warning' | 'upcoming';
}

export function useDeadlineReminders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<DeadlineReminder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeadlines = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_shortlist')
        .select(`
          id,
          is_locked,
          university:universities(
            id,
            name,
            application_deadline
          )
        `)
        .eq('user_id', user.id)
        .eq('is_locked', true);

      if (error) throw error;

      const today = new Date();
      const deadlineReminders: DeadlineReminder[] = [];

      data?.forEach((item) => {
        const university = item.university as { id: string; name: string; application_deadline: string | null } | null;
        if (!university?.application_deadline) return;

        // Parse deadline - handle various formats
        let deadlineDate: Date | null = null;
        const deadlineStr = university.application_deadline;

        // Try parsing as ISO date first
        if (deadlineStr.match(/^\d{4}-\d{2}-\d{2}/)) {
          deadlineDate = parseISO(deadlineStr);
        } else {
          // Try to extract date from strings like "January 15, 2025" or "15 Jan 2025"
          const parsed = new Date(deadlineStr);
          if (isValid(parsed)) {
            deadlineDate = parsed;
          }
        }

        if (!deadlineDate || !isValid(deadlineDate)) return;

        const daysRemaining = differenceInDays(deadlineDate, today);
        
        // Only show reminders for upcoming deadlines (within 90 days) or past deadlines
        if (daysRemaining > 90) return;

        let urgency: 'critical' | 'warning' | 'upcoming' = 'upcoming';
        if (daysRemaining <= 7) {
          urgency = 'critical';
        } else if (daysRemaining <= 30) {
          urgency = 'warning';
        }

        deadlineReminders.push({
          id: item.id,
          universityName: university.name,
          deadline: university.application_deadline,
          daysRemaining,
          urgency,
        });
      });

      // Sort by urgency and days remaining
      deadlineReminders.sort((a, b) => {
        const urgencyOrder = { critical: 0, warning: 1, upcoming: 2 };
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
          return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        }
        return a.daysRemaining - b.daysRemaining;
      });

      setReminders(deadlineReminders);
    } catch (error) {
      console.error('Error fetching deadlines:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const showDeadlineNotifications = useCallback(() => {
    const criticalReminders = reminders.filter(r => r.urgency === 'critical');
    const warningReminders = reminders.filter(r => r.urgency === 'warning');

    criticalReminders.forEach((reminder) => {
      const message = reminder.daysRemaining < 0
        ? `Deadline for ${reminder.universityName} has passed!`
        : reminder.daysRemaining === 0
        ? `Deadline for ${reminder.universityName} is TODAY!`
        : `Only ${reminder.daysRemaining} day${reminder.daysRemaining === 1 ? '' : 's'} left for ${reminder.universityName}!`;

      toast({
        variant: 'destructive',
        title: 'Urgent Deadline Alert',
        description: message,
      });
    });

    if (warningReminders.length > 0 && criticalReminders.length === 0) {
      toast({
        title: 'Upcoming Deadlines',
        description: `You have ${warningReminders.length} deadline${warningReminders.length === 1 ? '' : 's'} within the next 30 days.`,
      });
    }
  }, [reminders, toast]);

  useEffect(() => {
    fetchDeadlines();
  }, [fetchDeadlines]);

  // Show notifications once on initial load
  useEffect(() => {
    if (!loading && reminders.length > 0) {
      const hasShownNotifications = sessionStorage.getItem('deadline_notifications_shown');
      if (!hasShownNotifications) {
        showDeadlineNotifications();
        sessionStorage.setItem('deadline_notifications_shown', 'true');
      }
    }
  }, [loading, reminders, showDeadlineNotifications]);

  return {
    reminders,
    loading,
    refetch: fetchDeadlines,
    showNotifications: showDeadlineNotifications,
    criticalCount: reminders.filter(r => r.urgency === 'critical').length,
    warningCount: reminders.filter(r => r.urgency === 'warning').length,
  };
}
