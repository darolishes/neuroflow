/**
 * @module RootLayout
 * @fileoverview Root layout component with authentication provider and theme provider
 * @since 1.0.0
 */

import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
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
      <body className="bg-background text-foreground">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
