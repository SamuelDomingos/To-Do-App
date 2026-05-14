import prisma from "@/lib/prisma"
import { completeTaskSchema } from "@/lib/validations/task"
import { revalidateTag } from "next/cache"

export class TaskCompletionService {
  static async completeTask(taskId: string, data: unknown) {
    const validatedData = completeTaskSchema.parse(data)

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { items: true },
    })

    if (!task) {
      throw new Error("Tarefa não encontrada")
    }

    const completion = await prisma.taskCompletion.create({
      data: {
        taskId,
        answer: validatedData.answer,
        itemsSnapshot: validatedData.itemsSnapshot
          ? JSON.parse(JSON.stringify(validatedData.itemsSnapshot))
          : null,
        note: validatedData.note,
      },
    })

    let updatedTask = task

    if (task.type === "SINGLE") {
      updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { status: "COMPLETED" },
        include: {
          category: true,
          recurrence: true,
          items: true,
          completions: {
            orderBy: { completedAt: "desc" },
            take: 1,
          },
        },
      })
    } else {
      updatedTask =
        (await prisma.task.findUnique({
          where: { id: taskId },
          include: {
            category: true,
            recurrence: true,
            items: true,
            completions: {
              orderBy: { completedAt: "desc" },
              take: 1,
            },
          },
        })) || task
    }

    await revalidateTag(`tasks-${task.userId}`, "max")
    await revalidateTag(`task-${taskId}`, "max")

    return {
      task: updatedTask,
      completion,
    }
  }

  static async uncompleteTask(taskId: string) {
    const lastCompletion = await prisma.taskCompletion.findFirst({
      where: { taskId },
      orderBy: { completedAt: "desc" },
    })

    if (!lastCompletion) {
      throw new Error("Nenhuma conclusão encontrada")
    }

    await prisma.taskCompletion.delete({
      where: { id: lastCompletion.id },
    })

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    })

    if (task?.type === "SINGLE") {
      await prisma.task.update({
        where: { id: taskId },
        data: { status: "PENDING" },
      })
    }

    await revalidateTag(`tasks-${task?.userId}`, "max")
    await revalidateTag(`task-${taskId}`, "max")

    return { success: true }
  }
}
