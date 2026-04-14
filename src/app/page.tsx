import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-animated py-24 px-4">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

        <div className="container relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight font-serif">
            医学生に、受験の
            <br />
            <span className="text-gradient">&quot;今必要なことだけ&quot;</span>
            <br />
            単発で頼める
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            授業・添削・相談を、必要なときに必要な分だけ。
            <br className="hidden sm:block" />
            難関大に合格した医学生講師が、あなたの受験をサポートします。
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register/student">
              <Button size="lg" className="w-full sm:w-auto text-xl px-12 py-8 rounded-2xl shadow-soft glow-pulse">
                生徒/保護者として登録
              </Button>
            </Link>
            <Link href="/register/tutor">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-xl px-12 py-8 rounded-2xl bg-white/50 backdrop-blur hover:bg-white/80">
                講師として登録
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              このサービスの特徴
            </h2>
            <p className="text-muted-foreground text-lg">
              受験に特化した、新しい学習サポートの形
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover border-0 shadow-soft bg-white overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img
                  src="/medical-students.png"
                  alt="医学生講師"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">医学生限定の講師</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  講師は全員、大学の学番メールで認証された医学生のみ。
                  難関大受験を経験した先輩だからこそできるアドバイスがあります。
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-soft bg-white overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img
                  src="/study-notes.png"
                  alt="単発で依頼"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">単発で依頼できる</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  長期契約は不要。必要なときに、必要な分だけ依頼できます。
                  授業・添削・相談など、今必要なサポートだけを受けられます。
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-soft bg-white">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/30 flex items-center justify-center mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <CardTitle className="text-xl">あらゆる受験に対応</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  一般入試だけでなく、面接・推薦・小論文にも対応。
                  受験の悩みを気軽に相談できる環境があります。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works - Student */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              受験生の利用の流れ
            </h2>
            <p className="text-muted-foreground text-lg">
              4つのステップで簡単に始められます
            </p>
          </div>
          <div className="space-y-6">
            {[
              { num: 1, title: '無料で登録', desc: 'メールアドレスとパスワードで簡単登録。登録料は無料です。' },
              { num: 2, title: '依頼を作成', desc: '「授業・添削・相談」から形式を選び、依頼内容を投稿します。' },
              { num: 3, title: '提案を受ける', desc: '複数の講師から提案が届きます。プロフィールや評価を参考に選びましょう。' },
              { num: 4, title: '講師とやり取り', desc: 'マッチ成立後、講師とメッセージでやり取りして指導を受けます。' },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-5 bg-white rounded-2xl p-6 shadow-soft card-hover">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-lg">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              対応サービス
            </h2>
            <p className="text-muted-foreground text-lg">
              あなたのニーズに合わせた3つのサービス
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover border-gradient bg-white overflow-hidden">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">授業</CardTitle>
                <CardDescription className="text-base">オンラインでリアルタイム指導</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    英語、数学、理科の解説
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    過去問の一緒に解説
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    分からない問題の質問
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-hover border-gradient bg-white overflow-hidden">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">添削</CardTitle>
                <CardDescription className="text-base">ファイル提出でフィードバック</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    小論文の添削
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    志望理由書の添削
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    英作文の添削
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-hover border-gradient bg-white overflow-hidden">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-secondary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">相談</CardTitle>
                <CardDescription className="text-base">オンラインで相談・アドバイス</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-foreground/50" />
                    学習計画の相談
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-foreground/50" />
                    面接対策の相談
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-foreground/50" />
                    推薦入試の相談
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              安心してご利用いただけます
            </h2>
            <p className="text-muted-foreground text-lg">
              信頼と安全を第一に考えた仕組み
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '✅', title: '学番メール認証', desc: '講師は大学の学番メールで登録。なりすましを防止しています。' },
              { icon: '🎓', title: '学生証確認済みバッジ', desc: '学生証を提出した講師には認証バッジが付与されます。' },
              { icon: '⭐', title: 'レビュー制度', desc: '指導後に講師のレビューができ、他の受験生の参考になります。' },
              { icon: '💬', title: 'メッセージ機能', desc: 'マッチ後は講師と直接やり取りできるので、詳細の相談も安心です。' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-soft">
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              よくある質問
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { q: '登録料はかかりますか？', a: '登録は無料です。依頼の際に講師と合意した金額のみが発生します。' },
              { q: '講師は本当に医学生ですか？', a: '講師登録には大学の学番メール（.ac.jp）が必須です。さらに学生証を提出した講師には「学生証確認済み」バッジが表示されます。' },
              { q: 'どのような科目に対応していますか？', a: '英語・数学・化学・生物・物理・小論文・面接・学習計画・推薦対策など、受験に必要な科目・対策に幅広く対応しています。' },
            ].map((faq, i) => (
              <Card key={i} className="border-0 shadow-soft bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-start gap-3">
                    <span className="text-primary font-bold">Q.</span>
                    {faq.q}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground pl-7 leading-relaxed">
                    <span className="text-primary font-semibold">A. </span>
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary via-primary to-primary/80 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            今すぐ始めましょう
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            志望校合格に向けて、医学生講師のサポートを受けてみませんか？
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register/student">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                生徒/保護者として登録
              </Button>
            </Link>
            <Link href="/register/tutor">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-6 rounded-2xl bg-transparent text-white border-2 border-white/50 hover:bg-white/10 hover:border-white">
                講師として登録
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background/70 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold text-white">
              スキマ医学生
            </div>
            <div className="flex gap-8 text-sm">
              <Link href="/for-students" className="hover:text-white transition-colors">
                受験生の方へ
              </Link>
              <Link href="/for-tutors" className="hover:text-white transition-colors">
                講師の方へ
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                ログイン
              </Link>
            </div>
          </div>
          <div className="border-t border-white/10 mt-10 pt-10 text-center text-sm">
            © 2024 スキマ医学生. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
