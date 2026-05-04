import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-20 container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-[#1A1A2E]">Privacy Policy</h1>
        {/* TODO: Privacy policy content */}
      </main>
      <Footer />
    </>
  );
}
