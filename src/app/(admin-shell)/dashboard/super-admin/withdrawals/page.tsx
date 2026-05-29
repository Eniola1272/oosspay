"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { formatNaira, formatDateTime, getInitials } from "@/lib/utils";
import { toast } from "sonner";
import type { WithdrawalRequest, WithdrawalStatus, Profile } from "@/types";

interface WRWithUser extends WithdrawalRequest {
  profile: Pick<Profile, "full_name" | "email"> | null;
}

type TabValue = "pending" | "approved" | "completed" | "rejected" | "all";

const TABS: { label: string; value: TabValue }[] = [
  { label: "Pending",   value: "pending" },
  { label: "Approved",  value: "approved" },
  { label: "Completed", value: "completed" },
  { label: "Rejected",  value: "rejected" },
  { label: "All",       value: "all" },
];

const STATUS_BADGE: Record<WithdrawalStatus, string> = {
  pending:    "bg-[#F39C12]/10 text-[#F39C12]",
  approved:   "bg-blue-100 text-blue-600",
  processing: "bg-purple-100 text-purple-600",
  completed:  "bg-[#27AE60]/10 text-[#27AE60]",
  rejected:   "bg-[#E74C3C]/10 text-[#E74C3C]",
};

export default function AdminWithdrawalsPage() {
  const [requests, setRequests] = useState<WRWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabValue>("pending");
  const [reviewTarget, setReviewTarget] = useState<WRWithUser | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/withdrawals");
    const json = await res.json().catch(() => ({ withdrawals: [] }));
    if (!res.ok) { toast.error(json.error ?? "Could not load withdrawals"); }
    else { setRequests(json.withdrawals ?? []); }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = tab === "all" ? requests : requests.filter((r) => r.status === tab);

  async function handleAction(wr: WRWithUser, newStatus: WithdrawalStatus, note?: string) {
    setSubmitting(true);
    const res = await fetch("/api/admin/withdrawals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: wr.id, status: newStatus, admin_note: note ?? "" }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { toast.error(json.error ?? "Could not update withdrawal"); setSubmitting(false); return; }

    toast.success(`Request marked as ${newStatus}`);
    setReviewTarget(null);
    setAdminNote("");
    setSubmitting(false);
    load();
  }

  return (
    <div>
      <AdminTopBar title="Withdrawal Requests" subtitle="Review and process member withdrawal requests." />

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-5">
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
          <TabsList className="bg-[#FAFAFA] border border-[#E0E0E0] flex-wrap h-auto gap-1 p-1">
            {TABS.map(({ label, value }) => {
              const count = value === "all" ? requests.length : requests.filter((r) => r.status === value).length;
              return (
                <TabsTrigger key={value} value={value}
                  className="text-xs data-[state=active]:bg-[#C2185B] data-[state=active]:text-white gap-1.5">
                  {label}
                  {count > 0 && (
                    <span className="bg-current/20 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none">{count}</span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-[#666666] rounded-2xl border border-[#E0E0E0] bg-white">
              <Clock size={36} className="text-[#666666]/30 mx-auto mb-3" />
              <p className="font-medium text-[#1A1A2E]">No {tab === "all" ? "" : tab} requests</p>
              <p className="text-sm mt-1">Nothing to review here.</p>
            </div>
          ) : (
            filtered.map((wr) => {
              const isExpanded = expandedId === wr.id;
              const StatusIcon = wr.status === "completed" ? CheckCircle2 : wr.status === "rejected" ? XCircle : Clock;
              return (
                <div key={wr.id} className="rounded-2xl border border-[#E0E0E0] overflow-hidden bg-white">
                  <div
                    className="flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-[#FAFAFA] transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : wr.id)}
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-[#C2185B] text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {getInitials(wr.profile?.full_name ?? "?")}
                    </div>

                    {/* Content column — owns all rows */}
                    <div className="flex-1 min-w-0 space-y-1">
                      {/* Row 1: name + amount */}
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-[#1A1A2E] text-sm leading-tight truncate">
                          {wr.profile?.full_name ?? "Unknown"}
                        </p>
                        <p className="font-extrabold text-base text-[#1A1A2E] tabular-nums shrink-0">
                          {formatNaira(Number(wr.amount))}
                        </p>
                      </div>

                      {/* Row 2: email */}
                      <p className="text-xs text-[#666666] truncate">{wr.profile?.email}</p>

                      {/* Row 3: date + badges */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="text-xs text-[#666666]">{formatDateTime(wr.created_at)}</p>
                        <div className="flex items-center gap-1.5">
                          {wr.is_penalized && (
                            <Badge className="bg-amber-100 text-amber-700 text-[10px]">Penalty</Badge>
                          )}
                          <Badge className={`${STATUS_BADGE[wr.status]} text-[10px] flex items-center gap-1`}>
                            <StatusIcon size={10} />{wr.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Row 4: payout (only when penalized) */}
                      {wr.is_penalized && (
                        <p className="text-xs text-[#27AE60] font-semibold tabular-nums">
                          Payout: {formatNaira(Number(wr.payout_amount))}
                        </p>
                      )}
                    </div>

                    {/* Chevron */}
                    <ChevronDown size={16} className={`text-[#666666] transition-transform shrink-0 mt-1 ${isExpanded ? "rotate-180" : ""}`} />
                  </div>

                  {isExpanded && (
                    <div className="border-t border-[#E0E0E0] px-5 py-4 bg-[#FAFAFA] space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><p className="text-xs text-[#666666]">Bank</p><p className="font-medium text-[#1A1A2E]">{wr.bank_name}</p></div>
                        <div><p className="text-xs text-[#666666]">Account No.</p><p className="font-medium text-[#1A1A2E] tabular-nums">{wr.bank_account_number}</p></div>
                        <div><p className="text-xs text-[#666666]">Account Name</p><p className="font-medium text-[#1A1A2E]">{wr.bank_account_name}</p></div>
                        <div><p className="text-xs text-[#666666]">Reason</p><p className="font-medium text-[#1A1A2E]">{wr.reason || "—"}</p></div>
                      </div>
                      {wr.is_penalized && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm space-y-1">
                          <p className="font-semibold text-amber-900">Early Withdrawal: Penalty Applied</p>
                          <div className="grid grid-cols-3 gap-3 text-xs">
                            <div><p className="text-amber-700">Requested</p><p className="font-bold text-[#1A1A2E]">{formatNaira(Number(wr.amount))}</p></div>
                            <div><p className="text-amber-700">Penalty ({(Number(wr.penalty_rate) * 100).toFixed(1)}%)</p><p className="font-bold text-[#E74C3C]">−{formatNaira(Number(wr.penalty_amount))}</p></div>
                            <div><p className="text-amber-700">Transfer to member</p><p className="font-bold text-[#27AE60]">{formatNaira(Number(wr.payout_amount))}</p></div>
                          </div>
                        </div>
                      )}

                      {wr.admin_note && (
                        <div className="text-sm">
                          <p className="text-xs text-[#666666]">Admin Note</p>
                          <p className="text-[#1A1A2E]">{wr.admin_note}</p>
                        </div>
                      )}

                      {wr.status === "pending" && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          <Button size="sm" className="bg-[#27AE60] hover:bg-[#219a52] text-white" onClick={() => handleAction(wr, "approved")}>
                            <CheckCircle2 size={14} className="mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C]/10"
                            onClick={() => { setReviewTarget(wr); setAdminNote(""); }}>
                            <XCircle size={14} className="mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                      {wr.status === "approved" && (
                        <div className="flex gap-2 pt-1">
                          <Button size="sm" className="bg-[#C2185B] hover:bg-[#a31545] text-white" onClick={() => handleAction(wr, "completed")}>
                            <CheckCircle2 size={14} className="mr-1" /> Mark Completed
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <Dialog open={!!reviewTarget} onOpenChange={(o) => { if (!o) setReviewTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#E74C3C]">Reject Withdrawal</DialogTitle>
            <DialogDescription>
              {reviewTarget && `Reject ${formatNaira(Number(reviewTarget.amount))} request from ${reviewTarget.profile?.full_name}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1">
              <Label>Reason for rejection <span className="text-[#666666] font-normal">(optional)</span></Label>
              <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Let the member know why this was declined..." rows={3}
                className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C2185B]/30 resize-none" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setReviewTarget(null)} className="flex-1" disabled={submitting}>Cancel</Button>
              <Button disabled={submitting} className="flex-1 bg-[#E74C3C] hover:bg-red-700 text-white"
                onClick={() => reviewTarget && handleAction(reviewTarget, "rejected", adminNote)}>
                {submitting ? "Rejecting…" : "Confirm Reject"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
