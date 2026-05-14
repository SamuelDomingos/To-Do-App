
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/lib/fetch"
import { TaskStatus } from "@/generated/prisma/enums"
import { ItemsSnapshot, Task } from "../_interfaces/index.interfaces"
import { shouldRecurringTaskAppearOnDate } from "./shouldRecurringTaskAppearOnDate"
import { Prisma } from "@/generated/prisma/client"

export const getTodayTasks = async (
  userId: string,
  filters: {
    date: string
    categoryId?: string | null
    status?: string | null
    type?: string | null
    search?: string | null
  }
): Promise<ApiResponse<Task[]>> => {
  try {
    if (!userId) {
      return {
        data: null,
        error: "Não autenticado",
        status: 401,
      }
    }

    const { date, categoryId, status, type, search } = filters

    if (!date) {
      return {
        data: null,
        error: "A data é obrigatória",
        status: 400,
      }
    }

    const targetDate = new Date(date + "T00:00:00")
    const taskStatus = status ? (status as TaskStatus) : undefined

    const simpleWhere: Prisma.TaskWhereInput = {
      userId,
      type: "SINGLE",
      scheduledFor: date,
      status: taskStatus,
    }

    if (categoryId) simpleWhere.categoryId = categoryId
    if (search) {
      simpleWhere.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { note: { contains: search, mode: "insensitive" } },
      ]
    }

    const recurringWhere: Prisma.TaskWhereInput = {
      userId,
      type: "RECURRING",
      status: taskStatus,
      recurrence: {
        startDate: { lte: date },
        OR: [{ endDate: null }, { endDate: { gte: date } }],
      },
    }

    if (categoryId) recurringWhere.categoryId = categoryId
    if (search) {
      recurringWhere.OR = [
        ...(recurringWhere.OR || []),
        { title: { contains: search, mode: "insensitive" } },
        { note: { contains: search, mode: "insensitive" } },
      ]
    }

    const [simpleTasks, allRecurringTasks] = await Promise.all([
      prisma.task.findMany({
        where: simpleWhere,
        include: {
          category: { select: { name: true, color: true, icon: true } },
          recurrence: true,
          items: { orderBy: { order: "asc" } },
          completions: {
            orderBy: { completedAt: "desc" },
            take: 1,
          },
        },
        orderBy: { scheduledFor: "asc" },
      }),
      prisma.task.findMany({
        where: recurringWhere,
        include: {
          category: { select: { name: true, color: true, icon: true } },
          recurrence: true,
          items: { orderBy: { order: "asc" } },
          completions: {
            orderBy: { completedAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "asc" },
      }),
    ])

    const filteredRecurringTasks = allRecurringTasks.filter((task) => {
      if (!task.recurrence) return false
      return shouldRecurringTaskAppearOnDate(task.recurrence, targetDate)
    })

    const recurringTasksWithStatus = filteredRecurringTasks.map((task) => {
      const todayCompletion = task.completions?.[0]
      const wasCompletedToday =
        todayCompletion &&
        new Date(todayCompletion.completedAt).toDateString() ===
          targetDate.toDateString()

      return {
        ...task,
        scheduledFor: date,
        status: wasCompletedToday ? "COMPLETED" : task.status,
      }
    })

    let allTasks = [...simpleTasks, ...recurringTasksWithStatus]

    if (status) {
      allTasks = allTasks.filter((task) => task.status === status)
    }

    if (type) {
      allTasks = allTasks.filter((task) => task.type === type)
    }

    const tasks: Task[] = allTasks.map((task) => {
      const rawSnapshot = task.completions?.[0]?.itemsSnapshot
      const snapshot: ItemsSnapshot =
        rawSnapshot &&
        typeof rawSnapshot === "object" &&
        !Array.isArray(rawSnapshot)
          ? (rawSnapshot as ItemsSnapshot)
          : {}

      return {
        id: task.id,
        title: task.title,
        note: task.note,
        type: task.type,
        answerType: task.answerType,
        status: task.status,
        scheduledFor: task.scheduledFor,
        userId: task.userId,
        categoryId: task.categoryId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        category: task.category,
        recurrence: task.recurrence,
        items: task.items.map((item) => ({
          id: item.id,
          title: item.title,
          completed: !!snapshot[item.id],
          order: item.order,
        })),
      }
    })

    return {
      data: tasks,
      error: null,
      status: 200,
    }
  } catch (error) {
    console.error("getTodayTasks error:", error)
    return {
      data: null,
      error: "Erro ao buscar tarefas",
      status: 500,
    }
  }
}