import { OnboardingStepBar } from "@/components/auth/OnboardingStepBar";
import { AuthProvider } from "@/context/AuthContext";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#F7F7F7] flex flex-col">
        <OnboardingStepBar />
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          {children}
        </main>
        <footer className="text-center text-xs text-[#999999] py-4">
          © {new Date().getFullYear()} OOSSPAY Financial
        </footer>
      </div>
    </AuthProvider>
  );
}
