"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, Smartphone, CreditCard,
  RefreshCw, AlertCircle, Lightbulb, ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/landing/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type Bank = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  appSteps: string[];
  ussdSteps?: string[];
  supportsStanding: boolean;
  standingSteps?: string[];
  notes?: string;
};

const BANKS: Bank[] = [
  {
    id: "gtbank",
    name: "Guaranty Trust Bank (GTBank)",
    shortName: "GTBank",
    color: "#FF6900",
    appSteps: [
      "Open the GTWorld app and log in.",
      "Tap Transfers on the home screen.",
      "Select Other Banks, then tap Add Beneficiary.",
      "Enter OOSSPAY's bank name, account number, and account name exactly as shown on your Deposit page.",
      "Tap Save Beneficiary and confirm with your PIN or biometrics.",
      "To send money, return to Transfers → Saved Beneficiaries, select OOSSPAY, and enter the amount.",
    ],
    ussdSteps: [
      "Dial *737# on the phone number linked to your GTBank account.",
      "Select Transfer.",
      "Choose Other Banks.",
      "Enter OOSSPAY's account number and the destination bank code.",
      "Enter the amount and confirm with your PIN.",
    ],
    supportsStanding: true,
    standingSteps: [
      "In GTWorld, tap the hamburger menu (☰) → Standing Orders.",
      "Tap + New Standing Order.",
      "Select OOSSPAY from your saved beneficiaries (add it first if not listed).",
      "Enter the amount, start date, frequency (weekly/monthly), and end date or number of occurrences.",
      "Confirm with your PIN. GTBank will transfer automatically on each scheduled date.",
    ],
    notes: "Standing orders require the beneficiary to be saved first. Ensure your GTBank account has sufficient funds on the scheduled date to avoid failed transfers.",
  },
  {
    id: "access",
    name: "Access Bank",
    shortName: "Access Bank",
    color: "#E30613",
    appSteps: [
      "Open the Access More app and log in.",
      "Tap Payments → Transfer to Other Banks.",
      "Enter OOSSPAY's bank name, account number, and account name from your Deposit page.",
      "Tap Confirm, then tap Save as Beneficiary before completing the transfer.",
      "Future transfers: Payments → Beneficiaries → select OOSSPAY.",
    ],
    ussdSteps: [
      "Dial *901# on your Access Bank-registered number.",
      "Select Transfer → Other Banks.",
      "Enter the destination bank and OOSSPAY's account number.",
      "Enter the amount and confirm with your PIN.",
    ],
    supportsStanding: true,
    standingSteps: [
      "In Access More, go to Payments → Schedule Payments.",
      "Tap New Schedule.",
      "Select OOSSPAY from saved beneficiaries.",
      "Set amount, start date, and frequency (daily/weekly/monthly).",
      "Review and confirm with your PIN. Transfers will happen automatically.",
    ],
  },
  {
    id: "zenith",
    name: "Zenith Bank",
    shortName: "Zenith Bank",
    color: "#D40000",
    appSteps: [
      "Open the Zenith Bank Mobile App and log in.",
      "Tap Transfer → Transfer to Other Banks.",
      "Enter OOSSPAY's bank and account number.",
      "After the transfer is confirmed, tap Save Beneficiary to save OOSSPAY for future use.",
    ],
    ussdSteps: [
      "Dial *966# on your Zenith-registered number.",
      "Select Transfer.",
      "Choose Other Banks and follow the prompts.",
      "Enter OOSSPAY's account number, bank code, and amount.",
      "Confirm with your PIN.",
    ],
    supportsStanding: false,
    notes: "Zenith Bank's mobile app does not currently support in-app standing orders. Use the Zenith Internet Banking portal on a desktop browser: log in at www.zenithbank.com → Transfers → Standing Order to configure recurring transfers to OOSSPAY.",
  },
  {
    id: "firstbank",
    name: "First Bank of Nigeria",
    shortName: "First Bank",
    color: "#003087",
    appSteps: [
      "Open the FirstMobile app and log in.",
      "Tap Transfers → To Other Banks.",
      "Enter OOSSPAY's account number, select the bank, and verify the account name.",
      "Complete the transfer, then tap Add to Beneficiaries on the confirmation screen.",
      "Next time, use Quick Transfer → Beneficiaries → OOSSPAY.",
    ],
    ussdSteps: [
      "Dial *894# on your First Bank-registered number.",
      "Select Transfers → Other Banks.",
      "Enter bank code and account number, then confirm the amount with your PIN.",
    ],
    supportsStanding: true,
    standingSteps: [
      "In FirstMobile, go to More → Standing Order.",
      "Tap Create New.",
      "Select the destination: choose Other Banks, then enter OOSSPAY's details.",
      "Set the amount, start date, frequency, and expiry.",
      "Confirm with your transaction PIN.",
    ],
  },
  {
    id: "uba",
    name: "United Bank for Africa (UBA)",
    shortName: "UBA",
    color: "#E31837",
    appSteps: [
      "Open the UBA Mobile Banking app and log in.",
      "Tap Transfers → Other Banks.",
      "Enter OOSSPAY's bank, account number, and verify the name.",
      "Tap Save Beneficiary before confirming, then complete with your PIN.",
      "Future transfers: Transfers → Beneficiaries.",
    ],
    ussdSteps: [
      "Dial *919# on your UBA-registered number.",
      "Select Transfer → Other Banks.",
      "Follow prompts to enter account number, bank, and amount.",
      "Confirm with your PIN.",
    ],
    supportsStanding: true,
    standingSteps: [
      "In the UBA app, go to More → Scheduled Payments.",
      "Tap + New Payment.",
      "Choose OOSSPAY from saved beneficiaries.",
      "Enter amount, frequency, start date, and end date.",
      "Confirm with PIN.",
    ],
  },
  {
    id: "kuda",
    name: "Kuda Bank",
    shortName: "Kuda",
    color: "#4B1FED",
    appSteps: [
      "Open the Kuda app and log in.",
      "Tap Send on the home screen.",
      "Search for OOSSPAY's bank and enter the account number.",
      "Verify the account name matches, then enter the amount.",
      "Tap Save to Favourites on the confirmation screen so you can reuse it quickly.",
    ],
    supportsStanding: true,
    standingSteps: [
      "Tap the clock/schedule icon on the Send screen, or go to Pay → Scheduled.",
      "Tap Schedule a Payment.",
      "Select OOSSPAY from your favourites (save it first).",
      "Set the amount, frequency (weekly/monthly), start date, and optional end date.",
      "Confirm with your PIN or biometrics.",
    ],
    notes: "Kuda's scheduled transfers are one of the smoothest on mobile. The app will remind you before each transfer and notify you of success or failure.",
  },
  {
    id: "opay",
    name: "OPay",
    shortName: "OPay",
    color: "#1DC851",
    appSteps: [
      "Open the OPay app and log in.",
      "Tap Transfer → Bank Transfer.",
      "Select the destination bank and enter OOSSPAY's account number.",
      "Verify the account name, enter the amount, and tap Confirm.",
      "Tap Save Beneficiary to store OOSSPAY for future transfers.",
    ],
    supportsStanding: false,
    notes: "OPay does not currently support scheduled/recurring transfers. To automate, set a personal reminder on your phone to manually transfer to OOSSPAY on your chosen date each month, then submit your deposit request on OOSSPAY.",
  },
  {
    id: "palmpay",
    name: "PalmPay",
    shortName: "PalmPay",
    color: "#1BAC4B",
    appSteps: [
      "Open the PalmPay app and log in.",
      "Tap Transfer → To Bank Account.",
      "Choose the destination bank and enter OOSSPAY's account number.",
      "Confirm the account name matches, enter the amount, and tap Pay.",
      "Save OOSSPAY as a beneficiary when prompted.",
    ],
    supportsStanding: false,
    notes: "PalmPay does not support standing orders at this time. Set a recurring reminder on your phone to transfer on your savings day, then submit the deposit request on OOSSPAY.",
  },
  {
    id: "moniepoint",
    name: "Moniepoint",
    shortName: "Moniepoint",
    color: "#0A5FFF",
    appSteps: [
      "Open the Moniepoint personal app and log in.",
      "Tap Send Money → Bank Transfer.",
      "Enter OOSSPAY's bank and account number, verify the account name.",
      "Enter the amount and complete with your PIN.",
      "Save OOSSPAY as a frequent beneficiary after the first transfer.",
    ],
    supportsStanding: false,
    notes: "Moniepoint personal accounts do not yet support standing orders via the app. Use manual transfers and submit a deposit request on OOSSPAY each time.",
  },
];

