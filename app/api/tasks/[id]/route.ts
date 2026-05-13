import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-middleware"
import { TaskService } from "../services/index.services"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const userId = token.sub as string
    const { id } = await params
    
    const task = await TaskService.getTaskById(userId, id)

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json(
      { error: error },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    
    const task = await TaskService.updateTask(id, body)

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json(
      { error: error },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { id } = await params
    
    const result = await TaskService.deleteTask(id)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error },
      { status: 500 }
    )
  }
}