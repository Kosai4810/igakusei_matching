import { Card, CardContent } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-56 bg-muted animate-pulse rounded-lg" />
          <div className="h-5 w-40 bg-muted animate-pulse rounded-lg mt-2" />
        </div>
        <div className="h-8 w-16 bg-muted animate-pulse rounded-full" />
      </div>

      <div className="grid gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="border-0 shadow-soft bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className="p-5 border-b border-border/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
                      <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
                      <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
                    </div>
                    <div className="h-5 w-full bg-muted animate-pulse rounded-lg" />
                    <div className="flex gap-4">
                      <div className="h-4 w-28 bg-muted animate-pulse rounded-lg" />
                      <div className="h-4 w-24 bg-muted animate-pulse rounded-lg" />
                    </div>
                  </div>
                  <div className="h-9 w-24 bg-muted animate-pulse rounded-xl" />
                </div>
              </div>
              <div className="p-4 bg-muted/30">
                <div className="mb-3 space-y-2">
                  <div className="h-4 w-16 bg-muted animate-pulse rounded-lg" />
                  <div className="h-12 w-3/4 bg-muted animate-pulse rounded-xl" />
                </div>
                <div className="flex gap-2">
                  <div className="h-10 flex-1 bg-muted animate-pulse rounded-xl" />
                  <div className="h-10 w-12 bg-muted animate-pulse rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
