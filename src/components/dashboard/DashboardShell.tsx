"use client";

import { SidebarProvider, useSidebar } from "./SidebarContext";
import { DashboardSidebar } from "./DashboardSidebar";
import { SupportWidget } from "./SupportWidget";

function Shell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
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
