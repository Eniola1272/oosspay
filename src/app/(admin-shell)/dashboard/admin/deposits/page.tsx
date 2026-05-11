"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock, ChevronDown, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { formatNaira, formatDate, formatDateTime, getInitials } from "@/lib/utils";
import { toast } from "sonner";
import type { Transaction, TransactionStatus, Profile } from "@/types";

interface TxWithUser extends Transaction {
  profile: Pick<Profile, "full_name" | "email"> | null;
}

type TabValue = "pending" | "completed" | "failed" | "all";

const TABS: { label: string; value: TabValue }[] = [
  { label: "Pending",   value: "pending" },
  { label: "Confirmed", value: "completed" },
  { label: "Rejected",  value: "failed" },
  { label: "All",       value: "all" },
];

const STATUS_BADGE: Record<TransactionStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending:   { label: "Pending",   color: "bg-[#F39C12]/10 text-[#F39C12]", icon: Clock },
  completed: { label: "Confirmed", color: "bg-[#27AE60]/10 text-[#27AE60]", icon: CheckCircle2 },
  failed:    { label: "Rejected",  color: "bg-[#E74C3C]/10 text-[#E74C3C]", icon: XCircle },
};

export default function AdminDepositsPage() {
  const supabase = createClient();
  const { user } = useAuth();
  const [deposits, setDeposits] = useState<TxWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabValue>("pending");
  const [rejectTarget, setRejectTarget] = useState<TxWithUser | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function load() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("transactions")
      .select("*, profiles(full_name, email)")
      .eq("type", "deposit")
      .order("created_at", { ascending: false });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = (data ?? []).map((r: any) => ({ ...r, profile: r.profiles ?? null }));
    setDeposits(rows);
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = tab === "all" ? deposits : deposits.filter((d) => d.status === tab);

  async function handleApprove(tx: TxWithUser) {
    setSubmitting(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    const { error } = await sb.from("transactions").update({
      status: "completed",
      recorded_by: user?.id ?? null,
    }).eq("id", tx.id);

    if (error) { toast.error(error.message); setSubmitting(false); return; }

    await sb.from("notifications").insert({
      user_id: tx.user_id,
      title: "Deposit Confirmed!",
      message: `Your deposit of ${formatNaira(Number(tx.amount))} has been confirmed and added to your savings balance.`,
      type: "deposit",
    });

    toast.success("Deposit confirmed");
    setSubmitting(false);
    load();
  }

  async function handleReject(tx: TxWithUser, note: string) {
    setSubmitting(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    const { error } = await sb.from("transactions").update({
      status: "failed",
      admin_note: note || null,
      recorded_by: user?.id ?? null,
    }).eq("id", tx.id);

    if (error) { toast.error(error.message); setSubmitting(false); return; }

    await sb.from("notifications").insert({
      user_id: tx.user_id,
      title: "Deposit Request Declined",
      message: `Your deposit request of ${formatNaira(Number(tx.amount))} could not be confirmed.${note ? ` Reason: ${note}` : " Please contact support for more information."}`,
      type: "deposit",
    });

    toast.success("Deposit rejected");
    setRejectTarget(null);
    setAdminNote("");
    setSubmitting(false);
    load();
  }

  return (
    <div>
      <AdminTopBar title="Deposit Requests" subtitle="Review receipt uploads and confirm member deposits." />

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-5">
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
          <TabsList className="bg-[#FAFAFA] border border-[#E0E0E0] flex-wrap h-auto gap-1 p-1">
            {TABS.map(({ label, value }) => {
              const count = value === "all" ? deposits.length : deposits.filter((d) => d.status === value).length;
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
              <p className="font-medium text-[#1A1A2E]">No {tab === "all" ? "" : tab} deposit requests</p>
              <p className="text-sm mt-1">Nothing to review here.</p>
            </div>
          ) : (
            filtered.map((tx) => {
              const isExpanded = expandedId === tx.id;
              const cfg = STATUS_BADGE[tx.status];
              const Icon = cfg.icon;
              return (
                <div key={tx.id} className="rounded-2xl border border-[#E0E0E0] overflow-hidden bg-white">
                  <div
                    className="flex flex-wrap items-center gap-3 px-5 py-4 cursor-pointer hover:bg-[#FAFAFA] transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#C2185B] text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {getInitials(tx.profile?.full_name ?? "?")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1A1A2E] text-sm">{tx.profile?.full_name ?? "Unknown"}</p>
                      <p className="text-xs text-[#666666]">{tx.profile?.email} · {formatDateTime(tx.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <p className="font-extrabold text-lg text-[#1A1A2E] tabular-nums">{formatNaira(Number(tx.amount))}</p>
                      <Badge className={`${cfg.color} text-[10px] flex items-center gap-1`}><Icon size={10} /> {cfg.label}</Badge>
                      <ChevronDown size={16} className={`text-[#666666] transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-[#E0E0E0] px-5 py-4 bg-[#FAFAFA] space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-[#666666]">Amount Claimed</p>
                          <p className="font-semibold text-[#1A1A2E] tabular-nums">{formatNaira(Number(tx.amount))}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#666666]">Date of Transfer</p>
                          <p className="font-semibold text-[#1A1A2E]">{tx.deposit_request_date ? formatDate(tx.deposit_request_date) : "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#666666]">Description</p>
                          <p className="font-semibold text-[#1A1A2E]">{tx.description || "—"}</p>
                        </div>
                      </div>

                      {tx.receipt_url ? (
                        <div>
                          <p className="text-xs text-[#666666] mb-2">Receipt</p>
                          <a href={tx.receipt_url} target="_blank" rel="noopener noreferrer">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={tx.receipt_url} alt="Deposit receipt" className="max-h-52 rounded-xl border border-[#E0E0E0] object-contain hover:opacity-90 transition-opacity cursor-pointer" />
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-[#999999]">
                          <ImageIcon size={13} /> No receipt uploaded
                        </div>
                      )}

                      {tx.admin_note && (
                        <div className="text-sm">
                          <p className="text-xs text-[#666666]">Admin Note</p>
                          <p className="text-[#E74C3C]">{tx.admin_note}</p>
                        </div>
                      )}

                      {tx.status === "pending" && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          <Button size="sm" className="bg-[#27AE60] hover:bg-[#219a52] text-white" disabled={submitting} onClick={() => handleApprove(tx)}>
                            <CheckCircle2 size={14} className="mr-1" /> Confirm Deposit
                          </Button>
                          <Button size="sm" variant="outline" className="border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C]/10"
                            onClick={() => { setRejectTarget(tx); setAdminNote(""); }}>
                            <XCircle size={14} className="mr-1" /> Reject
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

      <Dialog open={!!rejectTarget} onOpenChange={(o) => { if (!o) setRejectTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#E74C3C]">Reject Deposit</DialogTitle>
            <DialogDescription>
              {rejectTarget && `Reject ${formatNaira(Number(rejectTarget.amount))} deposit from ${rejectTarget.profile?.full_name}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1">
              <Label>Reason for rejection</Label>
              <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)}
                placeholder="e.g. Receipt doesn't match claimed amount..." rows={3}
                className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C2185B]/30 resize-none" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setRejectTarget(null)} className="flex-1" disabled={submitting}>Cancel</Button>
              <Button disabled={submitting} className="flex-1 bg-[#E74C3C] hover:bg-red-700 text-white"
                onClick={() => rejectTarget && handleReject(rejectTarget, adminNote)}>
                {submitting ? "Rejecting…" : "Confirm Reject"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
