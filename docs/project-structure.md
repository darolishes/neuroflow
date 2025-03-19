# Project Structure Conventions

## Directory Hierarchy

```
├── src/
│   ├── app/               # Next.js app router entries
│   │   ├── dashboard/     # Authenticated area
│   │   │   └── components # Dashboard-specific components
│   │   ├── login/         # Auth page
│   │   ├── signup/        # Registration page
│   │   └── layout.tsx     # Root layout
│   │
│   ├── contexts/          # Global state management
│   ├── lib/               # Shared utilities
│   └── test/              # Test configurations
│
├── docs/                  # Architectural documentation
└── public/                # Static assets
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Contexts**: `*Context.tsx` (e.g., `AuthContext.tsx`)
- **Pages**: Lowercase directory names (e.g., `login/page.tsx`)
- **Tests**: `*.test.tsx` alongside components

## Key Implementation Patterns

1. **Authentication**
   - Token-based session management
   - Protected routes using middleware
   - OAuth provider integration

2. **Data Fetching**
   - Server-side props for static generation
   - Client-side data fetching with SWR
   - Real-time updates via Supabase subscriptions

3. **Styling**
   - Tailwind utility classes
   - Responsive breakpoint prefixes
   - Dark mode support through CSS variables

4. **Error Handling**
   - Global error boundaries
   - API error interception
   - User-friendly error messages 