"use client"

import { format } from "date-fns"

import { ptBR } from "date-fns/locale"

import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface TaskDatePickerProps {
  value?: Date

  onChange: (date: Date | undefined) => void
}

const TaskDatePicker = ({ value, onChange }: TaskDatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          data-empty={!value}
          className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />

          {value ? (
            format(value, "PPP", {
              locale: ptBR,
            })
          ) : (
            <span>Selecionar data</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          className="rounded-md border"
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}

export default TaskDatePicker
