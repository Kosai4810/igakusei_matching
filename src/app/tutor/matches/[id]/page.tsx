import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MATCH_STATUS } from '@/lib/constants'
import { MessageList } from '@/app/student/matches/[id]/MessageList'
import { MessageForm } from '@/app/student/matches/[id]/MessageForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TutorMatchDetailPage({ params }: PageProps) {
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
      request:requests(*, attachments:request_attachments(*)),
      proposal:proposals(*)
    `)
    .eq('id', id)
    .eq('tutor_user_id', user.id)
    .single()

  if (error || !match) {
    notFound()
  }

  // Check if review exists
  const { data: review } = await supabase
    .from('reviews')
    .select('*')
    .eq('match_id', id)
    .single()

  const request = match.request as {
    format: string
    category: string
    message: string
    budget: number | null
    preferred_datetime: string | null
    attachments: { file_name: string; file_path: string }[]
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
        <Link href="/tutor/matches">
          <Button variant="outline">一覧へ戻る</Button>
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

      {/* Review if exists */}
      {review && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">レビューが投稿されました</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-500 text-lg">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </span>
              <span className="text-gray-600">({review.rating}/5)</span>
            </div>
            {review.comment && (
              <p className="text-gray-600">{review.comment}</p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Request Details */}
        <Card>
          <CardHeader>
            <CardTitle>依頼内容</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{request.format}</Badge>
              <Badge variant="secondary">{request.category}</Badge>
            </div>
            <p className="text-gray-600 whitespace-pre-wrap">
              {request.message}
            </p>
            {request.budget && (
              <p>
                <span className="font-medium">予算目安:</span>{' '}
                ¥{request.budget.toLocaleString()}
              </p>
            )}
            {request.preferred_datetime && (
              <p>
                <span className="font-medium">希望日時:</span>{' '}
                {new Date(request.preferred_datetime).toLocaleString('ja-JP')}
              </p>
            )}

            {/* Attachments */}
            {request.attachments?.length > 0 && (
              <div>
                <p className="font-medium mb-2">添付ファイル</p>
                <ul className="space-y-1">
                  {request.attachments.map((attachment, index) => (
                    <li key={index} className="text-sm text-blue-600">
                      {attachment.file_name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Proposal Details */}
        <Card>
          <CardHeader>
            <CardTitle>あなたの提案</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <span className="font-medium">合意金額:</span>{' '}
              ¥{proposal.proposed_price.toLocaleString()}
            </p>
            {proposal.proposed_datetime && (
              <p>
                <span className="font-medium">対応日時:</span>{' '}
                {new Date(proposal.proposed_datetime).toLocaleString('ja-JP')}
              </p>
            )}
            <div>
              <p className="font-medium mb-1">アピールメッセージ</p>
              <p className="text-gray-600 text-sm">{proposal.appeal_message}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle>メッセージ</CardTitle>
          <CardDescription>
            受験生とやり取りができます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MessageList matchId={id} currentUserId={user.id} />
          <Separator className="my-4" />
          <MessageForm matchId={id} />
        </CardContent>
      </Card>
    </div>
  )
}
