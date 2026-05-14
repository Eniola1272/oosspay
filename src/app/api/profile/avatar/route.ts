import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png":  "png",
  "image/webp": "webp",
};
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const BUCKET = "avatars";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES[file.type]) {
    return NextResponse.json({ error: "Only JPEG, PNG, and WebP images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 2 MB." }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;

  // Ensure the bucket exists (no-op if it already does)
  await sb.storage.createBucket(BUCKET, { public: true }).catch(() => {});

  const ext = ALLOWED_TYPES[file.type];
  const path = `${user.id}/avatar.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await sb.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: true });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: { publicUrl } } = sb.storage.from(BUCKET).getPublicUrl(path);
  // Append timestamp so browsers don't serve a stale cached version after an update
  const avatarUrl = `${publicUrl}?t=${Date.now()}`;

  const { data: profile, error } = await sb
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ profile, avatar_url: avatarUrl });
}
