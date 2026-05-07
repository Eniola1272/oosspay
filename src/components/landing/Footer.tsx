"use client";

import { useState, type SVGProps } from "react";
import Link from "next/link";
import { Send } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmail("");
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
                  className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-full px-6 py-3 flex-1 min-w-0 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all"
                />
                <button
                  type="submit"
                  className="bg-white text-[#5f1f3e] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  Join <Send size={18} />
                </button>
              </form>

              <div className="flex gap-4 mt-6 justify-start lg:justify-start">
                <SocialLink href="https://facebook.com" label="Facebook">
                  <FacebookIcon />
                </SocialLink>
                <SocialLink href="https://twitter.com" label="Twitter">
                  <TwitterIcon />
                </SocialLink>
                <SocialLink
                  href="https://instagram.com/oosspayofficial"
                  label="Instagram"
                >
                  <InstagramIcon />
                </SocialLink>
                <SocialLink href="https://linkedin.com" label="LinkedIn">
                  <LinkedinIcon />
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
            ]}
          />
          <FooterColumn
            title="Company"
            items={[
              { label: "About", href: "/about" },
              { label: "Meet the Team", href: "/about#team" },
              { label: "Blog", href: "/blog" },
            ]}
          />
          <FooterColumn
            title="Support"
            items={[
              { label: "Help", href: "/help" },
              { label: "FAQ", href: "/faq" },
              { label: "Contact", href: "/contact" },
            ]}
          />
          <FooterColumn
            title="Legal"
            items={[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Services", href: "/terms" },
              { label: "Cookies", href: "/cookies" },
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
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">
        {title}
      </h4>
      <ul className="space-y-4">
        {items.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="text-pink-100 hover:text-white transition-colors text-sm"
            >
              {label}
            </Link>
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

// Inline brand icons (lucide-react in this project doesn't ship Facebook/Twitter/Instagram/Linkedin)
function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.14 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.8 8.43-4.94 8.43-9.94z" />
    </svg>
  );
}

function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  // X/Twitter mark
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zM17.083 19.77h1.833L7.084 4.126H5.117z" />
    </svg>
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

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M20.452 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.356V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.266 2.37 4.266 5.455v6.288zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
