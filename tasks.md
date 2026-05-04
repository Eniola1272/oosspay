# OOSSPAY — Full Project Setup Prompt

You are setting up the full-stack web application for **OOSSPAY**, a people-first savings platform based in Nigeria. This is a production project, not a demo. Build it like it's going live in 30 days.

---

## PROJECT OVERVIEW

OOSSPAY is a community-driven savings platform that helps Nigerian users save consistently, set financial targets, track their progress, and request withdrawals — all through a personal dashboard. There is no automated payment integration yet (no Paystack, no Flutterwave). Deposits are handled manually by an admin team who updates user balances after confirming bank transfers. Withdrawals are requested by users via a form and approved by admins.

The platform has two sides:

1. **User-facing app** — registration, login, dashboard, target savings, withdrawal requests, notifications, profile management
2. **Admin panel** — internal dashboard for the OOSSPAY team to manage users, update balances, approve/reject withdrawals, post official account details, and send announcements

---

## TECH STACK

- **Framework:** Next.js 14+ (App Router) with TypeScript
- **UI Library:** shadcn/ui + Tailwind CSS
- **Backend & Database:** Supabase (PostgreSQL, Auth, Row-Level Security, Realtime)
- **Hosting:** Hostinger JavaScript Hosting (Node.js environment)
- **Package Manager:** pnpm (preferred) or npm
- **State Management:** React Context or Zustand (keep it simple)
- **Form Handling:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Notifications (email):** Resend (free tier)
- **SMS (future):** Termii (not yet integrated — just leave hooks)

---

## PROJECT STRUCTURE

Set up the following folder structure:

```
oosspay/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── savings/page.tsx           # Target savings
│   │   │   ├── withdraw/page.tsx          # Withdrawal request form
│   │   │   ├── notifications/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   └── layout.tsx                 # Dashboard shell with sidebar
│   │   ├── (admin)/
│   │   │   ├── admin/page.tsx             # Admin dashboard overview
│   │   │   ├── admin/users/page.tsx       # User management
│   │   │   ├── admin/users/[id]/page.tsx  # Individual user detail + balance management
│   │   │   ├── admin/withdrawals/page.tsx # Withdrawal approval queue
│   │   │   ├── admin/settings/page.tsx    # Platform settings (account details, announcements)
│   │   │   └── layout.tsx                 # Admin shell with sidebar
│   │   ├── (marketing)/
│   │   │   ├── page.tsx                   # Landing page
│   │   │   ├── about/page.tsx
│   │   │   ├── terms/page.tsx
│   │   │   └── privacy/page.tsx
│   │   ├── layout.tsx                     # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                            # shadcn/ui components
│   │   ├── landing/                       # Landing page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── WhyChooseUs.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── CTABanner.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── Footer.tsx
│   │   ├── dashboard/                     # Dashboard components
│   │   │   ├── BalanceCard.tsx
│   │   │   ├── ProgressRing.tsx
│   │   │   ├── TransactionList.tsx
│   │   │   ├── SavingsTargetCard.tsx
│   │   │   ├── WithdrawalForm.tsx
│   │   │   ├── NotificationItem.tsx
│   │   │   └── DashboardSidebar.tsx
│   │   ├── admin/                         # Admin components
│   │   │   ├── UserTable.tsx
│   │   │   ├── BalanceUpdateForm.tsx
│   │   │   ├── WithdrawalApprovalCard.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── AnnouncementForm.tsx
│   │   ├── auth/                          # Auth components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ForgotPasswordForm.tsx
│   │   └── shared/                        # Shared components
│   │       ├── Navbar.tsx
│   │       ├── Logo.tsx
│   │       └── LoadingSpinner.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                  # Browser Supabase client
│   │   │   ├── server.ts                  # Server Supabase client
│   │   │   ├── admin.ts                   # Service role client (admin operations)
│   │   │   └── middleware.ts              # Auth middleware
│   │   ├── utils.ts                       # General utilities
│   │   ├── constants.ts                   # App-wide constants
│   │   └── validations.ts                # Zod schemas
│   ├── hooks/
│   │   ├── useUser.ts
│   │   ├── useBalance.ts
│   │   ├── useSavingsTargets.ts
│   │   ├── useTransactions.ts
│   │   ├── useNotifications.ts
│   │   └── useWithdrawals.ts
│   ├── types/
│   │   └── index.ts                       # TypeScript type definitions
│   └── context/
│       └── AuthContext.tsx
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── logo-white.svg
│   │   ├── team-circle.png
│   │   └── og-image.png                  # Open Graph image (1200x630)
│   └── favicon.ico
├── supabase/
│   └── migrations/                        # SQL migration files
│       └── 001_initial_schema.sql
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## DATABASE SCHEMA (Supabase PostgreSQL)

Create all tables with Row-Level Security (RLS) enabled. Users should only see their own data. Admins (identified by a role field) can see all data.

```sql
-- USERS PROFILE (extends Supabase Auth)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    bank_name TEXT,
    bank_account_number TEXT,
    bank_account_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTIONS (deposits and withdrawals logged here)
