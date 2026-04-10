'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { requestSchema, type RequestInput } from '@/lib/validations/request'
import { SUBJECTS, FORMATS } from '@/lib/constants'
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
import { toast } from 'sonner'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_FILES = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']

export default function NewRequestPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RequestInput>({
    resolver: zodResolver(requestSchema),
  })

  const selectedFormat = watch('format')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    // Validate file count
    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`ファイルは最大${MAX_FILES}個までです`)
      return
    }

    // Validate each file
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}は10MBを超えています`)
        return false
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}は対応していない形式です`)
        return false
      }
      return true
    })

    setFiles((prev) => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: RequestInput) => {
    setIsLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Create request
    const requestData = {
      student_user_id: user.id,
      format: data.format,
      category: data.category,
      budget: data.budget || null,
      message: data.message,
      preferred_datetime: data.preferred_datetime || null,
      status: 'open',
    }

    const { data: request, error: requestError } = await supabase
      .from('requests')
      .insert(requestData)
      .select()
      .single()

    if (requestError) {
      toast.error('依頼の作成に失敗しました')
      setIsLoading(false)
      return
    }

    // Upload files
    if (files.length > 0) {
      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${request.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('request-attachments')
          .upload(fileName, file)

        if (uploadError) {
          console.error('File upload error:', uploadError)
          continue
        }

        // Save attachment record
        await supabase.from('request_attachments').insert({
          request_id: request.id,
          file_path: fileName,
          file_name: file.name,
          mime_type: file.type,
          file_size: file.size,
        })
      }
    }

    toast.success('依頼を作成しました')
    router.push(`/student/requests/${request.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>新しい依頼を作成</CardTitle>
          <CardDescription>
            医学生講師に単発で指導・添削・相談を依頼できます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Format */}
            <div className="space-y-2">
              <Label htmlFor="format">
                指導形式 <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue('format', value as typeof FORMATS[number])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="形式を選択" />
                </SelectTrigger>
                <SelectContent>
                  {FORMATS.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.format && (
                <p className="text-sm text-red-600">{errors.format.message}</p>
              )}
              <p className="text-xs text-gray-500">
                {selectedFormat === '授業' && 'オンラインでのリアルタイム授業'}
                {selectedFormat === '添削' && 'ファイルを提出して添削フィードバックを受ける'}
                {selectedFormat === '相談' && 'オンラインでの相談・アドバイス'}
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                カテゴリ <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue('category', value as typeof SUBJECTS[number])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="カテゴリを選択" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget">予算目安（円）</Label>
              <Input
                id="budget"
                type="number"
                placeholder="例: 3000"
                {...register('budget', { valueAsNumber: true })}
              />
              {errors.budget && (
                <p className="text-sm text-red-600">{errors.budget.message}</p>
              )}
            </div>

            {/* Preferred Datetime (for 授業/相談) */}
            {(selectedFormat === '授業' || selectedFormat === '相談') && (
              <div className="space-y-2">
                <Label htmlFor="preferred_datetime">希望日時</Label>
                <Input
                  id="preferred_datetime"
                  type="datetime-local"
                  {...register('preferred_datetime')}
                />
              </div>
            )}

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">
                依頼内容 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="依頼内容を詳しく記入してください"
                rows={6}
                {...register('message')}
              />
              <p className="text-xs text-gray-500">
                今回見てほしい内容、困っている点、扱いたい教材や範囲をご記入ください。
                必要に応じてファイルや画像も添付してください。
              </p>
              {errors.message && (
                <p className="text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>添付ファイル</Label>
              <div className="border-2 border-dashed rounded-lg p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.gif,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="text-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={files.length >= MAX_FILES}
                  >
                    ファイルを選択
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG, GIF, PDF（最大10MB、{MAX_FILES}個まで）
                  </p>
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <ul className="space-y-2 mt-2">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        削除
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '作成中...' : '依頼を作成'}
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
