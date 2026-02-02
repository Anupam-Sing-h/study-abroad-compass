import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, MessageSquare, ClipboardList, Loader2, Sparkles, ArrowRight } from 'lucide-react';
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
      <div className="min-h-screen hero-gradient py-12 px-4 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex p-3 rounded-2xl bg-primary shadow-lg shadow-primary/25 mb-6">
              <GraduationCap className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Let's build your profile
            </h1>
            <p className="text-lg text-muted-foreground flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Choose how you'd like to share your information
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer group hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 bg-card/95 backdrop-blur-sm"
              onClick={() => setMode('form')}
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ClipboardList className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Step-by-Step Form</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Fill out a structured form at your own pace with clear sections
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-4">
                <Button variant="outline" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Choose Form
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer group hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 bg-card/95 backdrop-blur-sm relative overflow-hidden"
              onClick={() => setMode('ai')}
            >
              {/* Recommended Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-accent text-accent-foreground">
                  Recommended
                </span>
              </div>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-xl">AI-Led Conversation</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Chat naturally with AI that asks questions like a counsellor
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-4">
                <Button className="w-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/25">
                  Choose AI Chat
                  <Sparkles className="h-4 w-4" />
                </Button>
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
