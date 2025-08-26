import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, AuthState, LoginCredentials, RegisterData, AuthResponse } from "@/types/auth"
import { apiClient } from "@/lib/axios"

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true })
        try {
          const response = await apiClient.post<AuthResponse>("/auth/login/", credentials)
          const { user, access_token, refresh_token } = response.data

          localStorage.setItem("access_token", access_token)
          localStorage.setItem("refresh_token", refresh_token)

          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true })
        try {
          const response = await apiClient.post<AuthResponse>("/auth/register/", data)
          const { user, access_token, refresh_token } = response.data

          localStorage.setItem("access_token", access_token)
          localStorage.setItem("refresh_token", refresh_token)

          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      refreshUser: async () => {
        try {
          const response = await apiClient.get<User>("/auth/me/")
          set({ user: response.data })
        } catch (error) {
          get().logout()
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
