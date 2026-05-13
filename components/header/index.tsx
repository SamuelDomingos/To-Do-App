"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CheckIcon } from "lucide-react"
import { useSession } from "next-auth/react"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

import { Button } from "../ui/button"
import { SidebarTrigger } from "../ui/sidebar"
import { ButtonGroup, ButtonGroupSeparator } from "../ui/button-group"

const pageTitles: Record<string, string> = {
  "/tasks": "Tarefas",
  "/activities": "Atividades",
  "/categories": "Categorias",
}

const Header = () => {
  const pathname = usePathname()

  const { data: session, status } = useSession()

  const user = session?.user

  const isLoading = status === "loading"

  const isAuthenticated = !!user && !isLoading

  const currentPage = pageTitles[pathname] || "Dashboard"

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h3 className="text-lg font-semibold">{currentPage}</h3>
      </div>

      <ButtonGroup className="rounded-md border">
        <Button
          asChild
          variant={pathname === "/tasks" ? "default" : "ghost"}
          className="rounded-none rounded-l-md"
        >
          <Link href="/tasks">Tarefas</Link>
        </Button>

        <ButtonGroupSeparator />

        <Button
          asChild
          variant={pathname === "/activities" ? "default" : "ghost"}
          className="rounded-none rounded-r-md"
        >
          <Link href="/activities">Atividades</Link>
        </Button>

        <ButtonGroupSeparator />

        <Button
          asChild
          variant={pathname === "/categories" ? "default" : "ghost"}
          className="rounded-none rounded-r-md"
        >
          <Link href="/categories">Categorias</Link>
        </Button>
      </ButtonGroup>

      <Link
        href={isAuthenticated ? "/profile" : "/auth"}
        className="relative w-fit"
      >
        <Avatar
          className={
            isAuthenticated
              ? "ring-2 ring-primary ring-offset-2 ring-offset-background dark:ring-primary"
              : ""
          }
        >
          <AvatarImage
            src={
              user?.image ||
              "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
            }
            alt={user?.name || "Usuário"}
          />

          <AvatarFallback className="text-xs">
            {user?.name
              ?.split(" ")
              .map((name) => name[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>

        {isAuthenticated && (
          <span className="absolute -right-1.5 -bottom-1.5 inline-flex size-4 items-center justify-center rounded-full bg-primary dark:bg-primary">
            <CheckIcon className="size-3 text-white" />
          </span>
        )}
      </Link>
    </header>
  )
}

export default Header
