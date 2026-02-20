export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export interface TokenPair {
  access: string
  refresh: string
}

export interface LoginResponse {
  access: string
  refresh: string
  user: User
}

export interface RegisterResponse {
  access: string
  refresh: string
  user: User
}

export interface RefreshResponse {
  access: string
}
