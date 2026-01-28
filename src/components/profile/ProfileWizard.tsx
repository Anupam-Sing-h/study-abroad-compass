import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  GraduationCap, 
  Target, 
  DollarSign, 
  FileText,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: string[];
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'academics',
    title: 'Academic Background',
    description: 'Tell us about your educational qualifications',
    icon: <GraduationCap className="h-5 w-5" />,
    fields: ['education_level', 'degree', 'major', 'gpa', 'graduation_year'],
  },
  {
    id: 'goals',
    title: 'Study Goals',
    description: 'What are your study abroad aspirations?',
    icon: <Target className="h-5 w-5" />,
    fields: ['target_degree', 'target_field', 'target_countries', 'target_intake_year'],
  },
  {
    id: 'budget',
    title: 'Budget & Funding',
    description: 'Your financial planning for studies',
    icon: <DollarSign className="h-5 w-5" />,
    fields: ['budget_min', 'budget_max', 'funding_plan'],
  },
  {
    id: 'exams',
    title: 'Test Scores',
    description: 'Your standardized test preparation status',
    icon: <FileText className="h-5 w-5" />,
    fields: ['ielts_status', 'ielts_score', 'toefl_status', 'toefl_score', 'gre_status', 'gre_score', 'gmat_status', 'gmat_score'],
  },
  {
    id: 'documents',
    title: 'Documents',
    description: 'Application document readiness',
    icon: <Sparkles className="h-5 w-5" />,
    fields: ['sop_status'],
  },
];

const EDUCATION_LEVELS = ['High School', 'Bachelors', 'Masters', 'PhD'];
const DEGREES = ['B.Tech', 'B.Sc', 'B.Com', 'BA', 'BBA', 'M.Tech', 'M.Sc', 'MBA', 'Other'];
const TARGET_DEGREES = ['Masters', 'PhD', 'MBA', 'Bachelors'];
const COUNTRIES = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Ireland', 'Netherlands', 'Singapore'];
const FUNDING_PLANS = ['Self-funded', 'Education Loan', 'Scholarship', 'Employer Sponsored', 'Mixed'];
const EXAM_STATUSES = ['not_started', 'preparing', 'scheduled', 'completed'];
const DOCUMENT_STATUSES = ['not_started', 'in_progress', 'draft_ready', 'finalized'];

