import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  // Auth: verify caller is admin or super_admin
  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: caller } = await (userClient as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() as { data: { role: string } | null };

  if (!caller || (caller.role !== "admin" && caller.role !== "super_admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;

  // Fetch all profiles and all completed transactions in parallel
  const [profilesRes, txRes] = await Promise.all([
    sb.from("profiles").select("*").order("created_at", { ascending: false }),
    sb.from("transactions").select("user_id, type, amount").eq("status", "completed"),
  ]);

  const profiles: { id: string;[k: string]: unknown }[] = profilesRes.data ?? [];
  const transactions: { user_id: string; type: string; amount: number }[] = txRes.data ?? [];

  // Compute per-user balance in JS to avoid N+1 queries
  const balanceMap = new Map<string, number>();
  for (const tx of transactions) {
    const prev = balanceMap.get(tx.user_id) ?? 0;
    balanceMap.set(tx.user_id, prev + (tx.type === "deposit" ? Number(tx.amount) : -Number(tx.amount)));
  }

  const users = profiles.map((p) => ({ ...p, balance: balanceMap.get(p.id) ?? 0 }));

  return NextResponse.json({ users });
}
