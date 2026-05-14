import { Recurrence } from "@/generated/prisma/client"

export function shouldRecurringTaskAppearOnDate(
  recurrence: Recurrence,
  date: Date
): boolean {
  if (!recurrence) return false

  const startDate = recurrence.startDate
    ? new Date(recurrence.startDate + "T00:00:00")
    : null
  const endDate = recurrence.endDate
    ? new Date(recurrence.endDate + "T23:59:59")
    : null

  if (startDate && date < startDate) return false

  if (endDate && date > endDate) return false

  const dayOfWeek = date.getDay()
  const dayOfMonth = date.getDate()
  const monthDay = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(dayOfMonth).padStart(2, "0")}`

  switch (recurrence.pattern) {
    case "DAILY":
      return true

    case "WEEKLY":
      return recurrence.daysOfWeek?.includes(dayOfWeek) || false

    case "MONTHLY":
      return recurrence.daysOfMonth?.includes(dayOfMonth) || false

    case "YEARLY":
      return recurrence.specificDates?.includes(monthDay) || false

    case "CUSTOM":
      if (!recurrence.everyNDays || !startDate) return false
      const diffTime = date.getTime() - startDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      return diffDays >= 0 && diffDays % recurrence.everyNDays === 0

    default:
      return false
  }
}
