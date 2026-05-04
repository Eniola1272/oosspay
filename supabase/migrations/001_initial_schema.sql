-- OOSSPAY Initial Schema
-- Run this in the Supabase SQL Editor (or via supabase db push)

-- ─── PROFILES ────────────────────────────────────────────────────────────────
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

-- ─── TRANSACTIONS ─────────────────────────────────────────────────────────────
CREATE TABLE public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    description TEXT,
    reference TEXT,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    recorded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SAVINGS TARGETS ─────────────────────────────────────────────────────────
CREATE TABLE public.savings_targets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    target_amount DECIMAL(12,2) NOT NULL CHECK (target_amount > 0),
    current_amount DECIMAL(12,2) DEFAULT 0 CHECK (current_amount >= 0),
    deadline DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── WITHDRAWAL REQUESTS ──────────────────────────────────────────────────────
CREATE TABLE public.withdrawal_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    bank_name TEXT NOT NULL,
    bank_account_number TEXT NOT NULL,
    bank_account_name TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'processing', 'completed', 'rejected')),
    admin_note TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'deposit', 'withdrawal', 'announcement', 'target')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PLATFORM SETTINGS ────────────────────────────────────────────────────────
CREATE TABLE public.platform_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_savings_targets_user_id ON public.savings_targets(user_id);
CREATE INDEX idx_withdrawal_requests_user_id ON public.withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON public.withdrawal_requests(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- ─── ROW-LEVEL SECURITY ───────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can update all profiles"
    ON public.profiles FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Transactions
CREATE POLICY "Users view own transactions"
    ON public.transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert transactions"
    ON public.transactions FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can view all transactions"
    ON public.transactions FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Savings Targets
CREATE POLICY "Users manage own targets"
    ON public.savings_targets FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all targets"
    ON public.savings_targets FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can update all targets"
    ON public.savings_targets FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Withdrawal Requests
CREATE POLICY "Users view own withdrawals"
    ON public.withdrawal_requests FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own withdrawals"
    ON public.withdrawal_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage all withdrawals"
    ON public.withdrawal_requests FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Notifications
CREATE POLICY "Users manage own notifications"
    ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can mark notifications read"
    ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can create notifications"
    ON public.notifications FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Platform Settings
CREATE POLICY "Authenticated users can read settings"
    ON public.platform_settings FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage settings"
    ON public.platform_settings FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- ─── FUNCTIONS ────────────────────────────────────────────────────────────────

-- Auto-create profile on user signup
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

-- Calculate user balance from transactions (deposits minus withdrawals)
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

-- Auto-update savings_targets.updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_savings_targets_updated_at
    BEFORE UPDATE ON public.savings_targets
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── SEED: Default Platform Settings ─────────────────────────────────────────
INSERT INTO public.platform_settings (key, value) VALUES
(
    'deposit_account_details',
    '{"bank_name": "", "account_number": "", "account_name": "", "additional_info": "Please include your registered email as the payment reference."}'::jsonb
),
(
    'announcement',
    '{"title": "", "body": "", "created_at": ""}'::jsonb
);
