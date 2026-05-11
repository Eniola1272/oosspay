"use client";

import { useEffect, useState } from "react";
import { Users, PiggyBank, Clock, TrendingUp, ArrowDownLeft, ArrowUpRight, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { formatNaira, formatDateTime } from "@/lib/utils";

interface Stats {
  totalUsers: number;
  totalSavings: number;
  pendingWithdrawals: number;
  todayDeposits: number;
}

interface ActivityItem {
  id: string;
  type: "deposit" | "withdrawal_request" | "new_user";
  description: string;
  amount?: number;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setActivity(data.activity);
      }
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: "Total Users",          value: stats?.totalUsers ?? 0,          icon: Users,      color: "text-blue-500 bg-blue-50",          fmt: (v: number) => v.toLocaleString() },
    { label: "Total Savings",         value: stats?.totalSavings ?? 0,         icon: PiggyBank,  color: "text-[#27AE60] bg-[#27AE60]/10",    fmt: (v: number) => formatNaira(v) },
    { label: "Pending Withdrawals",   value: stats?.pendingWithdrawals ?? 0,   icon: Clock,      color: "text-[#F39C12] bg-[#F39C12]/10",    fmt: (v: number) => v.toLocaleString() },
    { label: "Today's Deposits",      value: stats?.todayDeposits ?? 0,        icon: TrendingUp, color: "text-[#C2185B] bg-[#FCE4EC]",       fmt: (v: number) => formatNaira(v) },
  ];

  return (
    <div>
      <AdminTopBar title="Admin Overview" subtitle="Platform activity at a glance." />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, color, fmt }) => (
            <Card key={label} className="border-[#E0E0E0]">
              <CardContent className="p-5 space-y-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={20} />
                </div>
                {loading ? <Skeleton className="h-7 w-24" /> : (
                  <p className="text-2xl font-extrabold text-[#1A1A2E] tabular-nums">{fmt(value)}</p>
                )}
                <p className="text-xs text-[#666666]">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="px-6 py-4 border-b border-[#E0E0E0]">
              <h2 className="font-bold text-[#1A1A2E]">Recent Activity</h2>
            </div>
            {loading ? (
              <div className="divide-y divide-[#E0E0E0]">
                {[0,1,2,3,4].map((i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activity.length === 0 ? (
              <div className="py-12 text-center text-[#666666] text-sm">No recent activity.</div>
            ) : (
              <div className="divide-y divide-[#E0E0E0]">
                {activity.map((item) => {
                  const Icon = item.type === "deposit" ? ArrowDownLeft : item.type === "withdrawal_request" ? ArrowUpRight : UserPlus;
                  const iconColor = item.type === "deposit" ? "text-[#27AE60] bg-[#27AE60]/10" : item.type === "withdrawal_request" ? "text-[#F39C12] bg-[#F39C12]/10" : "text-blue-500 bg-blue-50";
                  return (
                    <div key={item.id} className="px-6 py-4 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconColor}`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#1A1A2E]">{item.description}</p>
                        <p className="text-xs text-[#666666]">{formatDateTime(item.created_at)}</p>
                      </div>
                      {item.amount != null && (
                        <span className="text-sm font-bold tabular-nums text-[#1A1A2E] shrink-0">
                          {formatNaira(item.amount)}
                        </span>
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
  );
}
