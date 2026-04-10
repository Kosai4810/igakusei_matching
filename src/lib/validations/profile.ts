import { z } from 'zod'
import { SUBJECTS, FORMATS, DAYS, TIME_SLOTS, STUDENT_GRADES, TUTOR_GRADES, GENDERS, COURSE_TYPES, EXAM_TYPES, SCORE_BANDS } from '../constants'

export const studentProfileSchema = z.object({
  grade: z.enum(STUDENT_GRADES, { message: '学年を選択してください' }),
  desired_school: z.string().optional(),
  high_school: z.string().optional(),
  gender: z.enum(GENDERS).optional(),
  area: z.string().optional(),
  course_type: z.enum(COURSE_TYPES).optional(),
  exam_type: z.enum(EXAM_TYPES).optional(),
  score_band: z.enum(SCORE_BANDS).optional(),
  strong_subjects: z.array(z.enum(SUBJECTS)).optional(),
  weak_subjects: z.array(z.enum(SUBJECTS)).optional(),
})

export const tutorProfileSchema = z.object({
  nickname: z.string().min(1, 'ニックネームを入力してください').max(50, '50文字以内で入力してください'),
  gender: z.enum(GENDERS).optional(),
  university_name: z.string().min(1, '大学名を入力してください'),
  grade: z.enum(TUTOR_GRADES, { message: '学年を選択してください' }),
  available_subjects: z.array(z.enum(SUBJECTS)).min(1, '対応科目を1つ以上選択してください'),
  available_formats: z.array(z.enum(FORMATS)).min(1, '対応形式を1つ以上選択してください'),
  available_days: z.array(z.enum(DAYS)).optional(),
  available_time_slots: z.array(z.enum(TIME_SLOTS)).optional(),
  specialties: z.string().optional(),
  self_pr: z.string().max(1000, '1000文字以内で入力してください').optional(),
})

export type StudentProfileInput = z.infer<typeof studentProfileSchema>
export type TutorProfileInput = z.infer<typeof tutorProfileSchema>
