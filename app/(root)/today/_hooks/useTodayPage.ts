"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { Filters, Task } from "../_interfaces/index.interfaces"
import { updateTodayFilters } from "../_actions/todayActions"

interface UseTodayPageOptions {
  initialTasks: Task[]
  initialSelectedDate: number
  currentMonth: number
  currentYear: number
  initialFilters: Filters
}

const useTodayPage = ({
  initialSelectedDate,
  initialTasks,
  initialFilters,
  currentYear,
  currentMonth,
}: UseTodayPageOptions) => {
  const router = useRouter()

  const today = new Date()

  const isDateAllowed = (date: number) => {
    const selected = new Date(currentYear, currentMonth, date)
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return selected <= todayMidnight
  }

  const getFormattedSelectedDate = (date: number) => {
    const d = new Date(currentYear, currentMonth, date)
    return d.toLocaleDateString("pt-BR", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
  }

  const handleSelectDate = useCallback(
    async (date: number) => {
      const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`

      const newFilters: Filters = { ...initialFilters, date: formattedDate }

      await updateTodayFilters(newFilters)

      const params = new URLSearchParams()
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) params.set(key, value)
      })

      router.push(`/today?${params.toString()}`)
    },
    [currentMonth, currentYear, initialFilters, router]
  )

  return {
    selectedDate: initialSelectedDate,
    currentTasks: initialTasks,
    getFormattedSelectedDate,
    handleSelectDate,
    isDateDisabled: !isDateAllowed(initialSelectedDate),
  }
}

export default useTodayPage