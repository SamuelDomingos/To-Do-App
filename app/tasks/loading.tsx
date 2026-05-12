import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48 rounded-lg" />

          <Skeleton className="h-4 w-72 rounded-md" />
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32 rounded-xl" />

            <Skeleton className="h-10 w-40 rounded-xl" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border p-4"
              >
                <Skeleton className="h-14 w-14 rounded-2xl" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-40 rounded-md" />

                  <Skeleton className="h-4 w-64 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
