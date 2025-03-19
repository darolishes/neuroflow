/**
 * @module RootLayout
 * @fileoverview Root layout component with authentication provider
 * @since 1.0.0
 */

import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

export const metadata = {
  title: "BMad Starter App",
  description: "A modern web application with authentication",
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
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
