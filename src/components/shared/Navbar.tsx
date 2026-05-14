"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Menu, X, ChevronDown,
  Wallet, Target, Home,
  BookOpen, Shield, FileText,
  Mail, Phone, MessageCircle,
  Sparkles, Compass, RefreshCw,
} from "lucide-react";
import { Logo } from "./Logo";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { WHATSAPP_LINK } from "@/lib/constants";

type NavItem = {
  label: string;
  href: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  external?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Personal",
    items: [
      {
        label: "Savings",
        href: "/savings",
        description: "Build a consistent savings habit, your way.",
        icon: Wallet,
      },
      {
        label: "Set Goals",
        href: "/savings",
        description: "Name a target, set a deadline, and crush it.",
        icon: Target,
      },
      {
        label: "Plan for a New House",
        href: "/savings",
        description: "Save toward a home with a clear roadmap.",
        icon: Home,
      },
    ],
  },
  {
    label: "Company",
    items: [
      {
        label: "About Us",
        href: "/about",
        description: "The story, mission, and people behind OOSSPAY.",
        icon: Sparkles,
      },
      {
        label: "Documentation",
        href: "/docs",
        description: "Step-by-step guides for every feature on the platform.",
        icon: BookOpen,
      },
      {
        label: "Privacy",
        href: "/privacy",
        description: "How we protect your data and your trust.",
        icon: Shield,
      },
      {
        label: "Terms",
        href: "/terms",
        description: "The agreement that governs your use of OOSSPAY.",
        icon: FileText,
      },
    ],
  },
  {
    label: "Customer Support",
    items: [
      {
        label: "Email",
        href: "mailto:hello@oosspay.com",
        description: "hello@oosspay.com. We reply within 24 hours.",
        icon: Mail,
        external: true,
      },
      {
        label: "Phone",
        href: "tel:+2349000000000",
        description: "Speak to our member team directly.",
        icon: Phone,
        external: true,
      },
      {
        label: "WhatsApp",
        href: WHATSAPP_LINK,
        description: "Chat with us on WhatsApp, any time.",
        icon: MessageCircle,
        external: true,
      },
    ],
  },
  {
    label: "Learn",
    items: [
      {
        label: "Services",
        href: "/#services",
        description: "Everything OOSSPAY offers, in one place.",
        icon: Compass,
      },
      {
        label: "How It Works",
        href: "/#how-it-works",
        description: "Three steps from sign-up to savings.",
        icon: BookOpen,
      },
      {
        label: "Set Up Auto-Pay",
        href: "/setup-autopay",
        description: "Add OOSSPAY as a beneficiary and automate your deposits.",
        icon: RefreshCw,
      },
    ],
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastY = useRef(0);
  const { user } = useAuth();

  useEffect(() => {
    lastY.current = window.scrollY;
    const HIDE_AFTER = 80; // don't hide while near the very top
    const DELTA = 8; // ignore tiny jitter

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);

      const diff = y - lastY.current;
      if (Math.abs(diff) < DELTA) return;

      if (diff > 0 && y > HIDE_AFTER) {
        // scrolling down past threshold → hide
        setHidden(true);
        setActiveMenu(null);
      } else if (diff < 0) {
        // scrolling up → reveal
        setHidden(false);
      }
      lastY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openMenu(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(label);
  }

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  }

  return (
    <header
      className={cn(
        "fixed left-4 right-4 z-50 transition-all duration-300 max-w-7xl mx-auto",
        scrolled ? "top-3" : "top-4",
        hidden ? "-translate-y-[150%] opacity-0" : "translate-y-0 opacity-100"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between rounded-full transition-all duration-300 px-4 sm:px-6 h-14",
          scrolled
            ? "bg-white/80 backdrop-blur-xl border border-black/5 shadow-lg shadow-black/5"
            : "bg-white/40 backdrop-blur-md border border-white/40"
        )}
      >
        <Logo size="md" />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 bg-black/[0.03] rounded-full p-1">
          {navGroups.map((group) => {
            const isActive = activeMenu === group.label;
            return (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => openMenu(group.label)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-full transition-all",
                    isActive
                      ? "bg-white text-[#C2185B] shadow-sm"
                      : "text-[#1A1A2E]/70 hover:text-[#1A1A2E]"
                  )}
                  aria-expanded={isActive}
                  aria-haspopup="menu"
                  onClick={() => setActiveMenu(isActive ? null : group.label)}
                >
                  {group.label}
                  <ChevronDown
                    size={13}
                    className={cn(
                      "transition-transform duration-200",
                      isActive && "rotate-180"
                    )}
                  />
                </button>

                {/* Dropdown */}
                <div
                  className={cn(
                    "absolute left-1/2 -translate-x-1/2 top-full pt-3 w-80 transition-all duration-200",
                    isActive
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-1 pointer-events-none"
                  )}
                  role="menu"
                  onMouseEnter={() => openMenu(group.label)}
                  onMouseLeave={scheduleClose}
                >
                  <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 border border-black/5 p-2 overflow-hidden">
                    {/* Subtle decorative top accent */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#C2185B]/40 to-transparent" />
                    <ul className="flex flex-col gap-0.5">
                      {group.items.map(({ label, href, description, icon: Icon, external }) => {
                        const linkProps = external
                          ? { href, target: "_blank", rel: "noopener noreferrer" }
                          : { href };
                        const Tag = external ? "a" : Link;
                        return (
                          <li key={label}>
                            <Tag
                              {...linkProps}
                              className="group/item flex items-start gap-3 p-3 rounded-xl hover:bg-[#FCE4EC]/60 transition-colors"
                              onClick={() => setActiveMenu(null)}
                            >
                              <div className="w-9 h-9 rounded-lg bg-[#FCE4EC] text-[#C2185B] flex items-center justify-center shrink-0 group-hover/item:bg-[#C2185B] group-hover/item:text-white transition-colors">
                                <Icon size={16} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-[#1A1A2E] group-hover/item:text-[#C2185B] transition-colors">
                                  {label}
                                </p>
                                <p className="text-[11px] text-[#1A1A2E]/55 leading-snug mt-0.5">
                                  {description}
                                </p>
                              </div>
                            </Tag>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <Link
              href="/dashboard"
              className={cn(buttonVariants(), "bg-[#C2185B] hover:bg-[#a31545] text-white rounded-full px-5 h-9 text-xs")}
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-semibold text-[#1A1A2E]/70 hover:text-[#1A1A2E] transition-colors px-3"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center bg-[#C2185B] hover:bg-[#a01549] text-white rounded-full px-5 h-9 text-xs font-semibold shadow-md shadow-[#C2185B]/30 transition-all"
              >
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={(o) => { setOpen(o); if (!o) setMobileOpenGroup(null); }}>
          <SheetTrigger
            className="lg:hidden p-2 text-[#1A1A2E] rounded-full hover:bg-black/5 transition-colors"
            aria-label="Menu"
          >
            <Menu size={20} />
          </SheetTrigger>

          <SheetContent side="right" className="w-full sm:max-w-xs p-0 flex flex-col bg-white border-l border-[#F0F0F0]">
            {/* Header */}
            <div className="flex items-center pl-5 pr-14 h-16 border-b border-[#F0F0F0] shrink-0">
              <Logo size="md" />
            </div>

            {/* Scrollable nav groups */}
            <nav className="flex-1 overflow-y-auto">
              {navGroups.map((group) => {
                const isOpen = mobileOpenGroup === group.label;
                return (
                  <div key={group.label} className="border-b border-[#F0F0F0] last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setMobileOpenGroup(isOpen ? null : group.label)}
                      className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold text-[#1A1A2E] hover:text-[#C2185B] transition-colors"
                    >
                      {group.label}
                      <ChevronDown
                        size={15}
                        className={cn("text-[#1A1A2E]/40 transition-transform duration-200", isOpen && "rotate-180 text-[#C2185B]")}
                      />
                    </button>

                    <div
                      className="overflow-hidden transition-all duration-200 ease-in-out"
                      style={{ maxHeight: isOpen ? `${group.items.length * 60}px` : "0px" }}
                    >
                      <ul className="px-3 pb-3 space-y-0.5">
                        {group.items.map(({ label, href, description, icon: Icon, external }) => {
                          const linkProps = external
                            ? { href, target: "_blank" as const, rel: "noopener noreferrer" }
                            : { href };
                          const Tag = external ? "a" : Link;
                          return (
                            <li key={label}>
                              <Tag
                                {...linkProps}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FCE4EC]/60 active:bg-[#FCE4EC] transition-colors group/mitem"
                              >
                                <div className="w-9 h-9 rounded-xl bg-[#FCE4EC] text-[#C2185B] flex items-center justify-center shrink-0 group-hover/mitem:bg-[#C2185B] group-hover/mitem:text-white transition-colors">
                                  <Icon size={15} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-[#1A1A2E] group-hover/mitem:text-[#C2185B] transition-colors">{label}</p>
                                  <p className="text-[11px] text-[#666] leading-snug truncate">{description}</p>
                                </div>
                              </Tag>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Pinned CTA */}
            <div className="shrink-0 px-5 py-5 border-t border-[#F0F0F0] space-y-2.5 bg-[#FAFAFA]">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-full bg-[#C2185B] hover:bg-[#a31545] text-white font-bold text-sm rounded-2xl h-12 transition-colors shadow-md shadow-[#C2185B]/20"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center w-full bg-[#C2185B] hover:bg-[#a31545] text-white font-bold text-sm rounded-2xl h-12 transition-colors shadow-md shadow-[#C2185B]/20"
                  >
                    Sign Up Free
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center w-full bg-white border border-[#E0E0E0] text-[#1A1A2E] font-semibold text-sm rounded-2xl h-11 hover:border-[#C2185B] hover:text-[#C2185B] transition-colors"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
