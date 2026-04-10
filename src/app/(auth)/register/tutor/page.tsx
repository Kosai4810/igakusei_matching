'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { tutorRegisterSchema, type TutorRegisterInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TutorRegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TutorRegisterInput>({
    resolver: zodResolver(tutorRegisterSchema),
  })

  const onSubmit = async (data: TutorRegisterInput) => {
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?role=tutor`,
      },
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('このメールアドレスは既に登録されています')
      } else {
        setError('登録に失敗しました。もう一度お試しください。')
      }
      setIsLoading(false)
      return
    }

    if (authData.user) {
      // Create user record
      const { error: userError } = await supabase.from('users').insert({
        id: authData.user.id,
        email: data.email,
        role: 'tutor',
      })

      if (userError) {
        console.error('User creation error:', userError)
      }

      // Create tutor verification record
      const { error: verificationError } = await supabase.from('tutor_verifications').insert({
        user_id: authData.user.id,
        academic_email_verified: false,
      })

      if (verificationError) {
        console.error('Verification creation error:', verificationError)
      }
    }

    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">確認メールを送信しました</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              ご登録いただいた学番メールアドレスに確認メールを送信しました。
              メール内のリンクをクリックして、登録を完了してください。
            </p>
            <p className="text-sm text-gray-500 mb-4">
              ※ 学番メールでの認証が完了すると、講師としての活動を開始できます。
            </p>
            <Link href="/login">
              <Button variant="outline">ログインページへ</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">講師登録</CardTitle>
          <CardDescription>
            医学生として、受験生をサポートしましょう
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">講師登録の条件</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>・大学の学番メールアドレス（.ac.jp）が必要です</li>
              <li>・医学部在籍者のみご登録いただけます</li>
              <li>・学生証の提出で「認証済み」バッジが付与されます</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">学番メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="xxxxx@xxx.ac.jp"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
              <p className="text-xs text-gray-500">
                大学の学番メールアドレスを入力してください
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="8文字以上"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">パスワード（確認）</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '登録中...' : '登録する'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              既にアカウントをお持ちの方は{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                ログイン
              </Link>
            </p>
            <p className="mt-2">
              受験生として登録したい方は{' '}
              <Link href="/register/student" className="text-blue-600 hover:underline">
                受験生登録
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
