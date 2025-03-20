# ADHD Organizer

A modern web application designed to help individuals with ADHD organize their lives through intuitive task management, reminders, and personalized assistance.

![ADHD Organizer](https://placeholder-for-app-screenshot.com/screenshot.png)

## Overview

The ADHD Organizer is built with a focus on accessibility, simplicity, and effectiveness for users with ADHD. It provides a structured environment that helps users manage tasks, set reminders, and organize their daily activities in a way that accommodates ADHD-specific challenges.

## Features

### Core Features

- **Task Management System**

  - Create, categorize, and prioritize tasks
  - Visual progress tracking
  - Flexible organization options

- **Reminder System**

  - Smart notifications
  - Time-based and location-based reminders
  - Gentle but effective prompting

- **Focus Assistance**
  - Pomodoro timer integration
  - Distraction blocking suggestions
  - Focus mode with minimalist UI

### Technical Features

- **Comprehensive Authentication System**

  - Email/password registration and login
  - Google OAuth integration
  - Secure password recovery flow
  - Protected routes for authenticated content
  - Organized auth pages in `/app/auth` directory

- **Modern Web Architecture**

  - Next.js App Router for optimized routing
  - Server-side rendering for performance
  - TypeScript for type safety
  - Context API for state management

- **Responsive UI/UX**
  - ADHD-friendly design principles
  - Tailwind CSS for styling
  - ShadcnUI component library
  - Minimal visual distractions
- 🔒 Protected routes
- 🌍 Environment variable management
- ✨ TypeScript support
- 🧪 Testing setup with Vitest

## Prerequisites

- Node.js 20+ and npm
- A Supabase account (free tier works great)

## Getting Started

### 1. Clone the Template

To create a new project from this template:

```bash
# Make the script executable (Linux/Mac)
chmod +x scripts/clone-project.sh

# Run the cloning script
./scripts/clone-project.sh

# For Windows users
.\scripts\clone-project.bat
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Create the required database table:

   ```sql
   -- Create app_config table
   create table public.app_config (
     key text primary key,
     value text not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Insert welcome message
   insert into public.app_config (key, value)
   values ('starterAppWelcomeMessage', 'supabase hello');

   -- Enable Row Level Security (RLS)
   alter table public.app_config enable row level security;

   -- Create policy to allow authenticated users to read
   create policy "Allow authenticated users to read app_config"
   on public.app_config
   for select
   to authenticated
   using (true);
   ```

### 3. Environment Setup

Copy the environment template:

```bash
cp .env.template .env.local
```

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

For production, set up these same variables in your hosting platform (e.g., Vercel).

### 4. (Optional) Google Authentication Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials > Create Credentials > OAuth Client ID
5. Set up OAuth consent screen if not already done
6. Choose Web application as the application type
7. Add authorized redirect URI:
   ```
   https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback
   ```
8. Copy the Client ID and Client Secret
9. In Supabase dashboard:
   - Go to Authentication > Providers
   - Enable Google
   - Paste your Client ID and Client Secret
   - Save changes

### 5. Development

Run the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

### 6. Testing

Run the test suite:

```bash
npm test
```

For test coverage:

```bash
npm run test:coverage
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Auth-related routes
│   ├── dashboard/         # Dashboard page with:
│   │   ├── page.tsx      # - Env variable display
│   │   └── components/    # - Supabase data visualization
│   │       ├── ConfigCard.tsx  # App configuration display
│   │       └── StatusBadge.tsx # System status indicators
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utility functions
│   └── supabase.ts      # Supabase client
└── test/                # Test setup
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run linting
- `npm run test:coverage` - Run test coverage

## Project Structure

```
├── .ai/                 # Project documentation and planning
│   ├── arch.md          # Architecture documentation
│   ├── prd.md           # Product requirements document
│   └── story-*.story.md # User stories
│
├── src/
│   ├── app/             # Next.js app router entries
│   │   ├── auth/        # Authentication pages
│   │   │   ├── login/   # Login page
│   │   │   ├── signup/  # Registration page
│   │   │   ├── forgot-password/ # Password recovery
│   │   │   └── reset-password/  # Password reset
│   │   ├── dashboard/   # Authenticated area
│   │   └── layout.tsx   # Root layout
│   │
│   ├── components/      # Reusable components
│   │   ├── ui/          # UI components from shadcn
│   │   └── login-form.tsx # Login form component
│   │
│   ├── contexts/        # Global state management
│   │   └── AuthContext.tsx # Authentication context
│   │
│   └── lib/             # Shared utilities
│       └── supabase.ts  # Supabase client
│
└── public/              # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account for backend services

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/darolishes/neuroflow.git
   cd neuroflow
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env.local` file in the root directory with the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Authentication Setup

The application uses Supabase Authentication. To set up:

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Enable Email/Password and Google OAuth providers in the Auth settings
3. Configure password reset email templates in Supabase Auth settings
4. Add your app's URL to the site URL list in Auth settings

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run linting
- `npm run test` - Run tests
- `npm run test:coverage` - Run test coverage

### Development Workflow

This project follows Test-Driven Development (TDD) principles:

1. Write tests first
2. Implement the minimum code to pass tests
3. Refactor while maintaining passing tests

All development tasks are tracked in the `.ai` directory as user stories.

## Deployment

### Deployment Options

#### Vercel (Recommended)

The easiest way to deploy this application is using Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy and get a production URL
4. Add the production URL to Supabase Auth settings

## Architecture

The ADHD Organizer follows a modern web application architecture:

- **Frontend**: Next.js with App Router, TypeScript, and Tailwind CSS
- **Backend**: Supabase for authentication, database, and real-time features
- **State Management**: React Context API for global state
- **Authentication**: Supabase Auth with email/password and OAuth providers
- **Styling**: Tailwind CSS with ShadcnUI components

Detailed architecture documentation is available in the `.ai/arch.md` file.

## Roadmap

- [ ] Task management system
- [ ] Reminder and notification system
- [ ] Focus assistance tools
- [ ] Mobile responsive design
- [ ] Offline support
- [ ] Data visualization for progress tracking
- [ ] AI-powered task suggestions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
