import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validations";

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;
  const { data: existing, error: fetchError } = await sb
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const metadata = user.user_metadata ?? {};
  const fullName = typeof metadata.full_name === "string" ? metadata.full_name : "";
  const phone = typeof metadata.phone === "string" && metadata.phone.length > 0 ? metadata.phone : null;

  if (fetchError) { console.error("[profile] fetch:", fetchError.message); return NextResponse.json({ error: "Could not load profile." }, { status: 500 }); }
  if (existing) {
    const patch: Record<string, unknown> = {};
    if (!existing.email && user.email) patch.email = user.email;
    if (!existing.full_name && fullName) patch.full_name = fullName;
    if (!existing.role) patch.role = "user";

    if (Object.keys(patch).length === 0) return NextResponse.json({ profile: existing });

    const { data: repaired, error } = await sb
      .from("profiles")
      .update(patch)
      .eq("id", user.id)
      .select("*")
      .single();

    if (error) { console.error("[profile] write:", error.message); return NextResponse.json({ error: "Could not update profile." }, { status: 500 }); }
    return NextResponse.json({ profile: repaired });
  }

  const { data: profile, error } = await sb
    .from("profiles")
    .insert({
      id: user.id,
      full_name: fullName,
      email: user.email ?? "",
      phone,
      role: "user",
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ profile });
}

export async function PATCH(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid profile" }, { status: 400 });
  }

  const data = parsed.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;
  const { data: profile, error } = await sb
    .from("profiles")
    .update({
      full_name: data.full_name,
      phone: data.phone || null,
      bank_name: data.bank_name || null,
      bank_account_number: data.bank_account_number || null,
      bank_account_name: data.bank_account_name || null,
    })
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ profile });
}
