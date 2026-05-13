"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { Separator } from "@/components/ui/separator"

import { Plus, CheckCircle2, RotateCw } from "lucide-react"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import DialogCreateRecurringTask from "./dialog-create-recurring-task"
import DialogFormSimpleTask from "./dialog-form-simple-task"

const CreateTask = () => {
  const [openSimpleDialog, setOpenSimpleDialog] = useState(false)
  const [openRecurringDialog, setOpenRecurringDialog] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)

  return (
    <>
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerTrigger asChild>
          <Button
            className="fixed right-6 bottom-6 cursor-pointer rounded-full p-6 shadow-lg transition-shadow hover:shadow-xl"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerTitle></DrawerTitle>
          <div className="space-y-3 p-4">
            <button
              onClick={() => {
                setOpenSimpleDialog(true)
                setOpenDrawer(false)
              }}
              className="w-full text-left"
            >
              <Item
                variant={undefined}
                className="cursor-pointer transition-colors hover:bg-muted"
              >
                <ItemMedia
                  variant="icon"
                  className="rounded-full bg-primary p-2 dark:bg-primary"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary-foreground dark:text-primary-foreground" />
                </ItemMedia>

                <ItemContent>
                  <ItemTitle>Tarefa Simples</ItemTitle>
                  <ItemDescription>
                    Atividade de instância única
                  </ItemDescription>
                </ItemContent>
              </Item>
            </button>

            <Separator />

            <button
              onClick={() => {
                setOpenRecurringDialog(true)
                setOpenDrawer(false)
              }}
              className="w-full text-left"
            >
              <Item
                variant={undefined}
                className="cursor-pointer transition-colors hover:bg-muted"
              >
                <ItemMedia
                  variant="icon"
                  className="rounded-full bg-primary p-2 dark:bg-primary"
                >
                  <RotateCw className="h-5 w-5 text-primary-foreground dark:text-primary-foreground" />
                </ItemMedia>

                <ItemContent>
                  <ItemTitle>Tarefa Recorrente</ItemTitle>
                  <ItemDescription>
                    Atividade que se repete ao longo do tempo
                  </ItemDescription>
                </ItemContent>
              </Item>
            </button>
          </div>
        </DrawerContent>
      </Drawer>

      {openSimpleDialog && (
        <DialogFormSimpleTask
          open={openSimpleDialog}
          onOpenChange={setOpenSimpleDialog}
          mode="create"
        />
      )}

      <DialogCreateRecurringTask
        open={openRecurringDialog}
        onOpenChange={setOpenRecurringDialog}
      />
    </>
  )
}

export default CreateTask
