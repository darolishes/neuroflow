# Authentication System

This directory contains all authentication-related pages for the ADHD Organizer application.

## Directory Structure

- `/auth/login` - User login page
- `/auth/signup` - User registration page
- `/auth/forgot-password` - Password recovery request page
- `/auth/reset-password` - Password reset confirmation page

## Authentication Flow

1. **Login Flow**:
   - Users enter email/password or use Google OAuth
   - On successful login, they are redirected to the dashboard
   - On failure, appropriate error messages are displayed

2. **Registration Flow**:
   - Users provide email and password
   - Form validation ensures data quality
   - On successful registration, users are redirected to login page

3. **Password Recovery Flow**:
   - User requests password reset by providing email
   - Email with reset link is sent via Supabase Auth
   - User clicks link and is directed to reset-password page
   - User sets new password and is redirected to login page

## Implementation Details

- Authentication state is managed via `AuthContext` (`/src/contexts/AuthContext.tsx`)
- Login form component is in `/src/components/login-form.tsx`
- All authentication uses Supabase Auth services
- Error handling and loading states are implemented for better UX

## Security Considerations

- Password requirements: minimum 8 characters
- Email verification is handled by Supabase
- Auth pages implement proper validation and error handling
- Auth context ensures protected routes are secure

## Related Components

- `AuthContext` - Global authentication state management
- `login-form.tsx` - Reusable login form component

## Future Enhancements

- "Remember me" functionality
- Enhanced profile management
- Two-factor authentication
- Social login expansion (Apple, GitHub, etc.)
