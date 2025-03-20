/**
 * @module DashboardPage
 * @fileoverview Protected dashboard page component
 * @since 1.0.0
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, {user.email}!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
            <CardDescription>
              Manage your tasks and stay organized
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/auth/signout" method="post">
              <Button type="submit">Sign Out</Button>
            </form>
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
              <p>
                Supabase URL:{" "}
                {process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set"}
              </p>
              <p>Node Env: {process.env.NODE_ENV || "Not set"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
