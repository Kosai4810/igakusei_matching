import { z } from 'zod'
import { SUBJECTS, FORMATS } from '../constants'

export const requestSchema = z.object({
  format: z.enum(FORMATS, { message: '指導形式を選択してください' }),
  category: z.enum(SUBJECTS, { message: 'カテゴリを選択してください' }),
  budget: z.number().min(0, '予算は0以上で入力してください').optional(),
  message: z.string().min(10, '依頼内容は10文字以上で入力してください').max(2000, '依頼内容は2000文字以内で入力してください'),
  preferred_datetime: z.string().optional(),
})

export const proposalSchema = z.object({
  proposed_price: z.number().min(1, '金額を入力してください'),
  proposed_datetime: z.string().optional(),
  appeal_message: z.string().min(10, 'アピールメッセージは10文字以上で入力してください').max(1000, 'アピールメッセージは1000文字以内で入力してください'),
})

export type RequestInput = z.infer<typeof requestSchema>
export type ProposalInput = z.infer<typeof proposalSchema>
