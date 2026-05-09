export const dynamic = "force-dynamic";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AuthProvider } from "@/context/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
