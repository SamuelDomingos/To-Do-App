"use client"

import { useState } from "react"

import { format } from "date-fns"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

import DialogItemSimples from "./dialogItemSimples"

import { SimpleTask } from "@/lib/api/types/tasks.types"

import { formattedDate } from "@/lib/utils"

import * as Icons from "lucide-react"

import { LucideIcon } from "lucide-react"

const SimpleTasks = ({ simpleTasks }: { simpleTasks: SimpleTask[] }) => {
  const [selectedTask, setSelectedTask] = useState<SimpleTask | null>(null)

  const groupedTasks = simpleTasks.reduce(
    (acc: Record<string, SimpleTask[]>, task) => {
      const groupKey = format(new Date(task.scheduledFor), "yyyy-MM-dd")

      if (!acc[groupKey]) {
        acc[groupKey] = []
      }

      acc[groupKey].push(task)

      return acc
    },
    {}
  )

  return (
    <>
      <div className="space-y-8">
        {Object.entries(groupedTasks).map(([date, tasks]) => (
          <div key={date} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {formattedDate(new Date(date))}
              </h2>
            </div>

            <div className="space-y-3 px-4">
              {tasks.map((task) => {
                const Icon = Icons[
                  task.category.icon as keyof typeof Icons
                ] as LucideIcon

                return (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="w-full text-left"
                  >
                    <Item variant="outline" className="cursor-pointer">
                      <ItemMedia
                        variant="icon"
                        className="rounded-lg p-2"
                        style={{
                          backgroundColor: task.category.color,
                        }}
                      >
                        <Icon
                          className="h-5 w-5 text-black"
                          strokeWidth={2.5}
                        />
                      </ItemMedia>

                      <ItemContent>
                        <ItemTitle>{task.title}</ItemTitle>

                        <ItemDescription>{task.note}</ItemDescription>
                      </ItemContent>
                    </Item>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <DialogItemSimples
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />
    </>
  )
}

export default SimpleTasks
