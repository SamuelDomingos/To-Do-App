"use client"

import { EmptyState } from "../../tasks/_components/empty-state"
import useTodayPage from "../_hooks/useTodayPage"
import { Filters, Task } from "../_interfaces/index.interfaces"
import { CalendarDays } from "./calendarDays"
import { TaskChecklistItem } from "./taskChecklistItem"
import { TaskItem } from "./taskItem"

const TodayIndex = ({
  initialTasks,
  initialSelectedDate,
  currentMonth,
  currentYear,
  initialFilters,
}: {
  initialTasks: Task[]
  initialSelectedDate: number
  currentMonth: number
  currentYear: number
  initialFilters: Filters
}) => {
  const {
    selectedDate,
    completedTasks,
    setCompletedTasks,
    completedItems,
    setCompletedItems,
    getFormattedSelectedDate,
    currentTasks,
    handleSelectDate,
    isDateDisabled,
  } = useTodayPage({
    initialSelectedDate,
    initialTasks,
    initialFilters,
    currentYear,
    currentMonth,
  })

  return (
    <div className="flex h-screen flex-col">
      <h3 className="text-2xl font-bold capitalize">
        {getFormattedSelectedDate(selectedDate)}
      </h3>

      <CalendarDays
        currentMonth={currentMonth}
        currentYear={currentYear}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
      />

      <div className="flex-1 space-y-2 overflow-y-auto">
        {currentTasks.length > 0 ? (
          currentTasks.map((task) => {
            const isChecklist = task.type === "CHECKLIST"
            const hasItems = isChecklist && task.items && task.items.length > 0

            if (hasItems) {
              return (
                <TaskChecklistItem
                  key={task.id}
                  task={task}
                  items={task.items}
                  completedItems={completedItems}
                  disabled={isDateDisabled}
                  onToggleItem={(itemId) => {
                    if (!isDateDisabled) {
                      setCompletedItems((prev) => ({
                        ...prev,
                        [itemId]: !prev[itemId],
                      }))
                    }
                  }}
                />
              )
            }

            return (
              <TaskItem
                key={task.id}
                task={task}
                completed={completedTasks[task.id] || false}
                disabled={isDateDisabled}
                onToggle={(taskId) => {
                  if (!isDateDisabled) {
                    setCompletedTasks((prev) => ({
                      ...prev,
                      [taskId]: !prev[taskId],
                    }))
                  }
                }}
              />
            )
          })
        ) : (
          <EmptyState
            title="Nenhuma tarefa neste dia"
            description="Selecione outro dia ou crie uma nova atividade"
          />
        )}
      </div>
    </div>
  )
}

export default TodayIndex
