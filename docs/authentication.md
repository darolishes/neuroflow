# Authentication System Documentation

## Overview

This document provides a comprehensive overview of the authentication system implemented in our Next.js application using Supabase as the authentication provider. It covers the current implementation, architectural decisions, security considerations, and planned improvements.

## Current Implementation

### Architecture

Our authentication system follows a client-side + server-side hybrid approach:

- **Client-side Authentication**: Managed through an `AuthContext` React context provider
- **Server-side Authentication**: Implemented through Supabase server client in server actions
- **Route Protection**: Implemented using a `ProtectedRoute` component
- **Auth Directory Structure**: Located in `src/app/(auth)/` for auth pages and `src/app/(protected)/` for protected pages

### Key Components

#### 1. Supabase Client (`src/lib/supabase.ts`)

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

#### 2. Authentication Context (`src/contexts/AuthContext.tsx`)

Provides authentication state and methods to the application:

- User state management
- Authentication methods (signIn, signUp, signInWithGoogle, signOut, etc.)
- Loading state management

#### 3. Protected Route Component (`src/components/auth/protected-route.tsx`)

Controls access to routes based on authentication state:

- Redirects unauthenticated users from protected routes to login
- Redirects authenticated users from auth routes to dashboard
- Provides a higher-order component `withProtectedRoute` for use with components

#### 4. Server Actions (`src/app/actions/auth.ts`)

Server-side authentication operations:

- Password updates with server-side validation
- Session management

### Authentication Flow

1. **User Registration**:

   - User submits signup form
   - Supabase creates a new user
   - Verification email sent if enabled

2. **User Login**:

   - User submits login form
   - Supabase validates credentials
   - AuthContext updates user state

3. **Social Login**:

   - User clicks "Sign in with Google" button
   - Redirected to Google for authentication
   - Callback route processes OAuth response
   - AuthContext updates user state

4. **Password Reset**:

   - User requests password reset
   - Reset email sent
   - User clicks link in email
   - Reset page allows new password creation

5. **Protected Route Access**:
   - ProtectedRoute component checks authentication state
   - Redirects if necessary
   - Renders content if authorized

## Security Considerations

Current security measures:

- JWT-based authentication handled by Supabase
- Protected routes to control access to authenticated content
- Basic error handling for authentication failures
- Secure password update functionality

## Planned Improvements

### 1. Next.js Middleware Integration

Implement proper Next.js middleware for more consistent route protection:

```typescript
// Example middleware implementation
export function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request, NextResponse);

  // Check authentication for protected routes
  if (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/profile")
  ) {
    const session = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
```

### 2. Enhanced Error Handling

Create more comprehensive error handling with user-friendly messages:

```typescript
// Example error handling utility
export function handleAuthError(error: any): string {
  const errorMap: Record<string, string> = {
    "auth/invalid-email": "The email address is not valid.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    // Add more error mappings
  };

  return (
    errorMap[error.code] || "An unexpected error occurred. Please try again."
  );
}
```

### 3. Session Management Improvements

Implement better session handling and token refresh:

```typescript
// Example session refresh functionality
export function setupSessionRefresh(supabase, setUser) {
  // Set up automatic token refresh
  return supabase.auth.onAuthStateChange((event, session) => {
    if (event === "TOKEN_REFRESHED") {
      setUser(session?.user || null);
    }
  });
}
```

### 4. Security Enhancements

Add rate limiting and additional CSRF protection:

```typescript
// Example rate limiting implementation
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"),
});

export async function protectAuthEndpoint(ip: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    throw new Error("Too many requests. Please try again later.");
  }
}
```

### 5. Role-Based Access Control (RBAC)

Implement a role-based permission system:

```typescript
// Example RBAC implementation
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export function hasPermission(user: User, requiredRole: UserRole): boolean {
  const userRole = user.app_metadata?.role || UserRole.USER;

  switch (requiredRole) {
    case UserRole.ADMIN:
      return userRole === UserRole.ADMIN;
    case UserRole.USER:
      return [UserRole.USER, UserRole.ADMIN].includes(userRole);
    default:
      return false;
  }
}
```

### 6. Profile Management Integration

Better integrate profiles with the auth system:

```typescript
// Example profile update functionality
export async function updateUserProfile(
  userId: string,
  profileData: ProfileData
) {
  const { data, error } = await supabase.from("profiles").upsert({
    id: userId,
    ...profileData,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
  return data;
}
```

## Implementation Timeline

1. **Phase 1 (Current Sprint)**

   - Set up Next.js middleware for route protection
   - Enhance error handling for auth operations

2. **Phase 2 (Next Sprint)**

   - Implement session management improvements
   - Add security enhancements (rate limiting, CSRF protection)

3. **Phase 3 (Future)**
   - Implement RBAC system
   - Enhance profile management integration

## References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Authentication Documentation](https://nextjs.org/docs/authentication)
- [OWASP Authentication Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
