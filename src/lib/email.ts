import { Resend } from "resend";
import { formatNaira } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

// Verify this domain in your Resend dashboard → resend.com/domains
const FROM = process.env.RESEND_FROM ?? "OOSSPAY <hello@oosspay.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://oosspay.com";

// ─── Shared layout ──────────────────────────────────────────────────────────

function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OOSSPAY</title>
</head>
<body style="margin:0;padding:0;background:#F5F6FA;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F6FA;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

        <!-- Header -->
        <tr>
          <td style="background:#1A1A2E;padding:24px 32px;">
            <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">OOSSPAY</span>
            <span style="color:#C2185B;font-size:22px;font-weight:800;">.</span>
          </td>
        </tr>

        <!-- Body -->
        <tr><td style="padding:32px;">${content}</td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F5F6FA;padding:20px 32px;text-align:center;border-top:1px solid #EBEBEB;">
            <p style="color:#999999;font-size:12px;margin:0 0 4px;">You're receiving this because you have an account at OOSSPAY.</p>
            <p style="color:#BBBBBB;font-size:11px;margin:0;">
              <a href="${APP_URL}" style="color:#C2185B;text-decoration:none;">Visit OOSSPAY</a>
              &nbsp;·&nbsp;
              <a href="${APP_URL}/dashboard" style="color:#C2185B;text-decoration:none;">Go to Dashboard</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(text: string, href: string) {
  return `<a href="${href}" style="display:inline-block;background:#C2185B;color:#ffffff;padding:13px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;margin-top:8px;">${text}</a>`;
}

function amountPill(amount: number, color = "#1A1A2E") {
  return `<span style="font-size:26px;font-weight:800;color:${color};letter-spacing:-0.5px;">${formatNaira(amount)}</span>`;
}

function infoRow(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #F0F0F0;color:#888888;font-size:13px;width:40%;">${label}</td>
    <td style="padding:8px 0;border-bottom:1px solid #F0F0F0;color:#1A1A2E;font-size:13px;font-weight:600;">${value}</td>
  </tr>`;
}

function infoTable(rows: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">${rows}</table>`;
}

// ─── Email senders ───────────────────────────────────────────────────────────

async function send(to: string, subject: string, html: string) {
  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html });
    if (error) console.error("[email] send error:", error);
  } catch (err) {
    console.error("[email] unexpected error:", err);
  }
}

// 1. Welcome
export async function sendWelcomeEmail(to: string, name: string) {
  const first = name.split(" ")[0];
  const html = layout(`
    <h2 style="color:#1A1A2E;font-size:22px;font-weight:800;margin:0 0 12px;">Welcome to OOSSPAY, ${first}! 🎉</h2>
    <p style="color:#555555;font-size:15px;line-height:1.7;margin:0 0 20px;">
      You've just joined Africa's people-first savings community. Your account is ready — set your first savings target,
      deposit your first naira, and start building the financial future you deserve.
    </p>
    <p style="color:#555555;font-size:15px;line-height:1.7;margin:0 0 24px;">
      Every big goal starts with a single step. We're here to help you every step of the way.
    </p>
    ${ctaButton("Set My First Savings Target →", `${APP_URL}/dashboard/savings`)}
    <div style="margin-top:28px;padding:16px;background:#FFF8FA;border-left:3px solid #C2185B;border-radius:0 8px 8px 0;">
      <p style="color:#666666;font-size:13px;margin:0;line-height:1.6;">
        <strong style="color:#1A1A2E;">Need help getting started?</strong><br/>
        Read our <a href="${APP_URL}/docs" style="color:#C2185B;text-decoration:none;">savings guide</a> or chat with us on WhatsApp anytime.
      </p>
    </div>
  `);
  await send(to, `Welcome to OOSSPAY, ${first}!`, html);
}

// 2. Deposit confirmed
export async function sendDepositConfirmedEmail(to: string, name: string, amount: number) {
  const first = name.split(" ")[0];
  const html = layout(`
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:#27AE60;width:56px;height:56px;border-radius:50%;line-height:56px;text-align:center;font-size:24px;margin-bottom:12px;">✓</div>
      <h2 style="color:#1A1A2E;font-size:22px;font-weight:800;margin:0 0 6px;">Deposit Confirmed!</h2>
      <p style="color:#666666;font-size:14px;margin:0;">Your transfer has been verified and credited.</p>
    </div>

    <div style="background:#F0FBF4;border:1px solid #C3E6CB;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
      <p style="color:#27AE60;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Amount Credited</p>
      ${amountPill(amount, "#27AE60")}
    </div>

    <p style="color:#555555;font-size:15px;line-height:1.7;margin:0 0 24px;">
      Hi ${first}, your deposit of <strong>${formatNaira(amount)}</strong> has been confirmed and added to your savings balance.
      Keep it up — consistent savers reach their goals 3× faster!
    </p>
    ${ctaButton("View My Balance →", `${APP_URL}/dashboard`)}
  `);
  await send(to, `Deposit Confirmed — ${formatNaira(amount)} added to your savings`, html);
}

// 3. Deposit rejected
export async function sendDepositRejectedEmail(to: string, name: string, amount: number, reason?: string) {
  const first = name.split(" ")[0];
  const reasonBlock = reason
    ? `<div style="margin-top:20px;padding:14px 16px;background:#FFF5F5;border-left:3px solid #E74C3C;border-radius:0 8px 8px 0;">
        <p style="color:#888888;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px;">Reason</p>
        <p style="color:#1A1A2E;font-size:14px;margin:0;">${reason}</p>
       </div>`
    : "";
  const html = layout(`
    <h2 style="color:#1A1A2E;font-size:22px;font-weight:800;margin:0 0 12px;">Deposit Request Declined</h2>
    <p style="color:#555555;font-size:15px;line-height:1.7;margin:0 0 4px;">
      Hi ${first}, unfortunately your deposit request of <strong>${formatNaira(amount)}</strong> could not be confirmed.
    </p>
    ${reasonBlock}
    <p style="color:#555555;font-size:15px;line-height:1.7;margin:20px 0 24px;">
      If you believe this is an error, please reach out to our support team with your transfer receipt and we'll look into it right away.
    </p>
    ${ctaButton("Submit a New Request →", `${APP_URL}/dashboard/deposit`)}
  `);
  await send(to, `Your deposit request of ${formatNaira(amount)} could not be confirmed`, html);
}

