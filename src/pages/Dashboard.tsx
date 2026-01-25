import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProfileSummary from '@/components/dashboard/ProfileSummary';
import ProfileStrength from '@/components/dashboard/ProfileStrength';
import StageTracker from '@/components/dashboard/StageTracker';
import TaskList from '@/components/dashboard/TaskList';
import QuickActions from '@/components/dashboard/QuickActions';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, profile, studentProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (profile && !profile.onboarding_completed) {
        navigate('/onboarding');
      }
    }
  }, [user, profile, authLoading, navigate]);

  const { data: tasks } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const { data: shortlist } = useQuery({
    queryKey: ['shortlist', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_shortlist')
        .select('*, university:universities(*)')
        .eq('user_id', user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  if (authLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const lockedUniversities = shortlist?.filter(s => s.is_locked) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {profile.full_name?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your study-abroad journey overview
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProfileSummary profile={profile} studentProfile={studentProfile} />
          <ProfileStrength studentProfile={studentProfile} />
          <StageTracker currentStage={profile.current_stage as 1 | 2 | 3 | 4} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <TaskList tasks={tasks || []} />
          <QuickActions 
            currentStage={profile.current_stage} 
            shortlistCount={shortlist?.length || 0}
            lockedCount={lockedUniversities.length}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
