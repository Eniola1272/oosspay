export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "OOSSPAY";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
export const WHATSAPP_LINK = process.env.NEXT_PUBLIC_WHATSAPP_LINK ?? "https://wa.me/2347031904968";

export const NAIRA = "₦";

export const WITHDRAWAL_MIN_AMOUNT = 1000; // ₦1,000 minimum

export const ROUTES = {
  home: "/",
  about: "/about",
  terms: "/terms",
  privacy: "/privacy",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  dashboard: "/dashboard",
  savings: "/savings",
  withdraw: "/withdraw",
  notifications: "/notifications",
  profile: "/profile",
  admin: "/admin",
  adminUsers: "/admin/users",
  adminWithdrawals: "/admin/withdrawals",
  adminSettings: "/admin/settings",
} as const;
