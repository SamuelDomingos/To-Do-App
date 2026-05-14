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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Label } from "@/components/ui/label"

import useCheckForm from "../_hooks/useCheckForm"

export function TaskChecklistItem({
  task,
  items,
  completed,
  disabled,
}: {
  task: {
    id: string
    title: string
    note: string
    category: { name: string; color: string; icon: string }
  }
  items: Array<{ id: string; title: string }>
  completed: boolean
  disabled: boolean
}) {
  const Icon = Icons[task.category.icon as keyof typeof Icons] as LucideIcon

  const initialItems = items.reduce<Record<string, boolean>>(
    (acc, item) => {
      acc[item.id] = false
      return acc
    },
    {}
  )

  const { form, toggleItem, isPending } = useCheckForm({
    taskId: task.id,
    initialCompleted: completed,
    initialItems,
  })

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
              <ItemTitle>{task.title}</ItemTitle>
              <ItemDescription>{task.note}</ItemDescription>
            </ItemContent>
          </AccordionTrigger>

          <AccordionContent>
            <div className="space-y-4 pt-4 pl-4">
              {items.map((item) => {
                const checked = form.watch(
                  `itemsSnapshot.${item.id}`
                )

                return (
                  <div key={item.id} className="flex items-center">
                    <Label
                      className={`flex-1 ${
                        disabled
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      } ${
                        checked
                          ? "line-through text-slate-400"
                          : ""
                      }`}
                    >
                      {item.title}
                    </Label>

                    {disabled ? (
                      <Icons.Lock className="text-slate-400" />
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant={checked ? "default" : "outline"}
                        disabled={disabled || isPending}
                        onClick={() => toggleItem(item.id)}
                        className="h-8 w-8 rounded-full p-0"
                      >
                        {checked && (
                          <Check className="h-5! w-5!" />
                        )}
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