"use client"

import { completeTask, uncompleteTask } from "@/lib/api/tasks"
import { useTransition, useState } from "react"
import { toast } from "sonner"

const useCheckForm = ({
  taskId,
  initialCompleted = false,
  initialItems = {},
  totalItems = 0,
}: {
  taskId: string
  initialCompleted?: boolean
  initialItems?: Record<string, boolean>
  totalItems?: number
}) => {
  const [isPending, startTransition] = useTransition()

  const [completed, setCompleted] = useState(initialCompleted)
  const [itemsSnapshot, setItemsSnapshot] =
    useState<Record<string, boolean>>(initialItems)

  const toggleTask = async () => {
    startTransition(async () => {
      try {
        if (completed) {
          uncompleteTask(taskId)
          setCompleted(false)
          setItemsSnapshot({})
          toast.success("Tarefa desmarcada")
        } else {
          completeTask(taskId, {
            answer: true,
            itemsSnapshot,
          })
          setCompleted(true)
          toast.success("Tarefa concluída")
        }
      } catch {
        toast.error("Erro ao atualizar tarefa")
      }
    })
  }

  const toggleItem = async (itemId: string) => {
    const nextSnapshot = {
      ...itemsSnapshot,
      [itemId]: !itemsSnapshot[itemId],
    }

    const completedCount = Object.values(nextSnapshot).filter(Boolean).length

    const allDone = totalItems > 0 && completedCount === totalItems

    setItemsSnapshot(nextSnapshot)

    if (allDone) setCompleted(true)
    if (completed && !allDone) setCompleted(false)

    startTransition(async () => {
      try {
        await completeTask(taskId, {
          answer: true,
          itemsSnapshot: nextSnapshot,
        })

        if (allDone) {
          toast.success("Checklist concluído!")
        }
      } catch {
        setItemsSnapshot(initialItems)
        setCompleted(initialCompleted)

        toast.error("Erro ao atualizar item")
      }
    })
  }

  return {
    isPending,
    completed,
    itemsSnapshot,
    toggleTask,
    toggleItem,
  }
}

export default useCheckForm
