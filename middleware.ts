import { NextResponse, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const PUBLIC_ROUTES = ["/auth", "/api/auth"]
const PROTECTED_ROUTES = ["/tasks", "/today", "/categories"]
const AUTH_ROUTE = "/auth"
const DEFAULT_ROUTE = "/today"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isLoggedIn = !!token

  // Redireciona raiz para /today
  if (pathname === "/") {
    return NextResponse.redirect(new URL(DEFAULT_ROUTE, req.url))
  }

  if (isLoggedIn && pathname.startsWith(AUTH_ROUTE)) {
    return NextResponse.redirect(new URL("/tasks", req.url))
  }

  if (PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next()
  }

  if (PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/auth", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // ✅ Exclui API routes e arquivos estáticos
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
}