import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { depositAccountSchema, announcementSchema } from "@/lib/validations";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;
  const { data: profile } = await sb.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "super_admin"].includes(profile.role)) return null;
  return user;
}

/** GET — load current settings */
export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;
  const [accountRes, announcementsRes] = await Promise.all([
    sb.from("platform_settings").select("value").eq("key", "deposit_account_details").single(),
    sb.from("platform_settings").select("value").eq("key", "announcements").single(),
  ]);

  return NextResponse.json({
    account: accountRes.data?.value ?? null,
    announcements: announcementsRes.data?.value?.items ?? [],
  });
}

/** POST — save deposit account details */
export async function PUT(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { action } = body as { action?: string };

  if (action === "save_account") {
    const parsed = depositAccountSchema.safeParse(body.data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createAdminClient() as any;
    const { error } = await sb
      .from("platform_settings")
      .upsert({ key: "deposit_account_details", value: parsed.data }, { onConflict: "key" });
    if (error) {
      console.error("[settings] save_account error:", error.message);
      return NextResponse.json({ error: "Could not save account details." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "send_announcement") {
    const parsed = announcementSchema.safeParse(body.data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    const { title, body: message } = parsed.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createAdminClient() as any;

    // Fetch all member user IDs
    const { data: profiles } = await sb.from("profiles").select("id").eq("role", "user");
    const userIds: string[] = (profiles ?? []).map((p: { id: string }) => p.id);

    if (userIds.length > 0) {
      const notifications = userIds.map((uid) => ({
        user_id: uid,
        title,
        message,
        type: "announcement",
      }));
      await sb.from("notifications").insert(notifications);
    }

    // Update announcements history
    const { data: current } = await sb
      .from("platform_settings")
      .select("value")
      .eq("key", "announcements")
      .single();
    const existing = current?.value?.items ?? [];
    const updated = [{ title, body: message, created_at: new Date().toISOString() }, ...existing].slice(0, 20);
    await sb
      .from("platform_settings")
      .upsert({ key: "announcements", value: { items: updated } }, { onConflict: "key" });

    return NextResponse.json({ ok: true, count: userIds.length, announcements: updated });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
