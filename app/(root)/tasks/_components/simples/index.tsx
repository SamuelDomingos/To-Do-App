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

import { SimpleTask } from "@/lib/api/types/tasks.types"

import { formattedDate } from "@/lib/utils"

import * as Icons from "lucide-react"
import { LucideIcon } from "lucide-react"

import DialogFormSimpleTask from "@/components/createTask/dialog-form-simple-task"

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
                        <Icon className="h-6! w-6!" />
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

      {selectedTask && (
        <DialogFormSimpleTask
          open={!!selectedTask}
          onOpenChange={() => {
            setSelectedTask(null)
          }}
          mode="edit"
          taskId={selectedTask?.id}
          initialData={
            selectedTask
              ? {
                  title: selectedTask.title,
                  note: selectedTask.note || "",
                  categoryId: selectedTask.category.id,
                  scheduledFor: selectedTask.scheduledFor
                    ? new Date(selectedTask.scheduledFor).toISOString()
                    : "",
                  items: selectedTask.items || [],
                }
              : undefined
          }
        />
      )}
    </>
  )
}

export default SimpleTasks
