import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PROPOSAL_STATUS } from '@/lib/constants'

export default async function TutorProposalsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: proposals } = await supabase
    .from('proposals')
    .select(`
      *,
      request:requests(id, format, category, message, status)
    `)
    .eq('tutor_user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">提案一覧</h1>

      {proposals && proposals.length > 0 ? (
        <div className="grid gap-4">
          {proposals.map((proposal) => {
            const request = proposal.request as {
              id: string
              format: string
              category: string
              message: string
              status: string
            }

            return (
              <Card key={proposal.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{request?.format}</Badge>
                        <Badge variant="secondary">{request?.category}</Badge>
                        <Badge
                          variant={
                            proposal.status === 'accepted'
                              ? 'default'
                              : proposal.status === 'rejected'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {PROPOSAL_STATUS[proposal.status as keyof typeof PROPOSAL_STATUS]}
                        </Badge>
                      </div>
                      <p className="text-gray-600 line-clamp-2">
                        {request?.message}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium">
                          提案金額: ¥{proposal.proposed_price.toLocaleString()}
                        </span>
                        <span className="text-gray-500">
                          {new Date(proposal.created_at).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                    </div>
                    {proposal.status === 'accepted' && (
                      <Link href={`/tutor/matches`}>
                        <Badge className="bg-green-500 cursor-pointer">
                          マッチ詳細へ
                        </Badge>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            <p className="mb-4">まだ提案がありません</p>
            <Link href="/tutor/requests" className="text-blue-600 hover:underline">
              依頼を探す
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
