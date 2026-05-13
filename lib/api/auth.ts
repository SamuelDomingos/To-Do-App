import { apiFetch, ApiResponse } from "../fetch"
import { RegisterData, RegisterResponse } from "./types/auth.types"

export const register = async (
  data: RegisterData
): Promise<ApiResponse<RegisterResponse>> => {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
