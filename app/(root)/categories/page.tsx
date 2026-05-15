import { getCategories } from "./_services/getCategoriesService"
import Error from "@/components/error"
import { EmptyState } from "@/components/empty-state"
import { CategoryCard } from "./_components/categoryCard"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { CategoryDialog } from "./_components/CategoryDialog"
import { Button } from "@/components/ui/button"

const PageCategories = async () => {
  const { error, globalCategories, customCategories } = await getCategories()

  return (
    <div className="min-h-screen space-y-8">
      {error && <Error error={error} />}

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Minhas Categorias</h2>
          <p className="text-sm text-muted-foreground">
            Suas categorias personalizadas
          </p>
        </div>

        {!customCategories || customCategories.length === 0 ? (
          <EmptyState
            title="Nenhuma categoria personalizada"
            description="Você pode criar quantas quiser. Comece agora!"
          />
        ) : (
          <ScrollArea className="w-full rounded-md whitespace-nowrap">
            <div className="flex w-max gap-4 p-4">
              {customCategories.map((category) => (
                <div key={category.id} className="w-30 shrink-0">
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </section>
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Categorias Padrão</h2>
          <p className="text-sm text-muted-foreground">
            Categorias disponíveis para todos os usuários
          </p>
        </div>

        {!globalCategories || globalCategories.length === 0 ? (
          <EmptyState
            title="Nenhuma categoria padrão"
            description="As categorias padrão serão exibidas aqui"
          />
        ) : (
          <ScrollArea className="w-full rounded-md whitespace-nowrap">
            <div className="flex w-max gap-4 p-4">
              {globalCategories.map((category) => (
                <div key={category.id} className="w-30">
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </section>

      <div className="flex justify-center">
        <CategoryDialog trigger={<Button>Criar Categoria</Button>} />
      </div>
    </div>
  )
}

export default PageCategories
