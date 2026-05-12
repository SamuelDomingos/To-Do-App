import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function getAuthenticatedUser(request: NextRequest) {
  const token = await getToken({ req: request })

  if (!token) {
    return null
  }

  return token
}

export function withAuth(handler: Function) {
  return async (request: NextRequest, context: any) => {
    const token = await getAuthenticatedUser(request)

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    return handler(request, context, token)
  }
}
