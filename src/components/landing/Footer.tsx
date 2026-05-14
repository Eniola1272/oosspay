"use client";

import { useState, type SVGProps } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { WHATSAPP_LINK } from "@/lib/constants";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Something went wrong");
      }
      setSubmitted(true);
      setEmail("");
      toast.success("You're subscribed! Check your inbox for a welcome email.");
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="bg-[#5f1f3e] text-white pt-20 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Row */}
        <div className="grid lg:grid-cols-2 gap-12 items-center border-b border-white/10 pb-16 mb-16">
          <div>
            <h3 className="text-5xl font-semibold mb-4">
              Keep up with the latest
            </h3>
            <p className="text-pink-100 text-lg">
              Join our newsletter to get the latest news and resources.
            </p>
          </div>

          <div className="flex flex-col items-end">
            <div className="w-full max-w-md">
              <label
                htmlFor="footer-email"
                className="text-sm font-medium text-pink-200 mb-2 block"
              >
                Subscribe
              </label>
              <form className="flex gap-2" onSubmit={onSubmit}>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading || submitted}
                  className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-full px-6 py-3 flex-1 min-w-0 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={loading || submitted}
                  className="bg-white text-[#5f1f3e] px-8 py-3 rounded-full font-bold hover:bg-gray-100 disabled:opacity-70 disabled:cursor-default transition-colors flex items-center gap-2"
                >
                  {submitted ? "Joined!" : loading ? "…" : <><span>Join</span> <Send size={18} /></>}
                </button>
              </form>

              <div className="flex gap-4 mt-6 justify-start lg:justify-start">
                <SocialLink
                  href="https://instagram.com/oosspayofficial"
                  label="Instagram"
                >
                  <InstagramIcon />
                </SocialLink>
                <SocialLink href="https://tiktok.com/@oosspay" label="TikTok">
                  <TikTokIcon />
                </SocialLink>
                <SocialLink href={WHATSAPP_LINK} label="WhatsApp">
                  <WhatsAppIcon />
                </SocialLink>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-16">
          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-2xl tracking-tight text-white">
                OOSSPAY
              </span>
            </div>
            <p className="text-pink-100/60 text-sm">
              Africa&apos;s First Digital Cooperative Society
            </p>
          </div>

          <FooterColumn
            title="Quick Links"
            items={[
              { label: "Home", href: "/" },
              { label: "How it works", href: "/#how-it-works" },
              { label: "Services", href: "/#services" },
              { label: "FAQ", href: "/#faq" },
            ]}
          />
          <FooterColumn
            title="Company"
            items={[
              { label: "About Us", href: "/about" },
              { label: "Documentation", href: "/docs" },
              { label: "Set Up Auto-Pay", href: "/setup-autopay" },
            ]}
          />
          <FooterColumn
            title="Support"
            items={[
              { label: "WhatsApp Support", href: WHATSAPP_LINK, external: true },
              { label: "Email Us", href: "mailto:hello@oosspay.com", external: true },
              { label: "Member Login", href: "/login" },
            ]}
          />
          <FooterColumn
            title="Legal"
            items={[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
            ]}
          />
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-left">
          <p className="text-pink-100/40 text-xs">
            &copy; {new Date().getFullYear()} OOSSPAY Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">
        {title}
      </h4>
      <ul className="space-y-4">
        {items.map(({ label, href, external }) => (
          <li key={label}>
            {external ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-100 hover:text-white transition-colors text-sm"
              >
                {label}
              </a>
            ) : (
              <Link
                href={href}
                className="text-pink-100 hover:text-white transition-colors text-sm"
              >
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
    >
      {children}
    </a>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}
