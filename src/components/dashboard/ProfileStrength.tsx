import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StudentProfile } from '@/lib/types';
import { BookOpen, FileText, GraduationCap, TrendingUp } from 'lucide-react';

interface ProfileStrengthProps {
  studentProfile: StudentProfile | null;
}

const STRENGTH_LABELS: Record<string, { label: string; color: string }> = {
  strong: { label: 'Strong', color: 'text-success' },
  average: { label: 'Average', color: 'text-warning' },
  needs_improvement: { label: 'Needs Work', color: 'text-destructive' },
  completed: { label: 'Completed', color: 'text-success' },
  in_progress: { label: 'In Progress', color: 'text-warning' },
  not_started: { label: 'Not Started', color: 'text-muted-foreground' },
  ready: { label: 'Ready', color: 'text-success' },
  draft: { label: 'Draft', color: 'text-warning' },
};

export default function ProfileStrength({ studentProfile }: ProfileStrengthProps) {
  if (!studentProfile) {
    return (
      <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            Profile Strength
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Complete your profile to see strength</p>
        </CardContent>
      </Card>
    );
  }

  const getStrengthValue = (status: string) => {
    switch (status) {
      case 'strong':
      case 'completed':
      case 'ready':
        return 100;
      case 'average':
      case 'in_progress':
      case 'draft':
        return 60;
      default:
        return 20;
    }
  };

  const academicsStrength = STRENGTH_LABELS[studentProfile.profile_strength_academics] || STRENGTH_LABELS.average;
  const examsStrength = STRENGTH_LABELS[studentProfile.profile_strength_exams] || STRENGTH_LABELS.not_started;
  const docsStrength = STRENGTH_LABELS[studentProfile.profile_strength_documents] || STRENGTH_LABELS.not_started;

  const overallScore = Math.round(
    (getStrengthValue(studentProfile.profile_strength_academics) +
     getStrengthValue(studentProfile.profile_strength_exams) +
     getStrengthValue(studentProfile.profile_strength_documents)) / 3
  );

  return (
    <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            Profile Strength
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {overallScore}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Progress value={overallScore} className="h-2.5" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Academics</span>
            </div>
            <span className={`text-sm font-semibold ${academicsStrength.color}`}>
              {academicsStrength.label}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <BookOpen className="h-4 w-4 text-accent" />
              </div>
              <span className="text-sm font-medium">Exams</span>
            </div>
            <span className={`text-sm font-semibold ${examsStrength.color}`}>
              {examsStrength.label}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/10">
                <FileText className="h-4 w-4 text-info" />
              </div>
              <span className="text-sm font-medium">Documents</span>
            </div>
            <span className={`text-sm font-semibold ${docsStrength.color}`}>
              {docsStrength.label}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
