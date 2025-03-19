/**
 * @module ProfilePage
 * @fileoverview User profile page component
 * @since 1.0.0
 */

"use client";

import { useAuth } from "@/contexts/AuthContext";
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

export default function ProfilePage() {
  const { user } = useAuth();

  // We know user will be available because of the protected layout
  if (!user) return null;

  return (
    <Card className="max-w-4xl mx-auto">
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
            <ProfileForm user={user} />
          </TabsContent>
          <TabsContent value="password">
            <PasswordForm />
          </TabsContent>
          <TabsContent value="avatar">
            <AvatarUpload user={user} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
