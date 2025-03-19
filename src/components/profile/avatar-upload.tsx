/**
 * @module AvatarUpload
 * @fileoverview Avatar upload component for user profile
 * @since 1.0.0
 */

"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUploadProps {
  user: User;
}

export default function AvatarUpload({ user }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) fetchAvatar();
  }, [user]);

  async function fetchAvatar() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      if (data?.avatar_url) setAvatarUrl(data.avatar_url);
    } catch (error) {
      console.error("Error fetching avatar:", error);
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `avatars/${user.id}-${Math.random()}.${fileExt}`;

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const avatarUrl = data.publicUrl;

      // Update the user's profile with the new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(avatarUrl);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarUrl || undefined} alt="Profile picture" />
          <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <p className="text-sm text-muted-foreground">
          Recommended size: 256x256px. Max size: 2MB.
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => document.getElementById("avatar-upload")?.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Change Avatar"}
        </Button>
        {avatarUrl && (
          <Button
            variant="destructive"
            onClick={async () => {
              try {
                setUploading(true);
                const { error } = await supabase
                  .from("profiles")
                  .update({
                    avatar_url: null,
                    updated_at: new Date().toISOString(),
                  })
                  .eq("id", user.id);

                if (error) throw error;
                setAvatarUrl(null);
                toast({
                  title: "Avatar removed",
                  description: "Your profile picture has been removed.",
                });
              } catch (error: any) {
                toast({
                  title: "Error",
                  description: error.message || "Failed to remove avatar.",
                  variant: "destructive",
                });
              } finally {
                setUploading(false);
              }
            }}
            disabled={uploading}
          >
            Remove
          </Button>
        )}
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
        />
      </div>
    </div>
  );
}
