import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dispatch, SetStateAction } from "react"

const DialogItemRecurring = ({
  task,
  openDialog,
  setOpenDialog,
  activeTab,
  setActiveTab,
}: {
  task: any

  openDialog: boolean

  setOpenDialog: Dispatch<SetStateAction<boolean>>

  activeTab: "calendar" | "edit"

  setActiveTab: Dispatch<SetStateAction<"calendar" | "edit">>
}) => {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "calendar" | "edit")}
          className="mt-4"
        >
          <TabsList variant="line" className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">Calendário</TabsTrigger>

            <TabsTrigger value="edit">Editar</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-4">
            calendário aqui
          </TabsContent>

          <TabsContent value="edit" className="mt-4">
            edição aqui
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default DialogItemRecurring
