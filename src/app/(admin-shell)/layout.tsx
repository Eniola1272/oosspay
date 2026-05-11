export const dynamic = "force-dynamic";

import { AdminShell } from "@/components/admin/AdminShell";
import { AuthProvider } from "@/context/AuthContext";

export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
