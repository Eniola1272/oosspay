"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Phone, Mail, Calendar, Wallet, CheckCircle2, Clock, XCircle, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { createClient } from "@/lib/supabase/client";
import { balanceUpdateSchema, type BalanceUpdateInput } from "@/lib/validations";
import { formatNaira, formatDate, formatDateTime, getSavingsProgress, getInitials } from "@/lib/utils";
import { toast } from "sonner";
import type { Profile, Transaction, SavingsTarget, WithdrawalRequest } from "@/types";

interface UserDetail extends Profile { balance: number }

const STATUS_BADGE: Record<string, string> = {
  completed:  "bg-[#27AE60]/10 text-[#27AE60]",
  pending:    "bg-[#F39C12]/10 text-[#F39C12]",
  failed:     "bg-[#E74C3C]/10 text-[#E74C3C]",
  approved:   "bg-blue-100 text-blue-600",
  processing: "bg-purple-100 text-purple-600",
  rejected:   "bg-[#E74C3C]/10 text-[#E74C3C]",
};

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const basePath = pathname.startsWith("/dashboard/super-admin") ? "/dashboard/super-admin" : "/dashboard/admin";

  const [user, setUser] = useState<UserDetail | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [targets, setTargets] = useState<SavingsTarget[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BalanceUpdateInput>({
    resolver: zodResolver(balanceUpdateSchema),
  });

  async function loadData() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;
    const [profileRes, txRes, targetsRes, wrRes, balRes] = await Promise.all([
      sb.from("profiles").select("*").eq("id", id).single(),
      sb.from("transactions").select("*").eq("user_id", id).order("created_at", { ascending: false }),
      sb.from("savings_targets").select("*").eq("user_id", id).order("created_at", { ascending: false }),
      sb.from("withdrawal_requests").select("*").eq("user_id", id).order("created_at", { ascending: false }),
      sb.rpc("get_user_balance", { p_user_id: id }),
    ]);

    if (!profileRes.data) { router.push(`${basePath}/users`); return; }

    setUser({ ...profileRes.data, balance: Number(balRes.data ?? 0) });
    setTransactions(txRes.data ?? []);
    setTargets(targetsRes.data ?? []);
    setWithdrawals(wrRes.data ?? []);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function onRecordDeposit(data: BalanceUpdateInput) {
    if (!user) return;
    setSubmitting(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    const { error: txError } = await sb.from("transactions").insert({
      user_id: user.id,
      type: "deposit",
      amount: data.amount,
      description: data.description || "Admin deposit",
      reference: data.reference || null,
      status: "completed",
    });

    if (txError) { toast.error(txError.message); setSubmitting(false); return; }

    await sb.from("notifications").insert({
      user_id: user.id,
      title: "Deposit Recorded",
      message: `${formatNaira(data.amount)} has been added to your savings account.`,
      type: "deposit",
    });

    toast.success(`${formatNaira(data.amount)} deposited successfully`);
    reset();
    setSubmitting(false);
    loadData();
  }

  if (loading) {
    return (
      <div>
        <AdminTopBar title="Member Detail" />
        <div className="p-4 lg:p-6 space-y-4 lg:space-y-5">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-36 rounded-2xl" />
          <div className="grid md:grid-cols-2 gap-5">
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      <AdminTopBar title={user.full_name ?? "Member Detail"} subtitle={user.email} />

      <div className="p-4 lg:p-6 space-y-5 lg:space-y-6">
        <button
          onClick={() => router.push(`${basePath}/users`)}
          className="flex items-center gap-1.5 text-sm text-[#666666] hover:text-[#1A1A2E] transition-colors"
        >
          <ArrowLeft size={15} /> Back to Users
        </button>

        {/* User header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-5 items-start">
              <div className="w-16 h-16 rounded-full bg-[#C2185B] text-white text-2xl font-bold flex items-center justify-center shrink-0">
                {getInitials(user.full_name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xl font-extrabold text-[#1A1A2E]">{user.full_name}</p>
                <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#666666]">
                  <span className="flex items-center gap-1.5"><Mail size={13} />{user.email}</span>
                  {user.phone && <span className="flex items-center gap-1.5"><Phone size={13} />{user.phone}</span>}
                  <span className="flex items-center gap-1.5"><Calendar size={13} />Joined {formatDate(user.created_at)}</span>
                </div>
                <div className="mt-1.5">
                  <Badge className={user.role === "admin" || user.role === "super_admin" ? "bg-[#C2185B] text-white text-[10px]" : "bg-[#E0E0E0] text-[#666666] text-[10px]"}>
                    {user.role}
                  </Badge>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-[#666666] flex items-center gap-1 justify-end mb-1"><Wallet size={12} />Balance</p>
                <p className="text-3xl font-extrabold text-[#1A1A2E] tabular-nums">{formatNaira(user.balance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Record Deposit */}
          <Card>
            <CardHeader><CardTitle className="text-base text-[#1A1A2E]">Record Deposit</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onRecordDeposit)} className="space-y-4">
                <div className="space-y-1">
                  <Label>Amount (₦)</Label>
                  <Input type="number" placeholder="0" {...register("amount", { valueAsNumber: true })} className={errors.amount ? "border-[#E74C3C]" : ""} />
                  {errors.amount && <p className="text-xs text-[#E74C3C]">{errors.amount.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Description <span className="text-[#666666] font-normal">(optional)</span></Label>
                  <Input placeholder="e.g. Monthly savings deposit" {...register("description")} />
                </div>
                <div className="space-y-1">
                  <Label>Reference <span className="text-[#666666] font-normal">(optional)</span></Label>
                  <Input placeholder="e.g. Bank transfer ref" {...register("reference")} />
                </div>
                <div className="space-y-1">
                  <Label>Allocate to Target <span className="text-[#666666] font-normal">(optional)</span></Label>
                  <select {...register("target_id")} className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C2185B]/30">
                    <option value="">No specific target</option>
                    {targets.filter((t) => t.status === "active").map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({getSavingsProgress(t.current_amount, t.target_amount)}%)</option>
                    ))}
                  </select>
                </div>
                <Button type="submit" disabled={submitting} className="w-full bg-[#C2185B] hover:bg-[#a31545] text-white">
                  {submitting ? "Recording…" : "Record Deposit"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Savings targets */}
          <Card>
            <CardHeader><CardTitle className="text-base text-[#1A1A2E]">Savings Targets</CardTitle></CardHeader>
            <CardContent>
              {targets.length === 0 ? (
                <p className="text-sm text-[#666666] py-4 text-center">No savings targets yet.</p>
              ) : (
                <div className="space-y-4">
                  {targets.map((t) => {
                    const pct = getSavingsProgress(t.current_amount, t.target_amount);
                    return (
                      <div key={t.id} className="space-y-1.5">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-sm font-medium text-[#1A1A2E] truncate">{t.name}</span>
                          <Badge className={t.status === "completed" ? "bg-[#27AE60]/10 text-[#27AE60] text-[10px] shrink-0" : t.status === "cancelled" ? "bg-[#E0E0E0] text-[#666666] text-[10px] shrink-0" : "bg-[#C2185B]/10 text-[#C2185B] text-[10px] shrink-0"}>
                            {t.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-[#666666]">
                          <span>{formatNaira(Number(t.current_amount))}</span>
                          <span>{pct}% of {formatNaira(Number(t.target_amount))}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#E0E0E0] overflow-hidden">
                          <div className="h-full rounded-full bg-[#C2185B] transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        {t.deadline && <p className="text-xs text-[#666666]">Deadline: {formatDate(t.deadline)}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Transaction history */}
        <Card>
          <CardHeader><CardTitle className="text-base text-[#1A1A2E]">Transaction History</CardTitle></CardHeader>
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <p className="text-sm text-[#666666] py-8 text-center">No transactions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#FAFAFA] border-y border-[#E0E0E0]">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666]">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666]">Type</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666]">Amount</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] hidden md:table-cell">Description</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E0E0E0]">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#FAFAFA]">
                        <td className="px-4 py-3 text-[#666666] whitespace-nowrap text-xs">{formatDateTime(tx.created_at)}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1.5">
                            {tx.type === "deposit" ? <ArrowDownLeft size={13} className="text-[#27AE60]" /> : <ArrowUpRight size={13} className="text-[#F39C12]" />}
                            <span className="capitalize text-[#1A1A2E]">{tx.type}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold tabular-nums text-[#1A1A2E]">{formatNaira(Number(tx.amount))}</td>
                        <td className="px-4 py-3 text-[#666666] hidden md:table-cell max-w-xs truncate">{tx.description ?? "—"}</td>
                        <td className="px-4 py-3">
                          <Badge className={`${STATUS_BADGE[tx.status] ?? ""} text-[10px]`}>{tx.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Withdrawal requests */}
        <Card>
          <CardHeader><CardTitle className="text-base text-[#1A1A2E]">Withdrawal Requests</CardTitle></CardHeader>
          <CardContent className="p-0">
            {withdrawals.length === 0 ? (
              <p className="text-sm text-[#666666] py-8 text-center">No withdrawal requests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#FAFAFA] border-y border-[#E0E0E0]">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666]">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666]">Amount</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] hidden md:table-cell">Bank</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666]">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] hidden md:table-cell">Admin Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E0E0E0]">
                    {withdrawals.map((wr) => {
                      const StatusIcon = wr.status === "completed" ? CheckCircle2 : wr.status === "rejected" ? XCircle : Clock;
                      return (
                        <tr key={wr.id} className="hover:bg-[#FAFAFA]">
                          <td className="px-4 py-3 text-[#666666] whitespace-nowrap text-xs">{formatDateTime(wr.created_at)}</td>
                          <td className="px-4 py-3 font-semibold tabular-nums text-[#1A1A2E]">{formatNaira(Number(wr.amount))}</td>
                          <td className="px-4 py-3 text-[#666666] hidden md:table-cell">
                            <span className="block">{wr.bank_name}</span>
                            <span className="text-xs">{wr.bank_account_number}</span>
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={`${STATUS_BADGE[wr.status] ?? ""} text-[10px] flex items-center gap-1 w-fit`}>
                              <StatusIcon size={10} />{wr.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-[#666666] hidden md:table-cell max-w-xs truncate">{wr.admin_note ?? "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
