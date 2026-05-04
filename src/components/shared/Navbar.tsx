// TODO: Implement sticky marketing navbar with transparent → solid scroll effect
"use client";

import { Logo } from "./Logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        {/* Navigation links and CTA go here */}
      </div>
    </header>
  );
}
