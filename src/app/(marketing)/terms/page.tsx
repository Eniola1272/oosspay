import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/landing/Footer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = { title: "Terms of Service — OOSSPAY" };

export default function TermsPage() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="pt-28 pb-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C2185B] mb-3">Legal</p>
          <h1 className="text-4xl font-extrabold text-[#1A1A2E] mb-6">Terms of Service</h1>
          <div className="prose prose-gray max-w-none">
            <p className="text-[#666666] text-lg leading-relaxed bg-[#FAFAFA] border border-[#E0E0E0] rounded-xl p-6">
              Terms of Service content will be provided by the OOSSPAY legal team. This page will be updated before the platform launches.
            </p>
            <p className="text-sm text-[#666666] mt-6">
              For questions about our terms, please reach out via WhatsApp or Instagram{" "}
              <strong>@oosspayofficial</strong>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </AuthProvider>
  );
}
