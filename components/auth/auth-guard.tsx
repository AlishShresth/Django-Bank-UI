'use client'

import type React from "react"
import { useEffect } from "react"
import { useAuthStore } from "@/stores/auth-store"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { refreshUser, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (user && isAuthenticated) {
      refreshUser()
    }
  }, [refreshUser, isAuthenticated])

  return <>{children}</>
}