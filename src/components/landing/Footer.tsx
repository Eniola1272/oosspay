import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { MessageCircle, Camera, Music2, Mail, MapPin } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#1A1A2E] text-white overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#C2185B]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#4A0820]/30 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl py-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-5">
            <Logo variant="white" showTagline size="lg" />
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Making Many Wealthy &mdash; one saver at a time. A people-first savings community built for everyday Nigerians.
            </p>

            <div className="flex items-center gap-3 text-white/50 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={12} /> Nigeria
              </span>
              <span className="text-white/20">|</span>
              <span className="inline-flex items-center gap-1.5">
                <Mail size={12} /> hello@oosspay.com
              </span>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-extrabold text-white mb-5 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "#hero" },
                { label: "About", href: "#about" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Services", href: "#services" },
                { label: "FAQ", href: "#faq" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/55 hover:text-[#C2185B] text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-extrabold text-white mb-5 text-sm uppercase tracking-wider">Account</h3>
            <ul className="space-y-3">
              <li><Link href="/login" className="text-white/55 hover:text-[#C2185B] text-sm transition-colors">Login</Link></li>
              <li><Link href="/register" className="text-white/55 hover:text-[#C2185B] text-sm transition-colors">Sign Up</Link></li>
              <li><Link href="/terms" className="text-white/55 hover:text-[#C2185B] text-sm transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="text-white/55 hover:text-[#C2185B] text-sm transition-colors">Privacy</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-extrabold text-white mb-5 text-sm uppercase tracking-wider">Connect</h3>
            <div className="flex flex-col gap-3">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/55 hover:text-[#25D366] text-sm transition-colors"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
              <a
                href="https://instagram.com/oosspayofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/55 hover:text-[#E1306C] text-sm transition-colors"
              >
                <Camera size={15} /> Instagram
              </a>
              <a
                href="https://tiktok.com/@oosspay"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/55 hover:text-white text-sm transition-colors"
              >
                <Music2 size={15} /> TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-white/40 text-xs">
              &copy; {year} OOSSPAY. Powered by OOSS. All rights reserved.
            </p>
            <p className="text-white/30 text-xs italic">Built with people-first principles &mdash; in Nigeria.</p>
          </div>
        </div>
      </div>

      <div className="relative pointer-events-none">
        <p className="select-none text-[18vw] md:text-[14vw] lg:text-[12rem] font-extrabold leading-none tracking-[-0.06em] bg-linear-to-b from-white/5 to-transparent bg-clip-text text-transparent text-center pb-2">
          OOSSPAY
        </p>
      </div>
    </footer>
  );
}
