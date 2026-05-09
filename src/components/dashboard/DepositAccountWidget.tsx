"use client";

import { useState, useEffect } from "react";
import { Copy, CheckCircle2, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import type { DepositAccountDetails } from "@/types";

export function DepositAccountWidget() {
  const supabase = createClient();
  const [details, setDetails] = useState<DepositAccountDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("platform_settings")
      .select("value")
      .eq("key", "deposit_account_details")
      .single()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }: { data: any }) => {
        if (data?.value) setDetails(data.value as DepositAccountDetails);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function copyAccount() {
    if (details?.account_number) {
      navigator.clipboard.writeText(details.account_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div id="deposit-details" className="bg-white rounded-2xl border border-[#EBEBEB] p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#FCE4EC] flex items-center justify-center">
          <Building2 size={16} className="text-[#C2185B]" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#1A1A2E]">Save to OOSSPAY</p>
          <p className="text-[10px] text-[#999999]">Transfer to the account below</p>
        </div>
      </div>

      {/* Account details */}
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ) : !details?.bank_name ? (
        <p className="text-xs text-[#999999] italic">Deposit details not configured yet. Contact admin.</p>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
            <span className="text-[#999999]">Bank</span>
            <span className="font-semibold text-[#1A1A2E]">{details.bank_name}</span>

            <span className="text-[#999999]">Account No.</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1A1A2E] tabular-nums tracking-wider">{details.account_number}</span>
              <button
                onClick={copyAccount}
                className="text-[#C2185B] hover:text-[#a31545] transition-colors"
                title="Copy account number"
              >
                {copied
                  ? <CheckCircle2 size={14} className="text-[#27AE60]" />
                  : <Copy size={14} />}
              </button>
            </div>

            <span className="text-[#999999]">Account Name</span>
            <span className="font-semibold text-[#1A1A2E]">{details.account_name}</span>
          </div>

          <p className="text-[10px] text-[#999999] border-t border-[#F0F0F0] pt-2 leading-relaxed">
            {details.additional_info ?? "Balances typically update within 1–2 hours during business hours."}
          </p>
        </div>
      )}
    </div>
  );
}
