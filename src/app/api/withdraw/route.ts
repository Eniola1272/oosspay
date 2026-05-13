import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { withdrawalSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rateLimit";
import { getCycleInfo, calculatePayout } from "@/lib/savingsCycle";

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, "withdraw", 10, 60 * 60 * 1000);
  if (limited) return limited;

  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = withdrawalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const { amount, bank_name, bank_account_number, bank_account_name, reason } = parsed.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;

  // Server-side balance check: confirmed balance minus any in-flight withdrawals
  const [balanceRes, inflightRes, firstDepositRes] = await Promise.all([
    sb.rpc("get_user_balance", { p_user_id: user.id }),
    sb
      .from("withdrawal_requests")
      .select("amount")
      .eq("user_id", user.id)
      .in("status", ["pending", "approved", "processing"]),
    sb
      .from("transactions")
      .select("created_at")
      .eq("user_id", user.id)
      .eq("type", "deposit")
      .eq("status", "completed")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  if (balanceRes.error) {
    console.error("[withdraw] balance error:", balanceRes.error.message);
    return NextResponse.json({ error: "Could not verify balance." }, { status: 500 });
  }

  const confirmedBalance = Number(balanceRes.data ?? 0);
  const inflightTotal = ((inflightRes.data ?? []) as { amount: number }[])
    .reduce((sum, r) => sum + Number(r.amount), 0);
  const available = confirmedBalance - inflightTotal;

  if (amount > available) {
    return NextResponse.json(
      { error: `Withdrawal amount exceeds your available balance of ₦${available.toLocaleString("en-NG", { minimumFractionDigits: 2 })}.` },
      { status: 400 }
    );
  }

  // Determine penalty based on savings cycle
  let isPenalized = false;
  let penaltyRate = 0;
  let penaltyAmount = 0;
  let payoutAmount = amount;

  if (firstDepositRes.data) {
    const cycleInfo = getCycleInfo(new Date(firstDepositRes.data.created_at));
    isPenalized = !cycleInfo.isInFreeWindow;
    if (isPenalized) {
      penaltyRate = cycleInfo.penaltyRate;
      const payout = calculatePayout(amount, true);
      penaltyAmount = payout.penaltyAmount;
      payoutAmount = payout.payoutAmount;
    }
  }

  const { data, error } = await sb
    .from("withdrawal_requests")
    .insert({
      user_id: user.id,
      amount,
      bank_name,
      bank_account_number,
      bank_account_name,
      reason: reason || null,
      is_penalized: isPenalized,
      penalty_rate: penaltyRate,
      penalty_amount: penaltyAmount,
      payout_amount: isPenalized ? payoutAmount : null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[withdraw] insert error:", error.message);
    return NextResponse.json({ error: "Could not submit withdrawal request." }, { status: 500 });
  }

  return NextResponse.json({
    id: data.id,
    is_penalized: isPenalized,
    penalty_amount: penaltyAmount,
    payout_amount: isPenalized ? payoutAmount : amount,
  }, { status: 201 });
}
