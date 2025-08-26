"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuthStore } from "@/stores/auth-store"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { refreshUser, isAuthenticated, token } = useAuthStore()

  useEffect(() => {
    // Check if we have a token in localStorage on app start
    const storedToken = localStorage.getItem("access_token")
    if (storedToken && isAuthenticated) {
      refreshUser()
    }
  }, [refreshUser, isAuthenticated])

  return <>{children}</>
}
