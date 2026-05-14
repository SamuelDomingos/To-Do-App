"use client"

import { useCallback, useState } from "react"
import { Filters, Task } from "../_interfaces/index.interfaces"
import { updateTodayFilters } from "../_actions/todayActions"
import { useRouter } from "next/navigation"

const useTodayPage = ({
  initialSelectedDate,
  initialTasks,
  initialFilters,
  currentYear,
  currentMonth,
}: {
  initialTasks: Task[]
  initialSelectedDate: number
  currentMonth: number
  currentYear: number
  initialFilters: Filters
}) => {
  const router = useRouter()

  const currentTasks = initialTasks
  const selectedDate = initialSelectedDate

  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(
    {}
  )

  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(
    {}
  )

  const today = new Date()

  const getFormattedSelectedDate = (date: number) => {
    const d = new Date(currentYear, currentMonth, date)

    return d.toLocaleDateString("pt-BR", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
  }

  const isDateAllowed = (date: number) => {
    const selectedDateObj = new Date(currentYear, currentMonth, date)

    const todayObj = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )

    return selectedDateObj <= todayObj
  }

  const handleSelectDate = useCallback(
    async (date: number) => {
      const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(date).padStart(2, "0")}`

      const newFilters: Filters = {
        ...initialFilters,
        date: formattedDate,
      }

      await updateTodayFilters(newFilters)

      const params = new URLSearchParams()

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        }
      })

      router.push(`/today?${params.toString()}`)
    },
    [currentMonth, currentYear, initialFilters, router]
  )

  const isDateDisabled = !isDateAllowed(selectedDate)

  return {
    selectedDate,
    completedTasks,
    setCompletedTasks,
    completedItems,
    setCompletedItems,
    getFormattedSelectedDate,
    currentTasks,
    handleSelectDate,
    isDateDisabled,
  }
}

export default useTodayPage
