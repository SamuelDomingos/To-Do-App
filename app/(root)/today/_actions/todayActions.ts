"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Filters } from "../_interfaces/index.interfaces"

export async function updateTodayFilters(filters: Filters) {
  const params = new URLSearchParams()

  if (filters.date) {
    params.set("date", filters.date)
  }
  if (filters.categoryId) {
    params.set("categoryId", filters.categoryId)
  }
  if (filters.status) {
    params.set("status", filters.status)
  }
  if (filters.type) {
    params.set("type", filters.type)
  }
  if (filters.search) {
    params.set("search", filters.search)
  }

  const queryString = params.toString()
  revalidatePath("/today")
  redirect(`/today${queryString ? `?${queryString}` : ""}`)
}
