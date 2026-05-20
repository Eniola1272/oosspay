import { NextRequest, NextResponse } from "next/server";
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

export async function PATCH(request: NextRequest) {
  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;
  const { data: caller } = await sb.from("profiles").select("role").eq("id", user.id).single();

  if (caller?.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const targetId = typeof body.target_id === "string" ? body.target_id.trim() : "";
  const action: string = body.action ?? "";

  if (!targetId) return NextResponse.json({ error: "Missing target_id" }, { status: 400 });
  if (targetId === user.id) return NextResponse.json({ error: "Cannot modify your own account" }, { status: 400 });

  const { data: target } = await sb.from("profiles").select("role").eq("id", targetId).single();
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (target.role === "super_admin") return NextResponse.json({ error: "Cannot modify a super admin" }, { status: 403 });

  if (action === "set_active") {
    const isActive = Boolean(body.is_active);
    const { error } = await sb.from("profiles").update({ is_active: isActive }).eq("id", targetId);
    if (error) {
      console.error("[admin/users] set_active:", error.message);
      return NextResponse.json({ error: "Could not update account status" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "set_role") {
    const pin = typeof body.pin === "string" ? body.pin.trim() : "";
    const expectedPin = process.env.SUPER_ADMIN_PIN;
    if (!expectedPin || pin !== expectedPin) {
      return NextResponse.json({ error: "Incorrect PIN" }, { status: 403 });
    }
    const newRole = body.role === "admin" ? "admin" : "user";
    const { error } = await sb.from("profiles").update({ role: newRole }).eq("id", targetId);
    if (error) {
      console.error("[admin/users] set_role:", error.message);
      return NextResponse.json({ error: "Could not update role" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
