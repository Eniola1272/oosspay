import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { formatNaira } from "@/lib/utils";

async function getAdminUser() {
  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return { user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;
  const { data: profile, error } = await sb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return { user: null, error: NextResponse.json({ error: error.message }, { status: 400 }) };
  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    return { user: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { user, error: null };
}

function normalizeDeposit(row: Record<string, unknown>) {
  return {
    ...row,
    profile: row.profiles ?? null,
    amount: Number(row.amount ?? 0),
  };
}

export async function GET() {
  const { error } = await getAdminUser();
  if (error) return error;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;
  const { data, error: fetchError } = await sb
    .from("transactions")
    .select("*, profiles!transactions_user_id_fkey(full_name, email)")
    .eq("type", "deposit")
    .order("created_at", { ascending: false });

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 400 });

  return NextResponse.json({ deposits: (data ?? []).map(normalizeDeposit) });
}

export async function PATCH(request: NextRequest) {
  const { user, error } = await getAdminUser();
  if (error) return error;

  const body = await request.json();
  const id = typeof body.id === "string" ? body.id : "";
  const action = body.action === "approve" || body.action === "reject" ? body.action : "";
  const adminNote = typeof body.admin_note === "string" ? body.admin_note : "";

  if (!id || !action) {
    return NextResponse.json({ error: "Invalid deposit action" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;
  const { data: tx, error: updateError } = await sb
    .from("transactions")
    .update({
      status: action === "approve" ? "completed" : "failed",
      admin_note: action === "reject" ? adminNote || null : null,
      recorded_by: user?.id ?? null,
    })
    .eq("id", id)
    .eq("type", "deposit")
    .select("*")
    .single();

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });

  const confirmed = action === "approve";
  await sb.from("notifications").insert({
    user_id: tx.user_id,
    title: confirmed ? "Deposit Confirmed!" : "Deposit Request Declined",
    message: confirmed
      ? `Your deposit of ${formatNaira(Number(tx.amount))} has been confirmed and added to your savings balance.`
      : `Your deposit request of ${formatNaira(Number(tx.amount))} could not be confirmed.${adminNote ? ` Reason: ${adminNote}` : " Please contact support for more information."}`,
    type: "deposit",
  });

  return NextResponse.json({ transaction: tx });
}