export default function ProfileWizard() {
  const { user, studentProfile, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    education_level: studentProfile?.education_level || '',
    degree: studentProfile?.degree || '',
    major: studentProfile?.major || '',
    gpa: studentProfile?.gpa?.toString() || '',
    graduation_year: studentProfile?.graduation_year?.toString() || '',
    target_degree: studentProfile?.target_degree || '',
    target_field: studentProfile?.target_field || '',
    target_countries: studentProfile?.target_countries || [],
    target_intake_year: studentProfile?.target_intake_year?.toString() || '',
    budget_min: studentProfile?.budget_min?.toString() || '',
    budget_max: studentProfile?.budget_max?.toString() || '',
    funding_plan: studentProfile?.funding_plan || '',
    ielts_status: studentProfile?.ielts_status || 'not_started',
    ielts_score: studentProfile?.ielts_score?.toString() || '',
    toefl_status: studentProfile?.toefl_status || 'not_started',
    toefl_score: studentProfile?.toefl_score?.toString() || '',
    gre_status: studentProfile?.gre_status || 'not_started',
    gre_score: studentProfile?.gre_score?.toString() || '',
    gmat_status: studentProfile?.gmat_status || 'not_started',
    gmat_score: studentProfile?.gmat_score?.toString() || '',
    sop_status: studentProfile?.sop_status || 'not_started',
  });

  const calculateCompletion = () => {
    let filled = 0;
    let total = 0;

    WIZARD_STEPS.forEach(step => {
      step.fields.forEach(field => {
        total++;
        const value = formData[field as keyof typeof formData];
        if (Array.isArray(value) ? value.length > 0 : value && value !== 'not_started') {
          filled++;
        }
      });
    });

    return Math.round((filled / total) * 100);
  };

  const getStepCompletion = (stepIndex: number) => {
    const step = WIZARD_STEPS[stepIndex];
    let filled = 0;
    
    step.fields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (Array.isArray(value) ? value.length > 0 : value && value !== 'not_started') {
        filled++;
      }
    });

    return filled === step.fields.length;
  };

  const handleChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCountry = (country: string) => {
    setFormData(prev => {
      const countries = prev.target_countries.includes(country)
        ? prev.target_countries.filter(c => c !== country)
        : [...prev.target_countries, country];
      return { ...prev, target_countries: countries };
    });
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const updateData = {
        education_level: formData.education_level || null,
        degree: formData.degree || null,
        major: formData.major || null,
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
        target_degree: formData.target_degree || null,
        target_field: formData.target_field || null,
        target_countries: formData.target_countries.length > 0 ? formData.target_countries : null,
        target_intake_year: formData.target_intake_year ? parseInt(formData.target_intake_year) : null,
        budget_min: formData.budget_min ? parseInt(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseInt(formData.budget_max) : null,
        funding_plan: formData.funding_plan || null,
        ielts_status: formData.ielts_status,
        ielts_score: formData.ielts_score ? parseFloat(formData.ielts_score) : null,
        toefl_status: formData.toefl_status,
        toefl_score: formData.toefl_score ? parseInt(formData.toefl_score) : null,
        gre_status: formData.gre_status,
        gre_score: formData.gre_score ? parseInt(formData.gre_score) : null,
        gmat_status: formData.gmat_status,
        gmat_score: formData.gmat_score ? parseInt(formData.gmat_score) : null,
        sop_status: formData.sop_status,
      };

      const { error } = await supabase
        .from('student_profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const nextStep = async () => {
    await handleSave();
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completionPercentage = calculateCompletion();
  const step = WIZARD_STEPS[currentStep];

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Profile Completion</h2>
              <p className="text-sm text-muted-foreground">Complete your profile to get personalized recommendations</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-primary">{completionPercentage}%</span>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Step Navigation */}
      <div className="flex justify-between items-center">
        {WIZARD_STEPS.map((s, index) => (
          <button
            key={s.id}
            onClick={() => setCurrentStep(index)}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-lg transition-all',
              index === currentStep && 'bg-primary/10',
              index !== currentStep && 'opacity-60 hover:opacity-100'
            )}
          >
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              getStepCompletion(index) ? 'bg-stage-complete text-success-foreground' : 
              index === currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}>
              {getStepCompletion(index) ? <Check className="h-4 w-4" /> : s.icon}
            </div>
            <span className="text-xs font-medium hidden md:block">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {step.icon}
            {step.title}
          </CardTitle>
          <CardDescription>{step.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step.id === 'academics' && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Education Level</Label>
                  <Select value={formData.education_level} onValueChange={(v) => handleChange('education_level', v)}>
                    <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                    <SelectContent>
                      {EDUCATION_LEVELS.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Select value={formData.degree} onValueChange={(v) => handleChange('degree', v)}>
                    <SelectTrigger><SelectValue placeholder="Select degree" /></SelectTrigger>
                    <SelectContent>
                      {DEGREES.map(degree => (
                        <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Major / Field of Study</Label>
                <Input 
                  value={formData.major} 
                  onChange={(e) => handleChange('major', e.target.value)}
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>GPA (out of 10 or 4)</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={formData.gpa} 
                    onChange={(e) => handleChange('gpa', e.target.value)}
                    placeholder="e.g., 8.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Graduation Year</Label>
                  <Input 
                    type="number"
                    value={formData.graduation_year} 
                    onChange={(e) => handleChange('graduation_year', e.target.value)}
                    placeholder="e.g., 2024"
                  />
                </div>
              </div>
            </>
          )}

          {step.id === 'goals' && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Target Degree</Label>
                  <Select value={formData.target_degree} onValueChange={(v) => handleChange('target_degree', v)}>
                    <SelectTrigger><SelectValue placeholder="Select target degree" /></SelectTrigger>
                    <SelectContent>
                      {TARGET_DEGREES.map(degree => (
                        <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Intake Year</Label>
                  <Input 
                    type="number"
                    value={formData.target_intake_year} 
                    onChange={(e) => handleChange('target_intake_year', e.target.value)}
                    placeholder="e.g., 2025"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Target Field of Study</Label>
                <Input 
                  value={formData.target_field} 
                  onChange={(e) => handleChange('target_field', e.target.value)}
                  placeholder="e.g., Data Science, Business Analytics"
                />
              </div>
              <div className="space-y-2">
                <Label>Target Countries</Label>
                <div className="flex flex-wrap gap-2">
                  {COUNTRIES.map(country => (
                    <Badge
                      key={country}
                      variant={formData.target_countries.includes(country) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleCountry(country)}
                    >
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {step.id === 'budget' && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Minimum Budget ($/year)</Label>
                  <Input 
                    type="number"
                    value={formData.budget_min} 
                    onChange={(e) => handleChange('budget_min', e.target.value)}
                    placeholder="e.g., 20000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Budget ($/year)</Label>
                  <Input 
                    type="number"
                    value={formData.budget_max} 
                    onChange={(e) => handleChange('budget_max', e.target.value)}
                    placeholder="e.g., 50000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Funding Plan</Label>
                <Select value={formData.funding_plan} onValueChange={(v) => handleChange('funding_plan', v)}>
                  <SelectTrigger><SelectValue placeholder="How will you fund your studies?" /></SelectTrigger>
                  <SelectContent>
                    {FUNDING_PLANS.map(plan => (
                      <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step.id === 'exams' && (
            <div className="space-y-6">
              {/* IELTS */}
              <div className="p-4 border rounded-lg space-y-3">
                <h4 className="font-medium">IELTS</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.ielts_status} onValueChange={(v) => handleChange('ielts_status', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {EXAM_STATUSES.map(status => (
                          <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.ielts_status === 'completed' && (
                    <div className="space-y-2">
                      <Label>Score</Label>
                      <Input 
                        type="number"
                        step="0.5"
                        value={formData.ielts_score} 
                        onChange={(e) => handleChange('ielts_score', e.target.value)}
                        placeholder="e.g., 7.5"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* TOEFL */}
              <div className="p-4 border rounded-lg space-y-3">
                <h4 className="font-medium">TOEFL</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.toefl_status} onValueChange={(v) => handleChange('toefl_status', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {EXAM_STATUSES.map(status => (
                          <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.toefl_status === 'completed' && (
                    <div className="space-y-2">
                      <Label>Score</Label>
                      <Input 
                        type="number"
                        value={formData.toefl_score} 
                        onChange={(e) => handleChange('toefl_score', e.target.value)}
                        placeholder="e.g., 105"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* GRE */}
              <div className="p-4 border rounded-lg space-y-3">
                <h4 className="font-medium">GRE</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.gre_status} onValueChange={(v) => handleChange('gre_status', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {EXAM_STATUSES.map(status => (
                          <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.gre_status === 'completed' && (
                    <div className="space-y-2">
                      <Label>Score</Label>
                      <Input 
                        type="number"
                        value={formData.gre_score} 
                        onChange={(e) => handleChange('gre_score', e.target.value)}
                        placeholder="e.g., 320"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* GMAT */}
              <div className="p-4 border rounded-lg space-y-3">
                <h4 className="font-medium">GMAT</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.gmat_status} onValueChange={(v) => handleChange('gmat_status', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {EXAM_STATUSES.map(status => (
                          <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.gmat_status === 'completed' && (
                    <div className="space-y-2">
                      <Label>Score</Label>
                      <Input 
                        type="number"
                        value={formData.gmat_score} 
                        onChange={(e) => handleChange('gmat_score', e.target.value)}
                        placeholder="e.g., 700"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step.id === 'documents' && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg space-y-3">
                <h4 className="font-medium">Statement of Purpose (SOP)</h4>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.sop_status} onValueChange={(v) => handleChange('sop_status', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_STATUSES.map(status => (
                        <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                More document types (LORs, Resume, Transcripts) will be added soon.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          onClick={nextStep}
          disabled={saving}
        >
          {saving ? 'Saving...' : currentStep === WIZARD_STEPS.length - 1 ? 'Finish' : 'Save & Continue'}
          {!saving && currentStep < WIZARD_STEPS.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
        </Button>
      </div>
    </div>
  );
}
