export type RegisterData = {
  name: string
  email: string
  password: string
}

export type RegisterResponse = {
  message: string

  user: {
    id: string
    name: string
    email: string
  }
}