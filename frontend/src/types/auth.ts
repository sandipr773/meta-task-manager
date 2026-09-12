export interface User {
  id: number
  name: string
  email: string
  tenant_id: number
}

export interface LoginResponse {
  message: string
  token: string
  user: User
}