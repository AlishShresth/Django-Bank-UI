"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, Shield } from "lucide-react"

const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
const WARNING_TIME = 5 * 60 * 1000 // 5 minutes before timeout

export function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const { isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) return

    let timeoutId: NodeJS.Timeout
    let warningId: NodeJS.Timeout
    let countdownId: NodeJS.Timeout

    const resetTimer = () => {
      clearTimeout(timeoutId)
      clearTimeout(warningId)
      clearInterval(countdownId)
      setShowWarning(false)

      // Set warning timer
      warningId = setTimeout(() => {
        setShowWarning(true)
        setTimeLeft(WARNING_TIME)

        // Start countdown
        countdownId = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1000) {
              handleTimeout()
              return 0
            }
            return prev - 1000
          })
        }, 1000)
      }, SESSION_TIMEOUT - WARNING_TIME)

      // Set timeout timer
      timeoutId = setTimeout(handleTimeout, SESSION_TIMEOUT)
    }

    const handleTimeout = () => {
      logout()
      router.push("/login")
      setShowWarning(false)
    }

    const handleActivity = () => {
      if (isAuthenticated) {
        resetTimer()
      }
    }

    // Listen for user activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true)
    })

    // Initialize timer
    resetTimer()

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(warningId)
      clearInterval(countdownId)
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [isAuthenticated, logout, router])

  const extendSession = () => {
    setShowWarning(false)
    // Reset timers by triggering activity
    document.dispatchEvent(new Event("mousedown"))
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (!isAuthenticated) return null

  return (
    <Dialog open={showWarning} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-warning" />
            Session Timeout Warning
          </DialogTitle>
          <DialogDescription>Your session will expire soon due to inactivity.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Alert className="border-warning bg-warning/10">
            <Clock className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning">
              Your session will expire in <strong>{formatTime(timeLeft)}</strong> for security reasons.
            </AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground">
            Click "Stay Logged In" to extend your session, or you will be automatically logged out.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => logout()}>
            Log Out Now
          </Button>
          <Button onClick={extendSession}>Stay Logged In</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
