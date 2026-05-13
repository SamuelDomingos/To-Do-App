import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import * as Icons from "lucide-react"

const AVAILABLE_ICONS = [
  "Folder",
  "Briefcase",
  "BookOpen",
  "Home",
  "Heart",
  "ShoppingCart",
  "DollarSign",
  "TrendingUp",
  "Calendar",
  "Clock",
  "MapPin",
  "Users",
  "Settings",
  "Bell",
  "Star",
  "Zap",
  "Smile",
  "Shield",
  "Eye",
  "Coffee",
  "Palette",
  "Music",
  "Film",
  "Code",
  "Database",
  "Trophy",
  "Target",
  "Compass",
  "Lightbulb",
  "Rocket",
  "Bug",
  "AlertCircle",
  "CheckCircle",
  "XCircle",
  "Info",
  "HelpCircle",
  "Archive",
  "Trash2",
  "Edit",
  "Copy",
  "Download",
  "Upload",
  "Search",
  "Filter",
  "Menu",
  "MoreVertical",
  "ChevronRight",
  "ChevronDown",
]

export function IconSelectorDialog({
  open,
  onOpenChange,
  onSelectIcon,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectIcon: (icon: string) => void
}) {
  const handleSelectIcon = (icon: string) => {
    onSelectIcon(icon)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>Selecionar Ícone</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <ScrollArea className="h-96 w-full rounded-md border p-4">
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
              {AVAILABLE_ICONS.map((iconName) => {
                const IconComponent = (Icons as any)[iconName] || Icons.Folder
                return (
                  <Button
                    key={iconName}
                    variant="outline"
                    size="sm"
                    className="h-16 w-16 p-2"
                    onClick={() => handleSelectIcon(iconName)}
                    title={iconName}
                  >
                    <IconComponent className="h-8! w-8!" />
                  </Button>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
