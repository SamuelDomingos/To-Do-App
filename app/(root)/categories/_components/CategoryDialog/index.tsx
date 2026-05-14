"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCategory } from "../../_hooks/useCategory"
import { IconSelectorDialog } from "./iconSelectorDialog"
import { ColorSelectorDialog } from "./colorSelectorDialog"
import { Controller } from "react-hook-form"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import * as Icons from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

type CategoryDialogProps = {
  trigger: React.ReactNode
  category?: {
    id: string
    name: string
    icon: string
    color: string
  }
  open?: boolean
  setOpen?: (v: boolean) => void
}

export function CategoryDialog({
  trigger,
  category,
  open: externalOpen,
  setOpen: externalSetOpen,
}: CategoryDialogProps) {
  const isControlled = externalOpen !== undefined

  const [internalOpen, setInternalOpen] = useState(false)

  const open = isControlled ? externalOpen : internalOpen
  const setOpen = isControlled ? externalSetOpen! : setInternalOpen

  const {
    form,
    isLoading,
    handleSubmit,
    isIconDialogOpen,
    setIsIconDialogOpen,
    isColorDialogOpen,
    setIsColorDialogOpen,
  } = useCategory({
    mode: category ? "edit" : "create",
    category,
  })

  const isEditMode = !!category

  const titleCategory = form.watch("name")
  const selectedIcon = form.watch("icon")
  const selectedColor = form.watch("color")

  const IconComponent = (Icons as any)[selectedIcon] || Icons.Folder

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar Categoria" : "Criar Nova Categoria"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Altere as informações da sua categoria personalizada"
                : "Crie uma nova categoria para organizar suas tarefas"}
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className="flex items-center justify-between rounded-2xl border p-2">
            <div className="flex items-center gap-2">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: selectedColor }}
              />
              <h2 className="font-medium">
                {titleCategory || (isEditMode ? "Categoria" : "Nova Categoria")}
              </h2>
            </div>

            <div
              className="flex h-10 w-10 items-center justify-center rounded"
              style={{ backgroundColor: selectedColor }}
            >
              <IconComponent className="h-8 w-8 text-white" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Nome da categoria</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Ex: Trabalho, Estudos..."
                    autoComplete="off"
                  />
                  <FieldDescription>
                    Escolha um nome descritivo.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field>
              <FieldLabel>Ícone</FieldLabel>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setIsIconDialogOpen(true)}
              >
                <div
                  className="flex h-6 w-6 items-center justify-center rounded"
                  style={{ backgroundColor: selectedColor }}
                >
                  <IconComponent className="h-4 w-4" />
                </div>
                <p>Selecionar ícone</p>
              </Button>
            </Field>

            <Field>
              <FieldLabel>Cor</FieldLabel>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setIsColorDialogOpen(true)}
              >
                <div
                  className="h-6 w-6 rounded-full border"
                  style={{ backgroundColor: selectedColor }}
                />
                <p>Selecionar cor</p>
              </Button>
            </Field>

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Salvando..."
                  : isEditMode
                  ? "Salvar alterações"
                  : "Criar categoria"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <IconSelectorDialog
        open={isIconDialogOpen}
        onOpenChange={setIsIconDialogOpen}
        onSelectIcon={(icon) => form.setValue("icon", icon)}
      />

      <ColorSelectorDialog
        open={isColorDialogOpen}
        onOpenChange={setIsColorDialogOpen}
        onSelectColor={(color) => form.setValue("color", color)}
      />
    </>
  )
}