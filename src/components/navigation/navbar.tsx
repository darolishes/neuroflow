"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { UserDropdown } from "./user-dropdown";

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold inline-block">
              ADHD Organizer
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user && <UserDropdown user={user} signOut={signOut} />}
        </div>
      </div>
    </nav>
  );
}
