import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardTopBar title="get-help" />
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-[#999999] text-sm">Coming soon</p>
      </div>
    </div>
  );
}
