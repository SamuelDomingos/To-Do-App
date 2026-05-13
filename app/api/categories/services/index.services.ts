import prisma from "@/lib/prisma"
import { createCategorySchema } from "@/lib/validations/category"
import { revalidateTag } from "next/cache"
import { cacheTag } from "next/cache"

export class CategoryService {
  static async getCategories(userId: string) {
    "use cache"
    cacheTag(`categories-${userId}`)

    const categories = await prisma.category.findMany({
      where: {
        OR: [{ isGlobal: true }, { userId: userId }],
      },
      orderBy: { createdAt: "desc" },
    })

    return categories
  }

  static async createCategory(userId: string, data: unknown) {
    const validatedData = createCategorySchema.parse(data)

    const category = await prisma.category.create({
      data: {
        ...validatedData,
        userId: userId,
      },
    })

    await revalidateTag(`categories-${userId}`, 'max')

    return category
  }

  static async getCategoryById(userId: string, categoryId: string) {
    "use cache"
    cacheTag(`category-${categoryId}`)

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        OR: [{ isGlobal: true }, { userId: userId }],
      },
    })

    return category
  }

  static async updateCategory(
    userId: string,
    categoryId: string,
    data: unknown
  ) {
    const existingCategory = await this.getCategoryById(userId, categoryId)

    if (!existingCategory) {
      throw new Error("Categoria não encontrada")
    }

    if (existingCategory.isGlobal) {
      throw new Error("Não é possível editar categorias globais")
    }

    const updateData = data as {
      name?: string
      icon?: string
      color?: string
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
    })

    await revalidateTag(`categories-${userId}`, 'max')
    await revalidateTag(`category-${categoryId}`, 'max')

    return updatedCategory
  }

  static async deleteCategory(userId: string, categoryId: string) {
    const existingCategory = await this.getCategoryById(userId, categoryId)

    if (!existingCategory) {
      throw new Error("Categoria não encontrada")
    }

    if (existingCategory.isGlobal) {
      throw new Error("Não é possível deletar categorias globais")
    }

    await prisma.category.delete({
      where: { id: categoryId },
    })

    await revalidateTag(`categories-${userId}`, 'max')
    await revalidateTag(`category-${categoryId}`, 'max')

    return { success: true }
  }
}