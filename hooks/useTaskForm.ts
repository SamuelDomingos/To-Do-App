"use client"

import { useFieldArray, useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { AnswerType, TaskType } from "@/generated/prisma/enums"
import { CreateTaskDTO, createTaskSchema } from "@/lib/validations/task"
import { useState } from "react"

export const useTaskForm = ({
  mode,
  taskId,
  initialData,
}: {
  mode: "create" | "edit"
  taskId?: string
  initialData?: Partial<CreateTaskDTO>
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CreateTaskDTO>({
    resolver: zodResolver(createTaskSchema),

    defaultValues: {
      title: initialData?.title || "",

      note: initialData?.note || "",

      type: initialData?.type || TaskType.SINGLE,

      scheduledFor: initialData?.scheduledFor || "",

      answerType: initialData?.answerType || AnswerType.YES_NO,

      categoryId: initialData?.categoryId || "",

      recurrence: initialData?.recurrence || null,

      items: initialData?.items || [],
    },
  })

  const itemsFieldArray = useFieldArray({
    control: form.control,
    name: "items",
  })

  const isRecurring = form.watch("type") === TaskType.RECURRING

  const isChecklist = form.watch("answerType") === AnswerType.CHECKLIST

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      setIsLoading(true)

      if (mode === "create") {
      }

      if (mode === "edit" && taskId) {
      }

      form.reset(values)
    } catch (error) {
      console.error(error)
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
