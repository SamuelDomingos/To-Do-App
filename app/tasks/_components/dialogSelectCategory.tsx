"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"

import { Check, icons } from "lucide-react"

import { Category } from "@/generated/prisma/client"

const DialogSelectCategory = ({
  open,
  onOpenChange,
  categories,
  selectedCategoryId,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void

  categories: Category[]

  selectedCategoryId?: string

  onSelect: (categoryId: string) => void
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Selecione a categoria</DialogTitle>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {categories.map((category) => {
            const Icon = icons[category.icon as keyof typeof icons]

            if (!Icon) return null

            return (
              <Button
                key={category.id}
                type="button"
                variant="ghost"
                className="h-auto w-full p-0"
                onClick={() => {
                  onSelect(category.id)
                  onOpenChange(false)
                }}
              >
                <Item
                  variant="outline"
                  className="w-full justify-between rounded-xl p-3"
                >
                  <div className="flex items-center gap-3">
                    <ItemMedia
                      variant="icon"
                      className="rounded-xl"
                      style={{
                        backgroundColor: category.color,
                      }}
                    >
                      <Icon className="h-5 w-5 text-black" />
                    </ItemMedia>

                    <ItemContent>
                      <ItemTitle>{category.name}</ItemTitle>
                    </ItemContent>
                  </div>

                  {selectedCategoryId === category.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </Item>
              </Button>
            )
          })}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogSelectCategory
