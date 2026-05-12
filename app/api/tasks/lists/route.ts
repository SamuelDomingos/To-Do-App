import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const userId = token.sub as string

    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      )
    }

    const simpleTasks = await prisma.task.findMany({
      where: {
        userId,
        type: "SINGLE",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            iconType: true,
            scheduledFor: true,
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
        userId,
        type: "RECURRING",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            iconType: true,
          },
        },
        recurrence: {
          select: {
            id: true,
            pattern: true,
            everyNDays: true,
            daysOfWeek: true,
            everyNWeeks: true,
            daysOfMonth: true,
            everyNMonths: true,
            specificDates: true,
            everyNYears: true,
            timesPerPeriod: true,
            periodType: true,
            startDate: true,
            endDate: true,
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

    return NextResponse.json({
      simpleTasks,
      recurringTasks,
    })
  } catch (error) {
    console.error("Error fetching task lists:", error)
    return NextResponse.json(
      { error: "Erro ao buscar tarefas" },
      { status: 500 }
    )
  }
}
