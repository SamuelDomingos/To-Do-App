// _interfaces/index.interfaces.ts
import {
  Recurrence,
  TaskCompletion,
  Task as PrismaTask,
  Category,
  TaskItem as PrismaTaskItem,
} from "@/generated/prisma/client"

export type { Recurrence, TaskCompletion }

export interface TaskItem {
  id: string
  title: string
  completed: boolean
  order: number
}

export interface Task {
  id: string
  title: string
  note: string | null
  type: string
  answerType: string
  status: string
  scheduledFor: string
  userId: string
  categoryId: string
  createdAt: Date | string
  updatedAt: Date | string
  category: Pick<Category, "name" | "color" | "icon">
  recurrence: Recurrence | null
  items: TaskItem[]
}

export interface Filters {
  date: string
  categoryId?: string | null
  status?: string | null
  type?: string | null
  search?: string | null
}

export type ItemsSnapshot = Record<string, boolean>
