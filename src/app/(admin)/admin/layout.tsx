import { requireAdmin } from "@/lib/auth/admin-guard";

export default async function LegacyAdminRouteLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}
