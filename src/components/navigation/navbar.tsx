"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { UserDropdown } from "./user-dropdown";

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b bg-background">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/dashboard"
          className="text-xl font-bold text-center md:text-left"
        >
          ADHD Organizer
        </Link>
        {user && <UserDropdown user={user} signOut={signOut} />}
      </nav>
    </header>
  );
}
