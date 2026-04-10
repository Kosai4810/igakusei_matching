'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { tutorProfileSchema, type TutorProfileInput } from '@/lib/validations/profile'
import { TUTOR_GRADES, GENDERS, SUBJECTS, FORMATS, DAYS, TIME_SLOTS } from '@/lib/constants'
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
import { toast } from 'sonner'

export default function TutorProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [verification, setVerification] = useState<{
    academic_email_verified: boolean
    student_id_card_verified: boolean
  } | null>(null)
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
    const fetchProfile = async () => {
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
      }

      setIsFetching(false)
    }

    fetchProfile()
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
    router.push('/tutor/dashboard')
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
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-gray-500">読み込み中...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle>認証状況</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>学番メール認証</span>
            {verification?.academic_email_verified ? (
              <Badge className="bg-green-500">認証済み</Badge>
            ) : (
              <Badge variant="secondary">未認証</Badge>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span>学生証確認</span>
            {verification?.student_id_card_verified ? (
              <Badge className="bg-green-500">確認済み</Badge>
            ) : (
              <Badge variant="secondary">未提出</Badge>
            )}
          </div>
          {!verification?.student_id_card_verified && (
            <p className="text-sm text-gray-500">
              学生証を提出すると「学生証確認済み」バッジが付与され、
              受験生からの信頼度が上がります。
              （学生証の提出機能は現在準備中です）
            </p>
          )}
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
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
                ニックネーム <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nickname"
                placeholder="表示名を入力"
                {...register('nickname')}
              />
              {errors.nickname && (
                <p className="text-sm text-red-600">{errors.nickname.message}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">性別</Label>
              <Select
                onValueChange={(value) => setValue('gender', value as typeof GENDERS[number])}
                defaultValue={watch('gender')}
              >
                <SelectTrigger>
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
                大学名 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="university_name"
                placeholder="例: 東京大学"
                {...register('university_name')}
              />
              {errors.university_name && (
                <p className="text-sm text-red-600">{errors.university_name.message}</p>
              )}
            </div>

            {/* Grade */}
            <div className="space-y-2">
              <Label htmlFor="grade">
                学年 <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue('grade', value as typeof TUTOR_GRADES[number])}
                defaultValue={watch('grade')}
              >
                <SelectTrigger>
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
                <p className="text-sm text-red-600">{errors.grade.message}</p>
              )}
            </div>

            {/* Available Subjects */}
            <div className="space-y-2">
              <Label>
                対応科目 <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {SUBJECTS.map((subject) => (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subject-${subject}`}
                      checked={availableSubjects.includes(subject)}
                      onCheckedChange={() =>
                        toggleArrayValue('available_subjects', subject, availableSubjects)
                      }
                    />
                    <label
                      htmlFor={`subject-${subject}`}
                      className="text-sm cursor-pointer"
                    >
                      {subject}
                    </label>
                  </div>
                ))}
              </div>
              {errors.available_subjects && (
                <p className="text-sm text-red-600">{errors.available_subjects.message}</p>
              )}
            </div>

            {/* Available Formats */}
            <div className="space-y-2">
              <Label>
                対応形式 <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-4">
                {FORMATS.map((format) => (
                  <div key={format} className="flex items-center space-x-2">
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
                <p className="text-sm text-red-600">{errors.available_formats.message}</p>
              )}
            </div>

            {/* Available Days */}
            <div className="space-y-2">
              <Label>対応可能曜日</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
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
                  <div key={slot} className="flex items-center space-x-2">
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
                {...register('self_pr')}
              />
              <div className="text-sm text-gray-500 space-y-1">
                <p>以下のような内容を書くと、受験生に選ばれやすくなります:</p>
                <ul className="list-disc list-inside text-xs">
                  <li>指導経験</li>
                  <li>得意科目とその理由</li>
                  <li>医学部受験で力を入れた科目</li>
                  <li>面接・推薦の経験</li>
                  <li>どんな受験生に向いているか</li>
                </ul>
              </div>
              {errors.self_pr && (
                <p className="text-sm text-red-600">{errors.self_pr.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '保存中...' : '保存する'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/tutor/dashboard')}
              >
                キャンセル
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
