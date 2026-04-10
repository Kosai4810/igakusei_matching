import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function TutorRequestsPage() {
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

  // Get open requests
  const { data: requests } = await supabase
    .from('requests')
    .select(`
      *,
      proposals:proposals(tutor_user_id)
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  // Get tutor's existing proposals
  const { data: myProposals } = await supabase
    .from('proposals')
    .select('request_id')
    .eq('tutor_user_id', user.id)

  const myProposalRequestIds = new Set(myProposals?.map((p) => p.request_id) || [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">依頼を探す</h1>
      </div>

      {!profile && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <p className="text-orange-800 mb-4">
              依頼に提案するには、まずプロフィールを設定してください。
            </p>
            <Link href="/tutor/profile">
              <Button variant="outline">プロフィールを設定</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {requests && requests.length > 0 ? (
        <div className="grid gap-4">
          {requests.map((request) => {
            const hasProposed = myProposalRequestIds.has(request.id)
            const proposalCount = (request.proposals as { tutor_user_id: string }[])?.length || 0

            return (
              <Link
                key={request.id}
                href={`/tutor/requests/${request.id}`}
                className="block"
              >
                <Card className="hover:bg-gray-50 transition">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{request.format}</Badge>
                          <Badge variant="secondary">{request.category}</Badge>
                          {hasProposed && (
                            <Badge className="bg-green-500">提案済み</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 line-clamp-2">
                          {request.message}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {request.budget && (
                            <span>予算: ¥{request.budget.toLocaleString()}</span>
                          )}
                          {request.preferred_datetime && (
                            <span>
                              希望日時: {new Date(request.preferred_datetime).toLocaleDateString('ja-JP')}
                            </span>
                          )}
                          <span>
                            {new Date(request.created_at).toLocaleDateString('ja-JP')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm text-gray-500">{proposalCount}件の提案</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            現在募集中の依頼はありません
          </CardContent>
        </Card>
      )}
    </div>
  )
}
