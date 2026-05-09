"use client";

import { useState } from "react";
import { MessageCircle, X, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function SupportChatWidget() {
  const { profile } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(true);

  if (dismissed) {
    return (
      <button
        onClick={() => setDismissed(false)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#1A1A2E] text-white shadow-lg flex items-center justify-center hover:bg-[#2a2a4a] transition-colors z-30"
      >
        <MessageCircle size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2">
      {open && (
        <div className="bg-white rounded-2xl shadow-xl border border-[#EBEBEB] w-64 overflow-hidden">
          <div className="flex items-start justify-between p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FCE4EC] flex items-center justify-center">
                <MessageCircle size={15} className="text-[#C2185B]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1A1A2E]">Need Support?</p>
                <p className="text-[10px] text-[#999999]">contact with one of our experts to get support</p>
              </div>
            </div>
            <button onClick={() => setDismissed(true)} className="text-[#AAAAAA] hover:text-[#666666]">
              <X size={13} />
            </button>
          </div>
          <div className="px-4 pb-4">
            <button className="w-full h-8 rounded-lg border border-[#E0E0E0] text-xs font-semibold text-[#1A1A2E] hover:bg-[#F5F5F5] transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      )}

      {/* User chip */}
      {profile && (
        <div className="flex items-center gap-2 bg-white border border-[#EBEBEB] rounded-full px-3 py-1.5 shadow-md">
          <div className="w-6 h-6 rounded-full bg-[#C2185B] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            {profile.full_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[#1A1A2E] leading-none">{profile.full_name?.split(" ")[0]}</p>
            <p className="text-[9px] text-[#999999] leading-none mt-0.5">{profile.email}</p>
          </div>
          <button onClick={() => setOpen(!open)} className="text-[#AAAAAA] hover:text-[#666666] ml-1">
            <ChevronRight size={13} className={`transition-transform ${open ? "rotate-90" : ""}`} />
          </button>
        </div>
      )}
    </div>
  );
}
