# Project Starter Template

A modern web application starter template built with Next.js, TypeScript, Tailwind CSS, and Supabase authentication.

## Quick Start with clone-project.sh

To easily start a new project using this template, you can use the `clone-project.sh` (mac/linux) or the .bat version (windows) script. This script will guide you through the process of setting up a new project with the necessary configurations and files in place.

### Usage

1. Make the script executable:

   ```bash
   chmod +x scripts/clone-project.sh
   ```

2. Run the script:

   ```bash
   ./scripts/clone-project.sh
   ```

3. Follow the prompts to set up your new project.

## Features

- **Full Authentication Flow**  
  Integrated signup/login system with:

  - Email/password registration
  - Secure password validation
  - Email verification system
  - Google OAuth integration
  - Protected route handling

- **Modern Next.js Architecture**

  - App router implementation
  - Server-side rendering (SSR) optimization
  - Client-side navigation
  - Context API for state management

- 🎨 Modern UI with Tailwind CSS
- 📱 **Dynamic Dashboard**  
  Post-login interface demonstrating:
  - Environment configuration visibility
  - Supabase database integration
  - Real-time data fetching
  - Responsive layout components
  - Secure data handling
  - Configuration management UI
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

## Deployment

### Deployment Options

Choose your preferred hosting platform:

### 1. Vercel (Recommended)

#### One-Click Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fyour-repo-name)

1. Click the "Deploy with Vercel" button above
2. Sign in to Vercel (or create an account)
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

#### Manual Vercel Deployment

1. Push your code to a Git repository
2. Import your project in Vercel
3. Set up environment variables
4. Deploy!

### 2. AWS S3 Static Hosting

#### Prerequisites

- AWS account
- AWS CLI installed and configured
- IAM user with S3 access

#### Deployment Steps:

1. Install required packages:

```bash
npm install
```

2. Build static export:

```bash
npm run build && npm run export
```

3. Create S3 bucket:

```bash
aws s3 mb s3://your-bucket-name --region your-region
```

4. Configure bucket for static hosting:

```bash
aws s3 website s3://your-bucket-name --index-document index.html --error-document error.html
```

5. Set bucket policy (replace bucket-name with your actual bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

6. Deploy files:

```bash
aws s3 sync out/ s3://your-bucket-name --delete
```

7. Access your site at:
   `http://your-bucket-name.s3-website-region.amazonaws.com`

(Optional) For production use:

- Add CloudFront CDN
- Configure custom domain
- Enable HTTPS

## Customization

- Update the title in `src/app/layout.tsx`
- Modify the dashboard widgets in `src/app/dashboard/page.tsx`
- Add new authentication providers in Supabase dashboard
- Customize the UI using Tailwind CSS classes

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this template for your own projects!
