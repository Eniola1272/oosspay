-- ─── Migration 003: Fix infinite recursion in profiles RLS ────────────────────
-- The "Admins can view/update all profiles" policies query public.profiles
-- from within a policy on public.profiles itself, triggering infinite recursion.
-- Fix: use a SECURITY DEFINER function that bypasses RLS to check admin status.

-- ─── 1. Create a helper function to check admin status (bypasses RLS) ─────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ─── 2. Fix profiles policies (the source of the recursion) ──────────────────
DROP POLICY IF EXISTS "Admins can view all profiles"   ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT USING (
    public.is_admin()
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE USING (
    public.is_admin()
  );


-- ─── 3. Update all other admin policies to use the helper too ────────────────
-- (not strictly required for the recursion fix, but consistent & more efficient)

-- Transactions
DROP POLICY IF EXISTS "Admins can view all transactions"   ON public.transactions;
DROP POLICY IF EXISTS "Admins can insert transactions"     ON public.transactions;
DROP POLICY IF EXISTS "Admins can update all transactions" ON public.transactions;

CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert transactions"
  ON public.transactions FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update all transactions"
  ON public.transactions FOR UPDATE USING (public.is_admin());

-- Savings Targets
DROP POLICY IF EXISTS "Admins can view all targets"   ON public.savings_targets;
DROP POLICY IF EXISTS "Admins can update all targets" ON public.savings_targets;

CREATE POLICY "Admins can view all targets"
  ON public.savings_targets FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all targets"
  ON public.savings_targets FOR UPDATE USING (public.is_admin());

-- Withdrawal Requests
DROP POLICY IF EXISTS "Admins manage all withdrawals" ON public.withdrawal_requests;

CREATE POLICY "Admins manage all withdrawals"
  ON public.withdrawal_requests FOR ALL USING (public.is_admin());

-- Notifications
DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;

CREATE POLICY "Admins can create notifications"
  ON public.notifications FOR INSERT WITH CHECK (public.is_admin());

-- Platform Settings
DROP POLICY IF EXISTS "Admins can manage settings" ON public.platform_settings;

CREATE POLICY "Admins can manage settings"
  ON public.platform_settings FOR ALL USING (public.is_admin());
