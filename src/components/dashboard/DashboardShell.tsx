"use client";

import { UserX } from "lucide-react";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { DashboardSidebar } from "./DashboardSidebar";
import { SupportWidget } from "./SupportWidget";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

function Shell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  const { profile, isLoading, signOut } = useAuth();

  if (!isLoading && profile && profile.is_active === false) {
    return (
      <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center space-y-5 bg-white rounded-2xl p-8 border border-[#E0E0E0] shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#E74C3C]/10 flex items-center justify-center mx-auto">
            <UserX size={32} className="text-[#E74C3C]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-[#1A1A2E]">Account Deactivated</h1>
            <p className="text-sm text-[#666666] leading-relaxed">
              Your account has been deactivated by an administrator.
              Please contact support if you believe this is a mistake.
            </p>
          </div>
          <Button
            onClick={signOut}
            className="w-full bg-[#1A1A2E] hover:bg-[#2a2a4a] text-white"
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      <DashboardSidebar />
      <main
        className={`flex-1 min-w-0 transition-all duration-300 pb-16 lg:pb-0 ${collapsed ? "lg:ml-[68px]" : "lg:ml-60"}`}
      >
        {children}
      </main>
      <SupportWidget />
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Shell>{children}</Shell>
    </SidebarProvider>
  );
}
