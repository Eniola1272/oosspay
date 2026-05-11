"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { createClient } from "@/lib/supabase/client";
import { formatNaira, formatDate, getInitials } from "@/lib/utils";
import type { Profile } from "@/types";

interface UserWithBalance extends Profile { balance: number }

export default function SuperAdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserWithBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any).from("profiles").select("*").order("created_at", { ascending: false });
      const profiles: Profile[] = data ?? [];
      const withBalances = await Promise.all(profiles.map(async (p) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: balData } = await (supabase as any).rpc("get_user_balance", { p_user_id: p.id });
        return { ...p, balance: Number(balData ?? 0) };
      }));
      setUsers(withBalances);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q);
  });

  return (
    <div>
      <AdminTopBar title="Manage Users" subtitle={`${users.length} registered members`} />

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-5">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
          <Input placeholder="Search by name, email or phone…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="rounded-2xl border border-[#E0E0E0] overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666]">Member</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] hidden md:table-cell">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666]">Balance</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] hidden md:table-cell">Joined</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666]">Role</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0]">
                {loading ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-4"><div className="flex items-center gap-3"><Skeleton className="w-8 h-8 rounded-full" /><Skeleton className="h-4 w-32" /></div></td>
                    <td className="px-4 py-4 hidden md:table-cell"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-4 py-4 hidden md:table-cell"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-12 rounded-full" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-8 w-16 rounded-lg" /></td>
                  </tr>
                )) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-[#666666]">No users found.</td></tr>
                ) : filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAFAFA] cursor-pointer" onClick={() => router.push(`/dashboard/super-admin/users/${u.id}`)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {getInitials(u.full_name)}
                        </div>
                        <div>
                          <p className="font-medium text-[#1A1A2E]">{u.full_name}</p>
                          <p className="text-xs text-[#666666]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#666666] hidden md:table-cell">{u.phone ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold text-[#1A1A2E] tabular-nums">{formatNaira(u.balance)}</td>
                    <td className="px-4 py-3 text-[#666666] hidden md:table-cell">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3">
                      <Badge className={u.role === "admin" || u.role === "super_admin" ? "bg-amber-500 text-white text-[10px]" : "bg-[#E0E0E0] text-[#666666] text-[10px]"}>{u.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="ghost" className="text-amber-600 hover:bg-amber-50">
                        View <ChevronRight size={14} className="ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
