"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, CreditCard, Settings,
  LogOut, ChevronLeft, ChevronRight, Inbox, ScrollText, User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/shared/Logo";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useAdminSidebar } from "./AdminSidebarContext";
import { createClient } from "@/lib/supabase/client";

const ADMIN_NAV = [
  { href: "/dashboard/admin",             label: "Dashboard",    icon: LayoutDashboard, exact: true },
  { href: "/dashboard/admin/users",       label: "Users",        icon: Users },
  { href: "/dashboard/admin/deposits",    label: "Deposits",     icon: Inbox },
  { href: "/dashboard/admin/withdrawals", label: "Withdrawals",  icon: CreditCard },
  { href: "/dashboard/admin/settings",    label: "Settings",     icon: Settings },
];

const SUPER_ADMIN_NAV = [
  { href: "/dashboard/super-admin",             label: "Dashboard",    icon: LayoutDashboard, exact: true },
  { href: "/dashboard/super-admin/users",       label: "Users",        icon: Users },
  { href: "/dashboard/super-admin/deposits",    label: "Deposits",     icon: Inbox },
  { href: "/dashboard/super-admin/withdrawals", label: "Withdrawals",  icon: CreditCard },
  { href: "/dashboard/super-admin/activity",    label: "Activity Log", icon: ScrollText },
  { href: "/dashboard/super-admin/settings",    label: "Settings",     icon: Settings },
];

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  collapsed: boolean;
  badge?: number;
  isAmber?: boolean;
}

function NavItem({ href, label, icon: Icon, exact, collapsed, badge, isAmber }: NavItemProps) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);
  const activeColor = isAmber
    ? "bg-amber-500/20 text-amber-400 border-l-4 border-amber-400 pl-2"
    : "bg-[#C2185B]/20 text-[#C2185B] border-l-4 border-[#C2185B] pl-2";
  const hoverColor = isAmber
    ? "text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/10"
    : "text-white/70 hover:text-white hover:bg-white/10";

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg text-sm font-medium transition-all relative",
        collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
        active ? activeColor : hoverColor,
      )}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="flex-1">{label}</span>}
      {badge && badge > 0 && !collapsed && (
        <span className="bg-[#F39C12] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
          {badge}
        </span>
      )}
      {badge && badge > 0 && collapsed && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F39C12] rounded-full" />
      )}
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut, isSuperAdmin } = useAuth();
  const { collapsed, setCollapsed } = useAdminSidebar();
  const [pendingDeposits, setPendingDeposits] = useState(0);

  const isSuper = isSuperAdmin || pathname.startsWith("/dashboard/super-admin");
  const navItems = isSuper ? SUPER_ADMIN_NAV : ADMIN_NAV;
  const accentColor = isSuper ? "bg-amber-500" : "bg-[#C2185B]";

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

  const depositHref = isSuper ? "/dashboard/super-admin/deposits" : "/dashboard/admin/deposits";

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex flex-col min-h-screen bg-[#1A1A2E] fixed left-0 top-0 bottom-0 z-40 transition-all duration-300",
          collapsed ? "w-[68px]" : "w-60"
        )}
      >
        {/* Logo + collapse */}
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

        {/* Role badge */}
        {!collapsed && (
          <div className="px-4 pt-3 pb-1">
            <Badge className={`${accentColor} text-white text-[10px]`}>
              {isSuper ? "Super Admin" : "Admin"}
            </Badge>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon, exact }) => (
            <NavItem
              key={href}
              href={href}
              label={label}
              icon={icon}
              exact={exact}
              collapsed={collapsed}
              isAmber={isSuper}
              badge={href === depositHref ? pendingDeposits : undefined}
            />
          ))}

        </nav>

        {/* Account dropdown */}
        <div className="border-t border-white/10 p-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              title={collapsed ? "Account menu" : undefined}
              className={cn(
                "w-full rounded-lg text-left outline-none transition-all focus-visible:ring-2",
                isSuper ? "focus-visible:ring-amber-400/60" : "focus-visible:ring-[#C2185B]/60",
                collapsed
                  ? "flex items-center justify-center p-1 hover:bg-white/10"
                  : "flex items-center gap-3 px-3 py-2.5 hover:bg-white/10"
              )}
            >
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name ?? "Avatar"}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white/20 shrink-0"
                />
              ) : (
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 border-2 border-white/10",
                  isSuper ? "bg-linear-to-br from-amber-400 to-amber-600" : "bg-linear-to-br from-[#C2185B] to-[#4A0820]"
                )}>
                  {profile?.full_name?.charAt(0).toUpperCase() ?? "A"}
                </div>
              )}
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate leading-tight">{profile?.full_name ?? "Admin"}</p>
                    <p className="text-[10px] text-white/50 truncate mt-0.5">{profile?.email}</p>
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
                <p className="text-xs font-semibold text-[#1A1A2E] truncate">{profile?.full_name ?? "Admin"}</p>
                <p className="text-[11px] text-[#666666] truncate">{profile?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/profile")}
                className="cursor-pointer gap-2 px-2 py-2 text-[#1A1A2E]"
              >
                <User size={15} />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard")}
                className="cursor-pointer gap-2 px-2 py-2 text-[#1A1A2E]"
              >
                <LayoutDashboard size={15} />
                Switch to User View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                variant="destructive"
                className="cursor-pointer gap-2 px-2 py-2"
              >
                <LogOut size={15} />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1A1A2E] border-t border-white/10 flex">
        {navItems.slice(0, 5).map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          const activeTextColor = isSuper ? "text-amber-400" : "text-[#C2185B]";
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors",
                active ? activeTextColor : "text-white/50"
              )}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </nav>

    </>
  );
}
