import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ForStudentsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            受験生の方へ
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            志望校合格を目指すあなたを、医学生講師がサポートします
          </p>
          <Link href="/register/student">
            <Button size="lg" className="text-lg px-8">
              無料で登録する
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">こんな方におすすめ</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600">
                  ・塾や予備校に通っているが、特定の科目だけ追加でサポートがほしい
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600">
                  ・小論文や志望理由書を見てもらいたいが、周りに頼れる人がいない
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600">
                  ・面接対策を難関大に合格した人にアドバイスしてもらいたい
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600">
                  ・推薦入試や総合型選抜の対策を相談したい
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">利用の流れ</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">無料登録</h3>
                <p className="text-gray-600">
                  メールアドレスとパスワードで登録。プロフィールを設定しましょう。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">依頼を作成</h3>
                <p className="text-gray-600">
                  授業・添削・相談から形式を選び、依頼内容を投稿します。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">講師を選ぶ</h3>
                <p className="text-gray-600">
                  複数の講師から提案が届きます。評価やプロフィールを見て選びましょう。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">指導を受ける</h3>
                <p className="text-gray-600">
                  マッチ後、講師とやり取りして指導を受けます。終了後はレビューを投稿できます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">さあ、始めましょう</h2>
          <Link href="/register/student">
            <Button size="lg" className="text-lg px-8">
              無料で登録する
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
