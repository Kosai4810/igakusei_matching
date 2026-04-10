'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface AcceptProposalButtonProps {
  proposalId: string
  requestId: string
  tutorUserId: string
}

export function AcceptProposalButton({
  proposalId,
  requestId,
  tutorUserId,
}: AcceptProposalButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const supabase = createClient()

  const handleAccept = async () => {
    setIsLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Update proposal status to accepted
    const { error: proposalError } = await supabase
      .from('proposals')
      .update({ status: 'accepted' })
      .eq('id', proposalId)

    if (proposalError) {
      toast.error('エラーが発生しました')
      setIsLoading(false)
      return
    }

    // Update other proposals to rejected
    await supabase
      .from('proposals')
      .update({ status: 'rejected' })
      .eq('request_id', requestId)
      .neq('id', proposalId)

    // Update request status and selected proposal
    const { error: requestError } = await supabase
      .from('requests')
      .update({
        status: 'matched',
        selected_proposal_id: proposalId,
      })
      .eq('id', requestId)

    if (requestError) {
      toast.error('エラーが発生しました')
      setIsLoading(false)
      return
    }

    // Create match
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .insert({
        request_id: requestId,
        proposal_id: proposalId,
        student_user_id: user.id,
        tutor_user_id: tutorUserId,
        status: 'active',
      })
      .select()
      .single()

    if (matchError) {
      toast.error('マッチの作成に失敗しました')
      setIsLoading(false)
      return
    }

    toast.success('講師を選択しました')
    router.push(`/student/matches/${match.id}`)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button disabled={isLoading}>{isLoading ? '処理中...' : 'この講師を選ぶ'}</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>この講師を選択しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            この講師を選択すると、他の提案は自動的に不採用となります。
            選択後は講師とのやり取りを開始できます。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleAccept} disabled={isLoading}>
            選択する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
