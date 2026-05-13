import prisma from "@/lib/prisma"
import { createTaskSchema, updateTaskSchema } from "@/lib/validations/task"
import { revalidateTag } from "next/cache"
import { cacheTag } from "next/cache"

export class TaskService {
  static async getTasks(
    userId: string,
    filters: {
      date?: string | null
      categoryId?: string | null
      status?: string | null
      type?: string | null
      search?: string | null
    }
  ) {
    "use cache"
    cacheTag(`tasks-${userId}`)

    const { date, categoryId, status, type, search } = filters

    if (!date) {
      throw new Error("A data é obrigatória")
    }

    const selectedDate = new Date(date)
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    const where: any = {
      userId,
      scheduledFor: {
        gte: startOfDay,
        lte: endOfDay,
      },
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          note: {
            contains: search,
            mode: "insensitive",
          },
        },
      ]
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        category: true,
        recurrence: true,
        items: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { completions: true },
        },
      },
      orderBy: { scheduledFor: "asc" },
    })

    return tasks
  }

  static async createTask(userId: string, data: unknown) {
    const validatedData = createTaskSchema.parse(data)

    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
        note: validatedData.note,
        type: validatedData.type,
        answerType: validatedData.answerType,
        categoryId: validatedData.categoryId,
        scheduledFor: validatedData.scheduledFor
          ? new Date(validatedData.scheduledFor)
          : new Date(),
        userId: userId,

        ...(validatedData.recurrence && {
          recurrence: {
            create: {
              pattern: validatedData.recurrence.pattern,
              everyNDays: validatedData.recurrence.everyNDays,
              daysOfWeek: validatedData.recurrence.daysOfWeek,
              everyNWeeks: validatedData.recurrence.everyNWeeks,
              daysOfMonth: validatedData.recurrence.daysOfMonth,
              everyNMonths: validatedData.recurrence.everyNMonths,
              specificDates: validatedData.recurrence.specificDates,
              everyNYears: validatedData.recurrence.everyNYears,
              timesPerPeriod: validatedData.recurrence.timesPerPeriod,
              periodType: validatedData.recurrence.periodType,
              startDate: validatedData.recurrence.startDate
                ? new Date(validatedData.recurrence.startDate)
                : new Date(),
              endDate: validatedData.recurrence.endDate
                ? new Date(validatedData.recurrence.endDate)
                : null,
            },
          },
        }),

        ...(validatedData.items &&
          validatedData.items.length > 0 && {
            items: {
              create: validatedData.items.map((item) => ({
                title: item.title,
                order: item.order,
                completed: item.completed || false,
              })),
            },
          }),
      },
      include: {
        category: true,
        recurrence: true,
        items: {
          orderBy: { order: "asc" },
        },
      },
    })

    // Revalidar cache
    await revalidateTag(`tasks-${userId}`, "max")
    if (validatedData.categoryId) {
      await revalidateTag(`category-${validatedData.categoryId}`, "max")
    }

    return task
  }

  static async getTaskById(userId: string, taskId: string) {
    "use cache"
    cacheTag(`task-${taskId}`)

    const task = await prisma.task.findUnique({
      where: { userId, id: taskId },
      include: {
        category: true,
        recurrence: true,
        items: {
          orderBy: { order: "asc" },
        },
        completions: {
          orderBy: { completedAt: "desc" },
          take: 10,
        },
        _count: {
          select: { completions: true },
        },
      },
    })

    if (!task) {
      throw new Error("Tarefa não encontrada")
    }

    return task
  }

  static async updateTask(taskId: string, data: unknown) {
    const validatedData = updateTaskSchema.parse(data)

    // Verificar se a tarefa existe
    const currentTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: { recurrence: true, items: true },
    })

    if (!currentTask) {
      throw new Error("Tarefa não encontrada")
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.note !== undefined && { note: validatedData.note }),
        ...(validatedData.status && { status: validatedData.status }),
        ...(validatedData.categoryId !== undefined && {
          categoryId: validatedData.categoryId,
        }),

        ...(validatedData.recurrence && {
          recurrence: {
            upsert: {
              create: {
                pattern: validatedData.recurrence.pattern,
                everyNDays: validatedData.recurrence.everyNDays,
                daysOfWeek: validatedData.recurrence.daysOfWeek,
                everyNWeeks: validatedData.recurrence.everyNWeeks,
                daysOfMonth: validatedData.recurrence.daysOfMonth,
                everyNMonths: validatedData.recurrence.everyNMonths,
                specificDates: validatedData.recurrence.specificDates,
                everyNYears: validatedData.recurrence.everyNYears,
                timesPerPeriod: validatedData.recurrence.timesPerPeriod,
                periodType: validatedData.recurrence.periodType,
                startDate: validatedData.recurrence.startDate
                  ? new Date(validatedData.recurrence.startDate)
                  : new Date(),
                endDate: validatedData.recurrence.endDate
                  ? new Date(validatedData.recurrence.endDate)
                  : null,
              },
              update: {
                pattern: validatedData.recurrence.pattern,
                everyNDays: validatedData.recurrence.everyNDays,
                daysOfWeek: validatedData.recurrence.daysOfWeek,
                everyNWeeks: validatedData.recurrence.everyNWeeks,
                daysOfMonth: validatedData.recurrence.daysOfMonth,
                everyNMonths: validatedData.recurrence.everyNMonths,
                specificDates: validatedData.recurrence.specificDates,
                everyNYears: validatedData.recurrence.everyNYears,
                timesPerPeriod: validatedData.recurrence.timesPerPeriod,
                periodType: validatedData.recurrence.periodType,
                startDate: validatedData.recurrence.startDate
                  ? new Date(validatedData.recurrence.startDate)
                  : undefined,
                endDate: validatedData.recurrence.endDate
                  ? new Date(validatedData.recurrence.endDate)
                  : null,
              },
            },
          },
        }),

        ...(validatedData.items && {
          items: {
            deleteMany: {},
            create: validatedData.items.map((item) => ({
              title: item.title,
              order: item.order,
              completed: item.completed,
            })),
          },
        }),
      },
      include: {
        category: true,
        recurrence: true,
        items: {
          orderBy: { order: "asc" },
        },
      },
    })

    // Revalidar cache
    await revalidateTag(`tasks-${currentTask.userId}`, "max")
    await revalidateTag(`task-${taskId}`, "max")
    if (currentTask.categoryId) {
      await revalidateTag(`category-${currentTask.categoryId}`, "max")
    }
    if (
      validatedData.categoryId &&
      validatedData.categoryId !== currentTask.categoryId
    ) {
      await revalidateTag(`category-${validatedData.categoryId}`, "max")
    }

    return updatedTask
  }

  static async deleteTask(taskId: string) {
    // Verificar se a tarefa existe para pegar o userId
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { userId: true, categoryId: true },
    })

    if (!task) {
      throw new Error("Tarefa não encontrada")
    }

    await prisma.task.delete({
      where: { id: taskId },
    })

    // Revalidar cache
    await revalidateTag(`tasks-${task.userId}`, "max")
    await revalidateTag(`task-${taskId}`, "max")
    if (task.categoryId) {
      await revalidateTag(`category-${task.categoryId}`, "max")
    }

    return { success: true }
  }
}
