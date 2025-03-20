/**
 * @module PasswordForm
 * @fileoverview Password update form component with strength validation
 * @since 1.0.0
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { updatePassword } from "@/app/actions/auth";

// Password strength requirements
const passwordRequirements = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSpecialChars: 1,
};

// Password validation schema
const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required.",
    }),
    newPassword: z
      .string()
      .min(passwordRequirements.minLength, {
        message: `Password must be at least ${passwordRequirements.minLength} characters.`,
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string().min(1, {
      message: "Please confirm your new password.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface PasswordStrength {
  score: number;
  feedback: string;
  requirements: {
    minLength: boolean;
    hasLower: boolean;
    hasUpper: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

function getPasswordStrength(password: string): PasswordStrength {
  const requirements = {
    minLength: password.length >= passwordRequirements.minLength,
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(requirements).filter(Boolean).length;
  let feedback = "";

  switch (score) {
    case 0:
    case 1:
      feedback = "Very weak - Please make it stronger";
      break;
    case 2:
      feedback = "Weak - Add more variety";
      break;
    case 3:
      feedback = "Medium - Almost there";
      break;
    case 4:
      feedback = "Strong - Looking good";
      break;
    case 5:
      feedback = "Very strong - Excellent password";
      break;
    default:
      feedback = "Please enter a password";
  }

  return { score, feedback, requirements };
}

export default function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: "",
    requirements: {
      minLength: false,
      hasLower: false,
      hasUpper: false,
      hasNumber: false,
      hasSpecial: false,
    },
  });
  const { toast } = useToast();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update password strength when new password changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "newPassword") {
        setPasswordStrength(getPasswordStrength(value.newPassword || ""));
      }
      if (serverError) {
        setServerError(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, serverError]);

  async function onSubmit(data: PasswordFormValues) {
    setIsLoading(true);
    setServerError(null);

    try {
      const result = await updatePassword(
        data.currentPassword,
        data.newPassword
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      // Reset form
      form.reset();
      setPasswordStrength(getPasswordStrength(""));

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Password update error:", error);
      setServerError(
        error.message || "Failed to update password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter your current password to verify your identity.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormDescription className="space-y-2">
                <div>
                  Password strength:
                  <Progress
                    value={(passwordStrength.score / 5) * 100}
                    className="h-2 w-full mt-1"
                    indicatorClassName={
                      passwordStrength.score < 2
                        ? "bg-destructive"
                        : passwordStrength.score < 4
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }
                  />
                  <p className="text-sm mt-1">{passwordStrength.feedback}</p>
                </div>
                <div className="space-y-1 mt-2">
                  <div className="text-sm">Requirements:</div>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center space-x-2">
                      {passwordStrength.requirements.minLength ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span>
                        At least {passwordRequirements.minLength} characters
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      {passwordStrength.requirements.hasLower ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span>One lowercase letter</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      {passwordStrength.requirements.hasUpper ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span>One uppercase letter</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      {passwordStrength.requirements.hasNumber ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span>One number</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      {passwordStrength.requirements.hasSpecial ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span>One special character</span>
                    </li>
                  </ul>
                </div>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Re-enter your new password to confirm it.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </Form>
  );
}
