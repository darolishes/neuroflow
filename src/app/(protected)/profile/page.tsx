/**
 * @module ProfilePage
 * @fileoverview User profile page component
 * @since 1.0.0
 */

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loading } from "@/components/ui/loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "@/components/profile/profile-form";
import PasswordForm from "@/components/profile/password-form";
import AvatarUpload from "@/components/profile/avatar-upload";
import { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const authenticatedUser: User = user;

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="avatar">Avatar</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileForm user={authenticatedUser} />
          </TabsContent>
          <TabsContent value="password">
            <PasswordForm />
          </TabsContent>
          <TabsContent value="avatar">
            <AvatarUpload user={authenticatedUser} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
