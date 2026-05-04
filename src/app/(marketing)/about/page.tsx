import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = { title: "About OOSSPAY" };

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-20 container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#1A1A2E]">About OOSSPAY</h1>
        {/* TODO: Detailed about content */}
      </main>
      <Footer />
    </>
  );
}
