import {
  CreateSimpleTaskInput,
  CreateRecurringTaskInput,
  UpdateTaskInput,
  CreateTaskResponse,
  DeleteTaskResponse,
} from "@/lib/api/types/tasks.types"

import { apiFetch, ApiResponse } from "../fetch"
export const createTask = async (
  data: CreateSimpleTaskInput | CreateRecurringTaskInput
): Promise<ApiResponse<CreateTaskResponse>> => {
  return apiFetch("/api/tasks", {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
  })
}

export const getTask = async (
  taskId: string
): Promise<ApiResponse<CreateTaskResponse>> => {
  return apiFetch(`/api/tasks/${taskId}`, {
    method: "GET",
    credentials: "include",
  })
}

export const updateTask = async (
  taskId: string,
  data: UpdateTaskInput
): Promise<ApiResponse<CreateTaskResponse>> => {
  return apiFetch(`/api/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(data),
    credentials: "include",
  })
}

export const deleteTask = async (
  taskId: string
): Promise<ApiResponse<DeleteTaskResponse>> => {
  return apiFetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
    credentials: "include",
  })
}

export const completeTask = async (
  taskId: string,
  data?: {
    answer?: boolean
    itemsSnapshot?: Record<string, boolean>
    note?: string
  }
): Promise<
  ApiResponse<{
    task: CreateTaskResponse
    completion: any
  }>
> => {
  return apiFetch(`/api/tasks/${taskId}/complete`, {
    method: "POST",
    body: JSON.stringify(data || {}),
    credentials: "include",
  })
}

export const uncompleteTask = async (
  taskId: string
): Promise<ApiResponse<{ success: boolean }>> => {
  return apiFetch(`/api/tasks/${taskId}/complete`, {
    method: "DELETE",
    credentials: "include",
  })
}
