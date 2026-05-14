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

    if (!task) throw new Error("Tarefa não encontrada")

    const normalizedSnapshot = validatedData.itemsSnapshot
      ? JSON.parse(JSON.stringify(validatedData.itemsSnapshot))
      : null

    const lastCompletion = await prisma.taskCompletion.findFirst({
      where: { taskId },
      orderBy: { completedAt: "desc" },
    })

    let completion

    if (lastCompletion) {
      completion = await prisma.taskCompletion.update({
        where: { id: lastCompletion.id },
        data: {
          answer: validatedData.answer,
          note: validatedData.note,
          itemsSnapshot: normalizedSnapshot,
        },
      })
    } else {
      completion = await prisma.taskCompletion.create({
        data: {
          taskId,
          answer: validatedData.answer,
          note: validatedData.note,
          itemsSnapshot: normalizedSnapshot,
        },
      })
    }

    const updatedTask = await prisma.task.update({
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

    await revalidateTag(`tasks-${task.userId}`, "max")
    await revalidateTag(`task-${taskId}`, "max")

    return { task: updatedTask, completion }
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

    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status: "PENDING" },
    })

    await revalidateTag(`tasks-${task.userId}`, "max")
    await revalidateTag(`task-${taskId}`, "max")

    return { success: true }
  }
}
