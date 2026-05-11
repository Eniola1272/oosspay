"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, CreditCard, Settings,
  ExternalLink, LogOut, Inbox, ScrollText,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "@/components/shared/Logo";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

const ADMIN_NAV = [
  { href: "/admin",             label: "Dashboard",    icon: LayoutDashboard, exact: true },
  { href: "/admin/users",       label: "Users",         icon: Users },
  { href: "/admin/deposits",    label: "Deposits",      icon: Inbox },
  { href: "/admin/withdrawals", label: "Withdrawals",   icon: CreditCard },
  { href: "/admin/settings",    label: "Settings",      icon: Settings },
];

const SUPER_ADMIN_NAV = [
  { href: "/admin",             label: "Dashboard",    icon: LayoutDashboard, exact: true },
  { href: "/admin/users",       label: "Users",         icon: Users },
  { href: "/admin/deposits",    label: "Deposits",      icon: Inbox },
  { href: "/admin/withdrawals", label: "Withdrawals",   icon: CreditCard },
  { href: "/admin/activity",    label: "Activity Log",  icon: ScrollText },
  { href: "/admin/settings",    label: "Settings",      icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut, isSuperAdmin } = useAuth();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [pendingDeposits, setPendingDeposits] = useState(0);

  const navItems = isSuperAdmin ? SUPER_ADMIN_NAV : ADMIN_NAV;

  useEffect(() => {
    const supabase = createClient();
    async function loadCount() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count } = await (supabase as any)
        .from("transactions")
        .select("*", { count: "exact", head: true })
        .eq("type", "deposit")
        .eq("status", "pending");
      setPendingDeposits(count ?? 0);
    }
    loadCount();
  }, []);

  async function handleLogout() {
    await signOut();
    window.location.href = "/";
  }

  return (
    <>
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-[#1A1A2E] fixed left-0 top-0 bottom-0 z-40">
        <div className="p-6 border-b border-white/10">
          <Logo variant="white" showTagline size="md" />
          <Badge className={`mt-2 text-white text-[10px] ${
            isSuperAdmin ? "bg-amber-500" : "bg-[#C2185B]"
          }`}>
            {isSuperAdmin ? "Super Admin" : "Admin"}
          </Badge>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            const showDepositBadge = href === "/admin/deposits" && pendingDeposits > 0;
            const isActivityLog = href === "/admin/activity";

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? isActivityLog
                      ? "bg-amber-500/20 text-amber-400 border-l-4 border-amber-400 pl-2"
                      : "bg-[#C2185B]/20 text-[#C2185B] border-l-4 border-[#C2185B] pl-2"
                    : isActivityLog
                    ? "text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/10"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                {showDepositBadge && (
                  <span className="bg-[#F39C12] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {pendingDeposits}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-white/10 mt-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <ExternalLink size={18} />
              <span>User View</span>
            </Link>
          </div>
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 w-full transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Log out?</DialogTitle>
            <DialogDescription>You will be signed out of the admin panel.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-2">
            <Button variant="outline" onClick={() => setLogoutOpen(false)}>Cancel</Button>
            <Button onClick={handleLogout} className="bg-[#E74C3C] hover:bg-red-700 text-white">Log out</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
