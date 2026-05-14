import * as Icons from "lucide-react"
import { Check, Lock } from "lucide-react"
import { LucideIcon } from "lucide-react"

import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button"

import useCheckForm from "../_hooks/useCheckForm"

export function TaskItem({ task, disabled = false }: {
  task: {
    id: string
    title: string
    note?: string | null
    status: string
    category: { name: string; color: string; icon: string }
  }
  disabled?: boolean
}) {
  const Icon = Icons[task.category.icon as keyof typeof Icons] as LucideIcon

  const { isPending, completed, toggleTask } = useCheckForm({
    taskId: task.id,
    initialCompleted: task.status === "COMPLETED",
  })

  return (
    <Item variant="outline" className="flex-1">
      <ItemMedia
        variant="icon"
        className="rounded-lg p-2"
        style={{ backgroundColor: task.category.color }}
      >
        <Icon className="h-6! w-6!" />
      </ItemMedia>

      <ItemContent>
        <div className="flex items-center justify-between">
          <div>
            <ItemTitle className={completed ? "line-through text-slate-400" : ""}>
              {task.title}
            </ItemTitle>
            {task.note && <ItemDescription>{task.note}</ItemDescription>}
          </div>

          {disabled ? (
            <Lock className="text-slate-400" size={16} />
          ) : (
            <Button
              type="button"
              size="sm"
              variant={completed ? "default" : "outline"}
              disabled={isPending || disabled}
              onClick={toggleTask}
              className="h-8 w-8 rounded-full p-2"
            >
              {completed && <Check className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </ItemContent>
    </Item>
  )
}