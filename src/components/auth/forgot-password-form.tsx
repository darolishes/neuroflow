"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

export function ForgotPasswordForm() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setIsSuccess(false);

    try {
      await resetPassword(email);
      setIsSuccess(true);
    } catch (err) {
      console.error("Password reset error:", err);
      setError("Failed to send reset instructions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Reset instructions sent! Check your email.
          </AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground">
          If you don't receive an email within a few minutes, check your spam
          folder or make sure you've entered the correct email address.
        </p>
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Instructions"}
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
