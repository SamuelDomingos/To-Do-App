import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SimpleTasks from "./_components/simples"
import RecurringTasks from "./_components/recurring"
import Error from "@/components/error"
import { Suspense } from "react"
import { getLists } from "./_services/getLists"
import { EmptyState } from "../../../components/empty-state"

const PageTasks = async () => {
  const result = await getLists()

  const { simpleTasks, recurringTasks } = result.data!

  return (
    <div className="min-h-screen">
      <div>
        <h1 className="text-3xl font-bold">Tarefas</h1>
        <p className="mt-1">Gerencie suas tarefas simples e recorrentes</p>

        {result.error && <Error error={result.error} />}
      </div>

      <Suspense>
        <Tabs defaultValue="simpleTasks">
          <TabsList className="mx-w-6xl w-full" variant="line">
            <TabsTrigger
              value="simpleTasks"
              className="group-data-[variant=line]/tabs-list:data-active:after:bg-primary"
            >
              Tarefas Simples
            </TabsTrigger>
            <TabsTrigger
              value="recurringTasks"
              className="group-data-[variant=line]/tabs-list:data-active:after:bg-primary"
            >
              Tarefas Recorrentes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simpleTasks">
            {simpleTasks.length === 0 ? (
              <EmptyState
                title="Nenhuma tarefa simples"
                description="Você pode criar quantas quiser. Comece agora!"
              />
            ) : (
              <SimpleTasks simpleTasks={simpleTasks} />
            )}
          </TabsContent>

          <TabsContent value="recurringTasks">
            {recurringTasks.length === 0 ? (
              <EmptyState
                title="Nenhuma tarefa recorrente"
                description="Você pode criar quantas quiser. Comece agora!"
              />
            ) : (
              <RecurringTasks recurringTasks={recurringTasks} />
            )}
          </TabsContent>
        </Tabs>
      </Suspense>
    </div>
  )
}

export default PageTasks
