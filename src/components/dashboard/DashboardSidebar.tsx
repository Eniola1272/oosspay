"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, Wallet, Bell, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/savings", label: "My Savings", icon: Target },
  { href: "/withdraw", label: "Withdraw", icon: Wallet },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const [logoutOpen, setLogoutOpen] = useState(false);

  async function handleLogout() {
    await signOut();
    window.location.href = "/";
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-[#1A1A2E] fixed left-0 top-0 bottom-0 z-40">
        <div className="p-6 border-b border-white/10">
          <Logo variant="white" showTagline size="md" />
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-[#C2185B]/20 text-[#C2185B] border-l-4 border-[#C2185B] pl-2"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon size={18} />
                <span>{label}</span>
                {label === "Notifications" && unreadCount > 0 && (
                  <Badge className="ml-auto bg-[#C2185B] text-white text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Link>
            );
          })}
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

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E0E0E0] flex">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors relative",
                active ? "text-[#C2185B]" : "text-[#666666]"
              )}
            >
              <div className="relative">
                <Icon size={20} />
                {label === "Notifications" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C2185B] text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout confirmation dialog */}
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Log out?</DialogTitle>
            <DialogDescription>You will be taken back to the login page.</DialogDescription>
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
