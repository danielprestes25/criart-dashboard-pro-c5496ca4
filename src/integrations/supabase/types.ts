export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      budgets: {
        Row: {
          amount: number
          client_name: string
          created_at: string | null
          created_date: string
          id: number
          project_description: string
          status: string
          updated_at: string | null
          valid_until: string
        }
        Insert: {
          amount: number
          client_name: string
          created_at?: string | null
          created_date?: string
          id?: number
          project_description: string
          status?: string
          updated_at?: string | null
          valid_until: string
        }
        Update: {
          amount?: number
          client_name?: string
          created_at?: string | null
          created_date?: string
          id?: number
          project_description?: string
          status?: string
          updated_at?: string | null
          valid_until?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          budget: number
          created_at: string | null
          end_date: string
          id: number
          name: string
          objective: string | null
          platform: string
          start_date: string
          status: string
          target_audience: string | null
          updated_at: string | null
        }
        Insert: {
          budget: number
          created_at?: string | null
          end_date: string
          id?: number
          name: string
          objective?: string | null
          platform: string
          start_date: string
          status?: string
          target_audience?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: number
          created_at?: string | null
          end_date?: string
          id?: number
          name?: string
          objective?: string | null
          platform?: string
          start_date?: string
          status?: string
          target_audience?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cobrancas: {
        Row: {
          cliente: string
          created_at: string | null
          data: string
          id: number
          linkpagamento: string | null
          status: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          cliente: string
          created_at?: string | null
          data: string
          id?: number
          linkpagamento?: string | null
          status?: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          cliente?: string
          created_at?: string | null
          data?: string
          id?: number
          linkpagamento?: string | null
          status?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string | null
          email: string
          hire_date: string
          id: number
          name: string
          role: string
          salary: number
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          hire_date: string
          id?: number
          name: string
          role: string
          salary: number
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          hire_date?: string
          id?: number
          name?: string
          role?: string
          salary?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string
          description: string
          id: number
          supplier: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date: string
          description: string
          id?: number
          supplier: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string
          description?: string
          id?: number
          supplier?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: number
          name: string
          notes: string | null
          phone: string | null
          score: number
          source: string
          status: string
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: number
          name: string
          notes?: string | null
          phone?: string | null
          score?: number
          source: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: number
          name?: string
          notes?: string | null
          phone?: string | null
          score?: number
          source?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          name: string
          role: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      revenues: {
        Row: {
          amount: number
          category: string
          client: string
          created_at: string | null
          date: string
          description: string
          id: number
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: string
          client: string
          created_at?: string | null
          date: string
          description: string
          id?: number
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          client?: string
          created_at?: string | null
          date?: string
          description?: string
          id?: number
          updated_at?: string | null
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
