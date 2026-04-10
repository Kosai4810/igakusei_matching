import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4" variant="secondary">医学生限定の講師陣</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            医学生に、医学部受験の
            <br />
            <span className="text-blue-600">"今必要なことだけ"</span>
            <br />
            単発で頼める
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            授業・添削・相談を、必要なときに必要な分だけ。
            医学部に合格した医学生講師が、あなたの受験をサポートします。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register/student">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                受験生として始める
              </Button>
            </Link>
            <Link href="/register/tutor">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                講師として登録
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            このサービスの特徴
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">👨‍⚕️</span>
                  医学生限定の講師
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  講師は全員、大学の学番メールで認証された医学生のみ。
                  医学部受験を経験した先輩だからこそできるアドバイスがあります。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  単発で依頼できる
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  長期契約は不要。必要なときに、必要な分だけ依頼できます。
                  授業・添削・相談など、今必要なサポートだけを受けられます。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  医学部受験に特化
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  一般入試だけでなく、面接・推薦・小論文にも対応。
                  医学部受験特有の悩みを相談できる環境があります。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works - Student */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            受験生の利用の流れ
          </h2>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">無料で登録</h3>
                <p className="text-gray-600">
                  メールアドレスとパスワードで簡単登録。登録料は無料です。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">依頼を作成</h3>
                <p className="text-gray-600">
                  「授業・添削・相談」から形式を選び、依頼内容を投稿します。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">提案を受ける</h3>
                <p className="text-gray-600">
                  複数の講師から提案が届きます。プロフィールや評価を参考に選びましょう。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">講師とやり取り</h3>
                <p className="text-gray-600">
                  マッチ成立後、講師とメッセージでやり取りして指導を受けます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            対応サービス
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>授業</CardTitle>
                <CardDescription>オンラインでリアルタイム指導</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>・英語、数学、理科の解説</li>
                  <li>・過去問の一緒に解説</li>
                  <li>・分からない問題の質問</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>添削</CardTitle>
                <CardDescription>ファイル提出でフィードバック</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>・小論文の添削</li>
                  <li>・志望理由書の添削</li>
                  <li>・英作文の添削</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>相談</CardTitle>
                <CardDescription>オンラインで相談・アドバイス</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>・学習計画の相談</li>
                  <li>・面接対策の相談</li>
                  <li>・推薦入試の相談</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-blue-50 py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            安心してご利用いただけます
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="text-3xl">✅</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">学番メール認証</h3>
                <p className="text-gray-600">
                  講師は大学の学番メールで登録。なりすましを防止しています。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">🎓</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">学生証確認済みバッジ</h3>
                <p className="text-gray-600">
                  学生証を提出した講師には認証バッジが付与されます。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">⭐</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">レビュー制度</h3>
                <p className="text-gray-600">
                  指導後に講師のレビューができ、他の受験生の参考になります。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">💬</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">メッセージ機能</h3>
                <p className="text-gray-600">
                  マッチ後は講師と直接やり取りできるので、詳細の相談も安心です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            よくある質問
          </h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Q. 登録料はかかりますか？
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  A. 登録は無料です。依頼の際に講師と合意した金額のみが発生します。
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Q. 講師は本当に医学生ですか？
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  A. 講師登録には大学の学番メール（.ac.jp）が必須です。
                  さらに学生証を提出した講師には「学生証確認済み」バッジが表示されます。
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Q. どのような科目に対応していますか？
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  A. 英語・数学・化学・生物・物理・小論文・面接・学習計画・推薦対策など、
                  医学部受験に必要な科目・対策に幅広く対応しています。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            今すぐ始めましょう
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            医学部合格に向けて、医学生講師のサポートを受けてみませんか？
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register/student">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8">
                受験生として登録
              </Button>
            </Link>
            <Link href="/register/tutor">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
                講師として登録
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xl font-bold text-white">
              医学生マッチング
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/for-students" className="hover:text-white">
                受験生の方へ
              </Link>
              <Link href="/for-tutors" className="hover:text-white">
                講師の方へ
              </Link>
              <Link href="/login" className="hover:text-white">
                ログイン
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © 2024 医学生マッチング. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
