import {
  TasksListResponse,
  CreateSimpleTaskInput,
  CreateRecurringTaskInput,
  UpdateTaskInput,
  CreateTaskResponse,
  DeleteTaskResponse,
} from "@/lib/api/types/tasks.types"
import { getServerSession } from "next-auth"

export const getLists = async (): Promise<TasksListResponse> => {
  const session = await getServerSession()

  if (!session) {
    throw new Error("Não autenticado")
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/lists`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    }
  )

  if (!response.ok) {
    throw new Error("Erro ao buscar tarefas")
  }

  return response.json()
}

export const createTask = async (
  data: CreateSimpleTaskInput | CreateRecurringTaskInput
): Promise<CreateTaskResponse> => {
  const session = await getSession()

  if (!session) {
    throw new Error("Não autenticado")
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Erro ao criar tarefa")
  }

  return response.json()
}

export const getTask = async (taskId: string): Promise<CreateTaskResponse> => {
  const session = await getSession()

  if (!session) {
    throw new Error("Não autenticado")
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    }
  )

  if (!response.ok) {
    throw new Error("Tarefa não encontrada")
  }

  return response.json()
}

export const updateTask = async (
  taskId: string,
  data: UpdateTaskInput
): Promise<CreateTaskResponse> => {
  const session = await getSession()

  if (!session) {
    throw new Error("Não autenticado")
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Erro ao atualizar tarefa")
  }

  return response.json()
}

export const deleteTask = async (
  taskId: string
): Promise<DeleteTaskResponse> => {
  const session = await getSession()

  if (!session) {
    throw new Error("Não autenticado")
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Erro ao deletar tarefa")
  }

  return response.json()
}

export const completeTask = async (
  taskId: string,
  data?: {
    answer?: boolean
    itemsSnapshot?: Record<string, boolean>
    note?: string
  }
): Promise<{ task: CreateTaskResponse; completion: any }> => {
  const session = await getSession()

  if (!session) {
    throw new Error("Não autenticado")
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data || {}),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Erro ao completar tarefa")
  }

  return response.json()
}

export const uncompleteTask = async (
  taskId: string
): Promise<{ success: boolean }> => {
  const session = await getSession()

  if (!session) {
    throw new Error("Não autenticado")
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}/complete`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Erro ao desmarcar tarefa")
  }

  return response.json()
}
