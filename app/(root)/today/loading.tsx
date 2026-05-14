
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex h-screen flex-col p-4">
      {/* Título */}
      <Skeleton className="mb-6 h-8 w-48" />
      
      {/* Calendário */}
      <div className="mb-6 flex gap-2">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-12 rounded-full" />
        ))}
      </div>
      
      {/* Lista de tarefas */}
      <div className="flex-1 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-12 flex-1 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}