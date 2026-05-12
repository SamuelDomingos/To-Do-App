import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { completeTaskSchema } from "@/lib/validations/task"
import { getAuthenticatedUser } from "@/lib/auth-middleware"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()

    const validatedData = completeTaskSchema.parse(body)

    const task = await prisma.task.findUnique({
      where: { id: params.id },
      include: { items: true },
    })

    if (!task) {
      return NextResponse.json(
        { error: "Tarefa não encontrada" },
        { status: 404 }
      )
    }

    const completion = await prisma.taskCompletion.create({
      data: {
        taskId: params.id,
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
        where: { id: params.id },
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
          where: { id: params.id },
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

    return NextResponse.json(
      {
        task: updatedTask,
        completion,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error completing task:", error)
    return NextResponse.json(
      { error: "Erro ao completar tarefa" },
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

    const lastCompletion = await prisma.taskCompletion.findFirst({
      where: { taskId: params.id },
      orderBy: { completedAt: "desc" },
    })

    if (!lastCompletion) {
      return NextResponse.json(
        { error: "Nenhuma conclusão encontrada para esta tarefa" },
        { status: 404 }
      )
    }

    await prisma.taskCompletion.delete({
      where: { id: lastCompletion.id },
    })

    const task = await prisma.task.findUnique({
      where: { id: params.id },
    })

    if (task?.type === "SINGLE") {
      await prisma.task.update({
        where: { id: params.id },
        data: { status: "PENDING" },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error uncompleting task:", error)
    return NextResponse.json(
      { error: "Erro ao desmarcar conclusão" },
      { status: 500 }
    )
  }
}
