# セットアップ情報

## 本番URL

- **Vercel**: https://igakuseimatching.vercel.app
- **Vercel Dashboard**: https://vercel.com/kosai4810s-projects/igakusei_matching

## Supabase プロジェクト

- **プロジェクト名**: igakusei-matching
- **リージョン**: Northeast Asia (Tokyo)
- **Project Reference ID**: grkgyseuymwhxcymzoag
- **Project URL**: https://grkgyseuymwhxcymzoag.supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/grkgyseuymwhxcymzoag

## 環境変数

`.env.local` に以下を設定:

```env
NEXT_PUBLIC_SUPABASE_URL=https://grkgyseuymwhxcymzoag.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya2d5c2V1eW13aHhjeW16b2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MDYwNTcsImV4cCI6MjA5MTM4MjA1N30.O9BtiE9F5NaxeGncCZnsAVTKFbCgzPYh4_uBEKPdhos
```

## テストユーザー

| メール | パスワード | ロール |
|--------|-----------|--------|
| test@test.com | password123 | student |

## Vercel デプロイ設定

環境変数を Vercel の Project Settings > Environment Variables に追加:

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase 追加設定

### Authentication
- Site URL: https://igakuseimatching.vercel.app
- Redirect URLs: `https://igakuseimatching.vercel.app/**` を追加

### Storage
- `request-attachments` バケットを作成（Public）
