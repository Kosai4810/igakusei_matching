import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MATCH_STATUS } from '@/lib/constants'
import { MessageList } from './MessageList'
import { MessageForm } from './MessageForm'
import { ReviewForm } from './ReviewForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function StudentMatchDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get match with related data
  const { data: match, error } = await supabase
    .from('matches')
    .select(`
      *,
      request:requests(*),
      proposal:proposals(*),
      tutor:tutor_profiles!matches_tutor_user_id_fkey(
        nickname,
        university_name,
        grade,
        average_rating,
        review_count,
        self_pr
      ),
      verification:tutor_verifications!matches_tutor_user_id_fkey(
        student_id_card_verified
      )
    `)
    .eq('id', id)
    .eq('student_user_id', user.id)
    .single()

  if (error || !match) {
    notFound()
  }

  // Check if review exists
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('*')
    .eq('match_id', id)
    .single()

  const tutor = match.tutor as {
    nickname: string
    university_name: string
    grade: string
    average_rating: number
    review_count: number
    self_pr: string | null
  }

  const verification = match.verification as {
    student_id_card_verified: boolean
  } | null

  const request = match.request as {
    format: string
    category: string
    message: string
    budget: number | null
    preferred_datetime: string | null
  }

  const proposal = match.proposal as {
    proposed_price: number
    proposed_datetime: string | null
    appeal_message: string
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">マッチ詳細</h1>
        <Link href="/student/dashboard">
          <Button variant="outline">ダッシュボードへ</Button>
        </Link>
      </div>

      {/* Match Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>マッチ情報</CardTitle>
            <Badge
              variant={match.status === 'active' ? 'default' : 'secondary'}
            >
              {MATCH_STATUS[match.status as keyof typeof MATCH_STATUS]}
            </Badge>
          </div>
          <CardDescription>
            {new Date(match.matched_at).toLocaleString('ja-JP')} にマッチ
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Tutor Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              講師情報
              {verification?.student_id_card_verified && (
                <Badge className="bg-green-500">学生証確認済み</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-lg font-medium">{tutor.nickname}</p>
              <p className="text-gray-600">
                {tutor.university_name} {tutor.grade}
              </p>
            </div>
            {tutor.average_rating > 0 && (
              <p className="text-sm text-gray-600">
                評価: {tutor.average_rating.toFixed(1)} ({tutor.review_count}件)
              </p>
            )}
            {tutor.self_pr && (
              <div>
                <p className="text-sm font-medium mb-1">自己PR</p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {tutor.self_pr}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Request & Proposal Info */}
        <Card>
          <CardHeader>
            <CardTitle>依頼・提案内容</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{request.format}</Badge>
                <Badge variant="secondary">{request.category}</Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                {request.message}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <p>
                <span className="font-medium">合意金額:</span>{' '}
                ¥{proposal.proposed_price.toLocaleString()}
              </p>
              {proposal.proposed_datetime && (
                <p>
                  <span className="font-medium">日時:</span>{' '}
                  {new Date(proposal.proposed_datetime).toLocaleString('ja-JP')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle>メッセージ</CardTitle>
          <CardDescription>
            講師とやり取りができます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MessageList matchId={id} currentUserId={user.id} />
          <Separator className="my-4" />
          <MessageForm matchId={id} />
        </CardContent>
      </Card>

      {/* Review */}
      {match.status === 'active' && !existingReview && (
        <Card>
          <CardHeader>
            <CardTitle>レビューを投稿</CardTitle>
            <CardDescription>
              指導が完了したら、講師のレビューを投稿してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReviewForm
              matchId={id}
              tutorUserId={match.tutor_user_id}
            />
          </CardContent>
        </Card>
      )}

      {existingReview && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">レビュー投稿済み</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-500 text-lg">
                {'★'.repeat(existingReview.rating)}
                {'☆'.repeat(5 - existingReview.rating)}
              </span>
              <span className="text-gray-600">({existingReview.rating}/5)</span>
            </div>
            {existingReview.comment && (
              <p className="text-gray-600">{existingReview.comment}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
