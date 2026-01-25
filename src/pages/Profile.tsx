import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Loader2 } from 'lucide-react';

export default function Profile() {
  const { user, profile, studentProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p className="text-muted-foreground">Profile editing coming soon.</p>
    </DashboardLayout>
  );
}
