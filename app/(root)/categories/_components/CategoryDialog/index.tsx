"use client"

import {
  Dialog,
  DialogContent,
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

export function CategoryDialog({
  trigger,
  category,
}: {
  trigger: any
  category?: {
    id: string
    name: string
    icon: string
    color: string
  }
}) {
  const {
    form,
    isLoading,
    handleSubmit,
    isIconDialogOpen,
    setIsIconDialogOpen,
    isColorDialogOpen,
    setIsColorDialogOpen,
    open,
    setOpen,
  } = useCategory({
    mode: category ? "edit" : "create",
    category,
  })

  const titleCategory = form.watch("name")
  const selectedIcon = form.watch("icon")
  const selectedColor = form.watch("color")

  const { control } = form

  const IconComponent = (Icons as any)[selectedIcon] || Icons.Folder

  const isEditMode = !!category

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar Categoria" : "Criar Nova Categoria"}
            </DialogTitle>
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
              className="flex h-10 w-10 items-center justify-center rounded p-2"
              style={{ backgroundColor: selectedColor }}
            >
              <IconComponent className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Nome da categoria
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Ex: Trabalho, Estudos, Pessoal..."
                    autoComplete="off"
                  />
                  <FieldDescription>
                    Escolha um nome descritivo para sua categoria.
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

                <p>Icone de categoria</p>
              </Button>
              <FieldDescription>
                Clique para selecionar um ícone para sua categoria.
              </FieldDescription>
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
                  className="h-6 w-6 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: selectedColor }}
                />
                <p>Cor da categoria</p>
              </Button>
              <FieldDescription>
                Clique para escolher uma cor para sua categoria.
              </FieldDescription>
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
                    ? "Salvar Alterações"
                    : "Criar Categoria"}
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
