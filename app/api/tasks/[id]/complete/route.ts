import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-middleware"
import { TaskCompletionService } from "../../services/task-completion.services"

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()

    const result = await TaskCompletionService.completeTask(id, body)

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error completing task:", error)

    return NextResponse.json(
      { error: "Erro ao completar tarefa" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const result = await TaskCompletionService.uncompleteTask(id)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error uncompleting task:", error)

    return NextResponse.json(
      { error: "Erro ao desmarcar tarefa" },
      { status: 500 }
    )
  }
}
