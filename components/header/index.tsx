"use client"

import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { NavigationMenu } from "./navigationMenu"
import { UserMenu } from "./userMenu"

const pageTitles: Record<string, string> = {
  "/tasks": "Tarefas",
  "/today": "Hoje",
  "/categories": "Categorias",
}

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user
  const isAuthenticated = !!user

  const currentPage = pageTitles[pathname] || "Dashboard"

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{currentPage}</h3>
      </div>

      <NavigationMenu />

      <UserMenu user={user} isAuthenticated={isAuthenticated} />
    </header>
  )
}