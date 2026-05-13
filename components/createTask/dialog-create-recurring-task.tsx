import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DialogCreateRecurringTaskProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DialogCreateRecurringTask({
  open,
  onOpenChange,
}: DialogCreateRecurringTaskProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Tarefa Recorrente</DialogTitle>
        </DialogHeader>

        {/* Coloque o conteúdo aqui */}
      </DialogContent>
    </Dialog>
  )
}
