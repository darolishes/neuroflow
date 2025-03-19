/**
 * @module ProfileForm
 * @fileoverview Profile information update form component
 * @since 1.0.0
 */

"use client";

import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";

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
    .max(100, { message: "Full name must not be longer than 100 characters." })
    .optional(),
  website: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: async () => {
      // Fetch current profile data
      const { data, error } = await supabase
        .from("profiles")
        .select("username, full_name, website")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return {
          username: "",
          full_name: "",
          website: "",
        };
      }

      return {
        username: data.username || "",
        full_name: data.full_name || "",
        website: data.website || "",
      };
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          username: data.username,
          full_name: data.full_name,
          website: data.website,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                This is your full name. It will be visible to other users.
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
              <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
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
