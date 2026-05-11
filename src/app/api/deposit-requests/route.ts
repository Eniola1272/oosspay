import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { depositRequestSchema } from "@/lib/validations";

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = depositRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid deposit request" }, { status: 400 });
  }

  const { amount, deposit_date, description } = parsed.data;
  const receiptUrl = typeof body.receipt_url === "string" && body.receipt_url.length > 0
    ? body.receipt_url
    : null;

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
      status: "pending",
    })
    .select("*")
    .single();

  if (result.error && /deposit_request_date|receipt_url/.test(result.error.message)) {
    result = await sb
      .from("transactions")
      .insert({
        user_id: user.id,
        type: "deposit",
        amount,
        description: description || "Savings Deposit",
        status: "pending",
      })
      .select("*")
      .single();
  }

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  return NextResponse.json({ transaction: result.data }, { status: 201 });
}
