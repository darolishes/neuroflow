/**
 * @module ProfileForm
 * @fileoverview Profile information update form component
 * @since 1.0.0
 */

"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define form validation schema
const profileFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(50, { message: "Username must not be longer than 50 characters." })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        "Username can only include letters, numbers, underscores, and hyphens.",
    }),
  full_name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." })
    .max(100, { message: "Full name must not be longer than 100 characters." })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message:
        "Full name can only include letters, spaces, hyphens, and apostrophes.",
    })
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, { message: "Bio must not be longer than 500 characters." })
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .max(100, { message: "Location must not be longer than 100 characters." })
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: async () => {
      try {
        // Fetch current profile data
        const { data, error } = await supabase
          .from("profiles")
          .select("username, full_name, website, bio, location")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        return {
          username: data.username || "",
          full_name: data.full_name || "",
          website: data.website || "",
          bio: data.bio || "",
          location: data.location || "",
        };
      } catch (error) {
        console.error("Error fetching profile:", error);
        return {
          username: "",
          full_name: "",
          website: "",
          bio: "",
          location: "",
        };
      }
    },
  });

  // Clear server error when form values change
  useEffect(() => {
    if (serverError) {
      const subscription = form.watch(() => setServerError(null));
      return () => subscription.unsubscribe();
    }
  }, [form, serverError]);

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    setServerError(null);

    try {
      // Check if username is already taken (if changed)
      const currentValues = form.getValues();
      if (currentValues.username !== data.username) {
        const { data: existingUser, error: checkError } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", data.username)
          .single();

        if (existingUser) {
          setServerError("Username is already taken");
          return;
        }
        if (checkError && checkError.code !== "PGRST116") {
          throw checkError;
        }
      }

      // Update profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          username: data.username,
          full_name: data.full_name,
          website: data.website,
          bio: data.bio,
          location: data.location,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      setServerError(
        error.message || "Failed to update profile. Please try again."
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can only contain letters,
                numbers, underscores, and hyphens.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormDescription>
                Your full name will be visible to other users.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description about yourself. Maximum 500 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Your location" {...field} />
              </FormControl>
              <FormDescription>
                Your general location (e.g., city, country).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormDescription>
                Your personal website or portfolio.
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
            "Update Profile"
          )}
        </Button>
      </form>
    </Form>
  );
}
