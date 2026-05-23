import Image from "next/image";

export function WhyChooseUs() {
  return (
    <section
      id="capital-project"
      className="relative py-32 overflow-hidden bg-[#FCE4EC]/55"
    >
      <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-[#C2185B]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-32 w-[480px] h-[480px] rounded-full bg-[#C2185B]/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Centered header */}
        <div className="reveal text-center max-w-3xl mx-auto mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C2185B] mb-5">
            Capital Project Savings
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-[#1A1A2E] tracking-tight leading-[1.05]">
            Strategic Savings. <span className="text-[#C2185B]">Big Results.</span>
          </h2>
        </div>

        {/* Two-column body */}
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div className="reveal max-w-md" data-reveal-delay="120">
            <h3 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] leading-[1.15] tracking-tight mb-7">
              Most people don&apos;t have a money problem;they have a{" "}
              <span className="text-[#C2185B]">structure problem.</span>
            </h3>
            <p className="text-[#1A1A2E]/65 leading-relaxed text-base">
              That&apos;s why we created the Capital Project savings plan. We built a system that gives your finances the discipline they need without the stress. Start small, stay consistent, and watch your daily or weekly efforts grow into exactly what you need to fund your next big move.
            </p>
          </div>

          {/* Right: Chess mansion image */}
          <div className="reveal relative" data-reveal-delay="200">
            <div className="relative aspect-[5/4] rounded-[2rem] overflow-hidden shadow-2xl shadow-[#4A0820]/15 ring-1 ring-white/60">
              <Image
                src="/images/chess-mansion.png"
                alt="A hand placing a gold chess piece on a board with a luxury mansion in the background"
                fill
                sizes="(min-width: 1024px) 50vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
