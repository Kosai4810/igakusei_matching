'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface InlineChatProps {
  matchId: string
  currentUserId: string
  latestMessage?: {
    content: string
    created_at: string
    sender_user_id: string
  }
}

export function InlineChat({ matchId, currentUserId, latestMessage }: InlineChatProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const supabase = createClient()

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isSending) return

    setIsSending(true)
    const { error } = await supabase
      .from('messages')
      .insert({
        match_id: matchId,
        sender_user_id: currentUserId,
        content: message.trim(),
      })

    if (error) {
      toast.error('メッセージの送信に失敗しました')
    } else {
      setMessage('')
      toast.success('送信しました')
    }
    setIsSending(false)
  }

  const isMyMessage = latestMessage?.sender_user_id === currentUserId

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
    <div className="p-4 bg-muted/30">
      {/* Latest Message Preview */}
      {latestMessage && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium ${isMyMessage ? 'text-primary' : 'text-muted-foreground'}`}>
              {isMyMessage ? 'あなた' : '受験生'}
            </span>
            <span className="text-xs text-muted-foreground">
              {getRelativeTime(latestMessage.created_at)}
            </span>
          </div>
          <p className={`text-sm p-3 rounded-xl max-w-[80%] ${
            isMyMessage
              ? 'bg-primary/10 text-foreground ml-auto'
              : 'bg-white text-foreground shadow-sm'
          }`}>
            {latestMessage.content}
          </p>
        </div>
      )}

      {/* Quick Reply Form */}
      <form onSubmit={handleSend} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 rounded-xl bg-white border-border/50"
          disabled={isSending}
        />
        <Button
          type="submit"
          size="sm"
          className="rounded-xl px-4"
          disabled={!message.trim() || isSending}
        >
          {isSending ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </Button>
      </form>
    </div>
  )
}
