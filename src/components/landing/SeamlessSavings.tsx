import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SeamlessSavings() {
  return (
    <section id="seamless" className="bg-white py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Header */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <h2 className="reveal text-4xl lg:text-5xl font-extrabold text-[#1A1A2E] tracking-tight leading-tight">
            Seamless Savings.
            <br />
            <span className="text-[#1A1A2E]">Safer Loans.</span>
          </h2>
          <div className="reveal" data-reveal-delay="120">
            <p className="text-[#1A1A2E]/65 text-lg mb-6 leading-relaxed">
              Achieve your financial goals with tools designed for simplicity
              and security. Whether you are building an emergency fund, saving
              for a project, or seeking safe credit, we provide a structured
              approach that works.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#7A2850] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#5f1f3e] transition-colors shadow-lg shadow-pink-900/20"
            >
              Start your journey
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid lg:grid-cols-2 gap-6 h-auto lg:h-[600px]">
          {/* Left Large Card */}
          <div className="reveal relative rounded-[2.5rem] overflow-hidden bg-[#2D0F1F] group min-h-[420px] lg:min-h-0">
            <div className="absolute inset-0 bg-linear-to-t from-[#7A2850]/85 via-[#2D0F1F]/40 to-transparent z-10" />

            <div className="absolute top-0 right-0 w-[160px] md:w-[240px] lg:w-[280px] xl:w-[300px] aspect-[1/2] z-0 rotate-[45deg] translate-x-[25%] -translate-y-[25%]">
              <Image
                src="/images/phone-mockup.png"
                alt="OOSSPAY app interface"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain object-top group-hover:-translate-y-4 group-hover:scale-105 transition-all duration-700 drop-shadow-2xl"
              />
            </div>

            <div className="absolute bottom-0 left-0 p-10 z-20 w-full">
              <h3 className="text-3xl font-extrabold text-white mb-3">
                No Registration Fees
              </h3>
              <p className="text-white/85 text-lg max-w-sm leading-relaxed">
                Join our community without upfront costs. We believe in removing
                barriers to financial growth.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 h-full">
            {/* Top Text Card */}
            <div
              className="reveal flex-1 rounded-[2.5rem] bg-[#7A2850] p-10 flex flex-col justify-center relative overflow-hidden min-h-[280px]"
              data-reveal-delay="120"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -left-12 -bottom-16 w-48 h-48 bg-[#C2185B]/30 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-3xl font-extrabold text-white mb-4 leading-tight relative">
                Grow with many,
                <br />
                Win for yourself.
              </h3>
              <p className="text-white/85 text-lg relative leading-relaxed">
                Group contributions and cooperative benefits designed to
                maximize your returns.
              </p>
              <div className="mt-8 relative">
                <Link
                  href="/about"
                  className="group/link inline-flex items-center gap-2 text-white font-medium transition-all"
                >
                  Learn more
                  <ArrowRight
                    size={18}
                    className="group-hover/link:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>

            {/* Bottom Two Squares */}
            <div className="flex-1 grid grid-cols-2 gap-6 min-h-[220px]">
              <div
                className="reveal rounded-[2.5rem] overflow-hidden bg-[#FCE4EC] relative group"
                data-reveal-delay="200"
              >
                <Image
                  src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80&auto=format&fit=crop"
                  alt="Saving with confidence"
                  fill
                  sizes="(min-width: 1024px) 22vw, 48vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#1A1A2E]/40 to-transparent" />
              </div>
              <div
                className="reveal rounded-[2.5rem] overflow-hidden bg-[#FCE4EC] relative group"
                data-reveal-delay="280"
              >
                <Image
                  src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&q=80&auto=format&fit=crop"
                  alt="Building wealth together"
                  fill
                  sizes="(min-width: 1024px) 22vw, 48vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#1A1A2E]/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
