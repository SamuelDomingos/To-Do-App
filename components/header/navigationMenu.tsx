"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"

const navigationItems = [
  { href: "/tasks", label: "Tarefas" },
  { href: "/today", label: "Hoje" },
  { href: "/categories", label: "Categorias" },
]

export function NavigationMenu() {
  const pathname = usePathname()

  return (
    <ButtonGroup className="rounded-md border">
      {navigationItems.map((item, index) => (
        <div key={item.href}>
          <Button
            asChild
            variant={pathname === item.href ? "default" : "ghost"}
            className="rounded-none"
            style={{
              borderRadius:
                index === 0
                  ? "0.375rem 0 0 0.375rem"
                  : index === navigationItems.length - 1
                    ? "0 0.375rem 0.375rem 0"
                    : "0",
            }}
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>

          {index < navigationItems.length - 1 && <ButtonGroupSeparator />}
        </div>
      ))}
    </ButtonGroup>
  )
}