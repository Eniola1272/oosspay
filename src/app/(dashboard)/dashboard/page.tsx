import type { Metadata } from "next";
import { DashboardContent } from "./DashboardContent";

export const metadata: Metadata = { title: "My Dashboard — OOSSPAY" };

export default function DashboardPage() {
  return <DashboardContent />;
}
