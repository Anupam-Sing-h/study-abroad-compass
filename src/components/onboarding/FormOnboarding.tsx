import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { OnboardingData } from '@/lib/types';

interface FormOnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onBack: () => void;
  loading: boolean;
}

const COUNTRIES = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Netherlands', 'Singapore', 'Switzerland', 'Hong Kong', 'Ireland'];
const FIELDS = ['Computer Science', 'Business', 'Engineering', 'Data Science', 'Medicine', 'Law', 'Arts', 'Science', 'Mathematics', 'Public Policy'];

export default function FormOnboarding({ onComplete, onBack, loading }: FormOnboardingProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    education_level: '',
    degree: '',
    major: '',
    gpa: null,
    graduation_year: new Date().getFullYear(),
    target_degree: '',
    target_field: '',
    target_countries: [],
    target_intake_year: new Date().getFullYear() + 1,
    budget_min: 20000,
    budget_max: 50000,
    funding_plan: '',
    ielts_status: 'not_started',
    ielts_score: null,
    toefl_status: 'not_started',
    toefl_score: null,
    gre_status: 'not_started',
    gre_score: null,
    gmat_status: 'not_started',
    gmat_score: null,
    sop_status: 'not_started',
  });

  const updateField = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCountry = (country: string) => {
    const current = formData.target_countries || [];
    if (current.includes(country)) {
      updateField('target_countries', current.filter(c => c !== country));
    } else {
      updateField('target_countries', [...current, country]);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.education_level && formData.degree && formData.major;
      case 2:
        return formData.target_degree && formData.target_field && (formData.target_countries?.length || 0) > 0;
      case 3:
        return formData.budget_min && formData.budget_max && formData.funding_plan;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(formData as OnboardingData);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to selection
        </Button>

        <div className="mb-8">
          <Progress value={(step / totalSteps) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Step {step} of {totalSteps}</p>
        </div>

        <Card>
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Academic Background</CardTitle>
                <CardDescription>Tell us about your education</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Education Level</Label>
                  <Select value={formData.education_level} onValueChange={(v) => updateField('education_level', v)}>
                    <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_school">High School</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Current/Completed Degree</Label>
                  <Input 
                    placeholder="e.g., B.Tech Computer Science"
                    value={formData.degree || ''}
                    onChange={(e) => updateField('degree', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Major/Field of Study</Label>
                  <Input 
                    placeholder="e.g., Computer Science"
                    value={formData.major || ''}
                    onChange={(e) => updateField('major', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>GPA (optional)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      placeholder="e.g., 3.5"
                      value={formData.gpa || ''}
                      onChange={(e) => updateField('gpa', e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Graduation Year</Label>
                    <Input 
                      type="number"
                      min="2000"
                      max="2030"
                      value={formData.graduation_year || ''}
                      onChange={(e) => updateField('graduation_year', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Study Goals</CardTitle>
                <CardDescription>What do you want to study and where?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Target Degree</Label>
                  <Select value={formData.target_degree} onValueChange={(v) => updateField('target_degree', v)}>
                    <SelectTrigger><SelectValue placeholder="Select degree" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bachelors">Bachelor's</SelectItem>
                      <SelectItem value="masters">Master's</SelectItem>
                      <SelectItem value="mba">MBA</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <Select value={formData.target_field} onValueChange={(v) => updateField('target_field', v)}>
                    <SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger>
                    <SelectContent>
                      {FIELDS.map(field => (
                        <SelectItem key={field} value={field}>{field}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Countries (select all that apply)</Label>
                  <div className="flex flex-wrap gap-2">
                    {COUNTRIES.map(country => (
                      <Button
                        key={country}
                        type="button"
                        size="sm"
                        variant={formData.target_countries?.includes(country) ? 'default' : 'outline'}
                        onClick={() => toggleCountry(country)}
                      >
                        {country}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Target Intake Year</Label>
                  <Select 
                    value={formData.target_intake_year?.toString()} 
                    onValueChange={(v) => updateField('target_intake_year', parseInt(v))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                    <SelectContent>
                      {[2025, 2026, 2027, 2028].map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>Budget</CardTitle>
                <CardDescription>Help us understand your financial planning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Budget (USD/year)</Label>
                    <Input 
                      type="number"
                      min="0"
                      value={formData.budget_min || ''}
                      onChange={(e) => updateField('budget_min', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Budget (USD/year)</Label>
                    <Input 
                      type="number"
                      min="0"
                      value={formData.budget_max || ''}
                      onChange={(e) => updateField('budget_max', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Funding Plan</Label>
                  <Select value={formData.funding_plan} onValueChange={(v) => updateField('funding_plan', v)}>
                    <SelectTrigger><SelectValue placeholder="How will you fund your education?" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self_funded">Self-funded</SelectItem>
                      <SelectItem value="scholarship_dependent">Scholarship-dependent</SelectItem>
                      <SelectItem value="loan_dependent">Loan-dependent</SelectItem>
                      <SelectItem value="mixed">Mixed (Self + Scholarship/Loan)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </>
          )}

          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle>Exam Readiness</CardTitle>
                <CardDescription>Where are you with your exams and documents?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">English Proficiency</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">IELTS Status</Label>
                      <Select value={formData.ielts_status} onValueChange={(v) => updateField('ielts_status', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_started">Not Started</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.ielts_status === 'completed' && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">IELTS Score</Label>
                        <Input 
                          type="number"
                          step="0.5"
                          min="0"
                          max="9"
                          value={formData.ielts_score || ''}
                          onChange={(e) => updateField('ielts_score', parseFloat(e.target.value))}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Standardized Tests</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">GRE Status</Label>
                      <Select value={formData.gre_status} onValueChange={(v) => updateField('gre_status', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_started">Not Started</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="not_required">Not Required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">GMAT Status</Label>
                      <Select value={formData.gmat_status} onValueChange={(v) => updateField('gmat_status', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_started">Not Started</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="not_required">Not Required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Statement of Purpose</Label>
                  <Select value={formData.sop_status} onValueChange={(v) => updateField('sop_status', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_started">Not Started</SelectItem>
                      <SelectItem value="draft">Working on Draft</SelectItem>
                      <SelectItem value="ready">Ready/Finalized</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </>
          )}

          <div className="p-6 pt-0 flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            ) : <div />}
            <Button onClick={handleNext} disabled={!canProceed() || loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {step === totalSteps ? 'Complete Profile' : 'Next'}
              {step < totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