CREATE TABLE public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    description TEXT,
    reference TEXT,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    recorded_by UUID REFERENCES public.profiles(id),  -- admin who recorded it
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SAVINGS TARGETS
CREATE TABLE public.savings_targets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,                    -- e.g. "Rent Fund", "New Phone"
    target_amount DECIMAL(12,2) NOT NULL CHECK (target_amount > 0),
    current_amount DECIMAL(12,2) DEFAULT 0 CHECK (current_amount >= 0),
    deadline DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WITHDRAWAL REQUESTS
CREATE TABLE public.withdrawal_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    bank_name TEXT NOT NULL,
    bank_account_number TEXT NOT NULL,
    bank_account_name TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'processing', 'completed', 'rejected')),
    admin_note TEXT,                       -- admin can leave a note on approval/rejection
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'deposit', 'withdrawal', 'announcement', 'target')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PLATFORM SETTINGS (for admin-managed content)
CREATE TABLE public.platform_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,              -- e.g. 'deposit_account_details', 'announcement'
    value JSONB NOT NULL,
    updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_savings_targets_user_id ON public.savings_targets(user_id);
CREATE INDEX idx_withdrawal_requests_user_id ON public.withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON public.withdrawal_requests(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- RLS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Users can view their own transactions
CREATE POLICY "Users view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- Admins can insert transactions (recording deposits)
CREATE POLICY "Admins can insert transactions" ON public.transactions FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Users can CRUD their own savings targets
CREATE POLICY "Users manage own targets" ON public.savings_targets FOR ALL USING (auth.uid() = user_id);

-- Users can view and create their own withdrawal requests
CREATE POLICY "Users view own withdrawals" ON public.withdrawal_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own withdrawals" ON public.withdrawal_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view and update all withdrawal requests
CREATE POLICY "Admins manage all withdrawals" ON public.withdrawal_requests FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Users can view and update their own notifications
CREATE POLICY "Users manage own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can mark notifications read" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Admins can insert notifications for any user
CREATE POLICY "Admins can create notifications" ON public.notifications FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Platform settings readable by all authenticated users, writable by admins
CREATE POLICY "Authenticated users can read settings" ON public.platform_settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage settings" ON public.platform_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- FUNCTION: Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'phone', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- FUNCTION: Calculate user balance from transactions
CREATE OR REPLACE FUNCTION public.get_user_balance(p_user_id UUID)
RETURNS DECIMAL AS $$
BEGIN
    RETURN COALESCE(
        (SELECT SUM(CASE WHEN type = 'deposit' THEN amount ELSE -amount END)
         FROM public.transactions
         WHERE user_id = p_user_id AND status = 'completed'),
        0
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## ENVIRONMENT VARIABLES

Create `.env.local.example`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=OOSSPAY

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# WhatsApp
NEXT_PUBLIC_WHATSAPP_LINK=https://wa.me/2349XXXXXXXXX
```

---

## BRAND & DESIGN TOKENS

Configure these in `tailwind.config.ts` and `globals.css`:

```
Primary Pink:     #C2185B (brand color — CTAs, headings, accents)
Primary Dark:     #1A1A2E (text, dark backgrounds, footer)
Primary Light:    #FCE4EC (light pink backgrounds, cards)
Success Green:    #27AE60 (deposits, positive actions)
Warning Orange:   #F39C12 (pending states)
Error Red:        #E74C3C (rejections, errors)
Text Primary:     #333333
Text Secondary:   #666666
Background:       #FFFFFF
Surface:          #FAFAFA
Border:           #E0E0E0
```

Typography:

- Headings: Bold, clean sans-serif (e.g. Plus Jakarta Sans, DM Sans, or Outfit)
- Body: Regular weight of the same family
- Dashboard numbers/balances: Tabular figures, slightly larger weight

---

## KEY BUSINESS LOGIC

### Balance Calculation

User balance is calculated from the `transactions` table, NOT stored as a static field. This ensures accuracy:

- Balance = SUM of all completed deposits - SUM of all completed withdrawals
- Use the `get_user_balance()` Supabase function
- Display on dashboard with proper Naira formatting: `₦150,000.00`

### Deposit Flow (Admin-Initiated)

1. User transfers money to OOSSPAY's official bank account (displayed on their dashboard)
2. Admin logs into admin panel → finds user → records deposit (amount, reference, description)
3. Transaction record is created → user balance updates → notification sent to user

### Withdrawal Flow (User-Initiated, Admin-Approved)

1. User fills withdrawal request form (amount, bank details, reason)
2. System validates: requested amount ≤ current balance
3. Request enters `pending` status → admin gets notified
4. Admin reviews → approves or rejects (with optional note)
5. If approved: status moves to `processing` → admin transfers money externally → marks as `completed`
6. User gets notification at each status change

### Target Savings

1. User creates a target (name, target amount, optional deadline)
2. When admin records a deposit, it can optionally be allocated to a specific target
3. Progress = (current_amount / target_amount) × 100
4. If deadline exists: projected completion = based on average deposit rate
5. Target auto-completes when current_amount >= target_amount

### Notifications

Auto-create notifications on:

- Deposit confirmed: "₦X,XXX has been added to your savings"
- Withdrawal status change: "Your withdrawal of ₦X,XXX has been [approved/rejected/completed]"
- Target milestone: "You've reached 50% of your [target name] goal!"
- Admin announcement: broadcast to all users

---

## AUTHENTICATION FLOW

Use Supabase Auth with email/password. Configure in Supabase dashboard:

- Enable email/password signup
- Set redirect URLs for password reset
- Optional: enable phone OTP (Supabase supports this natively)

Protected routes:

- `/dashboard/*` — requires authenticated user with role = 'user'
- `/admin/*` — requires authenticated user with role = 'admin'
- `/login`, `/register` — redirect to dashboard if already authenticated

Use Next.js middleware (`middleware.ts`) to handle route protection.

---

## LANDING PAGE SECTIONS

The landing page (`src/app/(marketing)/page.tsx`) should have these sections in order:

1. **Navbar** — sticky, transparent → solid on scroll, logo left, CTA right
2. **Hero** — headline: "Your Wealth Starts With Your Community", subheadline, dual CTAs, social proof
3. **Trust Bar** — animated stat counters (members, savings tracked, etc.)
4. **About** — mission, vision, core value ("People Over Profit")
5. **How It Works** — 3 steps with icons (Create Account → Set Target → Save & Withdraw)
6. **Services** — 6 feature cards (Target Savings, Consistent Savings, Withdrawals, Dashboard, Education, Community)
7. **Why Choose Us** — 5 differentiators with check icons
8. **Testimonials** — carousel of member quotes
9. **CTA Banner** — full-width pink gradient, conversion-focused
10. **FAQ** — accordion with 8 questions
11. **Footer** — 4-column grid, dark background

---

## WHAT TO SET UP NOW

1. Initialize the Next.js project with TypeScript and App Router
2. Install and configure shadcn/ui with the OOSSPAY theme colors
3. Install all dependencies (react-hook-form, zod, lucide-react, @supabase/supabase-js, @supabase/ssr)
4. Set up the folder structure as specified above
5. Create the Supabase client files (browser, server, admin, middleware)
6. Create the TypeScript type definitions matching the database schema
7. Create the database migration SQL file
8. Set up Tailwind config with OOSSPAY brand tokens
9. Create the root layout with proper meta tags, fonts, and global styles
10. Create placeholder pages for all routes with basic layouts
11. Set up the auth middleware for route protection
12. Create the `.env.local.example` file
13. Create a README.md with setup instructions

Do NOT build any UI yet — just set up the foundation so that frontend development can begin immediately on the next session.
