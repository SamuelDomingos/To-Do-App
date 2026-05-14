"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { CheckIcon, LogOut } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserMenu({
  user,
  isAuthenticated,
}: {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  isAuthenticated: boolean
}) {
  const userInitials =
    user?.name
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"

  const avatarContent = (
    <Avatar
      className={cn(
        "transition-transform group-hover:scale-105",
        isAuthenticated &&
          "ring-2 ring-primary ring-offset-2 ring-offset-background dark:ring-primary"
      )}
    >
      <AvatarImage
        src={
          user?.image ||
          "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
        }
        alt={user?.name || "Usuário"}
      />
      <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
    </Avatar>
  )

  if (!isAuthenticated) {
    return (
      <Link href="/auth" className="group relative w-fit">
        {avatarContent}
      </Link>
    )
  }

  return (
    <div className="group relative w-fit">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer outline-none">
            {avatarContent}
            <span className="absolute -right-1.5 -bottom-1.5 inline-flex size-4 items-center justify-center rounded-full border-2 border-background bg-primary dark:bg-primary">
              <CheckIcon className="size-3 text-white" />
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-1">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">
                {user?.name || "Usuário"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={() => signOut({ redirect: true, callbackUrl: "/auth" })}
          >
            <LogOut className="mr-2 size-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
