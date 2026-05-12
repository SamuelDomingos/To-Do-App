import { Controller } from "react-hook-form"

import { useTaskForm } from "@/hooks/useTaskForm"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"

import { Textarea } from "@/components/ui/textarea"

import { Button } from "@/components/ui/button"

import TaskDatePicker from "@/components/ui/date-picker"

import DialogSelectCategory from "../dialogSelectCategory"

import useDialogHook from "../../_hooks/useDialogHook"

import { SimpleTask } from "@/lib/api/types/tasks.types"

import { icons } from "lucide-react"

const DialogItemSimples = ({
  selectedTask,
  setSelectedTask,
}: {
  selectedTask: SimpleTask | null
  setSelectedTask: (task: SimpleTask | null) => void
}) => {
  const {
    openCategoryDialog,
    setOpenCategoryDialog,
    openChecklistDialog,
    setOpenChecklistDialog,
  } = useDialogHook()

  const { form, handleSubmit, isLoading, itemsFieldArray } = useTaskForm({
    mode: "edit",

    taskId: selectedTask?.id,

    initialData: selectedTask
      ? {
          title: selectedTask.title,
          note: selectedTask.note,
          categoryId: selectedTask.category.id,
          scheduledFor: selectedTask.scheduledFor,
          items:
            selectedTask.items?.map((item, index) => ({
              title: item.title,
              completed: item.completed,
              order: index,
            })) || [],
        }
      : undefined,
  })

  const categoryId = form.watch("categoryId")

  const scheduledFor = form.watch("scheduledFor")

  const selectedCategory =
    categoryId === selectedTask?.category.id ? selectedTask.category : null

  const Icon =
    selectedCategory?.icon && icons[selectedCategory.icon as keyof typeof icons]

  return (
    <>
      <Dialog
        open={!!selectedTask}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTask(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar tarefa</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Título</FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite o título"
                    autoComplete="off"
                  />

                  <FieldDescription>Nome principal da tarefa.</FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="space-y-2">
              <FieldLabel>Categoria</FieldLabel>

              <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
                onClick={() => setOpenCategoryDialog(true)}
              >
                <div className="flex items-center gap-2">
                  {Icon && selectedCategory && (
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: selectedCategory.color,
                      }}
                    >
                      <Icon className="h-4 w-4 text-black" />
                    </div>
                  )}

                  <span>
                    {selectedCategory?.name || "Selecionar categoria"}
                  </span>
                </div>
              </Button>
            </div>

            <div className="space-y-2">
              <FieldLabel>Data</FieldLabel>

              <TaskDatePicker
                value={scheduledFor ? new Date(scheduledFor) : undefined}
                onChange={(date) => {
                  form.setValue(
                    "scheduledFor",
                    date ? date.toISOString() : "",
                    {
                      shouldValidate: true,
                    }
                  )
                }}
              />
            </div>

            <div className="space-y-2">
              <FieldLabel>Subitens</FieldLabel>

              <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
                onClick={() => setOpenChecklistDialog(true)}
              >
                {itemsFieldArray.fields.length > 0
                  ? `${itemsFieldArray.fields.length} itens`
                  : "Adicionar subitens"}
              </Button>
            </div>

            <Controller
              name="note"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Notas</FieldLabel>

                  <Textarea
                    {...field}
                    value={field.value || ""}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite observações"
                    className="min-h-32"
                  />

                  <FieldDescription>
                    Informações adicionais da tarefa.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar alterações"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <DialogSelectCategory
        open={openCategoryDialog}
        onOpenChange={setOpenCategoryDialog}
        categories={[selectedTask?.category].filter(Boolean)}
        selectedCategoryId={categoryId}
        onSelect={(categoryId) => {
          form.setValue("categoryId", categoryId, {
            shouldValidate: true,
          })
        }}
      />

      {/* FUTURO DIALOG DOS SUBITENS */}
      {/* 
      <DialogChecklist
        open={openChecklistDialog}
        onOpenChange={setOpenChecklistDialog}
      />
      */}
    </>
  )
}

export default DialogItemSimples
