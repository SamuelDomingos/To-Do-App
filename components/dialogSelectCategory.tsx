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

import { icons } from "lucide-react"

import { Category } from "@/generated/prisma/client"
import Link from "next/link"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"

const DialogSelectCategory = ({
  open,
  onOpenChange,
  categories,
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

        <ScrollArea className="h-100">
          <ScrollBar />
          <div className="mt-4 grid grid-cols-3">
            {categories.map((category) => {
              const Icon = icons[category.icon as keyof typeof icons]

              if (!Icon) return null

              return (
                <Button
                  key={category.id}
                  type="button"
                  variant="ghost"
                  className="h-auto p-0"
                  onClick={() => {
                    onSelect(category.id)
                    requestAnimationFrame(() => {
                      onOpenChange(false)
                    })
                  }}
                >
                  <Item
                    variant={undefined}
                    className="flex flex-col items-center justify-center gap-3 text-center"
                  >
                    <ItemMedia
                      variant="icon"
                      className="rounded-lg p-2"
                      style={{
                        backgroundColor: category.color,
                      }}
                    >
                      <Icon className="h-5 w-5 text-black" />
                    </ItemMedia>

                    <ItemContent>
                      <ItemTitle>{category.name}</ItemTitle>
                    </ItemContent>
                  </Item>
                </Button>
              )
            })}
          </div>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
          <Button>
            <Link href="/categories">Gerenciar Categorias</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogSelectCategory
