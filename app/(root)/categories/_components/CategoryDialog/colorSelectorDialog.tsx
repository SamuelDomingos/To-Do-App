"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const PRESET_COLORS = [
  "#4F46E5",
  "#7C3AED",
  "#DC2626",
  "#EA580C",
  "#EAB308",
  "#22C55E",
  "#06B6D4",
  "#0EA5E9",
  "#8B5CF6",
  "#EC4899",
  "#F43F5E",
  "#64748B",
  "#6366F1",
  "#10B981",
  "#3B82F6",
  "#1E293B",
]

export function ColorSelectorDialog({
  open,
  onOpenChange,
  onSelectColor,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectColor: (color: string) => void
}) {
  const [customColor, setCustomColor] = useState("")

  const handleSelectColor = (color: string) => {
    onSelectColor(color)
    onOpenChange(false)
  }

  const handleCustomColor = () => {
    if (customColor && /^#[0-9A-F]{6}$/i.test(customColor)) {
      handleSelectColor(customColor)
      setCustomColor("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>Selecionar Cor</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">Cores Pré-definidas</p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {PRESET_COLORS.map((color) => (
                <Button
                  key={color}
                  variant="outline"
                  className="h-16 w-16"
                  style={{ backgroundColor: color }}
                  onClick={() => handleSelectColor(color)}
                  title={color}
                >
                  <span className="sr-only">{color}</span>
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2 border-t pt-4">
            <p className="text-sm font-medium">Cor Personalizada</p>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColor || "#000000"}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="h-12 w-12 cursor-pointer rounded border"
                />
              </div>
              <Input
                type="text"
                placeholder="#000000"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                maxLength={7}
                pattern="^#[0-9A-Fa-f]{6}$"
              />
              <Button
                onClick={handleCustomColor}
                disabled={!customColor || !/^#[0-9A-F]{6}$/i.test(customColor)}
              >
                Adicionar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Formato: #000000 (hex válido)
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
