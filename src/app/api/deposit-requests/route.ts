import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { depositRequestSchema } from "@/lib/validations";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";

const ALLOWED_RECEIPT_ORIGINS = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");

function isSafeReceiptUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    // Only allow URLs from our own Supabase storage bucket
    return ALLOWED_RECEIPT_ORIGINS.length > 0 && url.startsWith(ALLOWED_RECEIPT_ORIGINS);
  } catch {
    return false;
  }
}

const uuidSchema = z.string().uuid();

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, "deposit-requests", 20, 60 * 60 * 1000); // 20 per hour per IP
  if (limited) return limited;

  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = depositRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid deposit request" }, { status: 400 });
  }

  const { amount, deposit_date, description } = parsed.data;

  // Validate receipt_url — must be a URL from our own Supabase storage
  const rawReceipt = typeof body.receipt_url === "string" ? body.receipt_url.trim() : "";
  const receiptUrl = rawReceipt.length > 0 && isSafeReceiptUrl(rawReceipt) ? rawReceipt : null;
  if (rawReceipt.length > 0 && !receiptUrl) {
    return NextResponse.json({ error: "Invalid receipt URL." }, { status: 400 });
  }

  // Validate savings_target_id ownership — must belong to this user
  const rawTargetId = typeof body.savings_target_id === "string" ? body.savings_target_id.trim() : "";
  let savingsTargetId: string | null = null;
  if (rawTargetId.length > 0) {
    if (!uuidSchema.safeParse(rawTargetId).success) {
      return NextResponse.json({ error: "Invalid savings target." }, { status: 400 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createAdminClient() as any;
    const { data: target } = await sb
      .from("savings_targets")
      .select("id")
      .eq("id", rawTargetId)
      .eq("user_id", user.id)
      .single();
    if (!target) {
      return NextResponse.json({ error: "Invalid savings target." }, { status: 400 });
    }
    savingsTargetId = rawTargetId;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;
  let result = await sb
    .from("transactions")
    .insert({
      user_id: user.id,
      type: "deposit",
      amount,
      description: description || "Savings Deposit",
      deposit_request_date: deposit_date,
      receipt_url: receiptUrl,
      savings_target_id: savingsTargetId,
      status: "pending",
    })
    .select("id, amount, status")
    .single();

  if (result.error && /deposit_request_date|receipt_url/.test(result.error.message)) {
    result = await sb
      .from("transactions")
      .insert({
        user_id: user.id,
        type: "deposit",
        amount,
        description: description || "Savings Deposit",
        savings_target_id: savingsTargetId,
        status: "pending",
      })
      .select("id, amount, status")
      .single();
  }

  if (result.error) {
    console.error("[deposit-requests] insert error:", result.error.message);
    return NextResponse.json({ error: "Could not submit deposit request." }, { status: 500 });
  }

  return NextResponse.json({ transaction: result.data }, { status: 201 });
}
