import prisma from "@/lib/prisma"
import { ApiResponse } from "@/lib/fetch"

export const getTodayTasks = async (
  userId: string,
  filters: {
    date: string
    categoryId?: string | null
    status?: string | null
    type?: string | null
    search?: string | null
  }
): Promise<ApiResponse<any>> => {
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

    const where: any = {
      userId,

      scheduledFor: date,
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
          orderBy: {
            order: "asc",
          },
        },

        _count: {
          select: {
            completions: true,
          },
        },
      },

      orderBy: {
        scheduledFor: "asc",
      },
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
