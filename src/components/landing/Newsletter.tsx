"use client";

import { useState } from "react";
import { ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubmitted(true);
    toast.success("You're on the list. Welcome to the OOSSPAY family.");
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <section id="newsletter" className="relative bg-[#FCE4EC] py-20 overflow-hidden">
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-[#C2185B]/15 blur-[100px] pointer-events-none animate-blob" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-[#4A0820]/10 blur-[100px] pointer-events-none animate-blob" style={{ animationDelay: "3s" }} />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="reveal grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-white">
          {/* Copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FCE4EC] border border-[#C2185B]/15 rounded-full px-3 py-1.5 mb-5">
              <Mail size={12} className="text-[#C2185B]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2185B]">Stay In The Loop</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1A1A2E] tracking-tight leading-[1.05] mb-3">
              Keep up with<br />
              <span className="text-[#C2185B]">the latest.</span>
            </h2>
            <p className="text-[#1A1A2E]/60 text-sm leading-relaxed max-w-md">
              Saving tips, member stories, and product updates &mdash; straight to your inbox. No spam, ever.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]/55">Your email address</label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C2185B]/60 pointer-events-none"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#FCE4EC]/40 border border-[#C2185B]/20 focus:border-[#C2185B] focus:bg-white outline-none rounded-full pl-11 pr-4 py-4 text-sm font-medium text-[#1A1A2E] placeholder:text-[#1A1A2E]/40 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitted}
              className="group inline-flex items-center justify-center gap-2 bg-[#C2185B] hover:bg-[#a01549] disabled:bg-[#27AE60] disabled:cursor-default text-white px-6 py-4 rounded-full font-bold text-sm shadow-xl shadow-[#C2185B]/30 transition-all"
            >
              {submitted ? (
                <>
                  <CheckCircle2 size={16} /> Subscribed
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-[10px] text-[#1A1A2E]/40 text-center">
              By subscribing, you agree to our privacy policy.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
