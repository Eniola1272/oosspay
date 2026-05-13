"use client";

import { useAuth } from "@/context/AuthContext";

// Re-use the same presentational components from the parent server page.
// They're plain functions so we can import them here and call them as JSX.
import {
  Section,
  SubSection,
  Note,
  Warning,
  FieldTable,
  ToastTable,
  StatusBadge,
} from "./docComponents";

export function AdminDocsSection() {
  const { isAdmin, isSuperAdmin, isLoading } = useAuth();

  // While auth resolves, render nothing so the layout doesn't jump
  if (isLoading || !isAdmin) return null;

  return (
    <>
      {/* ── ADMIN GUIDE ── */}
      <Section
        id="admin-guide"
        title="Admin Guide"
        subtitle="For users with the Admin or Super Admin role. Accessible from /dashboard/admin."
      >
        <Note>
          Admins access their dashboard from <strong>/dashboard/admin</strong>. The &ldquo;Switch to
          Admin&rdquo; option in the account dropdown menu takes you there directly without logging
          out.
        </Note>

        <SubSection id="admin-deposits" title="Deposit Management">
          <p className="text-sm text-[#444]">
            Page: <strong>/dashboard/admin/deposits</strong>. Review member deposit requests, check
            receipt uploads, and confirm or reject each one.
          </p>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#1A1A2E]">Tabs</p>
            <div className="flex flex-wrap gap-2">
              {["Pending", "Confirmed", "Rejected", "All"].map((t) => (
                <span key={t} className="border border-[#E0E0E0] rounded-full px-3 py-0.5 text-sm text-[#666666]">{t}</span>
              ))}
            </div>
          </div>

          <p className="text-sm text-[#444]">
            Each deposit card shows: member name, email, amount claimed, date of transfer, timestamp,
            and status badge. Click a card to expand it and see full details.
          </p>

          <div className="overflow-x-auto rounded-lg border border-[#E0E0E0]">
            <table className="w-full text-sm">
              <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666666]">Expanded Field</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666666]">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0]">
                {[
                  ["Amount Claimed",   "The amount the member says they transferred"],
                  ["Date of Transfer", "When the member made the transfer"],
                  ["Description",      "Optional reference note from the member"],
                  ["Receipt",          "Thumbnail of uploaded receipt image (click to view full size)"],
                  ["Admin Note",       "Shown when a previous note was recorded"],
                ].map(([f, d]) => (
                  <tr key={f}>
                    <td className="px-4 py-2.5 font-medium text-[#1A1A2E]">{f}</td>
                    <td className="px-4 py-2.5 text-[#666666]">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#1A1A2E]">Actions (Pending deposits only)</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-[#27AE60]/30 bg-[#27AE60]/5 p-3 text-sm">
                <p className="font-semibold text-[#27AE60] mb-1">Confirm Deposit</p>
                <p className="text-[#444]">Verifies the transfer and adds the amount to the member&apos;s balance. A notification is sent to the member. The action is logged with your admin identity.</p>
              </div>
              <div className="rounded-lg border border-[#E74C3C]/30 bg-[#E74C3C]/5 p-3 text-sm">
                <p className="font-semibold text-[#E74C3C] mb-1">Reject</p>
                <p className="text-[#444]">Opens a dialog to enter an optional rejection reason. The member is notified. The amount is not added to their balance.</p>
              </div>
            </div>
          </div>

          <ToastTable rows={[
            { scenario: "Deposit confirmed", message: "Deposit confirmed",         type: "success" },
            { scenario: "Deposit rejected",  message: "Deposit rejected",          type: "success" },
            { scenario: "Confirm failed",    message: "Could not confirm deposit", type: "error" },
            { scenario: "Reject failed",     message: "Could not reject deposit",  type: "error" },
          ]} />
        </SubSection>

        <SubSection id="admin-withdrawals" title="Withdrawal Management">
          <p className="text-sm text-[#444]">
            Page: <strong>/dashboard/admin/withdrawals</strong>. Process member withdrawal requests
            through a three-stage workflow.
          </p>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#1A1A2E]">Tabs</p>
            <div className="flex flex-wrap gap-2">
              {["Pending", "Approved", "Completed", "Rejected", "All"].map((t) => (
                <span key={t} className="border border-[#E0E0E0] rounded-full px-3 py-0.5 text-sm text-[#666666]">{t}</span>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#E0E0E0]">
            <table className="w-full text-sm">
              <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666666]">Stage</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666666]">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666666]">Available Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0]">
                <tr>
                  <td className="px-4 py-2.5 font-medium text-[#1A1A2E]">1. Review</td>
                  <td className="px-4 py-2.5"><StatusBadge label="Pending"   color="bg-[#F39C12]/10 text-[#F39C12]" /></td>
                  <td className="px-4 py-2.5 text-[#666666]">Approve · Reject (with optional reason)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-[#1A1A2E]">2. Process payment</td>
                  <td className="px-4 py-2.5"><StatusBadge label="Approved"  color="bg-blue-100 text-blue-600" /></td>
                  <td className="px-4 py-2.5 text-[#666666]">Mark Completed (after bank transfer is done)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-[#1A1A2E]">3. Done</td>
                  <td className="px-4 py-2.5"><StatusBadge label="Completed" color="bg-[#27AE60]/10 text-[#27AE60]" /></td>
                  <td className="px-4 py-2.5 text-[#666666]">No further actions</td>
                </tr>
              </tbody>
            </table>
          </div>

          <ToastTable rows={[
            { scenario: "Approved",         message: "Request marked as approved",  type: "success" },
            { scenario: "Rejected",         message: "Request marked as rejected",  type: "success" },
            { scenario: "Marked completed", message: "Request marked as completed", type: "success" },
            { scenario: "Action failed",    message: "(Supabase error message)",    type: "error" },
          ]} />
        </SubSection>

        <SubSection id="admin-users" title="Member Management">
          <p className="text-sm text-[#444]">
            Page: <strong>/dashboard/admin/users</strong>. View all registered members, their
            balances, roles, and join dates. Click any row or <strong>View</strong> to open the
            member detail page.
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
                  ["Member",      "Avatar initials, full name, and email"],
                  ["Phone",       "Registered phone number (hidden on small screens)"],
                  ["Balance (₦)", "Current confirmed savings balance"],
                  ["Joined",      "Account creation date (hidden on small screens)"],
                  ["Role",        "member / admin / super_admin badge"],
                ].map(([c, d]) => (
                  <tr key={c}>
                    <td className="px-4 py-2.5 font-medium text-[#1A1A2E]">{c}</td>
                    <td className="px-4 py-2.5 text-[#666666]">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm font-semibold text-[#1A1A2E] mt-2">
            Member Detail Page — <span className="font-mono font-normal text-sm">/dashboard/admin/users/[id]</span>
          </p>
          <p className="text-sm text-[#444]">
            Shows full profile info, current balance, all savings targets (with progress), full
            transaction history, and all withdrawal requests for that member.
          </p>

          <div className="rounded-lg border border-[#E0E0E0] p-4 space-y-3">
            <p className="text-sm font-semibold text-[#1A1A2E]">Record Deposit (Admin action)</p>
            <p className="text-sm text-[#444]">
              Manually credit a member&apos;s account after verifying a bank transfer receipt.
            </p>
            <FieldTable rows={[
              { label: "Amount (₦)",        type: "Number",   required: true,  notes: "Must be greater than zero" },
              { label: "Description",        type: "Text",     required: false, notes: 'e.g. "Monthly savings deposit"' },
              { label: "Reference",          type: "Text",     required: false, notes: "Bank transfer reference number" },
              { label: "Allocate to Target", type: "Dropdown", required: false, notes: "Optional — choose an active savings target to credit" },
            ]} />
            <ToastTable rows={[
              { scenario: "Deposit recorded", message: "[₦Amount] deposited successfully", type: "success" },
              { scenario: "Failed",           message: "Could not [action]",               type: "error" },
            ]} />
          </div>
        </SubSection>

        <SubSection id="admin-settings" title="Platform Settings">
          <p className="text-sm text-[#444]">
            Page: <strong>/dashboard/admin/settings</strong>. Two sections: the deposit account
            details that members see, and the broadcast announcement tool.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-[#E0E0E0] p-4 space-y-3">
              <p className="font-semibold text-sm text-[#1A1A2E]">OOSSPAY Deposit Account</p>
              <p className="text-sm text-[#444]">What members see on the deposit page when transferring funds.</p>
              <FieldTable rows={[
                { label: "Bank Name",       type: "Text", required: true,  notes: "Min 2 characters" },
                { label: "Account Number",  type: "Text", required: true,  notes: "Exactly 10 digits" },
                { label: "Account Name",    type: "Text", required: true,  notes: "Min 2 characters" },
                { label: "Additional Info", type: "Text", required: false, notes: 'e.g. "Please include your name in the narration"' },
              ]} />
              <ToastTable rows={[
                { scenario: "Saved", message: "Deposit account details saved!", type: "success" },
              ]} />
            </div>
            <div className="rounded-lg border border-[#E0E0E0] p-4 space-y-3">
              <p className="font-semibold text-sm text-[#1A1A2E]">Broadcast Announcement</p>
              <p className="text-sm text-[#444]">Send a notification to all registered members simultaneously.</p>
              <FieldTable rows={[
                { label: "Title",   type: "Text",     required: true, notes: 'Min 3 characters. e.g. "Platform Maintenance Notice"' },
                { label: "Message", type: "Textarea", required: true, notes: "Min 10 characters." },
              ]} />
              <ToastTable rows={[
                { scenario: "Sent", message: "Announcement sent to [N] member(s)!", type: "success" },
              ]} />
              <Note>Previous announcements are listed below the form with their title, message, and send date.</Note>
            </div>
          </div>
          <Warning>Updating the deposit account details takes effect immediately. All members will see the new account on their next visit to the deposit page.</Warning>
        </SubSection>
      </Section>

      {/* ── SUPER ADMIN ── */}
      {isSuperAdmin && (
        <Section
          id="super-admin"
          title="Super Admin"
          subtitle="For users with the Super Admin role. Accessible from /dashboard/super-admin."
        >
          <p className="text-sm text-[#444]">
            Super Admins have all Admin capabilities plus access to the <strong>Activity Log</strong>.
            The Super Admin dashboard is visually distinguished with amber accents.
          </p>
          <Note>The Super Admin role must be assigned directly in the database. It cannot be self-assigned from any UI screen.</Note>

          <SubSection id="activity-log" title="Activity Log">
            <p className="text-sm text-[#444]">
              Page: <strong>/dashboard/super-admin/activity</strong>. A tamper-evident audit trail
              of every admin action taken on deposits and withdrawals.
            </p>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#1A1A2E]">Filter tabs</p>
              <div className="flex flex-wrap gap-2">
                {["All Actions", "Deposits", "Withdrawals"].map((t) => (
                  <span key={t} className="border border-[#E0E0E0] rounded-full px-3 py-0.5 text-sm text-[#666666]">{t}</span>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#E0E0E0]">
              <table className="w-full text-sm">
                <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666666]">Action Type</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666666]">Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E0E0]">
                  {([
                    ["Deposit Confirmed",    "bg-[#27AE60]/10 text-[#27AE60]"],
                    ["Deposit Rejected",     "bg-[#E74C3C]/10 text-[#E74C3C]"],
                    ["Withdrawal Approved",  "bg-blue-50 text-blue-500"],
                    ["Withdrawal Rejected",  "bg-[#E74C3C]/10 text-[#E74C3C]"],
                    ["Withdrawal Completed", "bg-[#27AE60]/10 text-[#27AE60]"],
                  ] as [string, string][]).map(([label, color]) => (
                    <tr key={label}>
                      <td className="px-4 py-2.5 text-[#1A1A2E]">{label}</td>
                      <td className="px-4 py-2.5"><StatusBadge label={label} color={color} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm text-[#444]">
              Each entry shows: the admin who acted, what they did and the amount, the affected
              member (name + email), any admin note, and the timestamp.
            </p>
            <Warning>This log is read-only. No entries can be edited or deleted from the UI.</Warning>
          </SubSection>
        </Section>
      )}

      {/* Admin quick-reference routes */}
      <div className="overflow-x-auto rounded-lg border border-[#E0E0E0]">
        <p className="px-4 pt-3 text-xs font-bold uppercase tracking-widest text-[#999999]">Admin Routes</p>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-[#E0E0E0]">
            {[
              ["/dashboard/admin",                "Admin dashboard"],
              ["/dashboard/admin/deposits",        "Manage deposits"],
              ["/dashboard/admin/withdrawals",     "Manage withdrawals"],
              ["/dashboard/admin/users",           "Manage members"],
              ["/dashboard/admin/settings",        "Platform settings"],
              ...(isSuperAdmin ? [["/dashboard/super-admin/activity", "Activity audit log"]] : []),
            ].map(([route, desc]) => (
              <tr key={route}>
                <td className="px-4 py-1.5 font-mono text-[10px] text-amber-600">{route}</td>
                <td className="px-4 py-1.5 text-[#666666] text-xs">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </>
  );
}
