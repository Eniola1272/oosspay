"use client";

import { useState } from "react";
import { MessageCircle, X, Mail, Phone, ChevronRight } from "lucide-react";

const WHATSAPP_NUMBER = "2348000000000"; // replace with real number
const SUPPORT_EMAIL   = "support@oosspay.com";

export function SupportWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 flex flex-col items-end gap-3">

      {/* Card */}
      {open && (
        <div className="w-72 bg-white rounded-2xl shadow-xl border border-[#EBEBEB] overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">

          {/* Header */}
          <div className="bg-gradient-to-br from-[#C2185B] via-[#8e1244] to-[#4A0820] px-5 py-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Need Support?</p>
                <p className="text-white/70 text-xs mt-0.5">We typically reply within 2 hours</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition-colors mt-0.5"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-3">
            <p className="text-xs text-[#666666] leading-relaxed">
              Our support team is available <strong className="text-[#1A1A2E]">Mon – Fri, 8am – 6pm WAT</strong>.
              Reach us through any channel below.
            </p>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20OOSSPAY%20Support%2C%20I%20need%20help%20with%20my%20account.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                {/* WhatsApp icon */}
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A1A2E]">WhatsApp</p>
                <p className="text-xs text-[#666666]">Chat with us directly</p>
              </div>
              <ChevronRight size={14} className="text-[#999999] group-hover:text-[#25D366] transition-colors" />
            </a>

            {/* Email */}
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=OOSSPAY Support Request`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FAFAFA] hover:bg-[#F0F0F0] border border-[#E0E0E0] transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-[#C2185B]/10 flex items-center justify-center shrink-0">
                <Mail size={15} className="text-[#C2185B]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A1A2E]">Email</p>
                <p className="text-xs text-[#666666] truncate">{SUPPORT_EMAIL}</p>
              </div>
              <ChevronRight size={14} className="text-[#999999] group-hover:text-[#C2185B] transition-colors" />
            </a>

            {/* Call */}
            <a
              href="tel:+2348000000000"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FAFAFA] hover:bg-[#F0F0F0] border border-[#E0E0E0] transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-[#1A1A2E]/10 flex items-center justify-center shrink-0">
                <Phone size={15} className="text-[#1A1A2E]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A1A2E]">Call us</p>
                <p className="text-xs text-[#666666]">+234 800 000 0000</p>
              </div>
              <ChevronRight size={14} className="text-[#999999] group-hover:text-[#1A1A2E] transition-colors" />
            </a>
          </div>

          {/* Footer */}
          <div className="px-5 pb-4">
            <p className="text-[10px] text-[#999999] text-center">
              OOSSPAY Financial · Secure & Confidential
            </p>
          </div>
        </div>
      )}

      {/* Floating bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close support" : "Open support"}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 group ${
          open
            ? "bg-[#1A1A2E] rotate-0 scale-95"
            : "bg-gradient-to-br from-[#C2185B] to-[#4A0820] hover:scale-110 shadow-[#C2185B]/40"
        }`}
      >
        {open
          ? <X size={20} className="text-white" />
          : <MessageCircle size={22} className="text-white" />}
      </button>

    </div>
  );
}
