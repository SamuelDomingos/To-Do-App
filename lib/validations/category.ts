import z from "zod"

export const createCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida (use formato #RRGGBB)"),
  icon: z.string().min(1, "Ícone é obrigatório"),
})

export const updateCategorySchema = createCategorySchema.partial()

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>