"use client";

import { useState } from "react";
import { LogOut, LayoutDashboard, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAdminSidebar } from "./AdminSidebarContext";
import { cn } from "@/lib/utils";
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

interface AdminTopBarProps {
  title: string;
  subtitle?: string;
}

export function AdminTopBar({ title, subtitle }: AdminTopBarProps) {
  const { profile, signOut, isSuperAdmin } = useAuth();
  const { collapsed } = useAdminSidebar();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  async function handleLogout() {
    setLogoutOpen(false);
    await signOut();
    window.location.href = "/";
  }

  return (
    <>
      <div
        className={cn(
          "sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white border-b border-[#EBEBEB] transition-all duration-300",
        )}
        style={{ marginLeft: collapsed ? 0 : 0 }}
      >
        <div>
          <h1 className="text-xl font-bold text-[#1A1A2E]">{title}</h1>
          {subtitle && <p className="text-sm text-[#999999] mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {/* Name / role label — desktop only */}
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-[#1A1A2E]">{profile?.full_name}</p>
            <p className="text-[10px] text-[#999999]">{isSuperAdmin ? "Super Admin" : "Admin"}</p>
          </div>

          {/* Avatar — static on desktop (sidebar handles actions), dropdown on mobile */}
          {profile && (
            <>
              {/* Desktop: plain avatar */}
              <div className="hidden lg:block">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name ?? "Avatar"}
                    className="w-9 h-9 rounded-full object-cover border border-[#E0E0E0]"
                  />
                ) : (
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold",
                    isSuperAdmin ? "bg-amber-500" : "bg-[#C2185B]"
                  )}>
                    {profile.full_name?.charAt(0).toUpperCase() ?? "A"}
                  </div>
                )}
              </div>

              {/* Mobile: avatar as dropdown trigger */}
              <div className="lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none focus-visible:ring-2 focus-visible:ring-[#C2185B]/60 rounded-full">
                    {profile.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name ?? "Avatar"}
                        className="w-9 h-9 rounded-full object-cover border border-[#E0E0E0]"
                      />
                    ) : (
                      <div className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold",
                        isSuperAdmin ? "bg-amber-500" : "bg-[#C2185B]"
                      )}>
                        {profile.full_name?.charAt(0).toUpperCase() ?? "A"}
                      </div>
                    )}
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-56 rounded-xl border border-[#E0E0E0] bg-white p-2 shadow-xl"
                  >
                    {/* Name / role header */}
                    <div className="px-2 py-2">
                      <p className="text-xs font-semibold text-[#1A1A2E] truncate">
                        {profile.full_name || "Admin"}
                      </p>
                      <p className="text-[11px] text-[#999999]">
                        {isSuperAdmin ? "Super Admin" : "Admin"}
                      </p>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => router.push("/dashboard/profile")}
                      className="cursor-pointer gap-2 px-2 py-2 text-[#1A1A2E]"
                    >
                      <User size={15} />
                      My Profile
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
            </>
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
