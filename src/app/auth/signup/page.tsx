"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

/**
 * SignUp page component
 * Handles user registration with enhanced validation and user feedback
 * @returns {JSX.Element} The signup page component
 */
export default function SignupPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Form validation states
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Clear field-specific errors when user types
  useEffect(() => {
    setEmailError("")
  }, [email])

  useEffect(() => {
    setPasswordError("")
    checkPasswordStrength(password)
  }, [password])

  useEffect(() => {
    setConfirmPasswordError("")
  }, [confirmPassword])

  /**
   * Validates email format
   * @param {string} email - The email to validate
   * @returns {boolean} Whether the email is valid
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    return true
  }

  /**
   * Checks password strength and updates the strength indicator
   * @param {string} password - The password to check
   */
  const checkPasswordStrength = (password: string): void => {
    let strength = 0

    // Length check
    if (password.length >= 8) strength += 1

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1

    // Contains number
    if (/[0-9]/.test(password)) strength += 1

    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    setPasswordStrength(strength)
  }

  /**
   * Validates password requirements
   * @param {string} password - The password to validate
   * @returns {boolean} Whether the password is valid
   */
  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return false
    }
    return true
  }

  /**
   * Validates that passwords match
   * @returns {boolean} Whether the passwords match
   */
  const validatePasswordsMatch = (): boolean => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
      return false
    }
    return true
  }

  /**
   * Validates the entire form
   * @returns {boolean} Whether the form is valid
   */
  const validateForm = (): boolean => {
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    const doPasswordsMatch = validatePasswordsMatch()

    return isEmailValid && isPasswordValid && doPasswordsMatch
  }

  /**
   * Handles form submission
   * @param {React.FormEvent} e - The form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setError("")
    setEmailError("")
    setPasswordError("")
    setConfirmPasswordError("")

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password)
      setSuccess(true)

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/auth/login?registered=true")
      }, 2000)
    } catch (err) {
      console.error("Registration error:", err)
      setError("Failed to create account. Email may already be in use.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to sign up
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Account created successfully! Redirecting to login...
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className={emailError ? "border-red-300" : ""}
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                  />
                  {emailError && (
                    <p id="email-error" data-testid="email-error" className="text-sm text-red-500 mt-1">
                      {emailError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className={passwordError ? "border-red-300" : ""}
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? "password-error" : "password-strength"}
                  />
                  {passwordError ? (
                    <p id="password-error" className="text-sm text-red-500 mt-1">
                      {passwordError}
                    </p>
                  ) : password ? (
                    <div id="password-strength" className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Password strength:</p>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength < 2 ? 'bg-red-500' : passwordStrength < 4 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {passwordStrength < 2 ? 'Weak' : passwordStrength < 4 ? 'Medium' : 'Strong'}
                      </p>
                      <ul className="text-xs text-muted-foreground mt-1 list-disc pl-4">
                        <li className={password.length >= 8 ? "text-green-600" : ""}>At least 8 characters</li>
                        <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>Uppercase letter</li>
                        <li className={/[a-z]/.test(password) ? "text-green-600" : ""}>Lowercase letter</li>
                        <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>Number</li>
                        <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}>Special character</li>
                      </ul>
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className={confirmPasswordError ? "border-red-300" : ""}
                    aria-invalid={!!confirmPasswordError}
                    aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
                  />
                  {confirmPasswordError && (
                    <p id="confirm-password-error" className="text-sm text-red-500 mt-1">
                      {confirmPasswordError}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign up"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm mt-2">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
