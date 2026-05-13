import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-middleware"
import { CategoryService } from "../services/index.services"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const category = await CategoryService.getCategoryById(
      token.sub as string,
      params.id
    )

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar categoria" },
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
    const category = await CategoryService.updateCategory(
      token.sub as string,
      params.id,
      body
    )

    return NextResponse.json(category)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar categoria" },
      { status: 400 }
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

    await CategoryService.deleteCategory(token.sub as string, params.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao deletar categoria" },
      { status: 400 }
    )
  }
}
