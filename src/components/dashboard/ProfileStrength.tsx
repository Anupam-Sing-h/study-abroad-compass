import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StudentProfile } from '@/lib/types';
import { BookOpen, FileText, GraduationCap } from 'lucide-react';

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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Strength</CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Profile Strength
          <span className="text-2xl font-bold text-primary">{overallScore}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Progress value={overallScore} className="h-2 mb-4" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Academics</span>
            </div>
            <span className={`text-sm font-medium ${academicsStrength.color}`}>
              {academicsStrength.label}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Exams</span>
            </div>
            <span className={`text-sm font-medium ${examsStrength.color}`}>
              {examsStrength.label}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Documents</span>
            </div>
            <span className={`text-sm font-medium ${docsStrength.color}`}>
              {docsStrength.label}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
