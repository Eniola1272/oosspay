import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { formatNaira } from "@/lib/utils";
import { sendDepositConfirmedEmail, sendDepositRejectedEmail } from "@/lib/email";

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

  if (error) { console.error("[admin/deposits] role check:", error.message); return { user: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }; }
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

  if (fetchError) { console.error("[admin/deposits] fetch:", fetchError.message); return NextResponse.json({ error: "Could not load deposits." }, { status: 500 }); }

  return NextResponse.json({ deposits: (data ?? []).map(normalizeDeposit) });
}

export async function PATCH(request: NextRequest) {
  const { user, error } = await getAdminUser();
  if (error) return error;

  const body = await request.json();
  const id = typeof body.id === "string" ? body.id.trim() : "";
  const action = body.action === "approve" || body.action === "reject" ? body.action : "";
  const adminNote = typeof body.admin_note === "string" ? body.admin_note.slice(0, 500) : "";

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

  if (updateError) { console.error("[admin/deposits] update:", updateError.message); return NextResponse.json({ error: "Could not update deposit." }, { status: 500 }); }

  const confirmed = action === "approve";

  // Fetch member profile for email
  const { data: memberProfile } = await sb
    .from("profiles")
    .select("full_name, email")
    .eq("id", tx.user_id)
    .maybeSingle();

  await sb.from("notifications").insert({
    user_id: tx.user_id,
    title: confirmed ? "Deposit Confirmed!" : "Deposit Request Declined",
    message: confirmed
      ? `Your deposit of ${formatNaira(Number(tx.amount))} has been confirmed and added to your savings balance.`
      : `Your deposit request of ${formatNaira(Number(tx.amount))} could not be confirmed.${adminNote ? ` Reason: ${adminNote}` : " Please contact support for more information."}`,
    type: "deposit",
  });

  // Fire-and-forget email
  if (memberProfile?.email && memberProfile?.full_name) {
    if (confirmed) {
      sendDepositConfirmedEmail(memberProfile.email, memberProfile.full_name, Number(tx.amount));
    } else {
      sendDepositRejectedEmail(memberProfile.email, memberProfile.full_name, Number(tx.amount), adminNote || undefined);
    }
  }

  return NextResponse.json({ transaction: tx });
}
