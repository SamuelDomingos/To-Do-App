"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { toast } from "sonner"
import { CompleteTaskDTO, completeTaskSchema } from "@/lib/validations/task"
import { completeTask, uncompleteTask } from "@/lib/api/tasks"

const useCheckForm = ({
  taskId,
  initialCompleted = false,
  initialItems = {},
}: {
  taskId: string
  initialCompleted?: boolean
  initialItems?: Record<string, boolean>
}) => {
  const [isPending, startTransition] = useTransition()

  const form = useForm<CompleteTaskDTO>({
    resolver: zodResolver(completeTaskSchema),
    defaultValues: {
      answer: initialCompleted,
      itemsSnapshot: initialItems,
      note: "",
    },
  })

  const toggleTask = () => {
    startTransition(async () => {
      try {
        const values = form.getValues()

        if (values.answer) {
          await uncompleteTask(taskId)
          form.setValue("answer", false)

          toast.success("Tarefa desmarcada")
          return
        }

        await completeTask(taskId, values)
        form.setValue("answer", true)

        toast.success("Tarefa concluída")
      } catch (err) {
        console.error(err)
        toast.error("Erro ao atualizar tarefa")
      }
    })
  }

  const toggleItem = (itemId: string) => {
    const current = form.getValues(`itemsSnapshot.${itemId}`)
    form.setValue(`itemsSnapshot.${itemId}`, !current)
  }

  return {
    form,
    isPending,
    toggleTask,
    toggleItem,
  }
}

export default useCheckForm
