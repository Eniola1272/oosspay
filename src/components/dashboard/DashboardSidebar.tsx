"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Target, Wallet, Bell, User,
  LogOut, ChevronLeft, ChevronRight, ShieldCheck, House
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useSidebar } from "./SidebarContext";
import type { Profile } from "@/types";

const NAV_ITEMS = [
  { href: "/dashboard",                label: "Dashboard",     icon: LayoutDashboard },
  { href: "/dashboard/savings",        label: "My Savings",    icon: Target },
  { href: "/dashboard/withdraw",       label: "Withdraw",      icon: Wallet },
  { href: "/dashboard/notifications",  label: "Notifications", icon: Bell },
  { href: "/dashboard/profile",        label: "Profile",       icon: User },
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
  const active = pathname === href || (href !== "/dashboard" && href !== "/dashboard/profile" && pathname.startsWith(href));
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

function AccountMenu({
  collapsed,
  profile,
  unreadCount,
  isAdmin,
  isSuperAdmin,
  onNavigate,
  onLogout,
}: {
  collapsed: boolean;
  profile: Profile | null;
  unreadCount: number;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  onNavigate: (href: string) => void;
  onLogout: () => void;
}) {
  if (!profile) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title={collapsed ? "Account menu" : undefined}
        className={cn(
          "w-full rounded-lg text-left outline-none transition-all focus-visible:ring-2 focus-visible:ring-[#C2185B]/60",
          collapsed
            ? "flex items-center justify-center p-1 hover:bg-white/10"
            : "flex items-center gap-3 px-3 py-2.5 hover:bg-white/10"
        )}
      >
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt={profile.full_name ?? "Avatar"}
            className="w-9 h-9 rounded-full object-cover border-2 border-white/20 transition-all shrink-0 hover:border-[#C2185B]"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#C2185B] to-[#4A0820] flex items-center justify-center text-white text-sm font-bold shrink-0 border-2 border-white/10 transition-all">
            {profile.full_name?.charAt(0).toUpperCase() ?? "U"}
          </div>
        )}

        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate leading-tight">{profile.full_name || "Member"}</p>
              <p className="text-[10px] text-white/50 truncate mt-0.5">{profile.email}</p>
            </div>
            <ChevronRight size={14} className="text-white/35 shrink-0" />
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="right"
        align="end"
        sideOffset={10}
        className="w-56 rounded-xl border border-[#E0E0E0] bg-white p-2 shadow-xl"
      >
        <div className="px-2 py-2">
          <p className="text-xs font-semibold text-[#1A1A2E] truncate">{profile.full_name || "Member"}</p>
          <p className="text-[11px] text-[#666666] truncate">{profile.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onNavigate("/dashboard/profile")}
          className="cursor-pointer gap-2 px-2 py-2 text-[#1A1A2E]"
        >
          <User size={15} />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onNavigate("/dashboard/notifications")}
          className="cursor-pointer gap-2 px-2 py-2 text-[#1A1A2E]"
        >
          <Bell size={15} />
          Notifications
          {unreadCount > 0 && (
            <Badge className="ml-auto bg-[#C2185B] text-white text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onNavigate("/dashboard/profile")}
          className="cursor-pointer gap-2 px-2 py-2 text-[#1A1A2E]"
        >
          <ShieldCheck size={15} />
          Account security
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onNavigate(isSuperAdmin ? "/dashboard/super-admin" : "/dashboard/admin")}
              className="cursor-pointer gap-2 px-2 py-2 text-amber-600 font-semibold"
            >
              <ShieldCheck size={15} className="text-amber-500" />
              Switch to Admin
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          variant="destructive"
          className="cursor-pointer gap-2 px-2 py-2"
        >
          <LogOut size={15} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DashboardSidebar() {
  const { profile, signOut, isAdmin, isSuperAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const router = useRouter();
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

        {/* Account menu */}
        <div className="border-t border-white/10 p-2">
          {collapsed ? (
            <div className="flex justify-center py-1">
              <AccountMenu
                collapsed
                profile={profile}
                unreadCount={unreadCount}
                isAdmin={isAdmin}
                isSuperAdmin={isSuperAdmin}
                onNavigate={(href) => router.push(href)}
                onLogout={() => setLogoutOpen(true)}
              />
            </div>
          ) : (
            <AccountMenu
              collapsed={false}
              profile={profile}
              unreadCount={unreadCount}
              isAdmin={isAdmin}
              isSuperAdmin={isSuperAdmin}
              onNavigate={(href) => router.push(href)}
              onLogout={() => setLogoutOpen(true)}
            />
          )}
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1A1A2E] border-t border-white/10 flex">
        {/* Homepage link */}
        <Link
          href="/"
          className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors relative text-white/50 hover:text-white"
        >
          <House size={20} />
          Home
        </Link>

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
