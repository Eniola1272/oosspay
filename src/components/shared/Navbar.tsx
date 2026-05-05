"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Services", href: "#services" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed top-4 left-4 right-4 z-50 transition-all duration-300 max-w-7xl mx-auto",
        scrolled ? "top-3" : "top-4"
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
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "text-xs font-semibold px-4 py-2 rounded-full transition-all",
                  isActive
                    ? "bg-white text-[#C2185B] shadow-sm"
                    : "text-[#1A1A2E]/70 hover:text-[#1A1A2E]"
                )}
              >
                {link.label}
              </a>
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
              Dashboard
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
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="lg:hidden p-2 text-[#1A1A2E] rounded-full hover:bg-black/5"
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-white pt-12">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-[#1A1A2E] hover:text-[#C2185B] py-3 px-2 border-b border-[#E0E0E0] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-6 px-2">
                {user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className={cn(buttonVariants(), "bg-[#C2185B] hover:bg-[#a31545] text-white w-full justify-center rounded-full")}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className={cn(buttonVariants({ variant: "outline" }), "w-full border-[#C2185B] text-[#C2185B] justify-center rounded-full")}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className={cn(buttonVariants(), "bg-[#C2185B] hover:bg-[#a31545] text-white w-full justify-center rounded-full")}
                    >
                      Sign Up Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
