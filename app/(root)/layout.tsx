import CreateTask from "@/components/createTask"
import Header from "@/components/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto flex min-h-screen flex-col">
      <Header />

      <main className="my-4 flex-1 px-4">
        {children}

        <CreateTask />
      </main>
    </div>
  )
}
