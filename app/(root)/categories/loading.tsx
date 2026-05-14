

const loading = () => {
  return (
    <div className="space-y-8">
      {/* Skeleton para Minhas Categorias */}
      <section className="space-y-4">
        <div>
          <div className="mb-2 h-8 w-40 animate-pulse rounded bg-muted" />
          <div className="h-4 w-56 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex gap-4">
          <div className="h-32 w-32 animate-pulse rounded bg-muted" />
          <div className="h-32 w-32 animate-pulse rounded bg-muted" />
          <div className="h-32 w-32 animate-pulse rounded bg-muted" />
        </div>
      </section>

      {/* Skeleton para Categorias Padrão */}
      <section className="space-y-4">
        <div>
          <div className="mb-2 h-8 w-40 animate-pulse rounded bg-muted" />
          <div className="h-4 w-56 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex gap-4">
          <div className="h-32 w-32 animate-pulse rounded bg-muted" />
          <div className="h-32 w-32 animate-pulse rounded bg-muted" />
          <div className="h-32 w-32 animate-pulse rounded bg-muted" />
        </div>
      </section>
    </div>
  )
}

export default loading
