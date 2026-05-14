"use client"

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
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import useCheckForm from "../_hooks/useCheckForm"

export function TaskChecklistItem({
  task,
  items,
  disabled = false,
}: {
  task: {
    id: string
    title: string
    note?: string | null
    category: { name: string; color: string; icon: string }
    status: string
  }
  items: {
    id: string
    title: string
    completed?: boolean
  }[]
  itemsSnapshot?: Record<string, boolean>
  disabled?: boolean
}) {
  const Icon = Icons[task.category.icon as keyof typeof Icons] as LucideIcon

  const initialItems = Object.fromEntries(
    items.map((i) => [i.id, i.completed ?? false])
  )

  const { isPending, completed, itemsSnapshot, toggleItem } = useCheckForm({
    taskId: task.id,
    initialCompleted: task.status === "COMPLETED",
    initialItems,
    totalItems: items.length,
  })

  const completedCount = Object.values(itemsSnapshot).filter(Boolean).length

  return (
    <Item variant="outline" className="w-full">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={task.id}>
          <AccordionTrigger className="flex items-center p-0">
            <ItemMedia
              variant="icon"
              className="mr-2 rounded-lg p-2"
              style={{ backgroundColor: task.category.color }}
            >
              <Icon className="h-6! w-6!" />
            </ItemMedia>

            <ItemContent>
              <ItemTitle
                className={completed ? "text-slate-400 line-through" : ""}
              >
                {task.title}
              </ItemTitle>
              <ItemDescription>
                {task.note && <span>{task.note}</span>}
                <span className="ml-2 text-xs text-slate-500">
                  ({completedCount}/{items.length})
                </span>
              </ItemDescription>
            </ItemContent>
          </AccordionTrigger>

          <AccordionContent>
            <div className="space-y-4 pt-4 pl-4">
              {items.map((item) => {
                const checked = itemsSnapshot[item.id] ?? false

                return (
                  <div key={item.id} className="flex items-center gap-2">
                    <Label
                      className={[
                        "flex-1",
                        disabled
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer",
                        checked ? "text-slate-400 line-through" : "",
                      ].join(" ")}
                    >
                      {item.title}
                    </Label>

                    {disabled ? (
                      <Lock className="text-slate-400" size={16} />
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant={checked ? "default" : "outline"}
                        disabled={isPending}
                        onClick={() => toggleItem(item.id)}
                        className="h-8 w-8 rounded-full p-0"
                      >
                        {checked && <Check className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Item>
  )
}
