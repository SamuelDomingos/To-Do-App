import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-middleware"
import { CategoryService } from "../services/index.services"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { id } = await params

    const category = await CategoryService.getCategoryById(
      token.sub as string,
      id
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const category = await CategoryService.updateCategory(
      token.sub as string,
      id,
      body
    )

    return NextResponse.json(category)
  } catch (error: any) {
    if (error.message?.includes("não encontrada")) {
      return NextResponse.json(
        { error: error.message || "Categoria não encontrada" },
        { status: 404 }
      )
    }

    if (error.message?.includes("globais")) {
      return NextResponse.json(
        { error: error.message || "Não é possível editar categorias globais" },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: error.message || "Erro ao atualizar categoria" },
      { status: 400 }
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

    await CategoryService.deleteCategory(token.sub as string, id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message?.includes("não encontrada")) {
      return NextResponse.json(
        { error: error.message || "Categoria não encontrada" },
        { status: 404 }
      )
    }

    if (error.message?.includes("globais")) {
      return NextResponse.json(
        { error: error.message || "Não é possível deletar categorias globais" },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: error.message || "Erro ao deletar categoria" },
      { status: 400 }
    )
  }
}
