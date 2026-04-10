export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'student' | 'tutor'
export type RequestFormat = '授業' | '添削' | '相談'
export type RequestStatus = 'open' | 'matched' | 'closed' | 'cancelled'
export type ProposalStatus = 'pending' | 'accepted' | 'rejected'
export type MatchStatus = 'active' | 'completed' | 'cancelled'

export type Category =
  | '英語'
  | '数学'
  | '化学'
  | '生物'
  | '物理'
  | '小論文'
  | '面接'
  | '学習計画'
  | '推薦対策'
  | 'その他相談'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
      }
      student_profiles: {
        Row: {
          id: string
          user_id: string
          grade: string
          desired_school: string | null
          high_school: string | null
          gender: string | null
          area: string | null
          course_type: string | null
          exam_type: string | null
          score_band: string | null
          strong_subjects: string[] | null
          weak_subjects: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          grade: string
          desired_school?: string | null
          high_school?: string | null
          gender?: string | null
          area?: string | null
          course_type?: string | null
          exam_type?: string | null
          score_band?: string | null
          strong_subjects?: string[] | null
          weak_subjects?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          grade?: string
          desired_school?: string | null
          high_school?: string | null
          gender?: string | null
          area?: string | null
          course_type?: string | null
          exam_type?: string | null
          score_band?: string | null
          strong_subjects?: string[] | null
          weak_subjects?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      tutor_profiles: {
        Row: {
          id: string
          user_id: string
          nickname: string
          gender: string | null
          university_name: string
          grade: string
          available_subjects: string[]
          available_formats: string[]
          available_days: string[] | null
          available_time_slots: string[] | null
          specialties: string | null
          self_pr: string | null
          average_rating: number
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nickname: string
          gender?: string | null
          university_name: string
          grade: string
          available_subjects: string[]
          available_formats: string[]
          available_days?: string[] | null
          available_time_slots?: string[] | null
          specialties?: string | null
          self_pr?: string | null
          average_rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nickname?: string
          gender?: string | null
          university_name?: string
          grade?: string
          available_subjects?: string[]
          available_formats?: string[]
          available_days?: string[] | null
          available_time_slots?: string[] | null
          specialties?: string | null
          self_pr?: string | null
          average_rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      tutor_verifications: {
        Row: {
          id: string
          user_id: string
          academic_email_verified: boolean
          student_id_card_submitted: boolean
          student_id_card_verified: boolean
          student_id_card_path: string | null
          verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          academic_email_verified?: boolean
          student_id_card_submitted?: boolean
          student_id_card_verified?: boolean
          student_id_card_path?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          academic_email_verified?: boolean
          student_id_card_submitted?: boolean
          student_id_card_verified?: boolean
          student_id_card_path?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      requests: {
        Row: {
          id: string
          student_user_id: string
          format: RequestFormat
          category: Category
          budget: number | null
          message: string
          preferred_datetime: string | null
          status: RequestStatus
          selected_proposal_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_user_id: string
          format: RequestFormat
          category: Category
          budget?: number | null
          message: string
          preferred_datetime?: string | null
          status?: RequestStatus
          selected_proposal_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_user_id?: string
          format?: RequestFormat
          category?: Category
          budget?: number | null
          message?: string
          preferred_datetime?: string | null
          status?: RequestStatus
          selected_proposal_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      request_attachments: {
        Row: {
          id: string
          request_id: string
          file_path: string
          file_name: string
          mime_type: string | null
          file_size: number | null
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          file_path: string
          file_name: string
          mime_type?: string | null
          file_size?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          file_path?: string
          file_name?: string
          mime_type?: string | null
          file_size?: number | null
          created_at?: string
        }
      }
      proposals: {
        Row: {
          id: string
          request_id: string
          tutor_user_id: string
          proposed_price: number
          proposed_datetime: string | null
          appeal_message: string
          status: ProposalStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          request_id: string
          tutor_user_id: string
          proposed_price: number
          proposed_datetime?: string | null
          appeal_message: string
          status?: ProposalStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          tutor_user_id?: string
          proposed_price?: number
          proposed_datetime?: string | null
          appeal_message?: string
          status?: ProposalStatus
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          request_id: string
          proposal_id: string
          student_user_id: string
          tutor_user_id: string
          status: MatchStatus
          matched_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          request_id: string
          proposal_id: string
          student_user_id: string
          tutor_user_id: string
          status?: MatchStatus
          matched_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          proposal_id?: string
          student_user_id?: string
          tutor_user_id?: string
          status?: MatchStatus
          matched_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          match_id: string
          student_user_id: string
          tutor_user_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          student_user_id: string
          tutor_user_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          student_user_id?: string
          tutor_user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          match_id: string
          sender_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          sender_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          sender_id?: string
          content?: string
          created_at?: string
        }
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
  }
}
