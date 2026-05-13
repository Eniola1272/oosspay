-- ─── 005_savings_cycles.sql ───────────────────────────────────────────────────
-- Adds penalty columns to withdrawal_requests to support the 3-month savings
-- lock cycle with early withdrawal penalties.
-- ──────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.withdrawal_requests
  ADD COLUMN IF NOT EXISTS is_penalized    BOOLEAN        NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS penalty_rate    DECIMAL(5,4)   NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS penalty_amount  DECIMAL(12,2)  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payout_amount   DECIMAL(12,2);
  -- payout_amount NULL means full amount is paid out (no penalty).
  -- When penalized: payout_amount = amount - penalty_amount.

COMMENT ON COLUMN public.withdrawal_requests.is_penalized   IS 'True if this withdrawal was submitted outside the free withdrawal window';
COMMENT ON COLUMN public.withdrawal_requests.penalty_rate   IS 'Penalty rate applied at submission time (e.g. 0.035 = 3.5%)';
COMMENT ON COLUMN public.withdrawal_requests.penalty_amount IS 'Naira amount deducted as penalty';
COMMENT ON COLUMN public.withdrawal_requests.payout_amount  IS 'Actual amount to transfer to member bank account after deducting penalty';
