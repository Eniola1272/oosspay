import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { formatNaira } from "@/lib/utils";
import {
  sendWithdrawalApprovedEmail,
  sendWithdrawalRejectedEmail,
  sendWithdrawalCompletedEmail,
} from "@/lib/email";
import type { WithdrawalStatus } from "@/types";

const VALID_STATUSES: WithdrawalStatus[] = ["approved", "rejected", "completed"];

async function getAdminUser() {
  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return { user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;
  const { data: profile } = await sb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    return { user: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { user, error: null };
}

export async function GET() {
  const { error } = await getAdminUser();
  if (error) return error;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;
  const { data, error: fetchError } = await sb
    .from("withdrawal_requests")
    .select("*, profiles!withdrawal_requests_user_id_fkey(full_name, email)")
    .order("created_at", { ascending: false });

  if (fetchError) {
    console.error("[admin/withdrawals] fetch:", fetchError.message);
    return NextResponse.json({ error: "Could not load withdrawals." }, { status: 500 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (data ?? []).map((r: any) => ({ ...r, profile: r.profiles ?? null }));
  return NextResponse.json({ withdrawals: rows });
}

export async function PATCH(request: NextRequest) {
  const { user, error } = await getAdminUser();
  if (error) return error;

  const body = await request.json();
  const id = typeof body.id === "string" ? body.id.trim() : "";
  const newStatus: WithdrawalStatus = body.status;
  const adminNote = typeof body.admin_note === "string" ? body.admin_note.slice(0, 500) : "";

  if (!id || !VALID_STATUSES.includes(newStatus)) {
    return NextResponse.json({ error: "Invalid withdrawal action" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;

  const { data: wr, error: updateError } = await sb
    .from("withdrawal_requests")
    .update({
      status: newStatus,
      admin_note: adminNote || null,
      reviewed_by: user?.id ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (updateError) {
    console.error("[admin/withdrawals] update:", updateError.message);
    return NextResponse.json({ error: "Could not update withdrawal." }, { status: 500 });
  }

  // Fetch member profile for notifications and email
  const { data: memberProfile } = await sb
    .from("profiles")
    .select("full_name, email")
    .eq("id", wr.user_id)
    .maybeSingle();

  const payout = wr.is_penalized ? Number(wr.payout_amount) : Number(wr.amount);

  // Build notification message
  const notifTitle =
    newStatus === "approved"  ? "Withdrawal Approved" :
    newStatus === "rejected"  ? "Withdrawal Rejected" :
    newStatus === "completed" ? "Withdrawal Completed" : "Withdrawal Updated";

  const notifMessage =
    newStatus === "completed"
      ? `Your withdrawal has been completed. ${
          wr.is_penalized
            ? `${formatNaira(payout)} has been sent to your bank account (${(Number(wr.penalty_rate) * 100).toFixed(1)}% early withdrawal penalty of ${formatNaira(Number(wr.penalty_amount))} was deducted).`
            : `${formatNaira(payout)} has been sent to your bank account.`
        }`
      : newStatus === "approved"
      ? `Your withdrawal request of ${formatNaira(Number(wr.amount))} has been approved and will be processed soon.${
          wr.is_penalized
            ? ` Note: a ${(Number(wr.penalty_rate) * 100).toFixed(1)}% early withdrawal penalty applies; you will receive ${formatNaira(payout)}.`
            : ""
        }`
      : newStatus === "rejected"
      ? `Your withdrawal request of ${formatNaira(Number(wr.amount))} was declined.${adminNote ? ` Reason: ${adminNote}` : ""}`
      : "Your withdrawal status has been updated.";

  await sb.from("notifications").insert({
    user_id: wr.user_id,
    title: notifTitle,
    message: notifMessage,
    type: "withdrawal",
  });

  // Fire-and-forget email
  if (memberProfile?.email && memberProfile?.full_name) {
    const { email, full_name } = memberProfile;
    if (newStatus === "approved") {
      sendWithdrawalApprovedEmail(
        email, full_name,
        Number(wr.amount),
        wr.is_penalized,
        Number(wr.penalty_amount),
        Number(wr.penalty_rate),
        payout,
        wr.bank_name,
        wr.bank_account_number,
      );
    } else if (newStatus === "rejected") {
      sendWithdrawalRejectedEmail(email, full_name, Number(wr.amount), adminNote || undefined);
    } else if (newStatus === "completed") {
      sendWithdrawalCompletedEmail(
        email, full_name,
        Number(wr.amount),
        payout,
        wr.is_penalized,
        wr.bank_name,
        wr.bank_account_number,
      );
    }
  }

  return NextResponse.json({ withdrawal: wr });
}
