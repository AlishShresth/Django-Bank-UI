"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuthStore } from "@/stores/auth-store"
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react"

export default function ActivateAccountPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired">("loading")
  const [message, setMessage] = useState("")
  const [isResending, setIsResending] = useState(false)

  const router = useRouter()
  const params = useParams()
  const token = params.token as string
  const { activateAccount, resendActivation } = useAuthStore()

  useEffect(() => {
    if (token) {
      handleActivation()
    }
  }, [token])

  const handleActivation = async () => {
    try {
      setStatus("loading")
      await activateAccount(token)
      setStatus("success")
      setMessage("Your account has been successfully activated! You can now log in.")

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login?activated=true")
      }, 3000)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Activation failed"

      if (errorMessage.includes("expired") || errorMessage.includes("invalid")) {
        setStatus("expired")
        setMessage("This activation link has expired or is invalid.")
      } else {
        setStatus("error")
        setMessage(errorMessage)
      }
    }
  }

  const handleResendActivation = async () => {
    setIsResending(true)
    try {
      // This would need the user's email - in a real app, you might store this in the URL or ask for it
      await resendActivation()
      setMessage("A new activation link has been sent to your email address.")
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to resend activation email.")
    } finally {
      setIsResending(false)
    }
  }

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Activating Your Account</CardTitle>
            <CardDescription className="text-gray-600">
              Please wait while we activate your NextGen Bank account...
            </CardDescription>
          </>
        )

      case "success":
        return (
          <>
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Account Activated!</CardTitle>
            <CardDescription className="text-gray-600">
              Welcome to NextGen Bank! Your account is now ready to use.
            </CardDescription>
          </>
        )

      case "expired":
        return (
          <>
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Activation Link Expired</CardTitle>
            <CardDescription className="text-gray-600">
              This activation link is no longer valid. Request a new one below.
            </CardDescription>
          </>
        )

      case "error":
        return (
          <>
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Activation Failed</CardTitle>
            <CardDescription className="text-gray-600">
              We couldn't activate your account. Please try again or contact support.
            </CardDescription>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">{renderContent()}</CardHeader>

        <CardContent className="space-y-4">
          {message && (
            <Alert variant={status === "success" ? "default" : "destructive"}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === "success" && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">Redirecting to login page in 3 seconds...</p>
              <Button
                onClick={() => router.push("/login?activated=true")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Go to Login
              </Button>
            </div>
          )}

          {status === "expired" && (
            <div className="text-center space-y-3">
              <Button
                onClick={handleResendActivation}
                disabled={isResending}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isResending ? "Sending..." : "Send New Activation Link"}
              </Button>
              <Button variant="ghost" onClick={() => router.push("/register")} className="w-full">
                Back to Registration
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-3">
              <Button onClick={handleActivation} className="w-full bg-blue-600 hover:bg-blue-700">
                Try Again
              </Button>
              <Button variant="ghost" onClick={() => router.push("/login")} className="w-full">
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
