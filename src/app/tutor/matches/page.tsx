import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MATCH_STATUS } from '@/lib/constants'
import { InlineChat } from '@/components/tutor/InlineChat'

export default async function TutorMatchesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get active matches with latest message
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      request:requests(format, category, message, budget),
      proposal:proposals(proposed_price),
      messages:messages(content, created_at, sender_user_id)
    `)
    .eq('tutor_user_id', user.id)
    .eq('status', 'active')
    .order('matched_at', { ascending: false })

  // Get unread message counts
  const { data: unreadCounts } = await supabase
    .from('messages')
    .select('match_id')
    .neq('sender_user_id', user.id)
    .eq('is_read', false)

  const unreadByMatch = new Map<string, number>()
  unreadCounts?.forEach(msg => {
    const count = unreadByMatch.get(msg.match_id) || 0
    unreadByMatch.set(msg.match_id, count + 1)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">マッチング中の依頼</h1>
          <p className="text-muted-foreground mt-1">現在進行中のやり取り</p>
        </div>
        {matches && (
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {matches.length}件
          </Badge>
        )}
      </div>

      {matches && matches.length > 0 ? (
        <div className="grid gap-6">
          {matches.map((match) => {
            const request = match.request as {
              format: string
              category: string
              message: string
              budget: number | null
            }
            const proposal = match.proposal as {
              proposed_price: number
            }
            const messages = (match.messages as {
              content: string
              created_at: string
              sender_user_id: string
            }[]) || []
            const latestMessage = messages.sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0]
            const unreadCount = unreadByMatch.get(match.id) || 0

            return (
              <Card key={match.id} className="border-0 shadow-soft bg-white overflow-hidden">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="p-5 border-b border-border/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge className="bg-primary/10 text-primary border-0">
                            {request?.format}
                          </Badge>
                          <Badge variant="secondary">
                            {request?.category}
                          </Badge>
                          <Badge className="bg-green-500/10 text-green-600 border-0">
                            {MATCH_STATUS[match.status as keyof typeof MATCH_STATUS]}
                          </Badge>
                          {unreadCount > 0 && (
                            <Badge className="bg-destructive text-white">
                              {unreadCount}件の未読
                            </Badge>
                          )}
                        </div>
                        <p className="text-foreground line-clamp-2 mb-2">
                          {request?.message}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>合意金額: ¥{proposal?.proposed_price?.toLocaleString()}</span>
                          <span>
                            {new Date(match.matched_at).toLocaleDateString('ja-JP')} マッチ
                          </span>
                        </div>
                      </div>
                      <Link href={`/tutor/matches/${match.id}`}>
                        <Button size="sm" variant="outline" className="rounded-xl shrink-0">
                          詳細を見る
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Inline Chat Preview / Quick Reply */}
                  <InlineChat
                    matchId={match.id}
                    currentUserId={user.id}
                    latestMessage={latestMessage}
                  />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-muted-foreground mb-4">マッチング中の依頼はありません</p>
            <Link href="/tutor/requests">
              <Button variant="outline" className="rounded-xl">
                依頼を探す
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
