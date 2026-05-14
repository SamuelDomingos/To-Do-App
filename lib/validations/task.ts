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
    pattern: z.enum(RecurrencePattern),

    everyNDays: z.number().int().positive().optional(),

    daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
    everyNWeeks: z.number().int().positive().optional(),

    daysOfMonth: z.array(z.number().int().min(1).max(31)).optional(),
    everyNMonths: z.number().int().positive().optional(),

    specificDates: z.array(z.string().regex(/^\d{2}-\d{2}$/)).optional(),
    everyNYears: z.number().int().positive().optional(),

    timesPerPeriod: z.number().int().positive().optional(),
    periodType: z.enum(PeriodType).optional(),

    startDate: z.string().min(1, "Data de início é obrigatória"),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.pattern === "WEEKLY" &&
        (!data.daysOfWeek || data.daysOfWeek.length === 0)
      ) {
        return false
      }
      return true
    },
    {
      message: "Selecione ao menos um dia da semana",
      path: ["daysOfWeek"],
    }
  )
  .refine(
    (data) => {
      if (
        data.pattern === "MONTHLY" &&
        (!data.daysOfMonth || data.daysOfMonth.length === 0)
      ) {
        return false
      }
      return true
    },
    {
      message: "Selecione ao menos um dia do mês",
      path: ["daysOfMonth"],
    }
  )
  .refine(
    (data) => {
      if (
        data.pattern === "YEARLY" &&
        (!data.specificDates || data.specificDates.length === 0)
      ) {
        return false
      }
      return true
    },
    {
      message: "Selecione a data anual",
      path: ["specificDates"],
    }
  )
  .refine(
    (data) => {
      if (data.pattern === "CUSTOM" && !data.everyNDays) {
        return false
      }
      return true
    },
    {
      message: "Informe a quantidade de dias",
      path: ["everyNDays"],
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
    type: z.enum(TaskType).default("SINGLE"),
    answerType: z.enum(AnswerType).default("YES_NO"),
    categoryId: z.uuid("ID de categoria inválido"),
    scheduledFor: z.string().min(0).default(""),

    recurrence: recurrenceSchema.optional().nullable(),

    items: z.array(taskItemSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.type === "SINGLE" && !data.scheduledFor) {
        return false
      }
      return true
    },
    {
      message: "Data é obrigatória para tarefas simples",
      path: ["scheduledFor"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "RECURRING" && !data.recurrence) {
        return false
      }
      return true
    },
    {
      message: "Dados de recorrência são obrigatórios para tarefas recorrentes",
      path: ["recurrence"],
    }
  )
  .refine(
    (data) => {
      if (
        data.answerType === "CHECKLIST" &&
        (!data.items || data.items.length === 0)
      ) {
        return false
      }
      return true
    },
    {
      message: "Itens são obrigatórios para tarefas de checklist",
      path: ["items"],
    }
  )

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  note: z.string().max(2000).optional().nullable(),
  status: z.enum(TaskStatus).optional(),
  categoryId: z.uuid().optional(),
  scheduledFor: z.string().optional(),
  recurrence: recurrenceSchema.optional().nullable(),
  items: z.array(taskItemSchema).optional(),
})

export const completeTaskSchema = z.object({
  answer: z.boolean().optional(),
  itemsSnapshot: z.record(z.string(), z.boolean()).optional(),
  note: z.string().max(500).optional(),
})

export type CreateTaskDTO = z.input<typeof createTaskSchema>
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>
export type CompleteTaskDTO = z.infer<typeof completeTaskSchema>
export type RecurrenceDTO = z.infer<typeof recurrenceSchema>
export type TaskItemDTO = z.infer<typeof taskItemSchema>
