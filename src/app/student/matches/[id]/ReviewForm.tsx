'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface ReviewFormProps {
  matchId: string
  tutorUserId: string
}

export function ReviewForm({ matchId, tutorUserId }: ReviewFormProps) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('評価を選択してください')
      return
    }

    setIsLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('ログインしてください')
      setIsLoading(false)
      return
    }

    const { error } = await supabase.from('reviews').insert({
      match_id: matchId,
      student_user_id: user.id,
      tutor_user_id: tutorUserId,
      rating,
      comment: comment.trim() || null,
    })

    if (error) {
      if (error.code === '23505') {
        toast.error('既にレビューを投稿しています')
      } else {
        toast.error('レビューの投稿に失敗しました')
      }
      setIsLoading(false)
      return
    }

    // Update match status to completed
    await supabase
      .from('matches')
      .update({ status: 'completed' })
      .eq('id', matchId)

    toast.success('レビューを投稿しました')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>評価 <span className="text-red-500">*</span></Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-3xl focus:outline-none"
            >
              <span
                className={
                  (hoverRating || rating) >= star
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">コメント（任意）</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="講師の指導についてコメントを残してください"
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isLoading || rating === 0}>
        {isLoading ? '投稿中...' : 'レビューを投稿'}
      </Button>
    </form>
  )
}
