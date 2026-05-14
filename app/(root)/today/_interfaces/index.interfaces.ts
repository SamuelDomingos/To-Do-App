export interface TaskItem {
  id: string
  title: string
  completed: boolean
  order: number
}
 
export interface Task {
  id: string
  title: string
  note?: string
  type: "SINGLE" | "CHECKLIST"
  status: string
  scheduledFor: Date
  category: {
    id: string
    name: string
    color: string
    icon: string
  }
  items?: TaskItem[]
  _count?: {
    completions: number
  }
}
 
export interface Filters {
  date: string
  categoryId?: string | null
  status?: string | null
  type?: string | null
  search?: string | null
}
 