function StepItem({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-6 h-6 rounded-full bg-[#C2185B] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
        {number}
      </div>
      <p className="text-sm text-[#444] leading-relaxed">{text}</p>
    </div>
  );
}

function BankCard({ bank, isActive, onToggle }: {
  bank: Bank;
  isActive: boolean;
  onToggle: () => void;
}) {
  const [tab, setTab] = useState<"app" | "ussd" | "standing">("app");

  return (
    <div className={cn(
      "border rounded-2xl overflow-hidden transition-all duration-200",
      isActive ? "border-[#C2185B]/30 shadow-lg shadow-[#C2185B]/5" : "border-[#E0E0E0] hover:border-[#C2185B]/20"
    )}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: bank.color }}
          >
            {bank.shortName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-[#1A1A2E] text-sm">{bank.name}</p>
            {bank.supportsStanding && (
              <span className="text-[10px] font-medium text-[#27AE60] flex items-center gap-1 mt-0.5">
                <RefreshCw size={9} /> Supports scheduled transfers
              </span>
            )}
          </div>
        </div>
        <ChevronDown
          size={16}
          className={cn("text-[#666666] transition-transform duration-200", isActive && "rotate-180")}
        />
      </button>

      {/* Body */}
      {isActive && (
        <div className="border-t border-[#E0E0E0] px-5 pb-5 pt-4">
          {/* Tab switcher */}
          <div className="flex gap-1 bg-[#F5F5F5] rounded-xl p-1 mb-5 w-fit">
            <button
              onClick={() => setTab("app")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                tab === "app" ? "bg-white text-[#C2185B] shadow-sm" : "text-[#666666] hover:text-[#1A1A2E]"
              )}
            >
              <Smartphone size={11} className="inline mr-1" /> Mobile App
            </button>
            {bank.ussdSteps && (
              <button
                onClick={() => setTab("ussd")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  tab === "ussd" ? "bg-white text-[#C2185B] shadow-sm" : "text-[#666666] hover:text-[#1A1A2E]"
                )}
              >
                <CreditCard size={11} className="inline mr-1" /> USSD
              </button>
            )}
            {bank.supportsStanding && bank.standingSteps && (
              <button
                onClick={() => setTab("standing")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  tab === "standing" ? "bg-white text-[#C2185B] shadow-sm" : "text-[#666666] hover:text-[#1A1A2E]"
                )}
              >
                <RefreshCw size={11} className="inline mr-1" /> Auto-Transfer
              </button>
            )}
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {(tab === "app" ? bank.appSteps : tab === "ussd" ? bank.ussdSteps! : bank.standingSteps!).map(
              (step, i) => <StepItem key={i} number={i + 1} text={step} />
            )}
          </div>

          {bank.notes && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-2 text-sm text-amber-900">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-amber-500" />
              <span>{bank.notes}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SetupAutoPayPage() {
  const [activeBank, setActiveBank] = useState<string | null>(null);

  return (
    <AuthProvider>
      <Navbar />
      <main className="min-h-screen bg-white pb-20">

        {/* Hero */}
        <div className="bg-[#1A1A2E] pt-28 pb-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#C2185B]/20 border border-[#C2185B]/30 rounded-full px-3 py-1.5 mb-5">
              <RefreshCw size={12} className="text-[#C2185B]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2185B]">Auto-Pay Setup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              Set OOSSPAY as a{" "}
              <span className="text-[#C2185B]">Bank Beneficiary</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
              Add OOSSPAY to your bank contacts once, then transfer funds in seconds — or set up automatic recurring transfers so your savings happen on autopilot.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 pt-12 space-y-12">

          {/* How it works overview */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#C2185B] mb-3">Overview</p>
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">How it works in 4 steps</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  n: 1,
                  title: "Get OOSSPAY's bank details",
                  desc: "Log in to OOSSPAY, go to Deposit Funds, and note the bank name, account number, and account name shown there.",
                },
                {
                  n: 2,
                  title: "Add as a beneficiary",
                  desc: "Open your bank app and save OOSSPAY as a beneficiary. You only do this once — future transfers will be instant.",
                },
                {
                  n: 3,
                  title: "Transfer your savings amount",
                  desc: "Send however much you want to save. Use your bank's scheduled transfer feature to automate this monthly or weekly.",
                },
                {
                  n: 4,
                  title: "Submit a deposit request on OOSSPAY",
                  desc: "After transferring, go to Deposit Funds on OOSSPAY and submit a request. Our team will verify and credit your balance.",
                },
              ].map(({ n, title, desc }) => (
                <div key={n} className="bg-[#FAFAFA] border border-[#E0E0E0] rounded-2xl p-5">
                  <div className="w-8 h-8 rounded-full bg-[#C2185B] text-white text-sm font-bold flex items-center justify-center mb-3">
                    {n}
                  </div>
                  <h3 className="font-semibold text-[#1A1A2E] mb-1">{title}</h3>
                  <p className="text-sm text-[#666666] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1 detail */}
          <div className="bg-[#FCE4EC]/40 border border-[#C2185B]/15 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C2185B] text-white text-sm font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A2E] mb-2">Find OOSSPAY's bank details</h3>
                <p className="text-sm text-[#555] leading-relaxed mb-4">
                  The exact bank name, account number, and account name you need to add as a beneficiary are shown on your Deposit page inside OOSSPAY.
                </p>
                <ol className="space-y-2">
                  {[
                    "Log in to your OOSSPAY account.",
                    "From the sidebar, click Deposit Funds.",
                    "Under Step 1 — Transfer to this account, you will see the bank name, account number, and account name.",
                    "Copy or note these details — you will enter them in your bank app in the next step.",
                  ].map((s, i) => <StepItem key={i} number={i + 1} text={s} />)}
                </ol>
                <Link
                  href="/dashboard/deposit"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C2185B] hover:underline"
                >
                  Go to Deposit page <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          {/* Bank-specific instructions */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#C2185B] mb-3">Step 2 — Add beneficiary</p>
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Instructions for your bank</h2>
            <p className="text-sm text-[#666666] mb-6">
              Select your bank below. Each guide covers adding OOSSPAY as a beneficiary via the mobile app, USSD, and (where supported) setting up automatic recurring transfers.
            </p>

            <div className="space-y-3">
              {BANKS.map((bank) => (
                <BankCard
                  key={bank.id}
                  bank={bank}
                  isActive={activeBank === bank.id}
                  onToggle={() => setActiveBank(activeBank === bank.id ? null : bank.id)}
                />
              ))}
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex gap-2 text-sm text-blue-800">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-blue-500" />
              <span>
                Don&apos;t see your bank? The process is similar across all Nigerian banks — find <strong>Transfer → Other Banks</strong> in your app and add OOSSPAY&apos;s account details. Contact{" "}
                <a href="mailto:hello@oosspay.com" className="underline font-medium">hello@oosspay.com</a> if you need help.
              </span>
            </div>
          </div>

          {/* Auto-transfer tip */}
          <div className="border border-[#27AE60]/25 bg-[#27AE60]/5 rounded-2xl p-6">
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-[#27AE60]/15 flex items-center justify-center shrink-0">
                <RefreshCw size={18} className="text-[#27AE60]" />
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A2E] mb-1">Pro tip: automate it and forget it</h3>
                <p className="text-sm text-[#555] leading-relaxed">
                  Banks that support standing orders (GTBank, Access Bank, First Bank, UBA, Kuda) let you schedule transfers to repeat automatically on the same day every week or month. Set it up once and your savings happen without you needing to remember. Check the <strong>Auto-Transfer</strong> tab inside each bank above to see the exact steps.
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 detail */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#C2185B] mb-3">Step 4 — Confirm your deposit</p>
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Submit a deposit request after every transfer</h2>
            <p className="text-sm text-[#666666] mb-6">
              Because OOSSPAY verifies each deposit manually, you need to submit a deposit request every time you transfer funds — even if you&apos;ve set up automatic bank transfers.
            </p>
            <div className="space-y-3">
              {[
                "After your bank transfer completes, log in to OOSSPAY.",
                "Go to Deposit Funds from the sidebar.",
                "Under Step 2, fill in the amount transferred and the date of transfer.",
                "Optionally upload a screenshot of your bank transfer receipt — this speeds up verification.",
                "If you linked a savings goal earlier, select it from the Savings Goal dropdown.",
                "Tap Submit Deposit Request.",
                "Our team will verify your transfer and confirm the deposit — typically within 1–2 hours on business days.",
                "You will receive a notification once your balance is updated.",
              ].map((s, i) => <StepItem key={i} number={i + 1} text={s} />)}
            </div>
          </div>

          {/* Tips section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={18} className="text-[#F39C12]" />
              <h2 className="text-xl font-bold text-[#1A1A2E]">Tips for consistent savings</h2>
            </div>
            <div className="space-y-3">
              {[
                {
                  title: "Pick a fixed savings day",
                  desc: "Choose a day that aligns with when you receive income — payday, for example. Consistency beats amount.",
                },
                {
                  title: "Start small",
                  desc: "Even ₦5,000 per month adds up. You can increase your contribution at any time by editing the standing order amount in your bank app.",
                },
                {
                  title: "Link transfers to a savings goal",
                  desc: "When submitting your deposit request, select the savings goal you are working toward. This updates the progress bar on your Savings Targets page automatically when the deposit is confirmed.",
                },
                {
                  title: "Upload your receipt",
                  desc: "A screenshot of your bank transfer confirmation helps our team verify your deposit faster — sometimes in minutes instead of hours.",
                },
                {
                  title: "Check your notifications",
                  desc: "OOSSPAY sends you a notification when your deposit is confirmed. If 24 hours have passed and you haven't received one, contact support with your transfer reference.",
                },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-3 items-start">
                  <CheckCircle2 size={16} className="text-[#27AE60] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A2E]">{title}</p>
                    <p className="text-sm text-[#666666] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-[#1A1A2E] rounded-3xl p-8 text-center">
            <h2 className="text-2xl font-extrabold text-white mb-2">Ready to start saving?</h2>
            <p className="text-white/60 text-sm mb-6">
              Get your OOSSPAY account details and make your first deposit today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/deposit"
                className="inline-flex items-center justify-center gap-2 bg-[#C2185B] hover:bg-[#a01549] text-white px-6 py-3 rounded-full font-semibold text-sm transition-all"
              >
                Go to Deposit Page <ArrowRight size={15} />
              </Link>
              <Link
                href="/dashboard/savings"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all"
              >
                Set a Savings Goal
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </AuthProvider>
  );
}
