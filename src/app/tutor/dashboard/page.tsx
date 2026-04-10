import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PROPOSAL_STATUS, REQUEST_STATUS } from '@/lib/constants'

export default async function TutorDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Check if profile exists
  const { data: profile } = await supabase
    .from('tutor_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Check verification status
  const { data: verification } = await supabase
    .from('tutor_verifications')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get recent proposals
  const { data: proposals } = await supabase
    .from('proposals')
    .select(`
      *,
      request:requests(format, category, message, status)
    `)
    .eq('tutor_user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get active matches
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      request:requests(format, category)
    `)
    .eq('tutor_user_id', user.id)
    .eq('status', 'active')
    .order('matched_at', { ascending: false })
    .limit(5)

  // Get open requests count for this tutor's subjects
  const { count: openRequestsCount } = await supabase
    .from('requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'open')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        <Link href="/tutor/requests">
          <Button>依頼を探す</Button>
        </Link>
      </div>

      {!profile && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">プロフィールを設定してください</CardTitle>
            <CardDescription className="text-orange-700">
              プロフィールを設定すると、受験生からの依頼に提案できるようになります。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tutor/profile">
              <Button variant="outline">プロフィールを設定</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {profile && !verification?.student_id_card_verified && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">学生証を提出して認証バッジを取得</CardTitle>
            <CardDescription className="text-blue-700">
              学生証を提出すると「学生証確認済み」バッジが付与され、受験生からの信頼度が上がります。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tutor/profile">
              <Button variant="outline">学生証を提出する</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>募集中の依頼</CardDescription>
            <CardTitle className="text-3xl">{openRequestsCount || 0}件</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>あなたの評価</CardDescription>
            <CardTitle className="text-3xl">
              {profile?.average_rating
                ? `${profile.average_rating.toFixed(1)} / 5.0`
                : '-'}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>レビュー件数</CardDescription>
            <CardTitle className="text-3xl">{profile?.review_count || 0}件</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Proposals */}
        <Card>
          <CardHeader>
            <CardTitle>最近の提案</CardTitle>
            <CardDescription>あなたが送った提案</CardDescription>
          </CardHeader>
          <CardContent>
            {proposals && proposals.length > 0 ? (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {(proposal.request as { format: string })?.format}
                        </Badge>
                        <Badge variant="secondary">
                          {(proposal.request as { category: string })?.category}
                        </Badge>
                      </div>
                      <Badge
                        variant={proposal.status === 'accepted' ? 'default' : 'secondary'}
                      >
                        {PROPOSAL_STATUS[proposal.status as keyof typeof PROPOSAL_STATUS]}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">
                      提案金額: ¥{proposal.proposed_price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {proposal.appeal_message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>まだ提案がありません</p>
                <Link href="/tutor/requests" className="text-blue-600 hover:underline">
                  依頼を探す
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Matches */}
        <Card>
          <CardHeader>
            <CardTitle>進行中のマッチ</CardTitle>
            <CardDescription>現在やり取り中の受験生</CardDescription>
          </CardHeader>
          <CardContent>
            {matches && matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match) => (
                  <Link
                    key={match.id}
                    href={`/tutor/matches/${match.id}`}
                    className="block p-4 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {(match.request as { format: string })?.format}
                        </Badge>
                        <Badge variant="secondary">
                          {(match.request as { category: string })?.category}
                        </Badge>
                      </div>
                      <Badge variant="default">進行中</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(match.matched_at).toLocaleDateString('ja-JP')} マッチ
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>進行中のマッチはありません</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
