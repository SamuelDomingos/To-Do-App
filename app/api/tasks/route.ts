import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-middleware"
import { TaskService } from "./services/index.services"

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const userId = token.sub as string
    const body = await request.json()

    const task = await TaskService.createTask(userId, body)

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar tarefa" }, { status: 500 })
  }
}
