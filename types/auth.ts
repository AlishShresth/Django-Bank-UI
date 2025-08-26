export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  phoneNumber?: string
  dateJoined: string
  lastLogin?: string
}

export type UserRole = "customer" | "business_client" | "account_executive" | "teller" | "branch_manager"

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
  role?: UserRole
}

export interface AuthResponse {
  user: User
  access_token: string
  refresh_token: string
}
