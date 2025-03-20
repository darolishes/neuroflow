"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

export function ResetPasswordForm() {
  const router = useRouter();
  const { confirmPasswordReset } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  // Get the token and code from URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      setCodeVerified(true);
    } else {
      setError(
        "Invalid or expired password reset link. Please request a new one."
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await confirmPasswordReset(password);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(
        "Failed to reset password. Please try again or request a new link."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <AlertDescription className="text-green-800">
          Password updated successfully! Redirecting to login...
        </AlertDescription>
      </Alert>
    );
  }

  if (!codeVerified) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
        <Button asChild className="mt-2">
          <Link href="/auth/forgot-password">Request New Link</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Updating..." : "Reset Password"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <Link
          href="/auth/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