// 4. Withdrawal approved
export async function sendWithdrawalApprovedEmail(
  to: string,
  name: string,
  amount: number,
  isPenalized: boolean,
  penaltyAmount: number,
  penaltyRate: number,
  payoutAmount: number,
  bankName: string,
  accountNumber: string,
) {
  const first = name.split(" ")[0];
  const penaltyBlock = isPenalized
    ? infoTable(
        infoRow("Requested Amount", formatNaira(amount)) +
        infoRow(`Early Penalty (${(penaltyRate * 100).toFixed(1)}%)`, `−${formatNaira(penaltyAmount)}`) +
        infoRow("You Will Receive", formatNaira(payoutAmount)),
      )
    : "";
  const html = layout(`
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:#1A6EC8;width:56px;height:56px;border-radius:50%;line-height:56px;text-align:center;font-size:24px;color:#fff;margin-bottom:12px;">✓</div>
      <h2 style="color:#1A1A2E;font-size:22px;font-weight:800;margin:0 0 6px;">Withdrawal Approved</h2>
      <p style="color:#666666;font-size:14px;margin:0;">Your request is being processed.</p>
    </div>

    <p style="color:#555555;font-size:15px;line-height:1.7;margin:0 0 4px;">
      Hi ${first}, your withdrawal request of <strong>${formatNaira(amount)}</strong> has been approved and will be sent to your bank account shortly.
    </p>
    ${penaltyBlock}
    ${infoTable(
      infoRow("Bank", bankName) +
      infoRow("Account No.", `••••${accountNumber.slice(-4)}`),
    )}
    <p style="color:#888888;font-size:13px;line-height:1.6;margin:20px 0 24px;">
      Transfers are typically processed within 1–3 business hours. You will receive another email once the transfer is completed.
    </p>
    ${ctaButton("Track Withdrawal Status →", `${APP_URL}/dashboard/withdraw`)}
  `);
  await send(to, `Withdrawal Approved — ${formatNaira(isPenalized ? payoutAmount : amount)} will be sent to your account`, html);
}

// 5. Withdrawal rejected
export async function sendWithdrawalRejectedEmail(to: string, name: string, amount: number, reason?: string) {
  const first = name.split(" ")[0];
  const reasonBlock = reason
    ? `<div style="margin-top:20px;padding:14px 16px;background:#FFF5F5;border-left:3px solid #E74C3C;border-radius:0 8px 8px 0;">
        <p style="color:#888888;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px;">Reason</p>
        <p style="color:#1A1A2E;font-size:14px;margin:0;">${reason}</p>
       </div>`
    : "";
  const html = layout(`
    <h2 style="color:#1A1A2E;font-size:22px;font-weight:800;margin:0 0 12px;">Withdrawal Request Declined</h2>
    <p style="color:#555555;font-size:15px;line-height:1.7;margin:0 0 4px;">
      Hi ${first}, your withdrawal request of <strong>${formatNaira(amount)}</strong> has been declined.
    </p>
    ${reasonBlock}
    <p style="color:#555555;font-size:15px;line-height:1.7;margin:20px 0 24px;">
      If you have any questions, please contact our support team. Your balance remains unchanged.
    </p>
    ${ctaButton("Contact Support →", `${APP_URL}/dashboard`)}
  `);
  await send(to, `Your withdrawal request of ${formatNaira(amount)} was declined`, html);
}

// 6. Withdrawal completed (money sent)
export async function sendWithdrawalCompletedEmail(
  to: string,
  name: string,
  amount: number,
  payoutAmount: number,
  isPenalized: boolean,
  bankName: string,
  accountNumber: string,
) {
  const first = name.split(" ")[0];
  const sent = isPenalized ? payoutAmount : amount;
  const html = layout(`
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:#27AE60;width:56px;height:56px;border-radius:50%;line-height:56px;text-align:center;font-size:24px;margin-bottom:12px;">✓</div>
      <h2 style="color:#1A1A2E;font-size:22px;font-weight:800;margin:0 0 6px;">Withdrawal Completed!</h2>
      <p style="color:#666666;font-size:14px;margin:0;">Your money is on its way.</p>
    </div>

    <div style="background:#F0FBF4;border:1px solid #C3E6CB;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
      <p style="color:#27AE60;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Amount Sent</p>
      ${amountPill(sent, "#27AE60")}
    </div>

    <p style="color:#555555;font-size:15px;line-height:1.7;margin:0 0 4px;">
      Hi ${first}, <strong>${formatNaira(sent)}</strong> has been sent to your bank account.
    </p>
    ${infoTable(
      infoRow("Bank", bankName) +
      infoRow("Account No.", `••••${accountNumber.slice(-4)}`),
    )}
    <p style="color:#888888;font-size:13px;line-height:1.6;margin:20px 0 24px;">
      Funds typically arrive within a few minutes. If you don't receive the transfer within 24 hours, please contact support.
    </p>
    ${ctaButton("Back to Savings →", `${APP_URL}/dashboard`)}
  `);
  await send(to, `Withdrawal Completed — ${formatNaira(sent)} sent to your account`, html);
}
