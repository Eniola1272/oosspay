import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "OOSSPAY <hello@oosspay.com>";
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

export async function POST(req: NextRequest) {
  const { email } = await req.json() as { email?: string };

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createAdminClient() as any;

  // Upsert so duplicate submissions are silently accepted
  const { error: dbError } = await sb
    .from("newsletter_subscribers")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });

  if (dbError) {
    console.error("[newsletter] db error:", dbError.message);
    return NextResponse.json({ error: "Could not save subscription." }, { status: 500 });
  }

  // Add to Resend Audience (if configured)
  if (AUDIENCE_ID) {
    await resend.contacts.create({
      email,
      audienceId: AUDIENCE_ID,
      unsubscribed: false,
    }).catch((e) => console.error("[newsletter] audience error:", e));
  }

  // Send welcome email
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "You're in — welcome to OOSSPAY updates",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1A1A2E">
        <div style="background:#C2185B;display:inline-block;padding:8px 20px;border-radius:100px;margin-bottom:24px">
          <span style="color:white;font-size:13px;font-weight:700;letter-spacing:0.05em">OOSSPAY</span>
        </div>
        <h1 style="font-size:26px;font-weight:800;margin:0 0 12px">You're on the list.</h1>
        <p style="font-size:15px;color:#555;line-height:1.6;margin:0 0 24px">
          Thanks for subscribing! You'll hear from us when we have saving tips, member stories, or product updates worth sharing.
          No spam &mdash; ever.
        </p>
        <p style="font-size:15px;color:#555;line-height:1.6;margin:0 0 32px">
          In the meantime, <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://oosspay.com"}/register" style="color:#C2185B;font-weight:600;text-decoration:none">create your free savings account</a> if you haven't already.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:0 0 24px" />
        <p style="font-size:12px;color:#999;margin:0">
          You received this because you subscribed at oosspay.com.
          <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://oosspay.com"}/unsubscribe?email=${encodeURIComponent(email)}" style="color:#999">Unsubscribe</a>
        </p>
      </div>
    `,
  }).catch((e) => console.error("[newsletter] email error:", e));

  return NextResponse.json({ ok: true });
}
