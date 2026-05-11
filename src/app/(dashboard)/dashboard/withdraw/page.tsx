"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBalance } from "@/hooks/useBalance";
import { useWithdrawals } from "@/hooks/useWithdrawals";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import { withdrawalSchema, type WithdrawalInput } from "@/lib/validations";
import { formatNaira, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { WithdrawalStatus } from "@/types";

const NIGERIAN_BANKS = [
  "Access Bank","Citibank","Ecobank","FCMB","Fidelity Bank","First Bank","GTBank","Heritage Bank",
  "Jaiz Bank","Keystone Bank","Kuda Bank","Opay","PalmPay","Polaris Bank","Providus Bank",
  "Stanbic IBTC","Standard Chartered","Sterling Bank","SunTrust Bank","UBA","Union Bank",
  "Unity Bank","Wema Bank","Zenith Bank",
];

const statusConfig: Record<WithdrawalStatus, { label: string; color: string }> = {
  pending:    { label: "Pending",    color: "bg-[#F39C12]/10 text-[#F39C12]" },
  approved:   { label: "Approved",   color: "bg-blue-50 text-blue-600" },
  processing: { label: "Processing", color: "bg-blue-50 text-blue-600" },
  completed:  { label: "Completed",  color: "bg-[#27AE60]/10 text-[#27AE60]" },
  rejected:   { label: "Rejected",   color: "bg-[#E74C3C]/10 text-[#E74C3C]" },
};

export default function WithdrawPage() {
  const { user } = useAuth();
  const { profile } = useUser();
  const { balance, isLoading: balanceLoading } = useBalance();
  const { withdrawals, isLoading: historyLoading, refetch } = useWithdrawals();
  const supabase = createClient();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<WithdrawalInput>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      bank_name: profile?.bank_name ?? "",
      bank_account_number: profile?.bank_account_number ?? "",
      bank_account_name: profile?.bank_account_name ?? "",
    },
  });

  const amount = watch("amount", 0);
  const bankName = watch("bank_name", "");
  const accountName = watch("bank_account_name", "");
  const accountNumber = watch("bank_account_number", "");

  async function onSubmit(data: WithdrawalInput) {
    if (!user) return;
    if (data.amount > balance) { toast.error("Withdrawal amount exceeds your available balance."); return; }
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("withdrawal_requests").insert({
      user_id: user.id,
      amount: data.amount,
      bank_name: data.bank_name,
      bank_account_number: data.bank_account_number,
      bank_account_name: data.bank_account_name,
      reason: data.reason || null,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setSubmitted(true);
    refetch();
    reset();
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 lg:pb-6">
      <DashboardTopBar title="Withdraw Funds" subtitle="Your money is yours. Request a withdrawal and our team will process it promptly." />
      <div className="p-5 lg:p-6 space-y-6">

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[#1A1A2E]">Withdrawal Request</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#666666]">Available Balance:</span>
              {balanceLoading ? <Skeleton className="h-4 w-28" /> : (
                <span className="text-sm font-bold text-[#27AE60] tabular-nums">{formatNaira(balance)}</span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle size={48} className="text-[#27AE60] mx-auto" />
                <div>
                  <p className="font-bold text-lg text-[#1A1A2E]">Withdrawal Request Submitted!</p>
                  <p className="text-sm text-[#666666] mt-2 leading-relaxed max-w-sm mx-auto">
                    Your request is now being reviewed by our team. You&apos;ll receive a notification when it&apos;s processed. Most withdrawals are completed within 24 hours during business days.
                  </p>
                </div>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="border-[#C2185B] text-[#C2185B]">
                  Make Another Request
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <Label>Amount (₦)</Label>
                  <Input type="number" placeholder="Enter amount to withdraw"
                    {...register("amount", { valueAsNumber: true })}
                    className={errors.amount ? "border-[#E74C3C]" : ""} />
                  {errors.amount && <p className="text-xs text-[#E74C3C]">{errors.amount.message}</p>}
                  {amount > 0 && amount <= balance && (
                    <p className="text-xs text-[#666666]">Balance after withdrawal: <span className="font-semibold text-[#1A1A2E]">{formatNaira(balance - amount)}</span></p>
                  )}
                  {amount > balance && (
                    <p className="text-xs text-[#E74C3C]">Amount exceeds your available balance.</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>Bank Name</Label>
                  <select
                    {...register("bank_name")}
                    className={`w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C2185B]/30 ${errors.bank_name ? "border-[#E74C3C]" : "border-[#E0E0E0]"}`}
                  >
                    <option value="">Select your bank</option>
                    {NIGERIAN_BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {errors.bank_name && <p className="text-xs text-[#E74C3C]">{errors.bank_name.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label>Account Number</Label>
                  <Input placeholder="Enter 10-digit account number" maxLength={10}
                    {...register("bank_account_number")}
                    className={errors.bank_account_number ? "border-[#E74C3C]" : ""} />
                  {errors.bank_account_number && <p className="text-xs text-[#E74C3C]">{errors.bank_account_number.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label>Account Name</Label>
                  <Input placeholder="Account holder name"
                    {...register("bank_account_name")}
                    className={errors.bank_account_name ? "border-[#E74C3C]" : ""} />
                  {errors.bank_account_name && <p className="text-xs text-[#E74C3C]">{errors.bank_account_name.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label>Reason (Optional)</Label>
                  <Textarea placeholder="Why are you withdrawing? (optional)" rows={2}
                    {...register("reason")} className="resize-none" />
                </div>

                {/* Summary preview */}
                {amount > 0 && bankName && accountName && accountNumber.length === 10 && (
                  <div className="bg-[#FAFAFA] border border-[#E0E0E0] rounded-xl p-4 text-sm text-[#666666] leading-relaxed">
                    You are requesting a withdrawal of{" "}
                    <strong className="text-[#1A1A2E]">{formatNaira(amount)}</strong> to{" "}
                    <strong className="text-[#1A1A2E]">{accountName}</strong> at{" "}
                    <strong className="text-[#1A1A2E]">{bankName}</strong>{" "}
                    (••••••{accountNumber.slice(-4)}). Your remaining balance will be{" "}
                    <strong className="text-[#1A1A2E]">{formatNaira(Math.max(0, balance - amount))}</strong>.
                  </div>
                )}

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => reset()} className="flex-1">Cancel</Button>
                  <Button type="submit" disabled={loading} className="flex-1 bg-[#C2185B] hover:bg-[#a31545] text-white">
                    {loading ? "Submitting…" : "Submit Withdrawal Request"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* History */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[#1A1A2E]">Withdrawal History</CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="space-y-3">
                {[0,1,2].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
              </div>
            ) : withdrawals.length === 0 ? (
              <div className="py-8 text-center">
                <ArrowUpRight size={36} className="text-[#666666]/30 mx-auto mb-3" />
                <p className="font-medium text-[#1A1A2E]">No withdrawal requests yet</p>
                <p className="text-sm text-[#666666] mt-1">Your withdrawal history will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {withdrawals.map((w) => {
                  const cfg = statusConfig[w.status];
                  return (
                    <div key={w.id} className="border border-[#E0E0E0] rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1A1A2E] tabular-nums">{formatNaira(w.amount)}</span>
                        <Badge className={`text-[10px] font-semibold ${cfg.color}`}>{cfg.label}</Badge>
                      </div>
                      <p className="text-xs text-[#666666]">{w.bank_name} · ••••{w.bank_account_number.slice(-4)}</p>
                      <p className="text-xs text-[#666666]">{formatDate(w.created_at)}</p>
                      {w.admin_note && (
                        <p className="text-xs bg-[#E74C3C]/5 text-[#E74C3C] rounded-lg px-3 py-2">
                          Admin note: {w.admin_note}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
