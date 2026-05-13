"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const MEMBER_SECTIONS = [
  { id: "getting-started",  label: "Getting Started" },
  { id: "login",            label: "Logging In",              indent: true },
  { id: "register",         label: "Create an Account",       indent: true },
  { id: "forgot-password",  label: "Forgot Password",         indent: true },
  { id: "member-dashboard", label: "Member Dashboard" },
  { id: "deposit",          label: "Making a Deposit",        indent: true },
  { id: "withdraw",         label: "Requesting a Withdrawal", indent: true },
  { id: "savings",          label: "Savings Targets",         indent: true },
  { id: "transactions",     label: "Transaction History",     indent: true },
  { id: "notifications",    label: "Notifications",           indent: true },
  { id: "profile",          label: "Profile & Settings",      indent: true },
];

const ADMIN_SECTIONS = [
  { id: "admin-guide",       label: "Admin Guide" },
  { id: "admin-deposits",    label: "Deposit Management",    indent: true },
  { id: "admin-withdrawals", label: "Withdrawal Management", indent: true },
  { id: "admin-users",       label: "Member Management",     indent: true },
  { id: "admin-settings",    label: "Platform Settings",     indent: true },
];

const SUPER_ADMIN_SECTIONS = [
  { id: "super-admin",  label: "Super Admin" },
  { id: "activity-log", label: "Activity Log", indent: true },
];

const QUICK_REF = [{ id: "quick-reference", label: "Quick Reference", indent: false }];

type NavSection = { id: string; label: string; indent?: boolean };

export function DocsSidebar() {
  const { isAdmin, isSuperAdmin } = useAuth();
  const [active, setActive] = useState("getting-started");

  const sections: NavSection[] = [
    ...MEMBER_SECTIONS,
    ...(isAdmin ? ADMIN_SECTIONS : []),
    ...(isSuperAdmin ? SUPER_ADMIN_SECTIONS : []),
    ...QUICK_REF,
  ];

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the topmost visible section
          const topmost = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          setActive(topmost.target.id);
        }
      },
      { rootMargin: "-10% 0px -80% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, isSuperAdmin]);

  return (
    <nav className="space-y-0.5">
      {sections.map(({ id, label, indent }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className={cn(
            "block text-sm py-1.5 rounded transition-colors",
            indent ? "pl-4" : "pl-2 font-semibold",
            active === id
              ? "text-[#C2185B] font-medium"
              : indent
              ? "text-[#666666] hover:text-[#1A1A2E]"
              : "text-[#1A1A2E] hover:text-[#C2185B]"
          )}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
