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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
      router.push("/auth/login");
    }
  };

  if (!user) return null;

  const userInitial = user.email?.[0].toUpperCase() || "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {userInitial}
          </AvatarFallback>
        </Avatar>
        <span className="ml-2 hidden sm:inline text-sm font-medium">
          {user.email}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-destructive focus:text-destructive"
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
