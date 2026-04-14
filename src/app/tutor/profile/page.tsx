'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { tutorProfileSchema, type TutorProfileInput } from '@/lib/validations/profile'
import { TUTOR_GRADES, GENDERS, SUBJECTS, FORMATS, DAYS, TIME_SLOTS, MATCH_STATUS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

interface Review {
  id: string
  rating: number
  comment: string | null
  created_at: string
  match: {
    request: {
      format: string
      category: string
    }
  }
}

interface MatchHistory {
  id: string
  status: string
  matched_at: string
  completed_at: string | null
  request: {
    format: string
    category: string
    message: string
  }
  proposal: {
    proposed_price: number
  }
}

export default function TutorProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [verification, setVerification] = useState<{
    academic_email_verified: boolean
    student_id_card_verified: boolean
  } | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [matchHistory, setMatchHistory] = useState<MatchHistory[]>([])
  const [stats, setStats] = useState({
    totalMatches: 0,
    completedMatches: 0,
    averageRating: 0,
    reviewCount: 0,
  })
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TutorProfileInput>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      available_subjects: [],
      available_formats: [],
      available_days: [],
      available_time_slots: [],
    },
  })

  const availableSubjects = watch('available_subjects') || []
  const availableFormats = watch('available_formats') || []
  const availableDays = watch('available_days') || []
  const availableTimeSlots = watch('available_time_slots') || []

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Fetch verification status
      const { data: verificationData } = await supabase
        .from('tutor_verifications')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setVerification(verificationData)

      // Fetch profile
      const { data: profile } = await supabase
        .from('tutor_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profile) {
        setValue('nickname', profile.nickname)
        if (profile.gender) setValue('gender', profile.gender as typeof GENDERS[number])
        setValue('university_name', profile.university_name)
        setValue('grade', profile.grade as typeof TUTOR_GRADES[number])
        setValue('available_subjects', (profile.available_subjects || []) as typeof SUBJECTS[number][])
        setValue('available_formats', (profile.available_formats || []) as typeof FORMATS[number][])
        setValue('available_days', (profile.available_days || []) as typeof DAYS[number][])
        setValue('available_time_slots', (profile.available_time_slots || []) as typeof TIME_SLOTS[number][])
        setValue('specialties', profile.specialties || '')
        setValue('self_pr', profile.self_pr || '')

        setStats({
          totalMatches: 0,
          completedMatches: 0,
          averageRating: profile.average_rating || 0,
          reviewCount: profile.review_count || 0,
        })
      }

      // Fetch reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          *,
          match:matches(
            request:requests(format, category)
          )
        `)
        .eq('tutor_user_id', user.id)
        .order('created_at', { ascending: false })

      if (reviewsData) {
        setReviews(reviewsData as unknown as Review[])
      }

      // Fetch match history
      const { data: matchesData } = await supabase
        .from('matches')
        .select(`
          *,
          request:requests(format, category, message),
          proposal:proposals(proposed_price)
        `)
        .eq('tutor_user_id', user.id)
        .order('matched_at', { ascending: false })
        .limit(20)

      if (matchesData) {
        setMatchHistory(matchesData as unknown as MatchHistory[])
        setStats(prev => ({
          ...prev,
          totalMatches: matchesData.length,
          completedMatches: matchesData.filter(m => m.status === 'completed').length,
        }))
      }

      setIsFetching(false)
    }

    fetchData()
  }, [supabase, router, setValue])

  const onSubmit = async (data: TutorProfileInput) => {
    setIsLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('tutor_profiles')
      .upsert({
        user_id: user.id,
        ...data,
      })

    if (error) {
      toast.error('プロフィールの保存に失敗しました')
      setIsLoading(false)
      return
    }

    toast.success('プロフィールを保存しました')
    setIsLoading(false)
  }

  const toggleArrayValue = (
    field: keyof TutorProfileInput,
    value: string,
    currentValues: string[]
  ) => {
    if (currentValues.includes(value)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue(field, currentValues.filter((v) => v !== value) as any)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue(field, [...currentValues, value] as any)
    }
  }

  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-soft">
          <CardContent className="py-16">
            <div className="text-center text-muted-foreground">読み込み中...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-soft bg-white">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats.averageRating.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">平均評価</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft bg-white">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats.reviewCount}</p>
            <p className="text-sm text-muted-foreground">レビュー数</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft bg-white">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats.completedMatches}</p>
            <p className="text-sm text-muted-foreground">完了した指導</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft bg-white">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats.totalMatches}</p>
            <p className="text-sm text-muted-foreground">総マッチ数</p>
          </CardContent>
        </Card>
      </div>

      {/* Verification Status */}
      <Card className="border-0 shadow-soft bg-white">
        <CardHeader>
          <CardTitle className="text-lg">認証状況</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium">学番メール認証</span>
            </div>
            {verification?.academic_email_verified ? (
              <Badge className="bg-green-500/10 text-green-600 border-0">認証済み</Badge>
            ) : (
              <Badge variant="secondary">未認証</Badge>
            )}
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <span className="font-medium">学生証確認</span>
            </div>
            {verification?.student_id_card_verified ? (
              <Badge className="bg-green-500/10 text-green-600 border-0">確認済み</Badge>
            ) : (
              <Badge variant="secondary">未提出</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white shadow-soft border-0 p-1 rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
            プロフィール編集
          </TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
            レビュー ({reviews.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
            指導履歴 ({matchHistory.length})
          </TabsTrigger>
        </TabsList>

        {/* Profile Edit Tab */}
        <TabsContent value="profile">
          <Card className="border-0 shadow-soft bg-white">
            <CardHeader>
              <CardTitle>プロフィール編集</CardTitle>
              <CardDescription>
                プロフィールを充実させると、受験生からの依頼に選ばれやすくなります
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Nickname */}
                <div className="space-y-2">
                  <Label htmlFor="nickname">
                    ニックネーム <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nickname"
                    placeholder="表示名を入力"
                    className="rounded-xl"
                    {...register('nickname')}
                  />
                  {errors.nickname && (
                    <p className="text-sm text-destructive">{errors.nickname.message}</p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender">性別</Label>
                  <Select
                    onValueChange={(value) => setValue('gender', value as typeof GENDERS[number])}
                    defaultValue={watch('gender')}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* University */}
                <div className="space-y-2">
                  <Label htmlFor="university_name">
                    大学名 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="university_name"
                    placeholder="例: 東京大学"
                    className="rounded-xl"
                    {...register('university_name')}
                  />
                  {errors.university_name && (
                    <p className="text-sm text-destructive">{errors.university_name.message}</p>
                  )}
                </div>

                {/* Grade */}
                <div className="space-y-2">
                  <Label htmlFor="grade">
                    学年 <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) => setValue('grade', value as typeof TUTOR_GRADES[number])}
                    defaultValue={watch('grade')}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="学年を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {TUTOR_GRADES.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.grade && (
                    <p className="text-sm text-destructive">{errors.grade.message}</p>
                  )}
                </div>

                {/* Available Subjects */}
                <div className="space-y-2">
                  <Label>
                    対応科目 <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {SUBJECTS.map((subject) => (
                      <div key={subject} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50">
                        <Checkbox
                          id={`subject-${subject}`}
                          checked={availableSubjects.includes(subject)}
                          onCheckedChange={() =>
                            toggleArrayValue('available_subjects', subject, availableSubjects)
                          }
                        />
                        <label
                          htmlFor={`subject-${subject}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {subject}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.available_subjects && (
                    <p className="text-sm text-destructive">{errors.available_subjects.message}</p>
                  )}
                </div>

                {/* Available Formats */}
                <div className="space-y-2">
                  <Label>
                    対応形式 <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-4">
                    {FORMATS.map((format) => (
                      <div key={format} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50">
                        <Checkbox
                          id={`format-${format}`}
                          checked={availableFormats.includes(format)}
                          onCheckedChange={() =>
                            toggleArrayValue('available_formats', format, availableFormats)
                          }
                        />
                        <label
                          htmlFor={`format-${format}`}
                          className="text-sm cursor-pointer"
                        >
                          {format}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.available_formats && (
                    <p className="text-sm text-destructive">{errors.available_formats.message}</p>
                  )}
                </div>

                {/* Available Days */}
                <div className="space-y-2">
                  <Label>対応可能曜日</Label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => (
                      <div key={day} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50">
                        <Checkbox
                          id={`day-${day}`}
                          checked={availableDays.includes(day)}
                          onCheckedChange={() =>
                            toggleArrayValue('available_days', day, availableDays)
                          }
                        />
                        <label
                          htmlFor={`day-${day}`}
                          className="text-sm cursor-pointer"
                        >
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Time Slots */}
                <div className="space-y-2">
                  <Label>対応可能時間帯</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <div key={slot} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50">
                        <Checkbox
                          id={`slot-${slot}`}
                          checked={availableTimeSlots.includes(slot)}
                          onCheckedChange={() =>
                            toggleArrayValue('available_time_slots', slot, availableTimeSlots)
                          }
                        />
                        <label
                          htmlFor={`slot-${slot}`}
                          className="text-sm cursor-pointer"
                        >
                          {slot}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialties */}
                <div className="space-y-2">
                  <Label htmlFor="specialties">得意分野</Label>
                  <Input
                    id="specialties"
                    placeholder="例: 数学III、英語長文"
                    className="rounded-xl"
                    {...register('specialties')}
                  />
                </div>

                {/* Self PR */}
                <div className="space-y-2">
                  <Label htmlFor="self_pr">自己PR</Label>
                  <Textarea
                    id="self_pr"
                    placeholder="自己PRを入力してください"
                    rows={6}
                    className="rounded-xl"
                    {...register('self_pr')}
                  />
                  {errors.self_pr && (
                    <p className="text-sm text-destructive">{errors.self_pr.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading} className="rounded-xl">
                  {isLoading ? '保存中...' : '保存する'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card className="border-0 shadow-soft bg-white">
            <CardHeader>
              <CardTitle>受け取ったレビュー</CardTitle>
              <CardDescription>
                受験生からのフィードバック
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-xl bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500 text-lg">
                            {'★'.repeat(review.rating)}
                            {'☆'.repeat(5 - review.rating)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({review.rating}/5)
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      {review.match?.request && (
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {review.match.request.format}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {review.match.request.category}
                          </Badge>
                        </div>
                      )}
                      {review.comment && (
                        <p className="text-sm text-foreground">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  まだレビューがありません
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="border-0 shadow-soft bg-white">
            <CardHeader>
              <CardTitle>指導履歴</CardTitle>
              <CardDescription>
                過去のマッチング履歴
              </CardDescription>
            </CardHeader>
            <CardContent>
              {matchHistory.length > 0 ? (
                <div className="space-y-4">
                  {matchHistory.map((match) => (
                    <div key={match.id} className="p-4 rounded-xl bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary/10 text-primary border-0">
                            {match.request?.format}
                          </Badge>
                          <Badge variant="secondary">
                            {match.request?.category}
                          </Badge>
                          <Badge
                            className={
                              match.status === 'completed'
                                ? 'bg-green-500/10 text-green-600 border-0'
                                : match.status === 'active'
                                ? 'bg-blue-500/10 text-blue-600 border-0'
                                : 'bg-gray-500/10 text-gray-600 border-0'
                            }
                          >
                            {MATCH_STATUS[match.status as keyof typeof MATCH_STATUS]}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(match.matched_at).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-2 mb-2">
                        {match.request?.message}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        金額: ¥{match.proposal?.proposed_price?.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  まだ指導履歴がありません
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
