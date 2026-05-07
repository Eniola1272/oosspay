import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "OOSSPAY — Save Together, Grow Together",
    template: "%s | OOSSPAY",
  },
  description:
    "OOSSPAY is a people-first community savings platform in Nigeria. Set targets, save consistently, and withdraw when you're ready.",
  keywords: ["savings", "Nigeria", "fintech", "community savings", "target savings", "OOSSPAY"],
  authors: [{ name: "OOSSPAY" }],
  openGraph: {
    title: "OOSSPAY — Save Together, Grow Together",
    description:
      "A people-first community savings platform helping Nigerians save consistently and reach their financial goals.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "OOSSPAY",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OOSSPAY — Save Together, Grow Together",
    description: "A people-first community savings platform in Nigeria.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
