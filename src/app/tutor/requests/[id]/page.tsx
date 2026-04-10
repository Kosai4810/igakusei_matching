import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProposalForm } from './ProposalForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TutorRequestDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Check if tutor has profile
  const { data: profile } = await supabase
    .from('tutor_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get request
  const { data: request, error } = await supabase
    .from('requests')
    .select(`
      *,
      attachments:request_attachments(*)
    `)
    .eq('id', id)
    .eq('status', 'open')
    .single()

  if (error || !request) {
    notFound()
  }

  // Check if already proposed
  const { data: existingProposal } = await supabase
    .from('proposals')
    .select('*')
    .eq('request_id', id)
    .eq('tutor_user_id', user.id)
    .single()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">依頼詳細</h1>
        <Link href="/tutor/requests">
          <Button variant="outline">一覧に戻る</Button>
        </Link>
      </div>

      {/* Request Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{request.format}</Badge>
            <Badge variant="secondary">{request.category}</Badge>
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

          {(request.attachments as { file_name: string }[])?.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">添付ファイル</h3>
              <p className="text-sm text-gray-500">
                {(request.attachments as { file_name: string }[]).length}個のファイルが添付されています
                （マッチ後に閲覧可能）
              </p>
            </div>
          )}

          <div className="text-sm text-gray-500">
            投稿日: {new Date(request.created_at).toLocaleString('ja-JP')}
          </div>
        </CardContent>
      </Card>

      {/* Proposal Section */}
      {!profile ? (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <p className="text-orange-800 mb-4">
              提案するには、まずプロフィールを設定してください。
            </p>
            <Link href="/tutor/profile">
              <Button variant="outline">プロフィールを設定</Button>
            </Link>
          </CardContent>
        </Card>
      ) : existingProposal ? (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">提案済み</CardTitle>
            <CardDescription className="text-green-700">
              この依頼には既に提案を送っています
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-medium">提案金額:</span>{' '}
              ¥{existingProposal.proposed_price.toLocaleString()}
            </p>
            {existingProposal.proposed_datetime && (
              <p>
                <span className="font-medium">対応可能日時:</span>{' '}
                {new Date(existingProposal.proposed_datetime).toLocaleString('ja-JP')}
              </p>
            )}
            <p>
              <span className="font-medium">アピールメッセージ:</span>
            </p>
            <p className="text-gray-600">{existingProposal.appeal_message}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>この依頼に提案する</CardTitle>
            <CardDescription>
              依頼者に提案を送りましょう。選ばれるとマッチングが成立します。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProposalForm
              requestId={request.id}
              requestFormat={request.format}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
