import {
  AnswerType,
  PeriodType,
  RecurrencePattern,
  TaskStatus,
  TaskType,
} from "@/generated/prisma/enums"
import { z } from "zod"

export const recurrenceSchema = z
  .object({
    pattern: z.nativeEnum(RecurrencePattern),

    everyNDays: z.number().int().positive().optional(),

    daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
    everyNWeeks: z.number().int().positive().optional(),

    daysOfMonth: z.array(z.number().int().min(1).max(31)).optional(),
    everyNMonths: z.number().int().positive().optional(),

    specificDates: z.array(z.string().regex(/^\d{2}-\d{2}$/)).optional(), // MM-DD
    everyNYears: z.number().int().positive().optional(),

    timesPerPeriod: z.number().int().positive().optional(),
    periodType: z.nativeEnum(PeriodType).optional(),

    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.pattern === "DAILY" && !data.everyNDays) {
        return false
      }
      if (
        data.pattern === "WEEKLY" &&
        (!data.daysOfWeek || data.daysOfWeek.length === 0)
      ) {
        return false
      }
      if (
        data.pattern === "MONTHLY" &&
        (!data.daysOfMonth || data.daysOfMonth.length === 0)
      ) {
        return false
      }
      if (
        data.pattern === "YEARLY" &&
        (!data.specificDates || data.specificDates.length === 0)
      ) {
        return false
      }
      if (
        data.pattern === "CUSTOM" &&
        (!data.timesPerPeriod || !data.periodType)
      ) {
        return false
      }
      return true
    },
    {
      message: "Dados de recorrência incompletos para o padrão selecionado",
    }
  )

export const taskItemSchema = z.object({
  title: z.string().min(1, "Título do item é obrigatório").max(200),
  order: z.number().int().nonnegative(),
  completed: z.boolean().default(false),
})

export const createTaskSchema = z
  .object({
    title: z.string().min(1, "Título é obrigatório").max(200),
    note: z.string().max(2000).optional().nullable(),
    type: z.nativeEnum(TaskType).default("SINGLE"),
    answerType: z.nativeEnum(AnswerType).default("YES_NO"),
    categoryId: z.string().cuid("ID de categoria inválido"),
    scheduledFor: z.string().datetime().optional().nullable(),

    recurrence: recurrenceSchema.optional().nullable(),

    items: z.array(taskItemSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.type === "RECURRING" && !data.recurrence) {
        return false
      }
      if (
        data.answerType === "CHECKLIST" &&
        (!data.items || data.items.length === 0)
      ) {
        return false
      }
      return true
    },
    {
      message:
        "Dados incompletos: tarefas recorrentes precisam de padrão de recorrência, tarefas de checklist precisam de itens",
    }
  )

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  note: z.string().max(2000).optional().nullable(),
  status: z.nativeEnum(TaskStatus).optional(),
  categoryId: z.string().cuid().optional(),
  recurrence: recurrenceSchema.optional().nullable(),
  items: z.array(taskItemSchema).optional(),
})

export const completeTaskSchema = z.object({
  answer: z.boolean().optional(),
  itemsSnapshot: z.record(z.boolean()).optional(),
  note: z.string().max(500).optional().nullable(),
})

export type CreateTaskDTO = z.input<typeof createTaskSchema>
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>
export type CompleteTaskDTO = z.infer<typeof completeTaskSchema>
export type RecurrenceDTO = z.infer<typeof recurrenceSchema>
export type TaskItemDTO = z.infer<typeof taskItemSchema>
