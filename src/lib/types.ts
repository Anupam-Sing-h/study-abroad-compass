export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  current_stage: number;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  education_level: string | null;
  degree: string | null;
  major: string | null;
  gpa: number | null;
  graduation_year: number | null;
  target_degree: string | null;
  target_field: string | null;
  target_countries: string[] | null;
  target_intake_year: number | null;
  budget_min: number | null;
  budget_max: number | null;
  funding_plan: string | null;
  ielts_status: string;
  ielts_score: number | null;
  toefl_status: string;
  toefl_score: number | null;
  gre_status: string;
  gre_score: number | null;
  gmat_status: string;
  gmat_score: number | null;
  sop_status: string;
  profile_strength_academics: string;
  profile_strength_exams: string;
  profile_strength_documents: string;
  created_at: string;
  updated_at: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string | null;
  ranking: number | null;
  program_type: string | null;
  programs: string[] | null;
  tuition_min: number | null;
  tuition_max: number | null;
  acceptance_rate: number | null;
  ielts_requirement: number | null;
  toefl_requirement: number | null;
  gre_requirement: number | null;
  gmat_requirement: number | null;
  gpa_requirement: number | null;
  application_deadline: string | null;
  intake_months: string[] | null;
  description: string | null;
  website_url: string | null;
  image_url: string | null;
  created_at: string;
}

export interface UserShortlist {
  id: string;
  user_id: string;
  university_id: string;
  category: 'dream' | 'target' | 'safe' | null;
  fit_score: number | null;
  fit_reasons: string[] | null;
  risk_reasons: string[] | null;
  is_locked: boolean;
  locked_at: string | null;
  created_at: string;
  updated_at: string;
  university?: University;
}

export interface Task {
  id: string;
  user_id: string;
  university_id: string | null;
  title: string;
  description: string | null;
  category: string | null;
  priority: string;
  due_date: string | null;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export type Stage = 1 | 2 | 3 | 4;

export const STAGES = {
  1: { name: 'Building Profile', description: 'Complete your academic and career profile' },
  2: { name: 'Discovering Universities', description: 'Explore and shortlist universities' },
  3: { name: 'Finalizing Universities', description: 'Lock your final university choices' },
  4: { name: 'Preparing Applications', description: 'Work on your application documents' },
} as const;

export interface OnboardingData {
  // Academic Background
  education_level: string;
  degree: string;
  major: string;
  gpa: number | null;
  graduation_year: number;
  
  // Study Goals
  target_degree: string;
  target_field: string;
  target_countries: string[];
  target_intake_year: number;
  
  // Budget
  budget_min: number;
  budget_max: number;
  funding_plan: string;
  
  // Exam Readiness
  ielts_status: string;
  ielts_score: number | null;
  toefl_status: string;
  toefl_score: number | null;
  gre_status: string;
  gre_score: number | null;
  gmat_status: string;
  gmat_score: number | null;
  sop_status: string;
}
