/**
 * @module DashboardPage
 * @fileoverview Protected dashboard page component
 * @since 1.0.0
 */

"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EnvInfo {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NODE_ENV: string;
}

/**
 * Dashboard page component
 * @component
 */
export default function DashboardPage() {
  const { signOut } = useAuth();
  const [dbValue, setDbValue] = useState<string | null>(null);
  const [envInfo] = useState<EnvInfo>({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set",
    NODE_ENV: process.env.NODE_ENV || "Not set",
  });

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
            <CardDescription>
              Manage your tasks and stay organized
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={signOut}>Sign Out</Button>
          </CardContent>
        </Card>
        {/* Add more dashboard cards here */}
      </div>
    </>
  );
}
