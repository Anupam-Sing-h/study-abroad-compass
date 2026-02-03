import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardGlass, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Loader2, FileText, Sparkles } from 'lucide-react';
import { OnboardingData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FormOnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onBack: () => void;
  loading: boolean;
}

const COUNTRIES = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Netherlands', 'Singapore', 'Switzerland', 'Hong Kong', 'Ireland'];
const FIELDS = ['Computer Science', 'Business', 'Engineering', 'Data Science', 'Medicine', 'Law', 'Arts', 'Science', 'Mathematics', 'Public Policy'];

const STEP_TITLES = [
  { title: 'Academic Background', description: 'Tell us about your education' },
  { title: 'Study Goals', description: 'What do you want to study and where?' },
  { title: 'Budget', description: 'Help us understand your financial planning' },
  { title: 'Exam Readiness', description: 'Where are you with your exams and documents?' }
];

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
    <div className="min-h-screen hero-gradient py-8 md:py-12 px-4 relative overflow-hidden">
      {/* Decorative blur elements */}
      <div className="fixed -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="fixed -bottom-32 -left-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        {/* Title Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-primary shadow-lg shadow-primary/25">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Profile Setup</h1>
          </div>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            Complete your profile in a few easy steps
          </p>
        </div>

        {/* Step Indicators */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {STEP_TITLES.map((s, index) => (
              <div 
                key={index}
                className={cn(
                  "flex flex-col items-center gap-2 transition-all",
                  index + 1 === step && "scale-105",
                  index + 1 !== step && "opacity-50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                  index + 1 < step && "bg-success text-success-foreground",
                  index + 1 === step && "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
                  index + 1 > step && "bg-muted text-muted-foreground"
                )}>
                  {index + 1 < step ? '✓' : index + 1}
                </div>
                <span className="text-xs font-medium hidden md:block">{s.title}</span>
              </div>
            ))}
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">Step {step} of {totalSteps}</p>
        </div>

        {/* Form Card */}
        <CardGlass className="animate-fade-in">
          {step === 1 && (
            <>
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
                <CardTitle className="flex items-center gap-2">
                  <span className="icon-badge-solid p-2 rounded-lg">📚</span>
                  Academic Background
                </CardTitle>
                <CardDescription>Tell us about your education</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label>Current Education Level</Label>
                  <Select value={formData.education_level} onValueChange={(v) => updateField('education_level', v)}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select level" /></SelectTrigger>
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
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Major/Field of Study</Label>
                  <Input 
                    placeholder="e.g., Computer Science"
                    value={formData.major || ''}
                    onChange={(e) => updateField('major', e.target.value)}
                    className="h-11 rounded-xl"
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
                      className="h-11 rounded-xl"
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
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
                <CardTitle className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-accent/10">🎯</span>
                  Study Goals
                </CardTitle>
                <CardDescription>What do you want to study and where?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label>Target Degree</Label>
                  <Select value={formData.target_degree} onValueChange={(v) => updateField('target_degree', v)}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select degree" /></SelectTrigger>
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
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select field" /></SelectTrigger>
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
                        className="rounded-full"
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
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select year" /></SelectTrigger>
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
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
                <CardTitle className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-success/10">💰</span>
                  Budget
                </CardTitle>
                <CardDescription>Help us understand your financial planning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Budget (USD/year)</Label>
                    <Input 
                      type="number"
                      min="0"
                      value={formData.budget_min || ''}
                      onChange={(e) => updateField('budget_min', parseInt(e.target.value))}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Budget (USD/year)</Label>
                    <Input 
                      type="number"
                      min="0"
                      value={formData.budget_max || ''}
                      onChange={(e) => updateField('budget_max', parseInt(e.target.value))}
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Funding Plan</Label>
                  <Select value={formData.funding_plan} onValueChange={(v) => updateField('funding_plan', v)}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="How will you fund your education?" /></SelectTrigger>
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
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
                <CardTitle className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-info/10">📝</span>
                  Exam Readiness
                </CardTitle>
                <CardDescription>Where are you with your exams and documents?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">English Proficiency</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">IELTS Status</Label>
                      <Select value={formData.ielts_status} onValueChange={(v) => updateField('ielts_status', v)}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
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
                          className="h-11 rounded-xl"
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
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
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
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
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
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
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

          {/* Navigation */}
          <div className="p-6 pt-0 flex justify-between border-t border-border/50 mt-6 pt-6">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-xl">
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            ) : <div />}
            <Button 
              onClick={handleNext} 
              disabled={!canProceed() || loading}
              className="rounded-xl shadow-lg shadow-primary/25"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {step === totalSteps ? 'Complete Profile' : 'Next'}
              {step < totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardGlass>
      </div>
    </div>
  );
}
