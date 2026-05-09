import { AuthTopBar } from "@/components/auth/AuthTopBar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col">
      <AuthTopBar />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        {children}
      </main>
      <footer className="text-center text-xs text-[#999999] py-4">
        © {new Date().getFullYear()} OOSSPAY Financial
      </footer>
    </div>
  );
}
