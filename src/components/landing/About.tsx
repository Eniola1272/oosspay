import { Eye, Target, Heart, PiggyBank, Coins } from "lucide-react";

export function About() {
  return (
    <section id="about" className="relative py-24 bg-white overflow-hidden">
      <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full bg-[#FCE4EC]/40 blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy + Pillars */}
          <div className="space-y-6">
            <div className="reveal">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2185B] mb-4">About OOSSPAY</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] leading-[1.05] tracking-tight">
                We Exist to <span className="text-[#C2185B]">Make Many Wealthy</span>
              </h2>
            </div>

            <p className="reveal text-[#1A1A2E]/65 leading-relaxed text-base" data-reveal-delay="100">
              OOSSPAY isn&apos;t just another savings platform. We&apos;re a people-first economic community &mdash; built on the belief that wealth shouldn&apos;t be a privilege, it should be a shared journey.
            </p>
            <p className="reveal text-[#1A1A2E]/65 leading-relaxed text-base" data-reveal-delay="180">
              Our mantra is simple: <strong className="text-[#C2185B]">People Over Profit.</strong> Everything we build, every decision we make, starts with one question &mdash; does this serve the people we exist for?
            </p>

            <div className="reveal grid sm:grid-cols-3 gap-3 pt-4" data-reveal-delay="260">
              {[
                { icon: Eye, title: "Vision", desc: "Generational wealth, shared." },
                { icon: Target, title: "Mission", desc: "Tools to help you save consistently." },
                { icon: Heart, title: "Value", desc: "People over profit, every time." },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-[#E0E0E0] hover:border-[#C2185B]/40 hover:shadow-lg transition-all p-4 bg-white group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#FCE4EC] flex items-center justify-center mb-3 group-hover:bg-[#C2185B] transition-colors">
                    <Icon size={16} className="text-[#C2185B] group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-sm font-bold text-[#1A1A2E] mb-1">{title}</p>
                  <p className="text-xs text-[#1A1A2E]/55 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual money jar */}
          <div className="reveal relative" data-reveal-delay="200">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-linear-to-br from-[#FCE4EC] via-white to-[#FCE4EC]/40 rounded-[3rem]" />
              <div className="absolute inset-8 bg-linear-to-br from-[#C2185B]/10 to-transparent rounded-[2.5rem]" />
              <div className="absolute inset-12 rounded-full border-2 border-dashed border-[#C2185B]/20 animate-spin-slow" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#C2185B]/30 blur-3xl rounded-full" />
                  <div className="relative w-32 h-32 rounded-full bg-linear-to-br from-[#C2185B] to-[#4A0820] flex items-center justify-center shadow-2xl shadow-[#C2185B]/40">
                    <PiggyBank size={56} className="text-white" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              <div className="absolute top-12 left-4 bg-white rounded-2xl px-3 py-2 shadow-xl flex items-center gap-2 animate-float">
                <Coins size={14} className="text-[#F39C12]" />
                <span className="text-xs font-bold text-[#1A1A2E] tabular-nums">+&#8358;5,200</span>
              </div>

              <div
                className="absolute bottom-16 right-4 bg-white rounded-2xl px-3 py-2 shadow-xl animate-float-slow"
                style={{ animationDelay: "1s" }}
              >
                <p className="text-[9px] text-gray-400 uppercase font-bold">Saved</p>
                <p className="text-sm font-extrabold text-[#1A1A2E] tabular-nums">&#8358;150K</p>
              </div>

              <div
                className="absolute top-1/3 right-8 bg-[#1A1A2E] rounded-2xl px-3 py-2 shadow-xl animate-float"
                style={{ animationDelay: "2s" }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60]" />
                  <span className="text-[10px] font-bold text-white">Goal Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
