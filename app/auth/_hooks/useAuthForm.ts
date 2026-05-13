import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useState } from "react"

import { signIn } from "next-auth/react"
import {
  LoginFormData,
  loginSchema,
  RegisterFormData,
  registerSchema,
} from "../_schemas/authSchemas"
import { register } from "@/lib/api/auth"
import { toast } from "sonner"

export const useAuthForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      setIsLoading(false)

      if (result?.error) {
        toast.error(result?.error)
        return
      }

      toast.success("Seja bem vindo novamente!")
      router.push("/tasks")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  const onRegister = async (data: RegisterFormData) => {
    setIsLoading(true)
    const payload = {
      email: data.email,
      password: data.password,
      name: data.name,
    }
    try {
      await register(payload)
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      setIsLoading(false)

      if (result?.error) {
        toast(result.error)
        return
      }
      toast.success("Conta criada com sucesso!")
      router.push("/tasks")
    } catch (e) {
      toast(e instanceof Error ? e.message : "Erro inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    loginForm,
    registerForm,
    onLogin,
    onRegister,
    isLoading,
  }
}
