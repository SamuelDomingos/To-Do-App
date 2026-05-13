import { Category } from "@/generated/prisma/client"
import { apiFetch, ApiResponse } from "../fetch"

export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  return apiFetch(`/api/categories`, {
    method: "GET",
    credentials: "include",
  })
}

export const getCategoryById = async (
  id: string
): Promise<ApiResponse<Category>> => {
  return apiFetch(`/api/categories/${id}`, {
    method: "GET",
    credentials: "include",
  })
}

export const createCategory = async (data: {
  name: string
  icon: string
  color: string
}): Promise<ApiResponse<Category>> => {
  return apiFetch(`/api/categories`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export const updateCategory = async (
  id: string,
  data: {
    name?: string
    icon?: string
    color?: string
  }
): Promise<ApiResponse<Category>> => {
  return apiFetch(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export const deleteCategory = async (
  id: string
): Promise<ApiResponse<{ success: boolean }>> => {
  return apiFetch(`/api/categories/${id}`, {
    method: "DELETE",
  })
}
