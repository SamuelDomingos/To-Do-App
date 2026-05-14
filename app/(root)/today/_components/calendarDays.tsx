"use client"

import { useEffect, useRef } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"

export function CalendarDays({
  currentMonth,
  currentYear,
  selectedDate,
  onSelectDate,
}: {
  currentMonth: number
  currentYear: number
  selectedDate: number
  onSelectDate: (date: number) => void
}) {
  const scrollViewportRef = useRef<HTMLDivElement>(null)
  const selectedDateRef = useRef<HTMLDivElement>(null)

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]

  const getDayOfWeek = (date: number) => {
    const d = new Date(currentYear, currentMonth, date)
    return weekDays[d.getDay()]
  }

  useEffect(() => {
    if (selectedDateRef.current && scrollViewportRef.current) {
      const scrollElement = scrollViewportRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
      if (scrollElement) {
        selectedDateRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        })
      }
    }
  }, [selectedDate])

  return (
    <div className="my-6 overflow-hidden">
      <ScrollArea ref={scrollViewportRef} className="w-full">
        <div className="mb-3 flex gap-2">
          {days.map((day) => {
            const isSelected = selectedDate === day
            return (
              <div key={day} ref={isSelected ? selectedDateRef : null}>
                <Card
                  onClick={() => {
                    onSelectDate(day)
                  }}
                  className={`relative flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 p-2 font-semibold transition-all hover:shadow-md ${
                    isSelected
                      ? "border-2 border-primary bg-primary/10"
                      : ""
                  }`}
                >
                  <span className="text-xs">{getDayOfWeek(day)}</span>
                  <p className="text-base">{day}</p>
                </Card>
              </div>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}