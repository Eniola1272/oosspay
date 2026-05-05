import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <Logo size="md" variant="colored" className="mb-10" />
      <p className="text-8xl font-extrabold text-[#C2185B] leading-none mb-4">404</p>
      <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-2">Page not found</h1>
      <p className="text-[#666666] text-sm text-center max-w-xs mb-8">
        We couldn&apos;t find what you were looking for. It may have moved or never existed.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl bg-[#C2185B] text-white text-sm font-semibold hover:bg-[#a31545] transition-colors text-center"
        >
          Go home
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-2.5 rounded-xl border border-[#C2185B] text-[#C2185B] text-sm font-semibold hover:bg-[#FCE4EC] transition-colors text-center"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
