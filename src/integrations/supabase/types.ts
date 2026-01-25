export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          current_stage: number | null
          email: string
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          current_stage?: number | null
          email: string
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          current_stage?: number | null
          email?: string
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          created_at: string | null
          degree: string | null
          education_level: string | null
          funding_plan: string | null
          gmat_score: number | null
          gmat_status: string | null
          gpa: number | null
          graduation_year: number | null
          gre_score: number | null
          gre_status: string | null
          id: string
          ielts_score: number | null
          ielts_status: string | null
          major: string | null
          profile_strength_academics: string | null
          profile_strength_documents: string | null
          profile_strength_exams: string | null
          sop_status: string | null
          target_countries: string[] | null
          target_degree: string | null
          target_field: string | null
          target_intake_year: number | null
          toefl_score: number | null
          toefl_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          degree?: string | null
          education_level?: string | null
          funding_plan?: string | null
          gmat_score?: number | null
          gmat_status?: string | null
          gpa?: number | null
          graduation_year?: number | null
          gre_score?: number | null
          gre_status?: string | null
          id?: string
          ielts_score?: number | null
          ielts_status?: string | null
          major?: string | null
          profile_strength_academics?: string | null
          profile_strength_documents?: string | null
          profile_strength_exams?: string | null
          sop_status?: string | null
          target_countries?: string[] | null
          target_degree?: string | null
          target_field?: string | null
          target_intake_year?: number | null
          toefl_score?: number | null
          toefl_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          degree?: string | null
          education_level?: string | null
          funding_plan?: string | null
          gmat_score?: number | null
          gmat_status?: string | null
          gpa?: number | null
          graduation_year?: number | null
          gre_score?: number | null
          gre_status?: string | null
          id?: string
          ielts_score?: number | null
          ielts_status?: string | null
          major?: string | null
          profile_strength_academics?: string | null
          profile_strength_documents?: string | null
          profile_strength_exams?: string | null
          sop_status?: string | null
          target_countries?: string[] | null
          target_degree?: string | null
          target_field?: string | null
          target_intake_year?: number | null
          toefl_score?: number | null
          toefl_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          category: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          is_completed: boolean | null
          priority: string | null
          title: string
          university_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          priority?: string | null
          title: string
          university_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          priority?: string | null
          title?: string
          university_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          acceptance_rate: number | null
          application_deadline: string | null
          city: string | null
          country: string
          created_at: string | null
          description: string | null
          gmat_requirement: number | null
          gpa_requirement: number | null
          gre_requirement: number | null
          id: string
          ielts_requirement: number | null
          image_url: string | null
          intake_months: string[] | null
          name: string
          program_type: string | null
          programs: string[] | null
          ranking: number | null
          toefl_requirement: number | null
          tuition_max: number | null
          tuition_min: number | null
          website_url: string | null
        }
        Insert: {
          acceptance_rate?: number | null
          application_deadline?: string | null
          city?: string | null
          country: string
          created_at?: string | null
          description?: string | null
          gmat_requirement?: number | null
          gpa_requirement?: number | null
          gre_requirement?: number | null
          id?: string
          ielts_requirement?: number | null
          image_url?: string | null
          intake_months?: string[] | null
          name: string
          program_type?: string | null
          programs?: string[] | null
          ranking?: number | null
          toefl_requirement?: number | null
          tuition_max?: number | null
          tuition_min?: number | null
          website_url?: string | null
        }
        Update: {
          acceptance_rate?: number | null
          application_deadline?: string | null
          city?: string | null
          country?: string
          created_at?: string | null
          description?: string | null
          gmat_requirement?: number | null
          gpa_requirement?: number | null
          gre_requirement?: number | null
          id?: string
          ielts_requirement?: number | null
          image_url?: string | null
          intake_months?: string[] | null
          name?: string
          program_type?: string | null
          programs?: string[] | null
          ranking?: number | null
          toefl_requirement?: number | null
          tuition_max?: number | null
          tuition_min?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
      user_shortlist: {
        Row: {
          category: string | null
          created_at: string | null
          fit_reasons: string[] | null
          fit_score: number | null
          id: string
          is_locked: boolean | null
          locked_at: string | null
          risk_reasons: string[] | null
          university_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          fit_reasons?: string[] | null
          fit_score?: number | null
          id?: string
          is_locked?: boolean | null
          locked_at?: string | null
          risk_reasons?: string[] | null
          university_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          fit_reasons?: string[] | null
          fit_score?: number | null
          id?: string
          is_locked?: boolean | null
          locked_at?: string | null
          risk_reasons?: string[] | null
          university_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_shortlist_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_shortlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
