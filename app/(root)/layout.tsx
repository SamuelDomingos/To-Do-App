import CreateTask from "@/components/createTask"
import Header from "@/components/header"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="container mx-auto flex min-h-screen flex-col">
          <Header />

          <main className="my-4 flex-1">
            {children}

            <CreateTask />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
