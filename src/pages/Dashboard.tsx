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
import DeadlineReminders from '@/components/dashboard/DeadlineReminders';
import { Loader2, Sparkles } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const lockedUniversities = shortlist?.filter(s => s.is_locked) || [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl hero-gradient p-6 md:p-8">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/10 rounded-full blur-2xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-accent">Your Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Welcome back, {profile.full_name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Here's your study-abroad journey overview. Track your progress, manage tasks, and get personalized recommendations.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProfileSummary profile={profile} studentProfile={studentProfile} />
          <ProfileStrength studentProfile={studentProfile} />
          <StageTracker currentStage={profile.current_stage as 1 | 2 | 3 | 4} />
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TaskList tasks={tasks || []} />
          </div>
          <div className="space-y-6">
            <DeadlineReminders />
            <QuickActions 
              currentStage={profile.current_stage} 
              shortlistCount={shortlist?.length || 0}
              lockedCount={lockedUniversities.length}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
