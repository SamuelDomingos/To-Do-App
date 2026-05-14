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

import DialogFormTask from "./dialog-form-task"

type TaskFormType = "simple" | "recurring"

const CreateTask = () => {
  const [openDialogForm, setOpenDialogForm] = useState(false)
  const [typeFormTask, setTypeFormTask] = useState<TaskFormType>("simple")

  const [openDrawer, setOpenDrawer] = useState(false)

  const openForm = (type: TaskFormType) => {
    setTypeFormTask(type)
    setOpenDialogForm(true)
    requestAnimationFrame(() => {
      setOpenDrawer(false)
    })
  }

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
          <DrawerTitle />

          <div className="space-y-3 p-4">
            <button
              onClick={() => openForm("simple")}
              className="w-full text-left"
            >
              <Item className="cursor-pointer transition-colors hover:bg-muted">
                <ItemMedia
                  variant="icon"
                  className="rounded-full bg-primary p-2"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
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
              onClick={() => openForm("recurring")}
              className="w-full text-left"
            >
              <Item className="cursor-pointer transition-colors hover:bg-muted">
                <ItemMedia
                  variant="icon"
                  className="rounded-full bg-primary p-2"
                >
                  <RotateCw className="h-5 w-5 text-primary-foreground" />
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

      {openDialogForm && (
        <DialogFormTask
          open={openDialogForm}
          onOpenChange={setOpenDialogForm}
          mode="create"
          type={typeFormTask}
        />
      )}
    </>
  )
}

export default CreateTask
