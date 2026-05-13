import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { updateCategorySchema } from "@/lib/validations/category"
import { getAuthenticatedUser } from "@/lib/auth-middleware"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const categoryId = params.id
    const body = await request.json()

    const validatedData = updateCategorySchema.parse(body)

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      )
    }

    if (existingCategory.userId !== token.id) {
      return NextResponse.json(
        { error: "Você não tem permissão para atualizar esta categoria" },
        { status: 403 }
      )
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: validatedData,
    })

    return NextResponse.json(category, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar categoria" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.category.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar categoria" },
      { status: 500 }
    )
  }
}
