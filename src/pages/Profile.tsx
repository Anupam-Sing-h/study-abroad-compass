import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProfileWizard from '@/components/profile/ProfileWizard';
import { Loader2, User, Sparkles } from 'lucide-react';

export default function Profile() {
  const { user, profile, studentProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  if (loading || !studentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl hero-gradient p-6 md:p-8">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/10 rounded-full blur-2xl" />
          </div>
          <div className="relative z-10 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary shadow-lg shadow-primary/25">
              <User className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent">Your Profile</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
              <p className="text-muted-foreground mt-1 max-w-xl">
                Fill in your details to get personalized university recommendations and AI-powered guidance.
              </p>
            </div>
          </div>
        </div>
        
        <ProfileWizard />
      </div>
    </DashboardLayout>
  );
}
