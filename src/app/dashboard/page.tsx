/**
 * @module DashboardPage
 * @fileoverview Protected dashboard page component
 * @since 1.0.0
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface EnvInfo {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NODE_ENV: string;
}

/**
 * Dashboard page component
 * @component
 */
export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [dbValue, setDbValue] = useState<string | null>(null);
  const [envInfo] = useState<EnvInfo>({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set",
    NODE_ENV: process.env.NODE_ENV || "Not set",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
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

    if (user) {
      fetchSampleValue();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (err: unknown) {
      console.error("Error signing out:", err);
      // Still redirect to login page even if there's an error
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Project Starter Template
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 sm:px-0 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
          <p className="mt-1 text-sm text-gray-600">
            Here is your account status for today.
          </p>
        </div>

        {/* Environment Info Widget */}
        <div className="mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Environment Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-500">
                    Sample DB Value
                  </h4>
                  <p className="mt-1 text-sm text-gray-900 font-mono">
                    {dbValue}
                  </p>
                </div>
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-500">
                    Supabase URL
                  </h4>
                  <p className="mt-1 text-sm text-gray-900 font-mono">
                    {envInfo.NEXT_PUBLIC_SUPABASE_URL}
                  </p>
                </div>
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-500">
                    Node Environment
                  </h4>
                  <p className="mt-1 text-sm text-gray-900 font-mono">
                    {envInfo.NODE_ENV}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Sample Stat Cards */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Projects
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Tasks
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completed Tasks
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Activity
              </h3>
              <div className="mt-4">
                <div className="text-center py-8 text-gray-500">
                  No recent activity to show.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
