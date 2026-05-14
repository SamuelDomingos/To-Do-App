"use client"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

import * as Icons from "lucide-react"
import { LucideIcon } from "lucide-react"

import { RecurringTask } from "@/lib/api/types/tasks.types"
import DialogFormSimpleTask from "@/components/createTask/dialog-form-task"
import { useState } from "react"

const RecurringTasks = ({
  recurringTasks,
}: {
  recurringTasks: RecurringTask[]
}) => {
  const [selectedTask, setSelectedTask] = useState<RecurringTask | null>(null)

  return (
    <div className="mt-8 space-y-3 px-4">
      {recurringTasks.map((task) => {
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

      {selectedTask && (
        <DialogFormSimpleTask
          open={!!selectedTask}
          type="recurring"
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
                  scheduledFor: selectedTask.scheduledFor || "",
                  recurrence: selectedTask.recurrence
                    ? {
                        pattern: selectedTask.recurrence.pattern,
                        startDate: selectedTask.recurrence.startDate || "",
                        endDate: selectedTask.recurrence.endDate || "",
                        daysOfWeek: selectedTask.recurrence.daysOfWeek || [],
                        daysOfMonth: selectedTask.recurrence.daysOfMonth || [],
                        specificDates:
                          selectedTask.recurrence.specificDates || [],
                        everyNDays:
                          selectedTask.recurrence.everyNDays || undefined,
                      }
                    : null,
                  items: selectedTask.items || [],
                }
              : undefined
          }
        />
      )}
    </div>
  )
}

export default RecurringTasks
