import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getCycleInfo, PENALTY_RATE, FREE_WINDOW_DAYS, CYCLE_MONTHS } from "@/lib/savingsCycle";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;

  // Find the user's first completed deposit
  const { data: firstTx } = await sb
    .from("transactions")
    .select("created_at")
    .eq("user_id", user.id)
    .eq("type", "deposit")
    .eq("status", "completed")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!firstTx) {
    return NextResponse.json({
      hasStarted: false,
      penaltyRate: PENALTY_RATE,
      freeWindowDays: FREE_WINDOW_DAYS,
      cycleMonths: CYCLE_MONTHS,
    });
  }

  const info = getCycleInfo(new Date(firstTx.created_at));

  return NextResponse.json({
    hasStarted: true,
    cycleNumber: info.cycleNumber,
    cycleStart: info.cycleStart.toISOString(),
    cycleEnd: info.cycleEnd.toISOString(),
    freeWindowStart: info.freeWindowStart.toISOString(),
    isInFreeWindow: info.isInFreeWindow,
    daysUntilFreeWindow: info.daysUntilFreeWindow,
    daysLeftInCycle: info.daysLeftInCycle,
    penaltyRate: PENALTY_RATE,
    freeWindowDays: FREE_WINDOW_DAYS,
    cycleMonths: CYCLE_MONTHS,
  });
}
