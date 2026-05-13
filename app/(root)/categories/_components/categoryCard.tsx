import { LucideIcon } from "lucide-react"
import * as Icons from "lucide-react"

export function CategoryCard({
  category,
}: {
  category: {
    id: string
    name: string
    color: string
    icon: string
    isGlobal: boolean
    tasks: { id: string }[]
  }
}) {
  const getIconComponent = (iconName: string) => {
    const Icon = (Icons as any)[iconName] as LucideIcon
    return Icon ? <Icon className="h-10 w-10" /> : null
  }

  const taskCount = category.tasks.length

  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-lg text-black"
        style={{ backgroundColor: category.color }}
      >
        {getIconComponent(category.icon)}
      </div>

      <div className="mt-4">
        <h3 className="font-medium">{category.name}</h3>
        <p className="text-sm text-muted-foreground">
          {taskCount} {taskCount === 1 ? "tarefa" : "tarefas"}
        </p>
      </div>
    </div>
  )
}
