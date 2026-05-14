export interface Category {
  id: string
  name: string
  color: string
  icon: string
}

export interface TaskItem {
  id: string
  title: string
  completed: boolean
  order: number
}

export interface Recurrence {
  id: string

  pattern: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'CUSTOM'

  everyNDays: number | null

  daysOfWeek: number[]

  everyNWeeks: number | null

  daysOfMonth: number[]

  everyNMonths: number | null

  specificDates: string[]

  everyNYears: number | null

  timesPerPeriod: number | null

  periodType: 'WEEK' | 'MONTH' | 'YEAR' | null

  startDate: string

  endDate: string | null
}

export interface SimpleTask {
  id: string
  title: string
  note: string | null
  status: "PENDING" | "COMPLETED" | "ARCHIVED"
  category: Category
  items: TaskItem[]
  scheduledFor: string | null
  createdAt: Date
  updatedAt: Date
}

export interface RecurringTask {
  id: string
  title: string
  note: string | null
  status: "PENDING" | "COMPLETED" | "ARCHIVED"
  category: Category
  recurrence: Recurrence | null
  items: TaskItem[]
  scheduledFor: string | null
  createdAt: Date
  updatedAt: Date
}

export interface TasksListResponse {
  simpleTasks: SimpleTask[]
  recurringTasks: RecurringTask[]
}

export interface CreateSimpleTaskInput {
  title: string
  note?: string | null
  categoryId: string
  answerType?: "YES_NO" | "CHECKLIST"
  items?: Array<{
    title: string
    order: number
  }>
}

export interface CreateRecurringTaskInput {
  title: string
  note?: string | null
  categoryId: string
  answerType?: "YES_NO" | "CHECKLIST"
  recurrence: {
    pattern: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "CUSTOM"
    everyNDays?: number
    daysOfWeek?: number[]
    everyNWeeks?: number
    daysOfMonth?: number[]
    everyNMonths?: number
    specificDates?: string[]
    everyNYears?: number
    timesPerPeriod?: number
    periodType?: "WEEK" | "MONTH" | "YEAR"
    startDate?: string
    endDate?: string | null
  }
  items?: Array<{
    title: string
    order: number
  }>
}

export interface UpdateTaskInput {
  title?: string
  note?: string | null
  status?: "PENDING" | "COMPLETED" | "ARCHIVED"
  categoryId?: string
}

export interface CreateTaskResponse {
  id: string
  title: string
  note: string | null
  type: "SINGLE" | "RECURRING"
  answerType: "YES_NO" | "CHECKLIST"
  status: "PENDING" | "COMPLETED" | "ARCHIVED"
  category: Category
  recurrence?: Recurrence
  items: TaskItem[]
  createdAt: string
  updatedAt: string
}

export interface DeleteTaskResponse {
  success: boolean
}
