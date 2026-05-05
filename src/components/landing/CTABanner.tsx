import Link from "next/link";
import { ArrowRight, Shield, Clock, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CTABanner() {
  return (
    <section id="cta" className="py-20 bg-linear-to-r from-[#C2185B] via-[#ad1457] to-[#880e4f]">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
          Your Financial Future Doesn&apos;t Start Tomorrow.
          <br />
          <span className="text-[#FCE4EC]">It Starts Today.</span>
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          Join a community of Nigerians who are taking control of their finances, one saving at a time. No minimum amount. No complicated forms. Just a decision to start.
        </p>
        <Link
          href="/register"
          className={cn(buttonVariants({ size: "lg" }), "bg-white text-[#C2185B] hover:bg-[#FCE4EC] font-bold text-base px-10 shadow-xl")}
        >
          Create Your Free Account <ArrowRight size={18} className="ml-2" />
        </Link>
        <div className="flex items-center justify-center gap-6 mt-6 text-white/70 text-sm flex-wrap">
          <span className="flex items-center gap-1.5"><Star size={14} /> Free to join</span>
          <span className="flex items-center gap-1.5"><Clock size={14} /> Takes less than 2 minutes</span>
          <span className="flex items-center gap-1.5"><Shield size={14} /> No hidden fees</span>
        </div>
      </div>
    </section>
  );
}
