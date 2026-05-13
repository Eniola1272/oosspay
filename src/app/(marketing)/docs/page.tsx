import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/landing/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { DocsSidebar } from "./DocsSidebar";
import { AdminDocsSection } from "./AdminDocsSection";
import { Section, SubSection, Note, Warning, Tip, FieldTable, ToastTable, StatusBadge } from "./docComponents";

export const metadata: Metadata = { title: "Documentation — OOSSPAY" };

export default function DocsPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />

        {/* Hero */}
        <div className="bg-[#1A1A2E] text-white pt-50 pb-14 px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-[#C2185B] font-semibold text-sm mb-2 tracking-wide uppercase">Documentation</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold mb-3">OOSSPAY User Guide</h1>
            <p className="text-white/60 max-w-xl text-sm">
              Everything you need to know — from creating your account to managing savings targets
              and processing withdrawals. Step-by-step instructions for every feature.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-5xl mx-auto w-full px-4 py-10 flex-1 flex gap-10 items-start">

          {/* Sidebar */}
          <aside className="hidden lg:block w-52 shrink-0 sticky top-24">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#999999] mb-3">Contents</p>
            <DocsSidebar />
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-14">

            {/* ── GETTING STARTED ── */}
            <Section id="getting-started" title="Getting Started" subtitle="How to access and set up your OOSSPAY account.">

              <SubSection id="register" title="Create an Account">
                <p className="text-sm text-[#444]">Visit <strong>/register</strong> to sign up. All fields below are required unless marked optional.</p>
                <FieldTable rows={[
                  { label: "Full Name",        type: "Text",     required: true,  notes: "Minimum 2 characters" },
                  { label: "Email Address",    type: "Email",    required: true,  notes: "Must be a valid email format" },
                  { label: "Phone Number",     type: "Text",     required: false, notes: "Nigerian format: 0701234567 or +2347012345678" },
                  { label: "Password",         type: "Password", required: true,  notes: "Minimum 8 characters" },
                  { label: "Confirm Password", type: "Password", required: true,  notes: "Must match Password exactly" },
                ]} />
                <p className="text-sm text-[#444]">After submitting, a verification email is sent. Check your inbox (and spam folder) and click the link to activate your account.</p>
                <Note>Your email address cannot be changed after registration. Contact support if you need to update it.</Note>
              </SubSection>

              <SubSection id="login" title="Logging In">
                <p className="text-sm text-[#444]">Visit <strong>/login</strong> and enter your registered email and password. On success you are taken directly to your role&apos;s dashboard:</p>
                <div className="overflow-x-auto rounded-lg border border-[#E0E0E0]">
                  <table className="w-full text-sm">
                    <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                      <tr>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666666]">Role</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666666]">Redirected to</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0E0E0]">
                      <tr><td className="px-4 py-2.5">Member</td><td className="px-4 py-2.5 font-mono text-xs">/dashboard</td></tr>
                      <tr><td className="px-4 py-2.5">Admin</td><td className="px-4 py-2.5 font-mono text-xs">/dashboard/admin</td></tr>
                      <tr><td className="px-4 py-2.5">Super Admin</td><td className="px-4 py-2.5 font-mono text-xs">/dashboard/super-admin</td></tr>
                    </tbody>
                  </table>
                </div>
                <Warning>Sessions expire after <strong>30 minutes of inactivity</strong>. You will see a &quot;Still there?&quot; warning dialog at 25 minutes. Click <strong>Stay signed in</strong> to continue, or your session will end automatically.</Warning>
              </SubSection>

              <SubSection id="forgot-password" title="Forgot Password">
                <p className="text-sm text-[#444]">Visit <strong>/forgot-password</strong>, enter your registered email address, and click <strong>Send Reset Link</strong>. Check your inbox for the reset email and follow the link to set a new password.</p>
                <Tip>The reset link expires. If it does not arrive within a few minutes, check your spam folder before requesting again.</Tip>
              </SubSection>
            </Section>

            {/* ── MEMBER DASHBOARD ── */}
            <Section id="member-dashboard" title="Member Dashboard" subtitle="Your personal savings hub. Everything accessible from the left sidebar.">
              <p className="text-sm text-[#444]">The dashboard home (<strong>/dashboard</strong>) shows your live balance, recent activity, a savings summary, and pending notifications at a glance.</p>

              <SubSection id="deposit" title="Making a Deposit">
                <p className="text-sm text-[#444]">
                  Page: <strong>/dashboard/deposit</strong>. Deposits are a two-step process — transfer money to OOSSPAY&apos;s bank account first, then submit a request so the team can verify and confirm it.
                </p>

                <div className="bg-[#FAFAFA] rounded-xl border border-[#E0E0E0] p-4 space-y-2 text-sm">
                  <p className="font-semibold text-[#1A1A2E]">Step 1 — Transfer to the OOSSPAY account</p>
                  <p className="text-[#666666]">The deposit page shows the platform&apos;s bank name, account number, and account name. Use the <strong>Copy</strong> button next to the account number to avoid errors. Complete the bank transfer before proceeding.</p>
                </div>

                <div className="bg-[#FAFAFA] rounded-xl border border-[#E0E0E0] p-4 space-y-2 text-sm">
                  <p className="font-semibold text-[#1A1A2E]">Step 2 — Submit your deposit request</p>
                  <FieldTable rows={[
                    { label: "Amount Transferred (₦)", type: "Number", required: true,  notes: "Minimum ₦100. Must match the exact amount you sent." },
                    { label: "Date of Transfer",        type: "Date",   required: true,  notes: "The date the transfer was made." },
                    { label: "Reference / Description", type: "Text",   required: false, notes: 'e.g. "April savings, Week 2 deposit"' },
                    { label: "Receipt Image",           type: "File",   required: false, notes: "JPG, PNG, or HEIC. Max 5 MB. Strongly recommended." },
                  ]} />
                </div>

                <ToastTable rows={[
                  { scenario: "Request submitted successfully",  message: "Deposit request submitted", type: "success" },
                  { scenario: "Receipt file exceeds 5 MB",       message: "Receipt image must be under 5MB", type: "error" },
                  { scenario: "Receipt upload fails (request still goes through)", message: "Receipt upload failed, so the request will be submitted without it.", type: "warning" },
                  { scenario: "Submission error",                message: "Could not submit deposit request", type: "error" },
                ]} />

                <p className="text-sm text-[#444]">After submission the page shows: <em>&quot;Your deposit request is being reviewed. You&apos;ll be notified once it&apos;s confirmed — typically within 1–2 hours during business hours.&quot;</em></p>
                <Note>Deposits are confirmed manually by an admin. Your balance will only update after an admin marks the deposit as <strong>Confirmed</strong>.</Note>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[#1A1A2E]">Deposit request statuses</p>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge label="Pending"   color="bg-[#F39C12]/10 text-[#F39C12]" />
                    <StatusBadge label="Confirmed" color="bg-[#27AE60]/10 text-[#27AE60]" />
                    <StatusBadge label="Rejected"  color="bg-[#E74C3C]/10 text-[#E74C3C]" />
                  </div>
                </div>
              </SubSection>

              <SubSection id="withdraw" title="Requesting a Withdrawal">
                <p className="text-sm text-[#444]">
                  Page: <strong>/dashboard/withdraw</strong>. Fill in the form and submit. The admin team reviews every withdrawal before processing the bank transfer.
                </p>
                <FieldTable rows={[
                  { label: "Amount (₦)",    type: "Number",   required: true,  notes: "Minimum ₦1,000. Cannot exceed your available balance." },
                  { label: "Bank Name",      type: "Dropdown", required: true,  notes: "Select from 24 supported Nigerian banks." },
                  { label: "Account Number", type: "Text",     required: true,  notes: "Exactly 10 digits." },
                  { label: "Account Name",   type: "Text",     required: true,  notes: "Name on the bank account." },
                  { label: "Reason",         type: "Text",     required: false, notes: "Brief reason for the withdrawal." },
                ]} />

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#666666] uppercase tracking-wide">Supported Banks</p>
                  <p className="text-sm text-[#444]">Access Bank · Citibank · Ecobank · FCMB · Fidelity Bank · First Bank · GTBank · Heritage Bank · Jaiz Bank · Keystone Bank · Kuda Bank · Opay · PalmPay · Polaris Bank · Providus Bank · Stanbic IBTC · Standard Chartered · Sterling Bank · SunTrust Bank · UBA · Union Bank · Unity Bank · Wema Bank · Zenith Bank</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[#1A1A2E]">Withdrawal statuses</p>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge label="Pending"   color="bg-[#F39C12]/10 text-[#F39C12]" />
                    <StatusBadge label="Approved"  color="bg-blue-100 text-blue-600" />
                    <StatusBadge label="Completed" color="bg-[#27AE60]/10 text-[#27AE60]" />
                    <StatusBadge label="Rejected"  color="bg-[#E74C3C]/10 text-[#E74C3C]" />
                  </div>
                </div>

                <ToastTable rows={[
                  { scenario: "Request submitted",      message: "Withdrawal Request Submitted!", type: "success" },
                  { scenario: "Amount exceeds balance", message: "Withdrawal amount exceeds your available balance.", type: "error" },
                ]} />
                <Note>Most withdrawals are completed within 24 hours during business days. You will receive a notification at each status change.</Note>
              </SubSection>

              <SubSection id="savings-cycle" title="Savings Cycle &amp; Withdrawal Penalties">
                <p className="text-sm text-[#444]">
                  OOSSPAY uses a <strong>3-month savings cycle</strong> to encourage disciplined saving. Each member&apos;s cycle is personal — it starts on the date your first deposit is confirmed and resets automatically every three months.
                </p>

                {/* Cycle structure */}
                <div className="overflow-x-auto rounded-lg border border-[#E0E0E0]">
                  <table className="w-full text-sm">
                    <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                      <tr>
                        {["Phase", "Duration", "What it means"].map((h) => (
                          <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-[#666666]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0E0E0]">
                      <tr>
                        <td className="px-4 py-2.5 font-medium text-[#1A1A2E]">Lock Window</td>
                        <td className="px-4 py-2.5 text-[#666666]">~83 days (full cycle minus free window)</td>
                        <td className="px-4 py-2.5 text-[#666666]">Withdrawals are allowed but attract a <strong>3.5% early penalty</strong>.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-medium text-[#1A1A2E]">Free Window (Withdrawal Day)</td>
                        <td className="px-4 py-2.5 text-[#666666]">Last 7 days of the cycle</td>
                        <td className="px-4 py-2.5 text-[#666666]">No penalty. Withdraw any amount at no extra cost.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-medium text-[#1A1A2E]">Cycle Reset</td>
                        <td className="px-4 py-2.5 text-[#666666]">Day after cycle ends</td>
                        <td className="px-4 py-2.5 text-[#666666]">A new 3-month cycle begins automatically from the same anchor date.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Example */}
                <div className="bg-[#FAFAFA] rounded-xl border border-[#E0E0E0] p-4 space-y-2 text-sm">
                  <p className="font-semibold text-[#1A1A2E]">Example</p>
                  <p className="text-[#666666]">First deposit confirmed on <strong>15 January</strong>:</p>
                  <ul className="list-disc pl-5 space-y-1 text-[#666666]">
                    <li>Cycle 1 lock window: <strong>15 Jan — 7 Apr</strong></li>
                    <li>Cycle 1 free window (Withdrawal Day): <strong>8 Apr — 14 Apr</strong></li>
                    <li>Cycle 2 starts: <strong>15 Apr</strong></li>
                  </ul>
                </div>

                {/* Penalty */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[#1A1A2E]">Early Withdrawal Penalty</p>
                  <p className="text-sm text-[#444]">
                    If you withdraw during the lock window, a <strong>3.5% penalty</strong> is deducted from the amount sent to your bank. It is never added on top — you simply receive less.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm space-y-2">
                    <p className="font-semibold text-amber-900">Penalty calculation example</p>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-amber-700">You request</p>
                        <p className="font-bold text-[#1A1A2E]">₦50,000</p>
                      </div>
                      <div>
                        <p className="text-amber-700">Penalty (3.5%)</p>
                        <p className="font-bold text-[#E74C3C]">−₦1,750</p>
                      </div>
                      <div>
                        <p className="text-amber-700">You receive</p>
                        <p className="font-bold text-[#27AE60]">₦48,250</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checking status */}
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#1A1A2E]">Checking your cycle status</p>
                  <p className="text-sm text-[#444]">
                    A status card is displayed at the top of the withdrawal form (<strong>/dashboard/withdraw</strong>) every time you visit:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-[#444] space-y-1">
                    <li><strong className="text-[#27AE60]">Green card</strong> — you are in the free window. No penalty applies.</li>
                    <li><strong className="text-amber-700">Amber card</strong> — savings are locked. Shows days remaining and a live penalty preview as you type the amount.</li>
                    <li><strong className="text-blue-600">Blue card</strong> — your first deposit has not been confirmed yet; cycle has not started.</li>
                  </ul>
                </div>

                <Warning>The penalty is calculated and locked in at the time you submit the request. Waiting until the free window opens before withdrawing will always save you the 3.5%.</Warning>
                <Tip>You can still withdraw during the lock window — the penalty is only a deduction, not a block. Your request will be reviewed and processed normally.</Tip>
              </SubSection>

              <SubSection id="savings" title="Savings Targets">
                <p className="text-sm text-[#444]">
                  Page: <strong>/dashboard/savings</strong>. Create named goals, set a target amount and optional deadline, then watch your progress grow as deposits are allocated.
                </p>
                <FieldTable rows={[
                  { label: "Target Name",       type: "Text",   required: true,  notes: 'Min 2 characters. e.g. "Rent Fund", "New Phone"' },
                  { label: "Target Amount (₦)", type: "Number", required: true,  notes: "Must be greater than zero." },
                  { label: "Deadline",           type: "Date",   required: false, notes: "Must be a future date." },
                ]} />

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[#1A1A2E]">Target statuses</p>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge label="Active"    color="bg-[#C2185B]/10 text-[#C2185B]" />
                    <StatusBadge label="Completed" color="bg-[#27AE60]/10 text-[#27AE60]" />
                    <StatusBadge label="Cancelled" color="bg-[#E0E0E0] text-[#666666]" />
                  </div>
                </div>

                <ToastTable rows={[
                  { scenario: "Target created", message: "Target created!", type: "success" },
                  { scenario: "Target updated", message: "Target updated!", type: "success" },
                  { scenario: "Target deleted", message: "Target deleted",  type: "success" },
                  { scenario: "Create failed",  message: "Could not create target", type: "error" },
                  { scenario: "Update failed",  message: "Could not update target", type: "error" },
                  { scenario: "Delete failed",  message: "Could not delete target", type: "error" },
                ]} />
                <Tip>When an admin records a deposit for you, they can optionally allocate the amount to one of your active savings targets, instantly updating your progress bar.</Tip>
              </SubSection>

              <SubSection id="transactions" title="Transaction History">
                <p className="text-sm text-[#444]">
                  Page: <strong>/dashboard/transactions</strong>. A full chronological list of every deposit and withdrawal on your account.
                </p>
                <div className="overflow-x-auto rounded-lg border border-[#E0E0E0]">
                  <table className="w-full text-sm">
                    <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                      <tr>
                        {["Column", "Description"].map((h) => (
                          <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-[#666666]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0E0E0]">
                      {[
                        ["Date",        "Timestamp of the transaction"],
                        ["Type",        "Deposit or Withdrawal"],
                        ["Amount (₦)",  "Transaction value"],
                        ["Description", "Optional note recorded with the transaction"],
                        ["Status",      "Pending / Confirmed / Rejected (deposits) or full withdrawal lifecycle"],
                      ].map(([col, desc]) => (
                        <tr key={col}><td className="px-4 py-2.5 font-medium text-[#1A1A2E]">{col}</td><td className="px-4 py-2.5 text-[#666666]">{desc}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SubSection>

              <SubSection id="notifications" title="Notifications">
                <p className="text-sm text-[#444]">
                  Page: <strong>/dashboard/notifications</strong>. All platform notifications in one place, with tabs to filter by type.
                </p>
                <div className="flex flex-wrap gap-2 text-sm">
                  {["All", "Deposits", "Withdrawals", "Announcements"].map((t) => (
                    <span key={t} className="border border-[#E0E0E0] rounded-full px-3 py-0.5 text-[#666666]">{t}</span>
                  ))}
                </div>
                <p className="text-sm text-[#444]">Unread notifications are highlighted. Click <strong>Mark All as Read</strong> to clear the badge. The bell icon in the top bar shows an unread count.</p>
              </SubSection>

              <SubSection id="profile" title="Profile & Settings">
                <p className="text-sm text-[#444]">Page: <strong>/dashboard/profile</strong>. Update personal information and bank details used for withdrawals.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-[#E0E0E0] p-4 space-y-2">
                    <p className="font-semibold text-sm text-[#1A1A2E]">Personal Information</p>
                    <FieldTable rows={[
                      { label: "Full Name",     type: "Text",  required: true,  notes: "Min 2 characters" },
                      { label: "Email Address", type: "Email", required: false, notes: "Read-only — contact support to change" },
                      { label: "Phone Number",  type: "Text",  required: false, notes: "Nigerian format only" },
                    ]} />
                  </div>
                  <div className="rounded-lg border border-[#E0E0E0] p-4 space-y-2">
                    <p className="font-semibold text-sm text-[#1A1A2E]">Bank Details</p>
                    <FieldTable rows={[
                      { label: "Bank Name",      type: "Dropdown", required: false, notes: "24 supported banks" },
                      { label: "Account Number", type: "Text",     required: false, notes: "Exactly 10 digits" },
                      { label: "Account Name",   type: "Text",     required: false, notes: "Name on the bank account" },
                    ]} />
                  </div>
                </div>
                <Note>Bank details saved here are pre-filled automatically when you submit a withdrawal request.</Note>
                <p className="text-sm text-[#444]">Your <strong>role badge</strong> (Member / Admin / Super Admin) is displayed in the profile header. The role is assigned by a Super Admin and cannot be changed from the UI.</p>
              </SubSection>
            </Section>

            {/* ── ADMIN SECTIONS (role-gated client component) ── */}
            <AdminDocsSection />

            {/* ── QUICK REFERENCE ── */}
            <Section id="quick-reference" title="Quick Reference">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="font-semibold text-sm text-[#1A1A2E]">Limits & Rules</p>
                  <div className="overflow-x-auto rounded-lg border border-[#E0E0E0]">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-[#E0E0E0]">
                        {[
                          ["Session timeout",          "30 minutes of inactivity"],
                          ["Warning dialog",           "At 25 minutes idle"],
                          ["Min deposit amount",       "₦100"],
                          ["Min withdrawal amount",    "₦1,000"],
                          ["Max receipt file size",    "5 MB (JPG, PNG, HEIC)"],
                          ["Account number length",    "Exactly 10 digits"],
                          ["Password minimum",         "8 characters (registration)"],
                          ["Savings cycle length",     "3 months (per member)"],
                          ["Free withdrawal window",   "Last 7 days of each cycle"],
                          ["Early withdrawal penalty", "3.5% deducted from payout"],
                        ].map(([k, v]) => (
                          <tr key={k}><td className="px-4 py-2 font-medium text-[#1A1A2E] text-xs">{k}</td><td className="px-4 py-2 text-[#666666] text-xs">{v}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold text-sm text-[#1A1A2E]">Member Routes</p>
                  <div className="overflow-x-auto rounded-lg border border-[#E0E0E0]">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-[#E0E0E0]">
                        {[
                          ["/login",                    "Login page"],
                          ["/register",                 "Create account"],
                          ["/forgot-password",          "Reset password"],
                          ["/dashboard",                "Member dashboard"],
                          ["/dashboard/deposit",        "Submit deposit request"],
                          ["/dashboard/withdraw",       "Request withdrawal"],
                          ["/dashboard/savings",        "Savings targets"],
                          ["/dashboard/transactions",   "Transaction history"],
                          ["/dashboard/notifications",  "Notifications"],
                          ["/dashboard/profile",        "Profile & bank details"],
                        ].map(([route, desc]) => (
                          <tr key={route}><td className="px-4 py-1.5 font-mono text-[10px] text-[#C2185B]">{route}</td><td className="px-4 py-1.5 text-[#666666] text-xs">{desc}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-[#1A1A2E] text-white p-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1">
                  <p className="font-bold text-base">Still have questions?</p>
                  <p className="text-white/60 text-sm mt-1">Our support team is available via WhatsApp during business hours.</p>
                </div>
                <Link
                  href="/login"
                  className="shrink-0 bg-[#C2185B] hover:bg-[#a31545] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            </Section>

          </div>
        </div>

        <Footer />
      </div>
    </AuthProvider>
  );
}
