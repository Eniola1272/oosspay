import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  // Auth: verify caller is admin or super_admin
  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (userClient as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() as { data: { role: string } | null };

  if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const [usersRes, pendingRes, todayRes, allTxRes, recentTxRes, recentWRes] = await Promise.all([
    sb.from("profiles").select("id", { count: "exact", head: true }),
    sb.from("withdrawal_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    sb.from("transactions").select("amount").eq("type", "deposit").gte("created_at", todayISO).eq("status", "completed"),
    sb.from("transactions").select("type, amount").eq("status", "completed"),
    sb.from("transactions")
      .select("id, amount, type, created_at, user_id, profiles!transactions_user_id_fkey(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
    sb.from("withdrawal_requests")
      .select("id, amount, created_at, user_id, profiles!withdrawal_requests_user_id_fkey(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalUsers = usersRes.count ?? 0;
  const pendingWithdrawals = pendingRes.count ?? 0;
  const todayDeposits = (todayRes.data ?? []).reduce(
    (sum: number, t: { amount: number }) => sum + Number(t.amount), 0
  );
  const totalSavings = (allTxRes.data ?? []).reduce(
    (sum: number, t: { type: string; amount: number }) =>
      sum + (t.type === "deposit" ? Number(t.amount) : -Number(t.amount)),
    0
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txActivity = (recentTxRes.data ?? []).map((t: any) => ({
    id: `tx-${t.id}`,
    type: t.type === "deposit" ? "deposit" : "withdrawal_request",
    description: `${t.type === "deposit" ? "Deposit" : "Withdrawal"} — ${t.profiles?.full_name ?? "Unknown member"}`,
    amount: Number(t.amount),
    created_at: t.created_at,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wActivity = (recentWRes.data ?? []).map((w: any) => ({
    id: `wr-${w.id}`,
    type: "withdrawal_request",
    description: `Withdrawal request — ${w.profiles?.full_name ?? "Unknown member"}`,
    amount: Number(w.amount),
    created_at: w.created_at,
  }));

  const activity = [...txActivity, ...wActivity]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  return NextResponse.json({
    stats: { totalUsers, totalSavings, pendingWithdrawals, todayDeposits },
    activity,
  });
}
