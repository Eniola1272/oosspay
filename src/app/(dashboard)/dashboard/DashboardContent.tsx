"use client";

import Link from "next/link";
import { Copy, CheckCircle2, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { SavingsTargetCard, SavingsTargetCardSkeleton } from "@/components/dashboard/SavingsTargetCard";
import { NotificationItem } from "@/components/dashboard/NotificationItem";
import { useAuth } from "@/context/AuthContext";
import { useSavingsTargets } from "@/hooks/useSavingsTargets";
import { useNotifications } from "@/hooks/useNotifications";
import { createClient } from "@/lib/supabase/client";
import { getGreeting } from "@/lib/utils";
import type { DepositAccountDetails } from "@/types";

function DepositAccountCard() {
  const supabase = createClient();
  const [details, setDetails] = useState<DepositAccountDetails | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from("platform_settings").select("value").eq("key", "deposit_account_details").single()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }: { data: any }) => {
        if (data?.value) setDetails(data.value as DepositAccountDetails);
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

  if (!details?.bank_name) return null;

  return (
    <Card id="deposit-details" className="border-[#C2185B]/20 bg-[#FCE4EC]/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-[#1A1A2E]">Save to Your OOSSPAY Account</CardTitle>
        <p className="text-xs text-[#666666]">
          Transfer your savings to the account below. Your balance will be updated once confirmed by our team.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <span className="text-[#666666]">Bank Name</span>
          <span className="font-semibold text-[#1A1A2E]">{details.bank_name || "—"}</span>
          <span className="text-[#666666]">Account Number</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1A1A2E] tabular-nums">{details.account_number || "—"}</span>
            {details.account_number && (
              <button onClick={copyAccount} className="text-[#C2185B] hover:text-[#a31545]">
                {copied ? <CheckCircle2 size={14} className="text-[#27AE60]" /> : <Copy size={14} />}
              </button>
            )}
          </div>
          <span className="text-[#666666]">Account Name</span>
          <span className="font-semibold text-[#1A1A2E]">{details.account_name || "—"}</span>
        </div>
        <p className="text-xs text-[#666666] border-t border-[#E0E0E0] pt-2">
          {details.additional_info ?? "After transferring, your balance typically updates within 1–2 hours during business hours."}
        </p>
      </CardContent>
    </Card>
  );
}

export function DashboardContent() {
  const { profile, isLoading: authLoading } = useAuth();
  const { targets, isLoading: targetsLoading } = useSavingsTargets();
  const { notifications, isLoading: notifsLoading } = useNotifications();

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  const activeTargets = targets.filter((t) => t.status === "active").slice(0, 2);
  const recentNotifs = notifications.filter((n) => !n.is_read).slice(0, 3);

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      {/* Greeting */}
      <div>
        {authLoading ? (
          <Skeleton className="h-8 w-64" />
        ) : (
          <h1 className="text-2xl font-extrabold text-[#1A1A2E]">
            {getGreeting()}, {firstName}! 🌟
          </h1>
        )}
        <p className="text-sm text-[#666666] mt-1">Here&apos;s a snapshot of your savings journey.</p>
      </div>

      {/* Balance */}
      <BalanceCard />

      {/* Deposit account details */}
      <DepositAccountCard />

      {/* Savings targets quick view */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#1A1A2E]">My Savings Targets</h2>
          <Link href="/savings" className="text-sm text-[#C2185B] hover:underline font-medium">
            View All →
          </Link>
        </div>
        {targetsLoading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <SavingsTargetCardSkeleton /><SavingsTargetCardSkeleton />
          </div>
        ) : activeTargets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E0E0E0] p-8 text-center space-y-3">
            <Target size={36} className="text-[#C2185B]/40 mx-auto" />
            <p className="font-medium text-[#1A1A2E]">You haven&apos;t set any savings targets yet</p>
            <p className="text-sm text-[#666666]">Setting a goal makes saving 3x more effective.</p>
            <Link href="/savings" className="inline-block mt-2 bg-[#C2185B] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#a31545]">
              Create Your First Target
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {activeTargets.map((t) => <SavingsTargetCard key={t.id} target={t} />)}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#1A1A2E]">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionList limit={5} />
        </CardContent>
      </Card>

      {/* Notifications preview */}
      {!notifsLoading && recentNotifs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#1A1A2E]">
              Notifications <Badge className="ml-1 bg-[#C2185B] text-white text-[10px]">{recentNotifs.length}</Badge>
            </h2>
            <Link href="/notifications" className="text-sm text-[#C2185B] hover:underline font-medium">View All</Link>
          </div>
          <div className="rounded-xl border border-[#E0E0E0] overflow-hidden">
            {recentNotifs.map((n) => <NotificationItem key={n.id} notification={n} />)}
          </div>
        </div>
      )}
    </div>
  );
}
