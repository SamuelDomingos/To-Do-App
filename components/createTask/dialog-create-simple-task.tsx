import { useState } from "react"
import { Controller } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import TaskDatePicker from "@/components/ui/date-picker"
import { useTaskForm } from "@/hooks/useTaskForm"
import { Trash2, Plus, Folder } from "lucide-react"
import DialogSelectCategory from "../dialogSelectCategory"
import useGetCategory from "@/hooks/useGetCategory"
import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"

export default function DialogCreateSimpleTask({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false)

  const { categories } = useGetCategory()

  const { form, handleSubmit, isLoading, itemsFieldArray } = useTaskForm({
    mode: "create",
    onOpenChange,
  })

  const selectedCategory = form.watch("categoryId")
  const items = form.watch("items")

  const selectedCategoryData = categories?.find(
    (c) => c.id === selectedCategory
  )

  // Pegar o ícone da categoria
  const IconComponent = selectedCategoryData?.icon
    ? ((Icons[selectedCategoryData.icon as keyof typeof Icons] ||
        Folder) as typeof LucideIcon)
    : Folder

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Criar Tarefa Simples</DialogTitle>
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
                    placeholder="Digite o título da tarefa"
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
                className="w-full justify-start gap-2 py-6"
                onClick={() => setOpenCategoryDialog(true)}
              >
                {selectedCategoryData ? (
                  <>
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded"
                      style={{ backgroundColor: selectedCategoryData.color }}
                    >
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm">{selectedCategoryData.name}</span>
                  </>
                ) : (
                  <>
                    <Folder className="h-5 w-5" />
                    <span className="text-sm">Selecionar categoria</span>
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <FieldLabel>Data</FieldLabel>
              <Controller
                name="scheduledFor"
                control={form.control}
                render={({ field }) => (
                  <TaskDatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => {
                      field.onChange(date?.toISOString() || "")
                    }}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <FieldLabel>Subitens</FieldLabel>
              <div className="space-y-2">
                {itemsFieldArray.fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Controller
                      name={`items.${index}.title`}
                      control={form.control}
                      render={({ field: itemField }) => (
                        <Input
                          {...itemField}
                          placeholder="Digite o subitem"
                          className="flex-1"
                        />
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => itemsFieldArray.remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  itemsFieldArray.append({
                    title: "",
                    order: items?.length || 0,
                    completed: false,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar subitem
              </Button>
            </div>

            {/* Notas */}
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Criar tarefa"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DialogSelectCategory
        open={openCategoryDialog}
        onOpenChange={setOpenCategoryDialog}
        categories={categories}
        onSelect={(categoryId) => {
          form.setValue("categoryId", categoryId)
          setOpenCategoryDialog(false)
        }}
      />
    </>
  )
}