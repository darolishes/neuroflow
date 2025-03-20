"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export function SignUpForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Clear field-specific errors when user types
  useEffect(() => {
    setEmailError("");
  }, [email]);

  useEffect(() => {
    setPasswordError("");
    checkPasswordStrength(password);
  }, [password]);

  useEffect(() => {
    setConfirmPasswordError("");
  }, [confirmPassword]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const checkPasswordStrength = (password: string): void => {
    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;

    // Contains number
    if (/[0-9]/.test(password)) strength += 1;

    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  };

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const validatePasswordsMatch = (): boolean => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    return true;
  };

  const validateForm = (): boolean => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const doPasswordsMatch = validatePasswordsMatch();

    return isEmailValid && isPasswordValid && doPasswordsMatch;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Validate form
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check the form for errors.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password);
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      router.push("/auth/login?registered=true");
    } catch (err) {
      console.error("Registration error:", err);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "This email may already be in use.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <p
              id="email-error"
              data-testid="email-error"
              className="text-sm text-red-500 mt-1"
            >
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
            aria-describedby={
              passwordError ? "password-error" : "password-strength"
            }
          />
          {passwordError ? (
            <p id="password-error" className="text-sm text-red-500 mt-1">
              {passwordError}
            </p>
          ) : password ? (
            <div id="password-strength" className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">
                Password strength:
              </p>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    passwordStrength < 2
                      ? "bg-red-500"
                      : passwordStrength < 4
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {passwordStrength < 2
                  ? "Weak"
                  : passwordStrength < 4
                  ? "Medium"
                  : "Strong"}
              </p>
              <ul className="text-xs text-muted-foreground mt-1 list-disc pl-4">
                <li className={password.length >= 8 ? "text-green-600" : ""}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
                  Uppercase letter
                </li>
                <li className={/[a-z]/.test(password) ? "text-green-600" : ""}>
                  Lowercase letter
                </li>
                <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>
                  Number
                </li>
                <li
                  className={
                    /[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""
                  }
                >
                  Special character
                </li>
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
            aria-describedby={
              confirmPasswordError ? "confirm-password-error" : undefined
            }
          />
          {confirmPasswordError && (
            <p
              id="confirm-password-error"
              className="text-sm text-red-500 mt-1"
            >
              {confirmPasswordError}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
