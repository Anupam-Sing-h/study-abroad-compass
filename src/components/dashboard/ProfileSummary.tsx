import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Profile, StudentProfile } from '@/lib/types';
import { MapPin, Calendar, DollarSign, GraduationCap, User } from 'lucide-react';

interface ProfileSummaryProps {
  profile: Profile | null;
  studentProfile: StudentProfile | null;
}

export default function ProfileSummary({ profile, studentProfile }: ProfileSummaryProps) {
  if (!studentProfile) {
    return (
      <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            Profile Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Complete your profile to see summary</p>
        </CardContent>
      </Card>
    );
  }

  const formatBudget = (min?: number | null, max?: number | null) => {
    if (!min && !max) return 'Not set';
    return `$${(min || 0).toLocaleString()} - $${(max || 0).toLocaleString()}`;
  };

  return (
    <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          Profile Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
          <div className="p-2 rounded-lg bg-primary/10">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Education</p>
            <p className="text-sm text-muted-foreground">
              {studentProfile.degree || 'Not specified'} in {studentProfile.major || 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
          <div className="p-2 rounded-lg bg-accent/10">
            <Calendar className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Target Intake</p>
            <p className="text-sm text-muted-foreground">
              {studentProfile.target_degree?.replace('_', ' ').charAt(0).toUpperCase() + 
               (studentProfile.target_degree?.slice(1) || '')} in {studentProfile.target_field || 'N/A'}, {studentProfile.target_intake_year}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
          <div className="p-2 rounded-lg bg-info/10">
            <MapPin className="h-4 w-4 text-info" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Countries</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {studentProfile.target_countries?.map(country => (
                <Badge key={country} variant="secondary" className="text-xs">
                  {country}
                </Badge>
              )) || <span className="text-sm text-muted-foreground">Not specified</span>}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
          <div className="p-2 rounded-lg bg-success/10">
            <DollarSign className="h-4 w-4 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Budget</p>
            <p className="text-sm text-muted-foreground">
              {formatBudget(studentProfile.budget_min, studentProfile.budget_max)}/year
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
