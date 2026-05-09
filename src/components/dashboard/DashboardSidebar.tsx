"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Target, Wallet, Bell, User,
  LogOut, ChevronLeft, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useSidebar } from "./SidebarContext";

const NAV_ITEMS = [
  { href: "/dashboard",      label: "Dashboard",   icon: LayoutDashboard },
  { href: "/savings",        label: "My Savings",  icon: Target },
  { href: "/withdraw",       label: "Withdraw",    icon: Wallet },
  { href: "/notifications",  label: "Notifications", icon: Bell },
  { href: "/profile",        label: "Profile",     icon: User },
];

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  collapsed: boolean;
  badge?: number;
}

function NavItem({ href, label, icon: Icon, collapsed, badge }: NavItemProps) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg text-sm font-medium transition-all relative",
        collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
        active
          ? "bg-white/15 text-white border-l-4 border-[#C2185B] pl-2"
          : "text-white/65 hover:text-white hover:bg-white/10"
      )}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="flex-1">{label}</span>}
      {badge && badge > 0 && !collapsed && (
        <Badge className="bg-[#C2185B] text-white text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center">
          {badge > 9 ? "9+" : badge}
        </Badge>
      )}
      {badge && badge > 0 && collapsed && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C2185B] rounded-full" />
      )}
    </Link>
  );
}

export function DashboardSidebar() {
  const { profile, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebar();
  const [logoutOpen, setLogoutOpen] = useState(false);

  async function handleLogout() {
    await signOut();
    window.location.href = "/";
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col min-h-screen bg-[#1A1A2E] fixed left-0 top-0 bottom-0 z-40 transition-all duration-300",
          collapsed ? "w-[68px]" : "w-60"
        )}
      >
        {/* Logo + collapse toggle */}
        <div className={cn(
          "flex items-center border-b border-white/10 h-[65px]",
          collapsed ? "justify-center px-2" : "justify-between px-4"
        )}>
          {!collapsed && <Logo variant="white" size="md" />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all shrink-0"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon }) => (
            <NavItem
              key={href}
              href={href}
              label={label}
              icon={icon}
              collapsed={collapsed}
              badge={label === "Notifications" ? unreadCount : undefined}
            />
          ))}
        </nav>

        {/* User + logout */}
        <div className="border-t border-white/10 p-2 space-y-1">
          <button
            onClick={() => setLogoutOpen(true)}
            title={collapsed ? "Logout" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg text-sm font-medium text-white/65 hover:text-white hover:bg-white/10 w-full transition-all",
              collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
            )}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>

          {!collapsed && profile && (
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-[#C2185B] flex items-center justify-center shrink-0 text-white text-xs font-bold">
                {profile.full_name?.charAt(0).toUpperCase() ?? "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{profile.full_name}</p>
                <p className="text-[10px] text-white/50 truncate">{profile.email}</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1A1A2E] border-t border-white/10 flex">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          const isNotif = label === "Notifications";
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors relative",
                active ? "text-[#C2185B]" : "text-white/50"
              )}
            >
              <div className="relative">
                <Icon size={20} />
                {isNotif && unreadCount > 0 && (
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

      {/* Logout dialog */}
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
