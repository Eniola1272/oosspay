import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { MessageCircle, Camera, Music2 } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A2E] text-white">
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Logo variant="white" showTagline size="md" />
            <p className="text-white/60 text-sm leading-relaxed">
              Making Many Wealthy — one saver at a time.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "#hero" },
                { label: "About", href: "#about" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Services", href: "#services" },
                { label: "FAQ", href: "#faq" },
                { label: "Login", href: "/login" },
                { label: "Create Account", href: "/register" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-[#C2185B] text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-white/60 hover:text-[#C2185B] text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/60 hover:text-[#C2185B] text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-bold text-white mb-4">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-[#25D366] text-sm transition-colors"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/oosspayofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-[#E1306C] text-sm transition-colors"
                >
                  <Camera size={16} /> @oosspayofficial
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com/@oosspay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
                >
                  <Music2 size={16} /> @oosspay
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center text-white/40 text-sm">
          © {year} OOSSPAY. Powered by OOSS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
