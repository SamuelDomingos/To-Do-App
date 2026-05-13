"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useAuthForm } from "../_hooks/useAuthForm"
import { LoginForm } from "./loginForm"
import { RegisterForm } from "./registerForm"

export function AuthForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isLogin, setIsLogin] = useState(true)

  const { loginForm, registerForm, onLogin, onRegister, isLoading } =
    useAuthForm()

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isLogin ? "Bem-vindo de volta" : "Criar conta"}
          </CardTitle>

          <CardDescription>
            {isLogin
              ? "Faça login para continuar"
              : "Crie sua conta e comece agora"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={
              isLogin
                ? loginForm.handleSubmit(onLogin)
                : registerForm.handleSubmit(onRegister)
            }
            className="space-y-4"
          >
            {isLogin ? (
              <LoginForm form={loginForm} />
            ) : (
              <RegisterForm form={registerForm} />
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Carregando..." : isLogin ? "Entrar" : "Criar conta"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {isLogin ? "Não tem conta? " : "Já tem conta? "}

            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold underline underline-offset-4 hover:no-underline"
            >
              {isLogin ? "Cadastre-se" : "Faça login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
