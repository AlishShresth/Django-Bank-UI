export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="w-full h-56 rounded-xl bg-gradient-to-br from-gray-300 to-gray-400 animate-pulse" />
      <div className="space-y-2">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

export function TransactionSkeleton() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <LoadingSkeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-48" />
          <LoadingSkeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <LoadingSkeleton className="h-4 w-20" />
        <LoadingSkeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <LoadingSkeleton className="h-8 w-64" />
        <LoadingSkeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <LoadingSkeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LoadingSkeleton className="h-64 w-full" />
        <LoadingSkeleton className="h-64 w-full" />
      </div>
    </div>
  )
}
