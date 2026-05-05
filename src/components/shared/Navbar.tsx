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
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E0E0E0]"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <Logo showTagline size="md" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#333333] hover:text-[#C2185B] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className={cn(buttonVariants(), "bg-[#C2185B] hover:bg-[#a31545] text-white")}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-[#333333] hover:text-[#C2185B] transition-colors">
                Login
              </Link>
              <Link href="/register" className={cn(buttonVariants(), "bg-[#C2185B] hover:bg-[#a31545] text-white")}>
                Create Account
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden p-2 text-[#333333]"
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-white pt-12">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-[#333333] hover:text-[#C2185B] py-3 px-2 border-b border-[#E0E0E0] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-6 px-2">
                {user ? (
                  <Link href="/dashboard" onClick={() => setOpen(false)}
                    className={cn(buttonVariants(), "bg-[#C2185B] hover:bg-[#a31545] text-white w-full justify-center")}>
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)}
                      className={cn(buttonVariants({ variant: "outline" }), "w-full border-[#C2185B] text-[#C2185B] justify-center")}>
                      Login
                    </Link>
                    <Link href="/register" onClick={() => setOpen(false)}
                      className={cn(buttonVariants(), "bg-[#C2185B] hover:bg-[#a31545] text-white w-full justify-center")}>
                      Create Account
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
