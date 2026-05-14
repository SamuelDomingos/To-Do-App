import prisma from "@/lib/prisma"
import { createTaskSchema, updateTaskSchema } from "@/lib/validations/task"
import { revalidateTag } from "next/cache"
import { cacheTag } from "next/cache"

export class TaskService {
  static async createTask(userId: string, data: unknown) {
    const validatedData = createTaskSchema.parse(data)

    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
        note: validatedData.note,
        type: validatedData.type,
        answerType: validatedData.answerType,
        categoryId: validatedData.categoryId,
        scheduledFor: validatedData.scheduledFor,
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
              startDate: validatedData.recurrence.startDate,
              endDate: validatedData.recurrence.endDate || null,
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
        ...(validatedData.scheduledFor !== undefined && {
          scheduledFor: validatedData.scheduledFor,
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
                startDate: validatedData.recurrence.startDate,
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
                startDate: validatedData.recurrence.startDate,
                endDate: validatedData.recurrence.endDate || null,
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

    await revalidateTag(`tasks-${task.userId}`, "max")
    await revalidateTag(`task-${taskId}`, "max")
    if (task.categoryId) {
      await revalidateTag(`category-${task.categoryId}`, "max")
    }

    return { success: true }
  }
}
