"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores/auth-store"

export function ActivityMonitor() {
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !user) return

    const logActivity = (activity: string) => {
      // In production, send to analytics/security service
      console.log(`[Security] User ${user.full_name} - ${activity}`, {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      })
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logActivity("Page hidden")
      } else {
        logActivity("Page visible")
      }
    }

    const handleBeforeUnload = () => {
      logActivity("Page unload")
    }

    const handleFocus = () => {
      logActivity("Window focused")
    }

    const handleBlur = () => {
      logActivity("Window blurred")
    }

    // Monitor page visibility
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("focus", handleFocus)
    window.addEventListener("blur", handleBlur)

    // Log initial activity
    logActivity("Session active")

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("blur", handleBlur)
    }
  }, [isAuthenticated, user])

  return null
}
