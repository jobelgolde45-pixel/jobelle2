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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      job_analysis_forms: {
        Row: {
          additional_comments: string | null
          alternate_position: string | null
          challenges: string | null
          created_at: string
          date_submitted: string | null
          full_name: string | null
          id: string
          job_purpose: string | null
          main_duties: string | null
          office_division: string | null
          position_title: string | null
          required_competencies: Json | null
          secondary_duties: Json | null
          section_unit: string | null
          status: Database["public"]["Enums"]["form_status"] | null
          supervisor_remarks: string | null
          tools_equipment: string | null
          updated_at: string
          user_id: string
          user_signature_url: string | null
        }
        Insert: {
          additional_comments?: string | null
          alternate_position?: string | null
          challenges?: string | null
          created_at?: string
          date_submitted?: string | null
          full_name?: string | null
          id?: string
          job_purpose?: string | null
          main_duties?: string | null
          office_division?: string | null
          position_title?: string | null
          required_competencies?: Json | null
          secondary_duties?: Json | null
          section_unit?: string | null
          status?: Database["public"]["Enums"]["form_status"] | null
          supervisor_remarks?: string | null
          tools_equipment?: string | null
          updated_at?: string
          user_id: string
          user_signature_url?: string | null
        }
        Update: {
          additional_comments?: string | null
          alternate_position?: string | null
          challenges?: string | null
          created_at?: string
          date_submitted?: string | null
          full_name?: string | null
          id?: string
          job_purpose?: string | null
          main_duties?: string | null
          office_division?: string | null
          position_title?: string | null
          required_competencies?: Json | null
          secondary_duties?: Json | null
          section_unit?: string | null
          status?: Database["public"]["Enums"]["form_status"] | null
          supervisor_remarks?: string | null
          tools_equipment?: string | null
          updated_at?: string
          user_id?: string
          user_signature_url?: string | null
        }
        Relationships: []
      }
      nominations: {
        Row: {
          alt_contact: string | null
          alt_date_hired: string | null
          alt_email: string | null
          alt_employment_status: string | null
          alt_gender: string | null
          alt_id_number: string | null
          alt_name: string | null
          alt_position: string | null
          alt_salary_grade: string | null
          alt_years_of_service: string | null
          competency_type: string | null
          created_at: string
          date_filed: string | null
          date_of_training: string | null
          gedsi_responses: Json | null
          hrdd_remarks: string | null
          id: string
          indigenous_group: string | null
          is_indigenous: boolean | null
          is_solo_parent: boolean | null
          justification: string | null
          participant_contact: string | null
          participant_date_hired: string | null
          participant_email: string | null
          participant_employment_status: string | null
          participant_gender: string | null
          participant_id_number: string | null
          participant_name: string | null
          participant_office: string | null
          participant_oic: string | null
          participant_position: string | null
          participant_salary_grade: string | null
          participant_supervisor: string | null
          participant_years_of_service: string | null
          signatory_remarks: string | null
          signatory_signature_url: string | null
          status: Database["public"]["Enums"]["nomination_status"] | null
          supervisor_remarks: string | null
          supervisor_signature_url: string | null
          training_id: string | null
          training_title: string | null
          updated_at: string
          user_id: string
          user_signature_url: string | null
          venue: string | null
        }
        Insert: {
          alt_contact?: string | null
          alt_date_hired?: string | null
          alt_email?: string | null
          alt_employment_status?: string | null
          alt_gender?: string | null
          alt_id_number?: string | null
          alt_name?: string | null
          alt_position?: string | null
          alt_salary_grade?: string | null
          alt_years_of_service?: string | null
          competency_type?: string | null
          created_at?: string
          date_filed?: string | null
          date_of_training?: string | null
          gedsi_responses?: Json | null
          hrdd_remarks?: string | null
          id?: string
          indigenous_group?: string | null
          is_indigenous?: boolean | null
          is_solo_parent?: boolean | null
          justification?: string | null
          participant_contact?: string | null
          participant_date_hired?: string | null
          participant_email?: string | null
          participant_employment_status?: string | null
          participant_gender?: string | null
          participant_id_number?: string | null
          participant_name?: string | null
          participant_office?: string | null
          participant_oic?: string | null
          participant_position?: string | null
          participant_salary_grade?: string | null
          participant_supervisor?: string | null
          participant_years_of_service?: string | null
          signatory_remarks?: string | null
          signatory_signature_url?: string | null
          status?: Database["public"]["Enums"]["nomination_status"] | null
          supervisor_remarks?: string | null
          supervisor_signature_url?: string | null
          training_id?: string | null
          training_title?: string | null
          updated_at?: string
          user_id: string
          user_signature_url?: string | null
          venue?: string | null
        }
        Update: {
          alt_contact?: string | null
          alt_date_hired?: string | null
          alt_email?: string | null
          alt_employment_status?: string | null
          alt_gender?: string | null
          alt_id_number?: string | null
          alt_name?: string | null
          alt_position?: string | null
          alt_salary_grade?: string | null
          alt_years_of_service?: string | null
          competency_type?: string | null
          created_at?: string
          date_filed?: string | null
          date_of_training?: string | null
          gedsi_responses?: Json | null
          hrdd_remarks?: string | null
          id?: string
          indigenous_group?: string | null
          is_indigenous?: boolean | null
          is_solo_parent?: boolean | null
          justification?: string | null
          participant_contact?: string | null
          participant_date_hired?: string | null
          participant_email?: string | null
          participant_employment_status?: string | null
          participant_gender?: string | null
          participant_id_number?: string | null
          participant_name?: string | null
          participant_office?: string | null
          participant_oic?: string | null
          participant_position?: string | null
          participant_salary_grade?: string | null
          participant_supervisor?: string | null
          participant_years_of_service?: string | null
          signatory_remarks?: string | null
          signatory_signature_url?: string | null
          status?: Database["public"]["Enums"]["nomination_status"] | null
          supervisor_remarks?: string | null
          supervisor_signature_url?: string | null
          training_id?: string | null
          training_title?: string | null
          updated_at?: string
          user_id?: string
          user_signature_url?: string | null
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nominations_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          contact_number: string | null
          created_at: string
          date_hired: string | null
          email: string | null
          employment_status: string | null
          full_name: string | null
          gender: string | null
          id: string
          office_division: string | null
          phone: string | null
          position_title: string | null
          salary_grade: string | null
          updated_at: string
          user_id: string
          years_of_service: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          contact_number?: string | null
          created_at?: string
          date_hired?: string | null
          email?: string | null
          employment_status?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          office_division?: string | null
          phone?: string | null
          position_title?: string | null
          salary_grade?: string | null
          updated_at?: string
          user_id: string
          years_of_service?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          contact_number?: string | null
          created_at?: string
          date_hired?: string | null
          email?: string | null
          employment_status?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          office_division?: string | null
          phone?: string | null
          position_title?: string | null
          salary_grade?: string | null
          updated_at?: string
          user_id?: string
          years_of_service?: string | null
        }
        Relationships: []
      }
      trainings: {
        Row: {
          competency_type: string | null
          created_at: string
          created_by: string | null
          date_end: string | null
          date_start: string | null
          description: string | null
          id: string
          max_participants: number | null
          mode: string | null
          provider: string | null
          status: string | null
          time_end: string | null
          time_start: string | null
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          competency_type?: string | null
          created_at?: string
          created_by?: string | null
          date_end?: string | null
          date_start?: string | null
          description?: string | null
          id?: string
          max_participants?: number | null
          mode?: string | null
          provider?: string | null
          status?: string | null
          time_end?: string | null
          time_start?: string | null
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          competency_type?: string | null
          created_at?: string
          created_by?: string | null
          date_end?: string | null
          date_start?: string | null
          description?: string | null
          id?: string
          max_participants?: number | null
          mode?: string | null
          provider?: string | null
          status?: string | null
          time_end?: string | null
          time_start?: string | null
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "supervisor" | "hrdd_admin" | "signatory"
      form_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "returned"
      nomination_status:
        | "draft"
        | "pending_supervisor"
        | "pending_hrdd"
        | "approved"
        | "disapproved"
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
    Enums: {
      app_role: ["user", "supervisor", "hrdd_admin", "signatory"],
      form_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "returned",
      ],
      nomination_status: [
        "draft",
        "pending_supervisor",
        "pending_hrdd",
        "approved",
        "disapproved",
      ],
    },
  },
} as const
