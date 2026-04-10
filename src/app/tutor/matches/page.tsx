import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MATCH_STATUS } from '@/lib/constants'

export default async function TutorMatchesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      request:requests(format, category, message)
    `)
    .eq('tutor_user_id', user.id)
    .order('matched_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">マッチ一覧</h1>

      {matches && matches.length > 0 ? (
        <div className="grid gap-4">
          {matches.map((match) => {
            const request = match.request as {
              format: string
              category: string
              message: string
            }

            return (
              <Link
                key={match.id}
                href={`/tutor/matches/${match.id}`}
                className="block"
              >
                <Card className="hover:bg-gray-50 transition">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{request?.format}</Badge>
                          <Badge variant="secondary">{request?.category}</Badge>
                          <Badge
                            variant={
                              match.status === 'active'
                                ? 'default'
                                : match.status === 'completed'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {MATCH_STATUS[match.status as keyof typeof MATCH_STATUS]}
                          </Badge>
                        </div>
                        <p className="text-gray-600 line-clamp-2">
                          {request?.message}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(match.matched_at).toLocaleDateString('ja-JP')} マッチ
                        </p>
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
            <p className="mb-4">まだマッチがありません</p>
            <Link href="/tutor/requests" className="text-blue-600 hover:underline">
              依頼を探す
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
