import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { TasksListResponse } from "@/lib/api/types/tasks.types"
import { ApiResponse } from "@/lib/fetch"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const getLists = async (): Promise<ApiResponse<TasksListResponse>> => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return {
        data: null,
        error: "Não autenticado",
        status: 401,
      }
    }

    const simpleTasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        type: "SINGLE",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
        items: {
          select: {
            id: true,
            title: true,
            completed: true,
            order: true,
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const recurringTasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        type: "RECURRING",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
        recurrence: true,
        items: {
          select: {
            id: true,
            title: true,
            completed: true,
            order: true,
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return {
      data: {
        simpleTasks,
        recurringTasks,
      },
      error: null,
      status: 200,
    }
  } catch (error) {
    console.error("getLists error:", error)
    return {
      data: null,
      error: "Erro ao buscar tarefas",
      status: 500,
    }
  }
}