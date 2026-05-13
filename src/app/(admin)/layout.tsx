export const dynamic = "force-dynamic";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AuthProvider } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>
        <div className="flex min-h-screen bg-[#FAFAFA]">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
        </div>
      </AdminGuard>
    </AuthProvider>
  );
}
