import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, MessageSquare, ClipboardList, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OnboardingData } from '@/lib/types';
import FormOnboarding from '@/components/onboarding/FormOnboarding';
import AIOnboarding from '@/components/onboarding/AIOnboarding';

type OnboardingMode = 'select' | 'form' | 'ai';

export default function Onboarding() {
  const [mode, setMode] = useState<OnboardingMode>('select');
  const [loading, setLoading] = useState(false);
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleComplete = async (data: OnboardingData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Calculate profile strengths
      const academicStrength = data.gpa ? (data.gpa >= 3.5 ? 'strong' : data.gpa >= 3.0 ? 'average' : 'needs_improvement') : 'average';
      const examStrength = 
        (data.ielts_status === 'completed' || data.toefl_status === 'completed') &&
        (data.gre_status === 'completed' || data.gmat_status === 'completed')
          ? 'completed'
          : (data.ielts_status !== 'not_started' || data.toefl_status !== 'not_started')
            ? 'in_progress'
            : 'not_started';
      const docStrength = data.sop_status === 'ready' ? 'ready' : data.sop_status === 'draft' ? 'in_progress' : 'not_started';

      // Upsert student profile
      const { error: profileError } = await supabase
        .from('student_profiles')
        .upsert({
          user_id: user.id,
          ...data,
          profile_strength_academics: academicStrength,
          profile_strength_exams: examStrength,
          profile_strength_documents: docStrength,
        });

      if (profileError) throw profileError;

      // Update profile to mark onboarding complete
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          current_stage: 2, // Move to discovering universities
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await refreshProfile();

      toast({
        title: 'Profile complete!',
        description: 'Your AI Counsellor is now ready to help you.',
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving profile',
        description: error.message || 'Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-muted/30 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Let's build your profile</h1>
            <p className="text-muted-foreground">
              Choose how you'd like to share your information
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => setMode('form')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ClipboardList className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Step-by-Step Form</CardTitle>
                <CardDescription>
                  Fill out a structured form at your own pace
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full">Choose Form</Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => setMode('ai')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>AI-Led Conversation</CardTitle>
                <CardDescription>
                  Chat with AI that asks you questions naturally
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full">Choose AI Chat</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'form') {
    return (
      <FormOnboarding 
        onComplete={handleComplete} 
        onBack={() => setMode('select')}
        loading={loading}
      />
    );
  }

  return (
    <AIOnboarding 
      onComplete={handleComplete} 
      onBack={() => setMode('select')}
      loading={loading}
    />
  );
}
