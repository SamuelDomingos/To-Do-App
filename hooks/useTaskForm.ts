"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AnswerType, TaskType } from "@/generated/prisma/enums"
import { CreateTaskDTO, createTaskSchema } from "@/lib/validations/task"
import { createTask, deleteTask, updateTask } from "@/lib/api/tasks"

export const useTaskForm = ({
  mode,
  type,
  taskId,
  initialData,
  onOpenChange,
}: {
  mode: "create" | "edit"
  type: "simple" | "recurring"
  taskId?: string
  initialData?: Partial<CreateTaskDTO>
  onOpenChange?: (open: boolean) => void
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false)
  const router = useRouter()

  const isRecurringForm = type === "recurring"

  const defaultValues = useMemo<CreateTaskDTO>(
    () => ({
      title: "",
      note: "",
      type: isRecurringForm ? TaskType.RECURRING : TaskType.SINGLE,
      scheduledFor: "",
      answerType: AnswerType.YES_NO,
      categoryId: "",
      recurrence: isRecurringForm
        ? {
            pattern: "DAILY",
            startDate: "",
            endDate: "",
            daysOfWeek: [],
            daysOfMonth: [],
            specificDates: [],
            everyNDays: undefined,
          }
        : null,
      items: [],
    }),
    [isRecurringForm]
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
        type:
          initialData.type ||
          (isRecurringForm ? TaskType.RECURRING : TaskType.SINGLE),
        scheduledFor: initialData.scheduledFor || "",
        answerType: initialData.answerType || AnswerType.YES_NO,
        categoryId: initialData.categoryId || "",
        recurrence:
          initialData.recurrence ||
          (isRecurringForm
            ? {
                pattern: "DAILY",
                startDate: "",
                daysOfWeek: [],
                daysOfMonth: [],
                specificDates: [],
              }
            : null),
        items: initialData.items || [],
      })
    }

    if (mode === "create") {
      form.reset(defaultValues)
    }
  }, [mode, initialData])

  const handleSubmit = form.handleSubmit(
    async (values) => {
      try {
        setIsLoading(true)

        const payload: CreateTaskDTO = {
          ...values,
          type: isRecurringForm ? TaskType.RECURRING : TaskType.SINGLE,
          recurrence: isRecurringForm ? values.recurrence : null,
        }

        if (mode === "create") {
          const response = await createTask(payload)

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
          const response = await updateTask(taskId, payload)

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
    },
    (errors) => {
      console.error("Erros de validação:", errors)
    }
  )

  const handleDeleteTask = async (taskId: string) => {
    try {
      setIsDeleting(true)

      const response = await deleteTask(taskId)

      if (!response) {
        toast.error(response || "Erro ao deletar tarefa")
        return
      }

      toast.success("Tarefa deletada com sucesso")

      router.refresh()
      onOpenChange?.(false)
    } catch (error) {
      console.error(error)

      toast.error("Não foi possível deletar a tarefa")
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    form,
    handleSubmit,
    handleDeleteTask,
    setOpenCategoryDialog,
    openCategoryDialog,
    isDeleting,
    isLoading,
    itemsFieldArray,
  }
}
