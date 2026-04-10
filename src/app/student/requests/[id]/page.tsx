import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { REQUEST_STATUS, PROPOSAL_STATUS } from '@/lib/constants'
import { AcceptProposalButton } from './AcceptProposalButton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function StudentRequestDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get request
  const { data: request, error } = await supabase
    .from('requests')
    .select(`
      *,
      attachments:request_attachments(*)
    `)
    .eq('id', id)
    .eq('student_user_id', user.id)
    .single()

  if (error || !request) {
    notFound()
  }

  // Get proposals with tutor info
  const { data: proposals } = await supabase
    .from('proposals')
    .select(`
      *,
      tutor:tutor_profiles!proposals_tutor_user_id_fkey(
        nickname,
        university_name,
        grade,
        average_rating,
        review_count,
        available_subjects
      ),
      verification:tutor_verifications!proposals_tutor_user_id_fkey(
        student_id_card_verified
      )
    `)
    .eq('request_id', id)
    .order('created_at', { ascending: false })

  // Check if there's a match
  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .eq('request_id', id)
    .single()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">依頼詳細</h1>
        <Link href="/student/requests">
          <Button variant="outline">一覧に戻る</Button>
        </Link>
      </div>

      {/* Request Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{request.format}</Badge>
              <Badge variant="secondary">{request.category}</Badge>
            </div>
            <Badge
              variant={request.status === 'open' ? 'default' : 'secondary'}
            >
              {REQUEST_STATUS[request.status as keyof typeof REQUEST_STATUS]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">依頼内容</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{request.message}</p>
          </div>

          {request.budget && (
            <div>
              <h3 className="font-medium mb-1">予算目安</h3>
              <p className="text-gray-600">¥{request.budget.toLocaleString()}</p>
            </div>
          )}

          {request.preferred_datetime && (
            <div>
              <h3 className="font-medium mb-1">希望日時</h3>
              <p className="text-gray-600">
                {new Date(request.preferred_datetime).toLocaleString('ja-JP')}
              </p>
            </div>
          )}

          {(request.attachments as { file_name: string; file_path: string }[])?.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">添付ファイル</h3>
              <ul className="space-y-1">
                {(request.attachments as { file_name: string; file_path: string }[]).map((attachment, index) => (
                  <li key={index} className="text-sm text-blue-600">
                    {attachment.file_name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-sm text-gray-500">
            作成日: {new Date(request.created_at).toLocaleString('ja-JP')}
          </div>
        </CardContent>
      </Card>

      {/* Match Info */}
      {match && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">マッチ済み</CardTitle>
            <CardDescription className="text-green-700">
              講師とマッチングが成立しました
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/student/matches/${match.id}`}>
              <Button>マッチ詳細を見る</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Proposals */}
      {request.status === 'open' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            提案一覧 ({proposals?.length || 0}件)
          </h2>

          {proposals && proposals.length > 0 ? (
            <div className="space-y-4">
              {proposals.map((proposal) => {
                const tutor = proposal.tutor as {
                  nickname: string
                  university_name: string
                  grade: string
                  average_rating: number
                  review_count: number
                  available_subjects: string[]
                } | null
                const verification = proposal.verification as {
                  student_id_card_verified: boolean
                } | null

                return (
                  <Card key={proposal.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          {/* Tutor Info */}
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-lg">
                              {tutor?.nickname || '講師'}
                            </span>
                            {verification?.student_id_card_verified && (
                              <Badge className="bg-green-500">学生証確認済み</Badge>
                            )}
                          </div>

                          <div className="text-sm text-gray-600 space-y-1">
                            <p>{tutor?.university_name} {tutor?.grade}</p>
                            {tutor?.average_rating !== undefined && tutor.average_rating > 0 && (
                              <p>
                                評価: {tutor.average_rating.toFixed(1)} ({tutor.review_count}件)
                              </p>
                            )}
                          </div>

                          <Separator />

                          {/* Proposal Details */}
                          <div>
                            <p className="text-lg font-semibold text-blue-600">
                              ¥{proposal.proposed_price.toLocaleString()}
                            </p>
                            {proposal.proposed_datetime && (
                              <p className="text-sm text-gray-600">
                                対応可能日時: {new Date(proposal.proposed_datetime).toLocaleString('ja-JP')}
                              </p>
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-1">アピールメッセージ</p>
                            <p className="text-gray-600 whitespace-pre-wrap">
                              {proposal.appeal_message}
                            </p>
                          </div>
                        </div>

                        <AcceptProposalButton
                          proposalId={proposal.id}
                          requestId={request.id}
                          tutorUserId={proposal.tutor_user_id}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                まだ提案がありません。講師からの提案をお待ちください。
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
