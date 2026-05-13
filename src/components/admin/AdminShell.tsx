"use client";

import { AdminSidebarProvider, useAdminSidebar } from "./AdminSidebarContext";
import { AdminSidebar } from "./AdminSidebar";

function Shell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useAdminSidebar();
  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      <AdminSidebar />
      <main
        className={`flex-1 min-w-0 transition-all duration-300 pb-16 lg:pb-0 ${collapsed ? "lg:ml-[68px]" : "lg:ml-60"}`}
      >
        {children}
      </main>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminSidebarProvider>
      <Shell>{children}</Shell>
    </AdminSidebarProvider>
  );
}
