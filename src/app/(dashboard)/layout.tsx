export const dynamic = "force-dynamic";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { AuthProvider } from "@/context/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[#FAFAFA]">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </AuthProvider>
  );
}
