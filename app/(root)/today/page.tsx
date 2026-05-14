import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import TodayIndex from "./_components"
import { getTodayTasks } from "./_services/getTodayTasks"
import Error from "@/components/error"

export default async function PageToday({
  searchParams,
}: {
  searchParams: Promise<{
    date?: string
    categoryId?: string
    status?: string
    type?: string
    search?: string
  }>
}) {
  const params = await searchParams

  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <Error error="Não autenticado" />
  }

  const userId = session.user.id

  const today = new Date()

  const todayFormatted = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  const selectedDate = params.date || todayFormatted

  const [year, month, day] = selectedDate
    .split("-")
    .map(Number)

  const filters = {
    date: selectedDate,

    categoryId: params.categoryId || null,
    status: params.status || null,
    type: params.type || null,
    search: params.search || null,
  }

  const tasksResponse = await getTodayTasks(userId, filters)

  return (
    <TodayIndex
      initialTasks={tasksResponse.data || []}
      initialSelectedDate={day}
      currentMonth={month - 1}
      currentYear={year}
      initialFilters={filters}
    />
  )
}