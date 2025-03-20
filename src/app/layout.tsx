/**
 * @module RootLayout
 * @fileoverview Root layout component with authentication provider and theme provider
 * @since 1.0.0
 */

import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navigation/navbar";
import "./globals.css";

export const metadata = {
  title: "ADHD Organizer",
  description:
    "A modern web application for ADHD organization and task management",
};

/**
 * Root layout component
 * @component
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Navbar />
            <main className="container mx-auto px-4 py-8">{children}</main>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
