/**
 * @module DashboardPage
 * @fileoverview Protected dashboard page component
 * @since 1.0.0
 */

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface EnvInfo {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NODE_ENV: string;
}

/**
 * Dashboard page component
 * @component
 */
export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dbValue, setDbValue] = useState<string | null>(null);
  const [envInfo] = useState<EnvInfo>({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set",
    NODE_ENV: process.env.NODE_ENV || "Not set",
  });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      } else {
        fetchSampleValue();
      }
    }
  }, [user, loading, router]);

  const fetchSampleValue = async () => {
    try {
      const { data, error } = await supabase
        .from("app_config")
        .select("value")
        .eq("key", "starterAppWelcomeMessage")
        .single();

      if (error) throw error;
      setDbValue(data?.value || "No welcome message found");
    } catch (error) {
      console.error("Error fetching welcome message:", error);
      setDbValue("Error fetching welcome message");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your Dashboard</CardTitle>
          <CardDescription>
            Manage your tasks and stay organized
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/auth/login")}>Sign Out</Button>
        </CardContent>
      </Card>
      {/* Environment Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
          <CardDescription>Current configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>Supabase URL: {envInfo.NEXT_PUBLIC_SUPABASE_URL}</p>
            <p>Node Env: {envInfo.NODE_ENV}</p>
            <p>DB Value: {dbValue}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
