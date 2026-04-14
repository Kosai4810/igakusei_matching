import { Card, CardContent } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-0 shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="h-8 w-16 bg-muted animate-pulse rounded-lg mx-auto mb-1" />
              <div className="h-4 w-20 bg-muted animate-pulse rounded-lg mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Verification Status Skeleton */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="h-6 w-32 bg-muted animate-pulse rounded-lg mb-4" />
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded-lg" />
                  <div className="h-3 w-16 bg-muted animate-pulse rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs Skeleton */}
      <Card className="border-0 shadow-soft">
        <div className="border-b border-border/50">
          <div className="flex gap-1 p-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-28 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 w-full bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
