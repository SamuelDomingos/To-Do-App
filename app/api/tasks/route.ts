import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createTaskSchema } from "@/lib/validations/task"
import { TaskStatus, TaskType } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const userId = token.sub as string

    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json(
        { error: "A data é obrigatória" },
        { status: 400 }
      )
    }
    const selectedDate = new Date(date)

    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    const categoryId = searchParams.get("categoryId")
    const status = searchParams.get("status") as TaskStatus | null
    const type = searchParams.get("type") as TaskType | null
    const search = searchParams.get("search")

    const where: any = {
      userId,
      createdAt: {
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
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json(
      { error: "Erro ao buscar tarefas" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const userId = token.sub as string
    const body = await request.json()

    const validatedData = createTaskSchema.parse(body)

    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
        note: validatedData.note,
        type: validatedData.type,
        answerType: validatedData.answerType,
        categoryId: validatedData.categoryId,
        scheduledFor: validatedData.scheduledFor
          ? new Date(validatedData.scheduledFor)
          : new Date(), // ← ADICIONE
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

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.format() },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Erro ao criar tarefa" }, { status: 500 })
  }
}
