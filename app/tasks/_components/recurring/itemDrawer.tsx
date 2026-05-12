"use client"

import { ReactNode, useState } from "react"

import { Button } from "@/components/ui/button"

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { Separator } from "@/components/ui/separator"

import { Calendar, Pencil, Trash2 } from "lucide-react"
import DialogItemRecurring from "./dialogItemRecurring"

const ItemDrawer = ({ task, trigger }: { task: any; trigger: ReactNode }) => {
  const [openDialog, setOpenDialog] = useState(false)

  const [activeTab, setActiveTab] = useState<"calendar" | "edit">("calendar")

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <DrawerTitle className="text-lg">{task.title}</DrawerTitle>

                <DrawerDescription className="mt-1 text-sm">
                  {task.type}
                </DrawerDescription>
              </div>

              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: task.color,
                }}
              >
                <task.icon className="h-5 w-5 text-black" strokeWidth={2.5} />
              </div>
            </div>
          </DrawerHeader>

          <Separator className="my-2" />

          <div className="space-y-3 p-4">
            <Button
              onClick={() => {
                setActiveTab("calendar")
                setOpenDialog(true)
              }}
              variant="ghost"
              className="flex w-full items-center justify-baseline gap-3"
            >
              <Calendar className="h-4 w-4" />
              Calendário
            </Button>

            <Button
              onClick={() => {
                setActiveTab("edit")
                setOpenDialog(true)
              }}
              variant="ghost"
              className="flex w-full items-center justify-baseline gap-3"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Button>

            <Button
              variant="ghost"
              className="flex w-full items-center justify-baseline gap-3"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <DialogItemRecurring
        task={task}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </>
  )
}

export default ItemDrawer
