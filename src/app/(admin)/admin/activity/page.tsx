"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2, XCircle, Clock, ArrowDownLeft, ArrowUpRight,
  ScrollText, Filter,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { formatNaira, formatDateTime, getInitials } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActionType = "deposit_confirmed" | "deposit_rejected" | "withdrawal_approved" | "withdrawal_rejected" | "withdrawal_completed";

interface LogEntry {
  id: string;
  actionType: ActionType;
  amount: number;
  adminId: string;
  adminName: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  note: string | null;
  timestamp: string;
}

type TabValue = "all" | "deposits" | "withdrawals";

// ─── Config ───────────────────────────────────────────────────────────────────

const ACTION_CONFIG: Record<ActionType, {
  label: string;
  verb: string;
  icon: typeof Clock;
  iconColor: string;
  badgeColor: string;
}> = {
  deposit_confirmed:     { label: "Deposit Confirmed",     verb: "confirmed a deposit of",      icon: CheckCircle2,  iconColor: "bg-[#27AE60]/10 text-[#27AE60]", badgeColor: "bg-[#27AE60]/10 text-[#27AE60]" },
  deposit_rejected:      { label: "Deposit Rejected",      verb: "rejected a deposit of",       icon: XCircle,       iconColor: "bg-[#E74C3C]/10 text-[#E74C3C]", badgeColor: "bg-[#E74C3C]/10 text-[#E74C3C]" },
  withdrawal_approved:   { label: "Withdrawal Approved",   verb: "approved a withdrawal of",    icon: CheckCircle2,  iconColor: "bg-blue-50 text-blue-500",        badgeColor: "bg-blue-50 text-blue-500" },
  withdrawal_rejected:   { label: "Withdrawal Rejected",   verb: "rejected a withdrawal of",   icon: XCircle,       iconColor: "bg-[#E74C3C]/10 text-[#E74C3C]", badgeColor: "bg-[#E74C3C]/10 text-[#E74C3C]" },
  withdrawal_completed:  { label: "Withdrawal Completed",  verb: "completed a withdrawal of",   icon: CheckCircle2,  iconColor: "bg-[#27AE60]/10 text-[#27AE60]", badgeColor: "bg-[#27AE60]/10 text-[#27AE60]" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ActivityLogPage() {
  const router = useRouter();
  const { isSuperAdmin, isLoading: authLoading } = useAuth();
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabValue>("all");

  // Guard: only super_admin may view this page
  useEffect(() => {
    if (!authLoading && !isSuperAdmin) {
      router.replace("/admin");
    }
  }, [authLoading, isSuperAdmin, router]);

  useEffect(() => {
    if (!isSuperAdmin) return;
    load();
  }, [isSuperAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  async function load() {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createClient() as any;

    const [txRes, wrRes] = await Promise.all([
      // Admin-actioned deposits: recorded_by is set
      sb.from("transactions")
        .select("id, amount, status, admin_note, created_at, user_id, recorded_by")
        .eq("type", "deposit")
        .not("recorded_by", "is", null)
        .order("created_at", { ascending: false })
        .limit(100),

      // Admin-reviewed withdrawals: reviewed_by is set
      sb.from("withdrawal_requests")
        .select("id, amount, status, admin_note, reviewed_at, user_id, reviewed_by")
        .not("reviewed_by", "is", null)
        .order("reviewed_at", { ascending: false })
        .limit(100),
    ]);

    const txRows: {
      id: string; amount: number; status: string; admin_note: string | null;
      created_at: string; user_id: string; recorded_by: string;
    }[] = txRes.data ?? [];

    const wrRows: {
      id: string; amount: number; status: string; admin_note: string | null;
      reviewed_at: string; user_id: string; reviewed_by: string;
    }[] = wrRes.data ?? [];

    // Collect unique profile IDs we need
    const adminIds = new Set<string>([
      ...txRows.map((r) => r.recorded_by),
      ...wrRows.map((r) => r.reviewed_by),
    ]);
    const memberIds = new Set<string>([
      ...txRows.map((r) => r.user_id),
      ...wrRows.map((r) => r.user_id),
    ]);
    const allIds = [...new Set([...adminIds, ...memberIds])];

    let profiles: { id: string; full_name: string; email: string }[] = [];
    if (allIds.length > 0) {
      const { data } = await sb
        .from("profiles")
        .select("id, full_name, email")
        .in("id", allIds);
      profiles = data ?? [];
    }

    function byId(id: string) {
      return profiles.find((p) => p.id === id) ?? { full_name: "Unknown", email: "" };
    }

    // Map status → ActionType
    function depositAction(status: string): ActionType {
      return status === "completed" ? "deposit_confirmed" : "deposit_rejected";
    }
    function withdrawalAction(status: string): ActionType {
      if (status === "approved")   return "withdrawal_approved";
      if (status === "completed")  return "withdrawal_completed";
      return "withdrawal_rejected";
    }

    const depositEntries: LogEntry[] = txRows.map((r) => ({
      id: `tx-${r.id}`,
      actionType: depositAction(r.status),
      amount: Number(r.amount),
      adminId: r.recorded_by,
      adminName: byId(r.recorded_by).full_name,
      memberId: r.user_id,
      memberName: byId(r.user_id).full_name,
      memberEmail: byId(r.user_id).email,
      note: r.admin_note,
      timestamp: r.created_at,
    }));

    const withdrawalEntries: LogEntry[] = wrRows.map((r) => ({
      id: `wr-${r.id}`,
      actionType: withdrawalAction(r.status),
      amount: Number(r.amount),
      adminId: r.reviewed_by,
      adminName: byId(r.reviewed_by).full_name,
      memberId: r.user_id,
      memberName: byId(r.user_id).full_name,
      memberEmail: byId(r.user_id).email,
      note: r.admin_note,
      timestamp: r.reviewed_at,
    }));

    const all = [...depositEntries, ...withdrawalEntries]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setEntries(all);
    setLoading(false);
  }

  const filtered = entries.filter((e) => {
    if (tab === "deposits")    return e.actionType.startsWith("deposit");
    if (tab === "withdrawals") return e.actionType.startsWith("withdrawal");
    return true;
  });

  if (authLoading || !isSuperAdmin) return null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] flex items-center gap-2">
            <ScrollText size={22} className="text-amber-500" />
            Activity Log
          </h1>
          <p className="text-sm text-[#666666] mt-1">
            Every admin action on deposits and withdrawals: who did what, and when.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#666666] bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <Filter size={13} className="text-amber-500" />
          Super Admin view only
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
        <TabsList className="bg-[#FAFAFA] border border-[#E0E0E0] h-auto gap-1 p-1">
          {([
            { label: "All Actions", value: "all" },
            { label: "Deposits",    value: "deposits" },
            { label: "Withdrawals", value: "withdrawals" },
          ] as { label: string; value: TabValue }[]).map(({ label, value }) => {
            const count = value === "all"
              ? entries.length
              : entries.filter((e) => e.actionType.startsWith(value.slice(0, -1))).length;
            return (
              <TabsTrigger
                key={value}
                value={value}
                className="text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-white gap-1.5"
              >
                {label}
                {count > 0 && (
                  <span className="bg-current/20 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none">
                    {count}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Log feed */}
      <div className="rounded-2xl border border-[#E0E0E0] overflow-hidden bg-white">
        {loading ? (
          <div className="divide-y divide-[#F0F0F0]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-start gap-4">
                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <ScrollText size={36} className="text-[#999999]/30 mx-auto mb-3" />
            <p className="font-medium text-[#1A1A2E]">No admin actions recorded yet</p>
            <p className="text-sm text-[#666666] mt-1">
              Actions will appear here once admins start reviewing deposits and withdrawals.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0F0F0]">
            {filtered.map((entry) => {
              const cfg = ACTION_CONFIG[entry.actionType];
              const Icon = cfg.icon;
              const isTx = entry.actionType.startsWith("deposit");

              return (
                <div key={entry.id} className="px-5 py-4 flex items-start gap-4 hover:bg-[#FAFAFA] transition-colors">
                  {/* Action icon */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${cfg.iconColor}`}>
                    {isTx
                      ? <ArrowDownLeft size={15} />
                      : <ArrowUpRight size={15} />}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    {/* Sentence */}
                    <p className="text-sm text-[#1A1A2E] leading-snug">
                      <span className="font-semibold">{entry.adminName}</span>
                      {" "}<span className="text-[#666666]">{cfg.verb}</span>{" "}
                      <span className="font-semibold tabular-nums">{formatNaira(entry.amount)}</span>
                      {" "}<span className="text-[#666666]">for</span>{" "}
                      <span className="font-semibold">{entry.memberName}</span>
                      <span className="text-[#999999]"> ({entry.memberEmail})</span>
                    </p>

                    {/* Admin note */}
                    {entry.note && (
                      <p className="text-xs text-[#666666] mt-1 bg-[#F5F5F5] rounded px-2 py-1 inline-block">
                        Note: {entry.note}
                      </p>
                    )}

                    <p className="text-[11px] text-[#999999] mt-1">{formatDateTime(entry.timestamp)}</p>
                  </div>

                  {/* Admin avatar + badge */}
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#1A1A2E] text-white text-[10px] font-bold flex items-center justify-center">
                        {getInitials(entry.adminName)}
                      </div>
                    </div>
                    <Badge className={`text-[10px] font-semibold flex items-center gap-1 ${cfg.badgeColor}`}>
                      <Icon size={9} /> {cfg.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
