import z from "zod"

export const baseSchema = z.object({
  email: z.string().email("E‑mail inválido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
})

export const loginSchema = baseSchema
export const registerSchema = baseSchema
  .extend({
    name: z.string().min(1, "Nome é obrigatório"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
