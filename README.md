# OOSSPAY

A people-first community savings platform for Nigerian users. Save consistently, set financial targets, and request withdrawals — all through a personal dashboard.

## Tech Stack

- **Framework:** Next.js 14+ (App Router) with TypeScript
- **UI:** shadcn/ui + Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL, Auth, RLS)
- **Package Manager:** pnpm
- **Forms:** React Hook Form + Zod
- **Email:** Resend

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd oosspay
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in your Supabase project URL, anon key, and service role key from the [Supabase dashboard](https://app.supabase.com).

### 3. Set up the database

1. Open the Supabase SQL Editor
2. Copy and run `supabase/migrations/001_initial_schema.sql`
3. Configure Auth in the Supabase dashboard:
   - Enable Email/Password sign-in
   - Set `Site URL` to your app URL
   - Add redirect URLs for password reset (e.g. `http://localhost:3000/login`)

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/         # Login, Register, Forgot Password
│   ├── (dashboard)/    # User dashboard (protected)
│   ├── (admin)/        # Admin panel (admin-only)
│   └── (marketing)/    # Public landing page + static pages
├── components/
│   ├── auth/           # Auth forms
│   ├── dashboard/      # Dashboard components
│   ├── admin/          # Admin components
│   ├── landing/        # Landing page sections
│   └── shared/         # Navbar, Logo, LoadingSpinner
├── context/            # AuthContext
├── hooks/              # Data-fetching hooks
├── lib/
│   ├── supabase/       # Supabase clients (browser, server, admin, middleware)
│   ├── constants.ts
│   ├── utils.ts
│   └── validations.ts  # Zod schemas
└── types/              # TypeScript types matching DB schema
```

## Making a User an Admin

In the Supabase Table Editor, find the user in `profiles` and set `role` to `admin`.

## Deployment (Hostinger JS Hosting)

1. Build: `pnpm build`
2. Upload the `.next/`, `public/`, `package.json`, and `pnpm-lock.yaml` to Hostinger
3. Set environment variables in the Hostinger panel
4. Run `pnpm start` (or configure the start command in Hostinger)
