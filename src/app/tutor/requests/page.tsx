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

  // Get open requests (新着順)
  const { data: requests } = await supabase
    .from('requests')
    .select(`
      *,
      proposals:proposals(tutor_user_id),
      student:users!requests_student_user_id_fkey(email)
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  // Get tutor's existing proposals
  const { data: myProposals } = await supabase
    .from('proposals')
    .select('request_id')
    .eq('tutor_user_id', user.id)

  const myProposalRequestIds = new Set(myProposals?.map((p) => p.request_id) || [])

  // 相対時間表示
  const getRelativeTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'たった今'
    if (diffMins < 60) return `${diffMins}分前`
    if (diffHours < 24) return `${diffHours}時間前`
    if (diffDays < 7) return `${diffDays}日前`
    return date.toLocaleDateString('ja-JP')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">募集中の依頼</h1>
          <p className="text-muted-foreground mt-1">新着順に表示されています</p>
        </div>
        {requests && (
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {requests.length}件
          </Badge>
        )}
      </div>

      {!profile && (
        <Card className="border-accent bg-accent/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/30 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-accent-foreground mb-2">
                  依頼に提案するには、まずプロフィールを設定してください
                </p>
                <Link href="/tutor/profile">
                  <Button size="sm" className="rounded-xl">プロフィールを設定</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {requests && requests.length > 0 ? (
        <div className="grid gap-4">
          {requests.map((request) => {
            const hasProposed = myProposalRequestIds.has(request.id)
            const proposalCount = (request.proposals as { tutor_user_id: string }[])?.length || 0

            return (
              <Card key={request.id} className="card-hover border-0 shadow-soft bg-white overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Tags */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <Badge className="bg-primary/10 text-primary border-0">
                            {request.format}
                          </Badge>
                          <Badge variant="secondary">
                            {request.category}
                          </Badge>
                          {hasProposed && (
                            <Badge className="bg-green-500/10 text-green-600 border-0">
                              提案済み
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground ml-auto">
                            {getRelativeTime(request.created_at)}
                          </span>
                        </div>

                        {/* Message */}
                        <p className="text-foreground line-clamp-2 mb-3 leading-relaxed">
                          {request.message}
                        </p>

                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {request.budget && (
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              ¥{request.budget.toLocaleString()}
                            </span>
                          )}
                          {request.preferred_datetime && (
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(request.preferred_datetime).toLocaleDateString('ja-JP')}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            {proposalCount}件の提案
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="shrink-0">
                        <Link href={`/tutor/requests/${request.id}`}>
                          <Button
                            size="sm"
                            variant={hasProposed ? 'outline' : 'default'}
                            className="rounded-xl"
                          >
                            {hasProposed ? '詳細を見る' : '提案する'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-0 shadow-soft">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-muted-foreground">現在募集中の依頼はありません</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
