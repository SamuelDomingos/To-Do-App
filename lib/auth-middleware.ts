import { NextRequest, NextResponse } from "next/server"
import { getToken, JWT } from "next-auth/jwt"

type AuthHandler = (
  req: NextRequest,
  context: unknown,
  token: JWT
) => Promise<Response> | Response

export async function getAuthenticatedUser(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  return token
}

export function withAuth(handler: AuthHandler) {
  return async (request: NextRequest, context: unknown) => {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    return handler(request, context, token)
  }
}