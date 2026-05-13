-- ─── 004_security_hardening.sql ───────────────────────────────────────────────
-- Fixes Supabase security advisories:
--   1. All SECURITY DEFINER functions must SET search_path = '' to prevent
--      a malicious schema from shadowing public.profiles or other objects.
--   2. Creates the newsletter_subscribers table with RLS enabled.
-- Run this in the Supabase SQL editor (or via supabase db push).
-- ──────────────────────────────────────────────────────────────────────────────

-- 1. Fix handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    NULLIF(NEW.raw_user_meta_data->>'phone', ''),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 2. Fix get_user_balance
CREATE OR REPLACE FUNCTION public.get_user_balance(p_user_id UUID)
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(CASE WHEN type = 'deposit' THEN amount ELSE -amount END)
     FROM public.transactions
     WHERE user_id = p_user_id AND status = 'completed'),
    0
  );
END;
$$;

-- 3. Fix is_admin (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin' AND pronamespace = 'public'::regnamespace) THEN
    EXECUTE $f$
      CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
      RETURNS BOOLEAN
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = ''
      AS $inner$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = p_user_id AND role IN ('admin', 'super_admin')
        );
      END;
      $inner$;
    $f$;
  END IF;
END;
$$;

-- 4. Fix set_updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 5. Fix update_savings_target_progress (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_savings_target_progress' AND pronamespace = 'public'::regnamespace) THEN
    EXECUTE $f$
      CREATE OR REPLACE FUNCTION public.update_savings_target_progress()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = ''
      AS $inner$
      BEGIN
        IF NEW.status = 'completed' AND NEW.savings_target_id IS NOT NULL THEN
          UPDATE public.savings_targets
          SET current_amount = current_amount + (
            CASE WHEN NEW.type = 'deposit' THEN NEW.amount ELSE -NEW.amount END
          )
          WHERE id = NEW.savings_target_id;
        END IF;
        RETURN NEW;
      END;
      $inner$;
    $f$;
  END IF;
END;
$$;

-- ─── Newsletter subscribers table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  source     TEXT
);

-- Enable RLS — no policies needed; service-role key bypasses RLS entirely.
-- This blocks any direct PostgREST access from anon or authenticated roles.
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
