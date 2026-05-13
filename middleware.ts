import { NextResponse, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const PUBLIC_ROUTES = [
  "/tasks",
  "/today",
  "/api/auth",
]

const AUTH_ROUTE = "/auth"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isLoggedIn = !!token

  if (isLoggedIn && pathname.startsWith(AUTH_ROUTE)) {
    return NextResponse.redirect(new URL("/tasks", req.url))
  }

  if (
    PUBLIC_ROUTES.some(
      (route) =>
        pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    return NextResponse.next()
  }

  // 🔥 3. Protege rotas privadas
  if (!isLoggedIn) {
    const loginUrl = new URL("/auth", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
}