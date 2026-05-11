-- ─── Migration 002: Fixes & Super Admin Support ──────────────────────────────
-- Run this in the Supabase SQL Editor after 001_initial_schema.sql

-- ─── 1. Add super_admin to role CHECK constraint ──────────────────────────────
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('user', 'admin', 'super_admin'));


-- ─── 2. Add missing columns to transactions ───────────────────────────────────
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS receipt_url        TEXT,
  ADD COLUMN IF NOT EXISTS deposit_request_date DATE,
  ADD COLUMN IF NOT EXISTS admin_note         TEXT;


-- ─── 3. Fix handle_new_user: use NULL instead of '' for missing phone ─────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    NULLIF(COALESCE(NEW.raw_user_meta_data->>'phone', ''), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ─── 4. RLS: update all admin policies to include super_admin ─────────────────

-- Profiles
DROP POLICY IF EXISTS "Admins can view all profiles"   ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Transactions: add UPDATE + fix existing INSERT + add user INSERT
DROP POLICY IF EXISTS "Admins can insert transactions"     ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all transactions"   ON public.transactions;

CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can insert transactions"
  ON public.transactions FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update all transactions"
  ON public.transactions FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Users can submit their own pending deposit requests
CREATE POLICY "Users can submit deposit requests"
  ON public.transactions FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND type = 'deposit'
    AND status = 'pending'
  );

-- Savings Targets
DROP POLICY IF EXISTS "Admins can view all targets"   ON public.savings_targets;
DROP POLICY IF EXISTS "Admins can update all targets" ON public.savings_targets;

CREATE POLICY "Admins can view all targets"
  ON public.savings_targets FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update all targets"
  ON public.savings_targets FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Withdrawal Requests
DROP POLICY IF EXISTS "Admins manage all withdrawals" ON public.withdrawal_requests;

CREATE POLICY "Admins manage all withdrawals"
  ON public.withdrawal_requests FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Notifications
DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;

CREATE POLICY "Admins can create notifications"
  ON public.notifications FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Platform Settings
DROP POLICY IF EXISTS "Admins can manage settings" ON public.platform_settings;

CREATE POLICY "Admins can manage settings"
  ON public.platform_settings FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );


-- ─── 5. Add missing indexes (activity log queries) ───────────────────────────
CREATE INDEX IF NOT EXISTS idx_transactions_recorded_by       ON public.transactions(recorded_by);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_reviewed_by ON public.withdrawal_requests(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_transactions_type_status       ON public.transactions(type, status);


-- ─── 6. Fix platform_settings: consolidate to 'deposit_account_details' key ──
-- Rename any existing 'deposit_account' row to match what the app reads
UPDATE public.platform_settings
  SET key = 'deposit_account_details'
  WHERE key = 'deposit_account'
  AND NOT EXISTS (
    SELECT 1 FROM public.platform_settings WHERE key = 'deposit_account_details'
  );

-- Ensure the seed row exists
INSERT INTO public.platform_settings (key, value)
VALUES (
  'deposit_account_details',
  '{"bank_name": "", "account_number": "", "account_name": "", "additional_info": ""}'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- Ensure the announcements list key exists (different from the old singular 'announcement')
INSERT INTO public.platform_settings (key, value)
VALUES ('announcements', '{"items": []}'::jsonb)
ON CONFLICT (key) DO NOTHING;
