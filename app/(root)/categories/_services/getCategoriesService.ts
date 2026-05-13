import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { cache } from "react"

export const getCategories = cache(async () => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return {
        data: null,
        error: "Não autenticado",
        status: 401,
      }
    }

    const categories = await prisma.category.findMany({
      where: {
        OR: [{ isGlobal: true }, { userId: session?.user?.id }],
      },
      include: {
        tasks: {
          select: {
            id: true,
          },
        },
      },
      orderBy: [{ isGlobal: "desc" }, { createdAt: "desc" }],
    })

    const globalCategories = categories.filter((cat) => cat.isGlobal)
    const customCategories = categories.filter((cat) => !cat.isGlobal)

    return {
      error: null,
      globalCategories,
      customCategories,
      allCategories: categories,
    }
  } catch (error) {
    console.error(error)
    return {
      error: "Erro ao buscar categorias",
      globalCategories: [],
      customCategories: [],
      allCategories: [],
    }
  }
})
