type ApiSuccess<T> = {
  data: T
  error: null
  status: number
}

type ApiFailure = {
  data: null
  error: string
  status: number
}

export type ApiResponse<T> =
  | ApiSuccess<T>
  | ApiFailure

type ApiFetchOptions = RequestInit & {
  timeout?: number
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController()

  const timeout = setTimeout(() => {
    controller.abort()
  }, options.timeout || 10000)

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        ...options,
        credentials: "include",
        cache: "no-store",
        signal: controller.signal,

        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      }
    )

    let data: any = null

    try {
      data = await response.json()
    } catch {
      data = null
    }

    if (!response.ok) {
      return {
        data: null,
        error:
          data?.error ||
          data?.message ||
          getDefaultErrorMessage(response.status),
        status: response.status,
      }
    }

    return {
      data: data as T,
      error: null,
      status: response.status,
    }
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      return {
        data: null,
        error: "Tempo de requisição esgotado",
        status: 408,
      }
    }

    return {
      data: null,
      error: "Erro de conexão com o servidor",
      status: 500,
    }
  } finally {
    clearTimeout(timeout)
  }
}

function getDefaultErrorMessage(status: number) {
  switch (status) {
    case 400:
      return "Requisição inválida"

    case 401:
      return "Não autenticado"

    case 403:
      return "Você não tem permissão"

    case 404:
      return "Recurso não encontrado"

    case 422:
      return "Dados inválidos"

    case 429:
      return "Muitas requisições"

    case 500:
      return "Erro interno do servidor"

    case 503:
      return "Serviço indisponível"

    default:
      return "Erro inesperado"
  }
}