# 医学生マッチング

医学部受験生と現役医学生をつなぐマッチングプラットフォームのMVPです。

## 機能

### 受験生向け
- 依頼投稿（科目指導、過去問添削、面接対策、相談など）
- 講師からの提案を受け取り、選択
- マッチング後のメッセージ機能
- 講師へのレビュー投稿

### 医学生講師向け
- 学番メール（.ac.jp）による認証
- プロフィール作成（対応科目、時間帯など）
- 依頼への提案
- マッチング後のメッセージ機能

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UIコンポーネント**: shadcn/ui
- **バックエンド/DB**: Supabase (Auth, PostgreSQL, Storage)
- **フォーム**: React Hook Form + Zod
- **デプロイ**: Vercel

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Supabaseのセットアップ

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. `supabase/migrations/001_initial_schema.sql`の内容をSQL Editorで実行
3. Authentication > URL Configurationでサイトのurlを設定
4. Storageで`request-attachments`バケットを作成（公開設定）

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセス可能です。

## ディレクトリ構造

```
src/
├── app/
│   ├── (auth)/          # 認証関連ページ
│   │   ├── login/
│   │   ├── register/
│   │   └── auth/callback/
│   ├── student/         # 受験生向けページ
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── requests/
│   │   └── matches/
│   ├── tutor/           # 講師向けページ
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── requests/
│   │   └── matches/
│   └── page.tsx         # トップページ
├── components/
│   ├── layout/          # レイアウトコンポーネント
│   └── ui/              # shadcn/uiコンポーネント
├── hooks/               # カスタムフック
└── lib/
    ├── supabase/        # Supabaseクライアント
    ├── validations/     # Zodスキーマ
    └── constants.ts     # 定数定義
```

## データベース構造

- `users` - ユーザー基本情報（role: student/tutor）
- `student_profiles` - 受験生プロフィール
- `tutor_profiles` - 講師プロフィール
- `tutor_verifications` - 講師認証状況
- `requests` - 依頼
- `request_attachments` - 依頼添付ファイル
- `proposals` - 提案
- `matches` - マッチング
- `messages` - メッセージ
- `reviews` - レビュー

## デプロイ

### Vercel

1. GitHubリポジトリをVercelに接続
2. 環境変数を設定
3. デプロイ

### Supabase本番設定

1. Authentication > URL Configurationで本番URLを追加
2. RLSポリシーが正しく設定されていることを確認

## ライセンス

MIT
