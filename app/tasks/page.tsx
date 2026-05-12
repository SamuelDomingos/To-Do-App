import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SimpleTasks from "./_components/simples"
import RecurringTasks from "./_components/recurring"
import { getLists } from "@/lib/api/tasks"

const page = async () => {
  const { simpleTasks, recurringTasks } = await getLists()

  return (
    <div className="min-h-scree">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tarefas</h1>
          <p className="mt-1">Gerencie suas tarefas simples e recorrentes</p>
        </div>

        <Tabs defaultValue="simpleTasks">
          <TabsList className="mx-w-6xl w-full" variant="line">
            <TabsTrigger value="simpleTasks">Tarefas Simples</TabsTrigger>
            <TabsTrigger value="recurringTasks">
              Tarefas Recorrentes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="simpleTasks">
            <SimpleTasks simpleTasks={simpleTasks} />
          </TabsContent>

          <TabsContent value="recurringTasks">
            <RecurringTasks recurringTasks={recurringTasks} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default page
