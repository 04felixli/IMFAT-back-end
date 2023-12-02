export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      all_exercises: {
        Row: {
          created_at: string
          equipment: string
          id: number
          name: string
          target_muscle: string
          full_exercise_name: string | null
        }
        Insert: {
          created_at?: string
          equipment: string
          id?: number
          name: string
          target_muscle: string
        }
        Update: {
          created_at?: string
          equipment?: string
          id?: number
          name?: string
          target_muscle?: string
        }
        Relationships: []
      }
      exercises_done_in_workout: {
        Row: {
          created_at: string
          exercise_id: number
          id: number
          notes: string | null
          workout_id: number
        }
        Insert: {
          created_at?: string
          exercise_id: number
          id?: number
          notes?: string | null
          workout_id: number
        }
        Update: {
          created_at?: string
          exercise_id?: number
          id?: number
          notes?: string | null
          workout_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "exercises_done_in_workout_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "all_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercises_done_in_workout_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          }
        ]
      }
      sets: {
        Row: {
          created_at: string
          exercise_in_workout_id: number
          id: number
          reps: number
          set_number: number
          weight: number
          weight_unit: string
        }
        Insert: {
          created_at?: string
          exercise_in_workout_id: number
          id?: number
          reps: number
          set_number: number
          weight: number
          weight_unit: string
        }
        Update: {
          created_at?: string
          exercise_in_workout_id?: number
          id?: number
          reps?: number
          set_number?: number
          weight?: number
          weight_unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "sets_exercise_in_workout_id_fkey"
            columns: ["exercise_in_workout_id"]
            isOneToOne: false
            referencedRelation: "exercises_done_in_workout"
            referencedColumns: ["id"]
          }
        ]
      }
      workouts: {
        Row: {
          created_at: string
          duration: number
          id: number
          workout_date: string
          workout_name: string
          workout_type: string
        }
        Insert: {
          created_at?: string
          duration: number
          id?: number
          workout_date: string
          workout_name: string
          workout_type: string
        }
        Update: {
          created_at?: string
          duration?: number
          id?: number
          workout_date?: string
          workout_name?: string
          workout_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      full_exercise_name: {
        Args: {
          "": unknown
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
    Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
    Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof Database["public"]["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
