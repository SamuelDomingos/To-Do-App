import { getAuthenticatedUser } from "@/lib/auth-middleware"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { CategoryService } from "./services/index.services"

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const userId = token.sub as string

    const categories = await CategoryService.getCategories(userId)

    return NextResponse.json(categories)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
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

    const body = await request.json()
    const userId = token.sub as string

    const category = await CategoryService.createCategory(userId, body)

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error },
        { status: 400 }
      )
    }

    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Erro ao criar categoria" },
      { status: 500 }
    )
  }
}