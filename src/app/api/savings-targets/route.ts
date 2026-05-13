import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { savingsTargetSchema } from "@/lib/validations";

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

function normalizeTarget(target: Record<string, unknown>) {
  return {
    ...target,
    status: target.status ?? "active",
    current_amount: Number(target.current_amount ?? 0),
    target_amount: Number(target.target_amount ?? 0),
  };
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;
  const { data, error } = await sb
    .from("savings_targets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ targets: (data ?? []).map(normalizeTarget) });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = savingsTargetSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid target" }, { status: 400 });
  }

  const { name, target_amount, deadline } = parsed.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;
  const { data, error } = await sb
    .from("savings_targets")
    .insert({
      user_id: user.id,
      name,
      target_amount,
      current_amount: 0,
      deadline: deadline || null,
      status: "active",
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ target: normalizeTarget(data) }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const id = typeof body.id === "string" ? body.id : "";
  const parsed = savingsTargetSchema.safeParse(body);
  if (!id || !parsed.success) {
    return NextResponse.json({ error: parsed.success ? "Missing target id" : parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { name, target_amount, deadline } = parsed.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;
  const { data, error } = await sb
    .from("savings_targets")
    .update({ name, target_amount, deadline: deadline || null })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ target: normalizeTarget(data) });
}

export async function DELETE(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing target id" }, { status: 400 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;
  const { error } = await sb
    .from("savings_targets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
