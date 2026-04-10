'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { proposalSchema, type ProposalInput } from '@/lib/validations/request'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface ProposalFormProps {
  requestId: string
  requestFormat: string
}

export function ProposalForm({ requestId, requestFormat }: ProposalFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProposalInput>({
    resolver: zodResolver(proposalSchema),
  })

  const onSubmit = async (data: ProposalInput) => {
    setIsLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase.from('proposals').insert({
      request_id: requestId,
      tutor_user_id: user.id,
      proposed_price: data.proposed_price,
      proposed_datetime: data.proposed_datetime || null,
      appeal_message: data.appeal_message,
      status: 'pending',
    })

    if (error) {
      if (error.code === '23505') {
        toast.error('この依頼には既に提案しています')
      } else {
        toast.error('提案の送信に失敗しました')
      }
      setIsLoading(false)
      return
    }

    toast.success('提案を送信しました')
    router.push('/tutor/proposals')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Proposed Price */}
      <div className="space-y-2">
        <Label htmlFor="proposed_price">
          対応可能な金額（円） <span className="text-red-500">*</span>
        </Label>
        <Input
          id="proposed_price"
          type="number"
          placeholder="例: 3000"
          {...register('proposed_price', { valueAsNumber: true })}
        />
        {errors.proposed_price && (
          <p className="text-sm text-red-600">{errors.proposed_price.message}</p>
        )}
      </div>

      {/* Proposed Datetime (for 授業/相談) */}
      {(requestFormat === '授業' || requestFormat === '相談') && (
        <div className="space-y-2">
          <Label htmlFor="proposed_datetime">対応可能日時</Label>
          <Input
            id="proposed_datetime"
            type="datetime-local"
            {...register('proposed_datetime')}
          />
          <p className="text-xs text-gray-500">
            依頼者の希望日時に対応できる場合は、その日時を入力してください
          </p>
        </div>
      )}

      {/* Appeal Message */}
      <div className="space-y-2">
        <Label htmlFor="appeal_message">
          アピールメッセージ <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="appeal_message"
          placeholder="なぜこの依頼に適しているか、どのようにサポートできるかをアピールしてください"
          rows={6}
          {...register('appeal_message')}
        />
        {errors.appeal_message && (
          <p className="text-sm text-red-600">{errors.appeal_message.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '送信中...' : 'この依頼に提案する'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/tutor/requests')}
        >
          キャンセル
        </Button>
      </div>
    </form>
  )
}
