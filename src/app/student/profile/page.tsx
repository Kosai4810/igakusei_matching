'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { studentProfileSchema, type StudentProfileInput } from '@/lib/validations/profile'
import { STUDENT_GRADES, GENDERS, COURSE_TYPES, EXAM_TYPES, SCORE_BANDS, SUBJECTS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

export default function StudentProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentProfileInput>({
    resolver: zodResolver(studentProfileSchema),
  })

  const strongSubjects = watch('strong_subjects') || []
  const weakSubjects = watch('weak_subjects') || []

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profile) {
        setValue('grade', profile.grade as typeof STUDENT_GRADES[number])
        setValue('desired_school', profile.desired_school || '')
        setValue('high_school', profile.high_school || '')
        if (profile.gender) setValue('gender', profile.gender as typeof GENDERS[number])
        setValue('area', profile.area || '')
        if (profile.course_type) setValue('course_type', profile.course_type as typeof COURSE_TYPES[number])
        if (profile.exam_type) setValue('exam_type', profile.exam_type as typeof EXAM_TYPES[number])
        if (profile.score_band) setValue('score_band', profile.score_band as typeof SCORE_BANDS[number])
        setValue('strong_subjects', (profile.strong_subjects || []) as typeof SUBJECTS[number][])
        setValue('weak_subjects', (profile.weak_subjects || []) as typeof SUBJECTS[number][])
      }

      setIsFetching(false)
    }

    fetchProfile()
  }, [supabase, router, setValue])

  const onSubmit = async (data: StudentProfileInput) => {
    setIsLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('student_profiles')
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
    router.push('/student/dashboard')
  }

  const toggleSubject = (
    field: 'strong_subjects' | 'weak_subjects',
    subject: typeof SUBJECTS[number],
    currentValues: typeof SUBJECTS[number][]
  ) => {
    if (currentValues.includes(subject)) {
      setValue(field, currentValues.filter((s) => s !== subject))
    } else {
      setValue(field, [...currentValues, subject])
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
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>プロフィール編集</CardTitle>
          <CardDescription>
            プロフィールを充実させると、講師からの提案を受けやすくなります
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Required: Grade */}
            <div className="space-y-2">
              <Label htmlFor="grade">
                学年 <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue('grade', value as typeof STUDENT_GRADES[number])}
                defaultValue={watch('grade')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="学年を選択" />
                </SelectTrigger>
                <SelectContent>
                  {STUDENT_GRADES.map((grade) => (
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

            {/* Optional: Desired School */}
            <div className="space-y-2">
              <Label htmlFor="desired_school">志望校</Label>
              <Input
                id="desired_school"
                placeholder="例: 東京大学医学部"
                {...register('desired_school')}
              />
            </div>

            {/* Optional: High School */}
            <div className="space-y-2">
              <Label htmlFor="high_school">通っている高校</Label>
              <Input
                id="high_school"
                placeholder="例: ○○高等学校"
                {...register('high_school')}
              />
            </div>

            {/* Optional: Gender */}
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

            {/* Optional: Area */}
            <div className="space-y-2">
              <Label htmlFor="area">居住エリア</Label>
              <Input
                id="area"
                placeholder="例: 東京都"
                {...register('area')}
              />
            </div>

            {/* Optional: Course Type */}
            <div className="space-y-2">
              <Label htmlFor="course_type">文系/理系</Label>
              <Select
                onValueChange={(value) => setValue('course_type', value as typeof COURSE_TYPES[number])}
                defaultValue={watch('course_type')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Optional: Exam Type */}
            <div className="space-y-2">
              <Label htmlFor="exam_type">受験方式</Label>
              <Select
                onValueChange={(value) => setValue('exam_type', value as typeof EXAM_TYPES[number])}
                defaultValue={watch('exam_type')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {EXAM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Optional: Score Band */}
            <div className="space-y-2">
              <Label htmlFor="score_band">現在の成績帯・模試偏差値</Label>
              <Select
                onValueChange={(value) => setValue('score_band', value as typeof SCORE_BANDS[number])}
                defaultValue={watch('score_band')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {SCORE_BANDS.map((band) => (
                    <SelectItem key={band} value={band}>
                      {band}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Optional: Strong Subjects */}
            <div className="space-y-2">
              <Label>得意科目</Label>
              <div className="grid grid-cols-2 gap-2">
                {SUBJECTS.slice(0, 5).map((subject) => (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox
                      id={`strong-${subject}`}
                      checked={strongSubjects.includes(subject)}
                      onCheckedChange={() =>
                        toggleSubject('strong_subjects', subject, strongSubjects)
                      }
                    />
                    <label
                      htmlFor={`strong-${subject}`}
                      className="text-sm cursor-pointer"
                    >
                      {subject}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional: Weak Subjects */}
            <div className="space-y-2">
              <Label>苦手科目</Label>
              <div className="grid grid-cols-2 gap-2">
                {SUBJECTS.slice(0, 5).map((subject) => (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox
                      id={`weak-${subject}`}
                      checked={weakSubjects.includes(subject)}
                      onCheckedChange={() =>
                        toggleSubject('weak_subjects', subject, weakSubjects)
                      }
                    />
                    <label
                      htmlFor={`weak-${subject}`}
                      className="text-sm cursor-pointer"
                    >
                      {subject}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '保存中...' : '保存する'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/student/dashboard')}
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
