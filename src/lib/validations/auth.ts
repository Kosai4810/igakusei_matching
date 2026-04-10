import { z } from 'zod'

// Academic email domains (Japanese universities)
const academicEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.ac\.jp$/

export const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
})

export const studentRegisterSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
})

export const tutorRegisterSchema = z.object({
  email: z.string()
    .email('有効なメールアドレスを入力してください')
    .refine((email) => academicEmailPattern.test(email), {
      message: '大学の学番メールアドレス（.ac.jp）を使用してください',
    }),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
})

export const resetPasswordSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
})

export const updatePasswordSchema = z.object({
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>
export type TutorRegisterInput = z.infer<typeof tutorRegisterSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
