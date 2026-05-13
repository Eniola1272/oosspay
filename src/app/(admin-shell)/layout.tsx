export const dynamic = "force-dynamic";

import { AdminShell } from "@/components/admin/AdminShell";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AuthProvider } from "@/context/AuthContext";

export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>
        <AdminShell>{children}</AdminShell>
      </AdminGuard>
    </AuthProvider>
  );
}
