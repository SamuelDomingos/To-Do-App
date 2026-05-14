"use client"

import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item"

import { Button } from "@/components/ui/button"
import * as Icons from "lucide-react"
import { Check } from "lucide-react"
import { LucideIcon } from "lucide-react"

import useCheckForm from "../_hooks/useCheckForm"

export function TaskItem({
  task,
  disabled,
  completed,
}: {
  task: {
    id: string
    title: string
    note: string
    category: { name: string; color: string; icon: string }
  }
  disabled: boolean
  completed: boolean
}) {
  const Icon = Icons[task.category.icon as keyof typeof Icons] as LucideIcon

  const { form, toggleTask, isPending } = useCheckForm({
    taskId: task.id,
    initialCompleted: completed,
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
            <ItemTitle>{task.title}</ItemTitle>
            <ItemDescription>{task.note}</ItemDescription>
          </div>

          {disabled ? (
            <Icons.Lock className="text-slate-400" />
          ) : (
            <Button
              type="button"
              size="sm"
              variant={form.watch("answer") ? "default" : "outline"}
              disabled={disabled || isPending}
              onClick={toggleTask}
              className="h-8 w-8 rounded-full p-2"
            >
              {form.watch("answer") && <Check className="h-5! w-5!" />}
            </Button>
          )}
        </div>
      </ItemContent>
    </Item>
  )
}