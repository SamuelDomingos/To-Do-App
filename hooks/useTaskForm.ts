"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useState, useEffect, useMemo } from "react"

import { useRouter } from "next/navigation"

import { toast } from "sonner"

import { AnswerType, TaskType } from "@/generated/prisma/enums"

import { CreateTaskDTO, createTaskSchema } from "@/lib/validations/task"

import { createTask, updateTask } from "@/lib/api/tasks"

export const useTaskForm = ({
  mode,
  taskId,
  initialData,
  onOpenChange,
}: {
  mode: "create" | "edit"
  taskId?: string
  initialData?: Partial<CreateTaskDTO>
  onOpenChange?: (open: boolean) => void
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const defaultValues = useMemo<CreateTaskDTO>(
    () => ({
      title: "",
      note: "",
      type: TaskType.SINGLE,
      scheduledFor: "",
      answerType: AnswerType.YES_NO,
      categoryId: "",
      recurrence: null,
      items: [],
    }),
    []
  )

  const form = useForm<CreateTaskDTO>({
    resolver: zodResolver(createTaskSchema),
    defaultValues,
  })

  const itemsFieldArray = useFieldArray({
    control: form.control,
    name: "items",
  })

  const isRecurring = form.watch("type") === TaskType.RECURRING

  const isChecklist = form.watch("answerType") === AnswerType.CHECKLIST

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        title: initialData.title || "",
        note: initialData.note || "",
        type: initialData.type || TaskType.SINGLE,
        scheduledFor: initialData.scheduledFor || "",
        answerType: initialData.answerType || AnswerType.YES_NO,
        categoryId: initialData.categoryId || "",
        recurrence: initialData.recurrence || null,
        items: initialData.items || [],
      })
    }

    if (mode === "create") {
      form.reset(defaultValues)
    }
  }, [mode, initialData])

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      setIsLoading(true)

      if (mode === "create") {
        const response = await createTask(values)

        if (!response.data) {
          toast.error(response.error || "Erro ao criar tarefa")
          return
        }

        toast.success("Tarefa criada com sucesso!")

        form.reset(defaultValues)

        onOpenChange?.(false)

        router.refresh()
      }

      if (mode === "edit" && taskId) {
        const response = await updateTask(taskId, values)

        if (!response.data) {
          toast.error(response.error || "Erro ao atualizar tarefa")
          return
        }

        toast.success("Tarefa atualizada com sucesso!")

        onOpenChange?.(false)

        router.refresh()
      }
    } catch (error) {
      console.error(error)

      toast.error("Erro ao processar tarefa")
    } finally {
      setIsLoading(false)
    }
  })

  return {
    form,
    handleSubmit,
    isLoading,
    isRecurring,
    isChecklist,
    itemsFieldArray,
  }
}
