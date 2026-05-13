import { AuthForm } from "./_components/authForm"
import { Suspense } from "react"

export default function AuthPage() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <Suspense>
        <AuthForm />
      </Suspense>
    </div>
  )
}
