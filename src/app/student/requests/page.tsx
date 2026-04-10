import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { REQUEST_STATUS } from '@/lib/constants'

export default async function StudentRequestsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: requests } = await supabase
    .from('requests')
    .select(`
      *,
      proposals:proposals(count)
    `)
    .eq('student_user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">依頼一覧</h1>
        <Link href="/student/requests/new">
          <Button>新しい依頼を作成</Button>
        </Link>
      </div>

      {requests && requests.length > 0 ? (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Link
              key={request.id}
              href={`/student/requests/${request.id}`}
              className="block"
            >
              <Card className="hover:bg-gray-50 transition">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{request.format}</Badge>
                        <Badge variant="secondary">{request.category}</Badge>
                        <Badge
                          variant={request.status === 'open' ? 'default' : 'secondary'}
                        >
                          {REQUEST_STATUS[request.status as keyof typeof REQUEST_STATUS]}
                        </Badge>
                      </div>
                      <p className="text-gray-600 line-clamp-2">
                        {request.message}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {request.budget && (
                          <span>予算: ¥{request.budget.toLocaleString()}</span>
                        )}
                        <span>
                          {new Date(request.created_at).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                    </div>
                    {request.status === 'open' && (
                      <div className="text-right">
                        <p className="text-lg font-semibold text-blue-600">
                          {(request.proposals as { count: number }[])?.[0]?.count || 0}
                        </p>
                        <p className="text-sm text-gray-500">件の提案</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500 mb-4">まだ依頼がありません</p>
            <Link href="/student/requests/new">
              <Button>依頼を作成する</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
