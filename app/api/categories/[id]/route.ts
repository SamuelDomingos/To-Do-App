import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { updateCategorySchema } from "@/lib/validations/category"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const validatedData = updateCategorySchema.parse(body)

    const category = await prisma.category.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(category)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      )
    }

    if ((error as any)?.code === "P2025") {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
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
