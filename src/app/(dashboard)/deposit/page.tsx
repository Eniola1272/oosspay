"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import {
  CheckCircle, Upload, X, ImageIcon, ArrowDownLeft,
  Clock, CheckCircle2, XCircle, Copy, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { depositRequestSchema, type DepositRequestInput } from "@/lib/validations";
import { formatNaira, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { TransactionStatus } from "@/types";

const STATUS_CONFIG: Record<TransactionStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending:   { label: "Pending",   color: "bg-[#F39C12]/10 text-[#F39C12]", icon: Clock },
  completed: { label: "Confirmed", color: "bg-[#27AE60]/10 text-[#27AE60]", icon: CheckCircle2 },
  failed:    { label: "Rejected",  color: "bg-[#E74C3C]/10 text-[#E74C3C]", icon: XCircle },
};

function useDepositAccount() {
  const [details, setDetails] = useState<{
    bank_name: string;
    account_number: string;
    account_name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from("platform_settings")
        .select("value")
        .eq("key", "deposit_account_details")
        .single();
      if (data?.value) {
        setDetails(data.value as { bank_name: string; account_number: string; account_name: string });
      }
      setLoading(false);
    }
    load();
  }, []);

  return { details, loading };
}

export default function DepositPage() {
  const { user } = useAuth();
  const { transactions, isLoading: historyLoading, refetch } = useTransactions(50);
  const { details: accountDetails, loading: accountLoading } = useDepositAccount();
  const supabase = createClient();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deposits = transactions.filter((tx) => tx.type === "deposit");

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<DepositRequestInput>({
    resolver: zodResolver(depositRequestSchema),
    defaultValues: {
      deposit_date: new Date().toISOString().split("T")[0],
    },
  });

  const amount = watch("amount", 0);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Receipt image must be under 5MB");
      return;
    }
    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setReceiptPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function copyAccountNumber() {
    if (!accountDetails?.account_number) return;
    navigator.clipboard.writeText(accountDetails.account_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function onSubmit(data: DepositRequestInput) {
    if (!user) return;
    setLoading(true);

    let receipt_url: string | null = null;

    if (receiptFile) {
      const ext = receiptFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: uploadError } = await (supabase as any).storage
        .from("receipts")
        .upload(path, receiptFile);

      if (uploadError) {
        toast.error("Failed to upload receipt. Please try again.");
        setLoading(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: urlData } = (supabase as any).storage
        .from("receipts")
        .getPublicUrl(path);
      receipt_url = urlData.publicUrl;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("transactions").insert({
      user_id: user.id,
      type: "deposit",
      amount: data.amount,
      description: data.description || "Savings Deposit",
      deposit_request_date: data.deposit_date,
      receipt_url,
      status: "pending",
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setSubmitted(true);
    refetch();
    reset();
    setReceiptFile(null);
    setReceiptPreview(null);
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 lg:pb-6">
      <DashboardTopBar
        title="Deposit Funds"
        subtitle="Transfer to our account, then submit a deposit request below."
      />
      <div className="p-5 lg:p-6 space-y-6">
        <div className="grid lg:grid-cols-2 gap-6 items-start">

          {/* Left column: instructions + form */}
          <div className="space-y-4">

            {/* Step 1: Account details */}
            <Card className="bg-[#FAFAFA] border-[#E0E0E0]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#1A1A2E] flex items-center gap-2">
                  <ArrowDownLeft size={15} className="text-[#C2185B]" />
                  Step 1 — Transfer to this account
                </CardTitle>
              </CardHeader>
              <CardContent>
                {accountLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : accountDetails ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[#666666]">Bank</span>
                      <span className="font-semibold text-[#1A1A2E]">{accountDetails.bank_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#666666]">Account No.</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1A1A2E] tabular-nums">{accountDetails.account_number}</span>
                        <button
                          onClick={copyAccountNumber}
                          className="p-1 rounded text-[#666666] hover:text-[#C2185B] transition-colors"
                          title="Copy"
                        >
                          {copied
                            ? <Check size={13} className="text-[#27AE60]" />
                            : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#666666]">Account Name</span>
                      <span className="font-semibold text-[#1A1A2E]">{accountDetails.account_name}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#666666]">
                    Account details not configured yet. Contact support.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Deposit request form */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-[#1A1A2E]">
                  Step 2 — Submit your deposit request
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="py-8 text-center space-y-4">
                    <CheckCircle size={48} className="text-[#27AE60] mx-auto" />
                    <div>
                      <p className="font-bold text-lg text-[#1A1A2E]">Request Submitted!</p>
                      <p className="text-sm text-[#666666] mt-2 leading-relaxed max-w-sm mx-auto">
                        Your deposit request is being reviewed. You&apos;ll be notified once
                        it&apos;s confirmed — typically within 1–2 hours during business hours.
                      </p>
                    </div>
                    <Button
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="border-[#C2185B] text-[#C2185B]"
                    >
                      Submit Another Request
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div className="space-y-1">
                      <Label>Amount Transferred (₦)</Label>
                      <Input
                        type="number"
                        placeholder="Enter the exact amount you transferred"
                        {...register("amount", { valueAsNumber: true })}
                        className={errors.amount ? "border-[#E74C3C]" : ""}
                      />
                      {errors.amount && (
                        <p className="text-xs text-[#E74C3C]">{errors.amount.message}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label>Date of Transfer</Label>
                      <Input
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        {...register("deposit_date")}
                        className={errors.deposit_date ? "border-[#E74C3C]" : ""}
                      />
                      {errors.deposit_date && (
                        <p className="text-xs text-[#E74C3C]">{errors.deposit_date.message}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label>
                        Reference / Description{" "}
                        <span className="text-[#999999] font-normal">(optional)</span>
                      </Label>
                      <Input
                        placeholder="e.g. April savings, Week 2 deposit"
                        {...register("description")}
                      />
                    </div>

                    {/* Receipt upload */}
                    <div className="space-y-1">
                      <Label>
                        Receipt Image{" "}
                        <span className="text-[#999999] font-normal">(optional but recommended)</span>
                      </Label>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      {receiptPreview ? (
                        <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={receiptPreview}
                            alt="Receipt preview"
                            className="w-full max-h-48 object-contain rounded-xl border border-[#E0E0E0] bg-[#FAFAFA]"
                          />
                          <button
                            type="button"
                            onClick={() => { setReceiptFile(null); setReceiptPreview(null); }}
                            className="absolute top-2 right-2 p-1 bg-white rounded-full border border-[#E0E0E0] shadow-sm text-[#666666] hover:text-[#E74C3C]"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-[#E0E0E0] hover:border-[#C2185B]/50 rounded-xl p-6 flex flex-col items-center gap-2 text-[#666666] hover:text-[#C2185B] transition-colors"
                        >
                          <Upload size={24} />
                          <span className="text-sm font-medium">Upload receipt photo</span>
                          <span className="text-xs text-[#999999]">JPG, PNG or HEIC · Max 5MB</span>
                        </button>
                      )}
                    </div>

                    {/* Pre-submission summary */}
                    {(amount ?? 0) > 0 && (
                      <div className="bg-[#FAFAFA] border border-[#E0E0E0] rounded-xl p-4 text-sm text-[#666666] leading-relaxed">
                        You are submitting a deposit request for{" "}
                        <strong className="text-[#1A1A2E]">{formatNaira(amount)}</strong>.
                        Our team will verify your receipt and confirm the deposit.
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#C2185B] hover:bg-[#a31545] text-white"
                    >
                      {loading ? "Submitting…" : "Submit Deposit Request"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column: deposit history */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-[#1A1A2E]">Deposit History</CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
                </div>
              ) : deposits.length === 0 ? (
                <div className="py-8 text-center">
                  <ImageIcon size={36} className="text-[#666666]/30 mx-auto mb-3" />
                  <p className="font-medium text-[#1A1A2E]">No deposit requests yet</p>
                  <p className="text-sm text-[#666666] mt-1">
                    Your deposit history will appear here once you submit a request.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {deposits.map((tx) => {
                    const cfg = STATUS_CONFIG[tx.status];
                    const Icon = cfg.icon;
                    return (
                      <div key={tx.id} className="border border-[#E0E0E0] rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold tabular-nums ${
                            tx.status === "pending" ? "text-[#999999]" : "text-[#1A1A2E]"
                          }`}>
                            {tx.status === "pending" ? "" : "+"}{formatNaira(tx.amount)}
                          </span>
                          <Badge className={`text-[10px] font-semibold flex items-center gap-1 ${cfg.color}`}>
                            <Icon size={10} /> {cfg.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#666666]">{tx.description ?? "Savings Deposit"}</p>
                        {tx.deposit_request_date && (
                          <p className="text-xs text-[#666666]">
                            Transferred: {formatDate(tx.deposit_request_date)}
                          </p>
                        )}
                        <p className="text-xs text-[#999999]">Submitted {formatDate(tx.created_at)}</p>
                        {tx.receipt_url && (
                          <a
                            href={tx.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#C2185B] hover:underline flex items-center gap-1"
                          >
                            <ImageIcon size={11} /> View receipt
                          </a>
                        )}
                        {tx.admin_note && (
                          <p className="text-xs bg-[#E74C3C]/5 text-[#E74C3C] rounded-lg px-3 py-2">
                            Note: {tx.admin_note}
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
