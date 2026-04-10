import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { REQUEST_STATUS } from '@/lib/constants'

export default async function StudentDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Check if profile exists
  const { data: profile } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get recent requests
  const { data: requests } = await supabase
    .from('requests')
    .select(`
      *,
      proposals:proposals(count)
    `)
    .eq('student_user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get active matches
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      tutor:tutor_profiles!matches_tutor_user_id_fkey(nickname, university_name),
      request:requests(format, category)
    `)
    .eq('student_user_id', user.id)
    .eq('status', 'active')
    .order('matched_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        <Link href="/student/requests/new">
          <Button>新しい依頼を作成</Button>
        </Link>
      </div>

      {!profile && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">プロフィールを設定してください</CardTitle>
            <CardDescription className="text-orange-700">
              依頼を作成する前に、プロフィールを設定すると講師からの提案を受けやすくなります。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/student/profile">
              <Button variant="outline">プロフィールを設定</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle>最近の依頼</CardTitle>
            <CardDescription>あなたが作成した依頼</CardDescription>
          </CardHeader>
          <CardContent>
            {requests && requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request) => (
                  <Link
                    key={request.id}
                    href={`/student/requests/${request.id}`}
                    className="block p-4 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
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
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {request.message}
                    </p>
                    {request.status === 'open' && (
                      <p className="text-sm text-blue-600 mt-2">
                        {(request.proposals as { count: number }[])?.[0]?.count || 0}件の提案
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>まだ依頼がありません</p>
                <Link href="/student/requests/new" className="text-blue-600 hover:underline">
                  依頼を作成する
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Matches */}
        <Card>
          <CardHeader>
            <CardTitle>進行中のマッチ</CardTitle>
            <CardDescription>現在やり取り中の講師</CardDescription>
          </CardHeader>
          <CardContent>
            {matches && matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match) => (
                  <Link
                    key={match.id}
                    href={`/student/matches/${match.id}`}
                    className="block p-4 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {(match.tutor as { nickname: string })?.nickname || '講師'}
                      </span>
                      <Badge variant="outline">
                        {(match.request as { format: string })?.format}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {(match.tutor as { university_name: string })?.university_name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(match.request as { category: string })?.category}
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
