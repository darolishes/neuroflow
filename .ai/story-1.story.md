# Story: Set up Next.js project with Supabase integration

## Status: Draft

## Epic: Core Infrastructure & Authentication (Epic-1)

## Story Points: 5

## Context

As the first step in building the ADHD Organizer app, we need to set up the core infrastructure with Next.js 14 and Supabase integration. This will serve as the foundation for all future development.

## Acceptance Criteria

### Project Setup

- [ ] Initialize Next.js 14 project with TypeScript and App Router
- [ ] Configure TailwindCSS and ShadcnUI
- [ ] Set up ESLint and Prettier
- [ ] Configure Vitest and Testing Library
- [ ] Add PWA support

### Supabase Integration

- [ ] Initialize Supabase project
- [ ] Set up database schema with initial tables
- [ ] Configure Supabase client
- [ ] Set up authentication providers
- [ ] Implement Row Level Security policies

### Development Environment

- [ ] Configure environment variables
- [ ] Set up development database
- [ ] Create documentation for local setup
- [ ] Add CI/CD pipeline configuration

## Technical Notes

### Database Schema Implementation

```sql
-- Create database schema
CREATE TYPE task_priority AS ENUM ('high', 'medium', 'low');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'archived');
CREATE TYPE reminder_status AS ENUM ('pending', 'triggered', 'dismissed');

-- Users table is handled by Supabase Auth

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  ai_metadata JSONB DEFAULT '{}',
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  priority task_priority DEFAULT 'medium',
  status task_status DEFAULT 'pending'
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ai_rules JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ai_confidence FLOAT DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reminders table
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  remind_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status reminder_status DEFAULT 'pending',
  smart_rules JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_tags_task_id ON tags(task_id);
CREATE INDEX idx_reminders_task_id ON reminders(task_id);
CREATE INDEX idx_reminders_remind_at ON reminders(remind_at);
```

### Row Level Security Policies

```sql
-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Tasks policies
CREATE POLICY "Users can create their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Similar policies for categories, tags, and reminders...
```

## Implementation Steps

1. Project Initialization

   ```bash
   pnpm create next-app@latest adhd-organizer
   cd adhd-organizer
   pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
   ```

2. Configure Development Environment

   ```bash
   pnpm add -D typescript @types/react @types/node
   pnpm add -D eslint prettier
   pnpm add -D vitest @testing-library/react
   ```

3. Set up TailwindCSS and ShadcnUI

   ```bash
   pnpm add -D tailwindcss postcss autoprefixer
   pnpm add @shadcn/ui
   npx shadcn-ui@latest init
   ```

4. Initialize Supabase Project

   - Create new project in Supabase dashboard
   - Set up database schema
   - Configure authentication providers
   - Set up RLS policies

5. Configure Environment Variables
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## Test Cases

### Unit Tests

- [ ] Test Supabase client initialization
- [ ] Test environment configuration
- [ ] Test database schema creation
- [ ] Test RLS policy enforcement

### Integration Tests

- [ ] Test user authentication flow
- [ ] Test database operations with RLS
- [ ] Test environment variable loading

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Database schema implemented and verified
- [ ] RLS policies tested and working
- [ ] All tests passing
- [ ] Documentation updated
- [ ] PR reviewed and approved
- [ ] Deployed to development environment

## Chat Log

[Start of implementation]
