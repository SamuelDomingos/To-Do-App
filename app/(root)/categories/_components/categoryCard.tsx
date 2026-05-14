"use client"

import { useState } from "react"
import * as Icons from "lucide-react"
import { LucideIcon } from "lucide-react"
import { CategoryDialog } from "./CategoryDialog"

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
  const [open, setOpen] = useState(false)

  const Icon = (Icons as any)[category.icon] as LucideIcon
  const taskCount = category.tasks.length
  const isClickable = !category.isGlobal

  if (!isClickable) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center transition opacity-70">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-lg"
          style={{ backgroundColor: category.color }}
        >
          {Icon && <Icon className="h-10 w-10 text-white" />}
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

  return (
    <CategoryDialog
      open={open}
      setOpen={setOpen}
      category={{
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
      }}
      trigger={
        <div className="flex flex-col items-center justify-center p-6 text-center transition hover:scale-[1.03] cursor-pointer">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-lg"
            style={{ backgroundColor: category.color }}
          >
            {Icon && <Icon className="h-10 w-10 text-white" />}
          </div>

          <div className="mt-4">
            <h3 className="font-medium">{category.name}</h3>
            <p className="text-sm text-muted-foreground">
              {taskCount} {taskCount === 1 ? "tarefa" : "tarefas"}
            </p>
          </div>
        </div>
      }
    />
  )
}