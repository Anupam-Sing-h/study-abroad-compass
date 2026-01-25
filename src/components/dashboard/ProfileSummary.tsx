import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Profile, StudentProfile } from '@/lib/types';
import { MapPin, Calendar, DollarSign, GraduationCap } from 'lucide-react';

interface ProfileSummaryProps {
  profile: Profile | null;
  studentProfile: StudentProfile | null;
}

export default function ProfileSummary({ profile, studentProfile }: ProfileSummaryProps) {
  if (!studentProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Summary</CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Profile Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Education</p>
            <p className="text-sm text-muted-foreground">
              {studentProfile.degree || 'Not specified'} in {studentProfile.major || 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Target Intake</p>
            <p className="text-sm text-muted-foreground">
              {studentProfile.target_degree?.replace('_', ' ').charAt(0).toUpperCase() + 
               (studentProfile.target_degree?.slice(1) || '')} in {studentProfile.target_field || 'N/A'}, {studentProfile.target_intake_year}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Countries</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {studentProfile.target_countries?.map(country => (
                <Badge key={country} variant="secondary" className="text-xs">
                  {country}
                </Badge>
              )) || <span className="text-sm text-muted-foreground">Not specified</span>}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Budget</p>
            <p className="text-sm text-muted-foreground">
              {formatBudget(studentProfile.budget_min, studentProfile.budget_max)}/year
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
