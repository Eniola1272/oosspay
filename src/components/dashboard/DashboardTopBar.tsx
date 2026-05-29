"use client";

import { useState } from "react";
import { Bell, User, ShieldCheck, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { getGreeting } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardTopBarProps {
  title?: string;
  subtitle?: string;
  showGreeting?: boolean;
}

export function DashboardTopBar({ title, subtitle, showGreeting = false }: DashboardTopBarProps) {
  const { profile, signOut, isAdmin, isSuperAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  async function handleLogout() {
    setLogoutOpen(false);
    await signOut();
    window.location.href = "/";
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#EBEBEB]">
        {/* Left: title / greeting */}
        <div>
          {showGreeting ? (
            <>
              <h1 className="text-2xl font-bold text-[#1A1A2E]">
                {getGreeting()}, {firstName}! 🌟
              </h1>
              <p className="text-sm text-[#999999] mt-0.5">
                Here&apos;s a snapshot of your savings journey.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-[#1A1A2E]">{title ?? "Dashboard"}</h1>
              {subtitle && <p className="text-sm text-[#999999] mt-0.5">{subtitle}</p>}
            </>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          {/* Bell — always visible */}
          <Link
            href="/dashboard/notifications"
            className="relative w-9 h-9 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center text-[#666666] transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C2185B] rounded-full" />
            )}
          </Link>

          {/* Avatar dropdown — mobile only (desktop uses the sidebar) */}
          {profile && (
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none focus-visible:ring-2 focus-visible:ring-[#C2185B]/60 rounded-full ml-1">
                  {profile.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name ?? "Avatar"}
                      className="w-9 h-9 rounded-full object-cover border-2 border-[#EBEBEB]"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C2185B] to-[#4A0820] flex items-center justify-center text-white text-sm font-bold border-2 border-[#EBEBEB]">
                      {profile.full_name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                  )}
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-56 rounded-xl border border-[#E0E0E0] bg-white p-2 shadow-xl"
                >
                  {/* Name / email header */}
                  <div className="px-2 py-2">
                    <p className="text-xs font-semibold text-[#1A1A2E] truncate">
                      {profile.full_name || "Member"}
                    </p>
                    <p className="text-[11px] text-[#666666] truncate">{profile.email}</p>
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
                    onClick={() => router.push("/dashboard/notifications")}
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
                    onClick={() => router.push("/dashboard/settings")}
                    className="cursor-pointer gap-2 px-2 py-2 text-[#1A1A2E]"
                  >
                    <Settings size={15} />
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/profile")}
                    className="cursor-pointer gap-2 px-2 py-2 text-[#1A1A2E]"
                  >
                    <ShieldCheck size={15} />
                    Account security
                  </DropdownMenuItem>

                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            isSuperAdmin ? "/dashboard/super-admin" : "/dashboard/admin"
                          )
                        }
                        className="cursor-pointer gap-2 px-2 py-2 text-amber-600 font-semibold"
                      >
                        <ShieldCheck size={15} className="text-amber-500" />
                        Switch to Admin
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => setLogoutOpen(true)}
                    variant="destructive"
                    className="cursor-pointer gap-2 px-2 py-2"
                  >
                    <LogOut size={15} />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      {/* Logout confirmation dialog */}
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Log out?</DialogTitle>
            <DialogDescription>You will be taken back to the login page.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" className="flex-1" onClick={() => setLogoutOpen(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-[#C2185B] hover:bg-[#a31545] text-white"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
