import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function ForTutorsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            講師の方へ
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            医学生の経験を活かして、受験生をサポートしませんか？
          </p>
          <Link href="/register/tutor">
            <Button size="lg" className="text-lg px-8">
              講師として登録する
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">講師登録のメリット</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">自分のペースで活動できる</h3>
                <p className="text-gray-600">
                  単発依頼のみなので、長期契約の縛りがありません。
                  空いた時間だけ活動できます。
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">経験を活かせる</h3>
                <p className="text-gray-600">
                  難関大受験を乗り越えた経験は貴重です。
                  次の世代の受験生を応援しましょう。
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">得意分野で活動</h3>
                <p className="text-gray-600">
                  教科だけでなく、面接・推薦・学習計画など、
                  自分の得意な分野で活動できます。
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">評価が実績になる</h3>
                <p className="text-gray-600">
                  受験生からのレビューが蓄積され、
                  信頼できる講師として認知されます。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">登録条件</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <p>大学の学番メールアドレス（.ac.jp）をお持ちの方</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <p>医学部に在籍中の方</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              学生証を提出いただくと「学生証確認済み」バッジが付与され、
              受験生からの信頼度が上がります。
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">活動の流れ</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">学番メールで登録</h3>
                <p className="text-gray-600">
                  大学の学番メールアドレスで登録し、プロフィールを設定します。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">依頼を探す</h3>
                <p className="text-gray-600">
                  受験生からの依頼一覧を見て、対応できそうな依頼を探します。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">提案を送る</h3>
                <p className="text-gray-600">
                  金額とアピールメッセージを添えて提案を送ります。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">指導を行う</h3>
                <p className="text-gray-600">
                  選ばれたらマッチ成立。受験生とやり取りして指導を行います。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-16 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-6">
            医学生の経験を活かしませんか？
          </h2>
          <Link href="/register/tutor">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              講師として登録する
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
