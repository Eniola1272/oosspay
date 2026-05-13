import { requireAdmin } from "@/lib/auth/admin-guard";

export default async function DashboardSuperAdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin({ superAdminOnly: true });
  return <>{children}</>;
}
