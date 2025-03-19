"use client";

import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserDropdownProps {
  user: User | null;
  signOut: () => Promise<void>;
}

export function UserDropdown({ user, signOut }: UserDropdownProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth/login");
    } catch (err: unknown) {
      console.error("Error signing out:", err);
      // Still redirect to login page even if there's an error
      router.push("/auth/login");
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 outline-none">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user?.email?.[0].toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
          {user?.email}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
