"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"

/**
 * ResetPassword page component
 * Handles setting a new password after receiving a reset link
 */
export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { confirmPasswordReset } = useAuth()
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [codeVerified, setCodeVerified] = useState(false)

  // Get the token and code from URL
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes("type=recovery")) {
      setCodeVerified(true)
    } else {
      setError("Invalid or expired password reset link. Please request a new one.")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    
    setIsLoading(true)
    setError("")

    try {
      await confirmPasswordReset(password)
      setIsSuccess(true)
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (err) {
      console.error("Password reset error:", err)
      setError("Failed to reset password. Please try again or request a new link.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
            <CardDescription className="text-center">
              Create a new password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="flex flex-col gap-4 text-center">
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="text-sm font-medium text-green-800">
                      Password updated successfully! Redirecting to login...
                    </div>
                  </div>
                </div>
              </div>
            ) : !codeVerified ? (
              <div className="flex flex-col gap-4 text-center">
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="text-sm font-medium text-red-800">
                      {error}
                    </div>
                  </div>
                </div>
                <Button asChild className="mt-2">
                  <Link href="/auth/forgot-password">Request New Link</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Reset Password"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm mt-2">
              <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
                Back to login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
