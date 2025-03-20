"use client";

import { useSearchParams } from "next/navigation";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/dashboard";

  return (
    <>
      <CardHeader className="space-y-1 p-6">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>
          Enter your email and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <div className="p-6">
        <ForgotPasswordForm returnTo={returnTo} />
      </div>
    </>
  );
}
