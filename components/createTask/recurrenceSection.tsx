"use client"

import { Controller } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import TaskDatePicker from "@/components/ui/date-picker"
import { parseLocalDate } from "@/lib/utils"
import { format } from "date-fns"

const patterns = [
  { value: "DAILY", title: "Todos os dias" },
  { value: "WEEKLY", title: "Alguns dias da semana" },
  { value: "MONTHLY", title: "Dias do mês" },
  { value: "YEARLY", title: "Um dia específico por ano" },
  { value: "CUSTOM", title: "Repetir a cada X dias" },
]

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export function RecurrenceSection({ form }: { form: any }) {
  const pattern = form.watch("recurrence.pattern")

  return (
    <div className="my-2 space-y-4 rounded-lg border p-4">
      {/* HEADER */}
      <div>
        <h3 className="text-sm font-medium">Recorrência</h3>
        <p className="text-xs text-muted-foreground">
          Defina como essa tarefa se repete
        </p>
      </div>

      <Controller
        name="recurrence.pattern"
        control={form.control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="grid grid-cols-1 gap-2 sm:grid-cols-2"
          >
            {patterns.map((p) => (
              <div
                key={p.value}
                className="flex items-center gap-3 rounded-md border p-3"
              >
                <RadioGroupItem value={p.value} id={p.value} />
                <Label htmlFor={p.value} className="cursor-pointer text-sm">
                  {p.title}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      />

      {pattern === "DAILY" && (
        <p className="text-sm text-muted-foreground">
          Esta tarefa será gerada todos os dias.
        </p>
      )}

      {pattern === "WEEKLY" && (
        <Field>
          <FieldLabel>Dias da semana</FieldLabel>
          <Controller
            name="recurrence.daysOfWeek"
            control={form.control}
            render={({ field, fieldState }) => {
              const value: number[] = field.value || []
              return (
                <>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                    {weekDays.map((day, index) => {
                      const checked = value.includes(index)
                      return (
                        <button
                          type="button"
                          key={day}
                          onClick={() => {
                            if (checked) {
                              field.onChange(value.filter((v) => v !== index))
                            } else {
                              field.onChange([...value, index])
                            }
                          }}
                          className={`w-full rounded border p-2 text-xs transition-colors sm:text-sm ${
                            checked
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </>
              )
            }}
          />
        </Field>
      )}

      {pattern === "MONTHLY" && (
        <Field>
          <FieldLabel>Dias do mês</FieldLabel>
          <Controller
            name="recurrence.daysOfMonth"
            control={form.control}
            render={({ field, fieldState }) => {
              const value: number[] = field.value || []
              return (
                <>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                      const checked = value.includes(day)
                      return (
                        <button
                          type="button"
                          key={day}
                          onClick={() => {
                            if (checked) {
                              field.onChange(value.filter((v) => v !== day))
                            } else {
                              field.onChange([...value, day])
                            }
                          }}
                          className={`aspect-square w-full rounded border text-xs transition-colors sm:text-sm ${
                            checked
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </>
              )
            }}
          />
        </Field>
      )}

      {pattern === "YEARLY" && (
        <Field>
          <FieldLabel>Data do ano (dia e mês)</FieldLabel>
          <Controller
            name="recurrence.specificDates"
            control={form.control}
            render={({ field, fieldState }) => {
              const currentValue = field.value?.[0] 
              const dateForPicker = currentValue
                ? parseLocalDate(`2000-${currentValue}`)
                : undefined

              return (
                <>
                  <TaskDatePicker
                    value={dateForPicker || undefined}
                    onChange={(date) => {
                      if (!date) {
                        field.onChange([])
                        return
                      }
                      const mmdd = format(date, "MM-dd")
                      field.onChange([mmdd])
                    }}
                  />
                  {currentValue && (
                    <span className="text-xs text-muted-foreground">
                      Repetirá todo ano em:{" "}
                      {format(parseLocalDate(`2000-${currentValue}`)!, "dd/MM")}
                    </span>
                  )}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </>
              )
            }}
          />
        </Field>
      )}

      {pattern === "CUSTOM" && (
        <Field>
          <FieldLabel>Repetir a cada quantos dias?</FieldLabel>
          <Controller
            name="recurrence.everyNDays"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  type="number"
                  min={1}
                  className="w-full"
                  placeholder="Ex: 2 = a cada 2 dias"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const num = parseInt(e.target.value, 10)
                    field.onChange(isNaN(num) ? undefined : num)
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </>
            )}
          />
        </Field>
      )}

      <Field>
        <FieldLabel>A partir de quando?</FieldLabel>
        <Controller
          name="recurrence.startDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <TaskDatePicker
                value={
                  field.value
                    ? parseLocalDate(field.value) || undefined
                    : undefined
                }
                onChange={(date) => {
                  field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                }}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </>
          )}
        />
      </Field>

      <Field>
        <FieldLabel>
          Até quando?{" "}
          <span className="font-normal text-muted-foreground">(opcional)</span>
        </FieldLabel>
        <Controller
          name="recurrence.endDate"
          control={form.control}
          render={({ field }) => (
            <TaskDatePicker
              value={
                field.value
                  ? parseLocalDate(field.value) || undefined
                  : undefined
              }
              onChange={(date) => {
                field.onChange(date ? format(date, "yyyy-MM-dd") : "")
              }}
            />
          )}
        />
      </Field>
    </div>
  )
}