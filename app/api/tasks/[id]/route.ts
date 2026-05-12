import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { updateTaskSchema } from "@/lib/validations/task"
import prisma from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/auth-middleware"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const userId = token.sub as string

    const task = await prisma.task.findUnique({
      where: { userId, id: params.id },
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
      return NextResponse.json(
        { error: "Tarefa não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json(
      { error: "Erro ao buscar tarefa" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()

    const validatedData = updateTaskSchema.parse(body)

    const currentTask = await prisma.task.findUnique({
      where: { id: params.id },
      include: { recurrence: true, items: true },
    })

    if (!currentTask) {
      return NextResponse.json(
        { error: "Tarefa não encontrada" },
        { status: 404 }
      )
    }

    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.note !== undefined && { note: validatedData.note }),
        ...(validatedData.status && { status: validatedData.status }),
        ...(validatedData.categoryId && {
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

    return NextResponse.json(task)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Erro ao atualizar tarefa" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }
    await prisma.task.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json(
      { error: "Erro ao deletar tarefa" },
      { status: 500 }
    )
  }
}
