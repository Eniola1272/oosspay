"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Megaphone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { createClient } from "@/lib/supabase/client";
import {
  depositAccountSchema, announcementSchema,
  type DepositAccountInput, type AnnouncementInput,
} from "@/lib/validations";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import type { Announcement } from "@/types";

const NIGERIAN_BANKS = [
  "Access Bank","Citibank","Ecobank","FCMB","Fidelity Bank","First Bank","GTBank","Heritage Bank",
  "Jaiz Bank","Keystone Bank","Kuda Bank","Opay","PalmPay","Polaris Bank","Providus Bank",
  "Stanbic IBTC","Standard Chartered","Sterling Bank","SunTrust Bank","UBA","Union Bank",
  "Unity Bank","Wema Bank","Zenith Bank",
];

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  const accountForm = useForm<DepositAccountInput>({ resolver: zodResolver(depositAccountSchema) });
  const announcementForm = useForm<AnnouncementInput>({ resolver: zodResolver(announcementSchema) });

  async function loadSettings() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;
    const { data } = await sb.from("platform_settings").select("*").eq("key", "deposit_account").single();
    if (data?.value) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const v = data.value as any;
      accountForm.reset({ bank_name: v.bank_name ?? "", account_number: v.account_number ?? "", account_name: v.account_name ?? "", additional_info: v.additional_info ?? "" });
    }
    setLoadingAccount(false);
  }

  async function loadAnnouncements() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;
    const { data } = await sb.from("platform_settings").select("*").eq("key", "announcements").single();
    if (data?.value && Array.isArray((data.value as { items?: Announcement[] }).items)) {
      setAnnouncements((data.value as { items: Announcement[] }).items);
    }
    setLoadingAnnouncements(false);
  }

  useEffect(() => { loadSettings(); loadAnnouncements(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function onSaveAccount(data: DepositAccountInput) {
    setSavingAccount(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;
    const { error } = await sb.from("platform_settings").upsert({ key: "deposit_account", value: data }, { onConflict: "key" });
    setSavingAccount(false);
    if (error) { toast.error(error.message); } else { toast.success("Deposit account details saved!"); }
  }

  async function onSendAnnouncement(data: AnnouncementInput) {
    setSavingAnnouncement(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;
    const { data: profiles } = await sb.from("profiles").select("id").eq("role", "user");
    const userIds: string[] = (profiles ?? []).map((p: { id: string }) => p.id);

    if (userIds.length > 0) {
      const notifications = userIds.map((uid) => ({ user_id: uid, title: data.title, message: data.body, type: "announcement" }));
      await sb.from("notifications").insert(notifications);
    }

    const newAnnouncement: Announcement = { title: data.title, body: data.body, created_at: new Date().toISOString() };
    const updated = [newAnnouncement, ...announcements].slice(0, 20);
    await sb.from("platform_settings").upsert({ key: "announcements", value: { items: updated } }, { onConflict: "key" });

    setAnnouncements(updated);
    announcementForm.reset();
    setSavingAnnouncement(false);
    toast.success(`Announcement sent to ${userIds.length} member${userIds.length !== 1 ? "s" : ""}!`);
  }

  return (
    <div>
      <AdminTopBar title="Platform Settings" subtitle="Manage deposit account details and member announcements." />

      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[#1A1A2E] flex items-center gap-2">
              <Building2 size={16} className="text-[#C2185B]" /> OOSSPAY Deposit Account
            </CardTitle>
            <p className="text-xs text-[#666666]">Members see these details when making a deposit. Keep them up to date.</p>
          </CardHeader>
          <CardContent>
            {loadingAccount ? (
              <div className="space-y-3"><Skeleton className="h-9 rounded-md" /><Skeleton className="h-9 rounded-md" /><Skeleton className="h-9 rounded-md" /></div>
            ) : (
              <form onSubmit={accountForm.handleSubmit(onSaveAccount)} className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <Label>Bank Name</Label>
                  <select {...accountForm.register("bank_name")} className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C2185B]/30">
                    <option value="">Select bank</option>
                    {NIGERIAN_BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {accountForm.formState.errors.bank_name && <p className="text-xs text-[#E74C3C]">{accountForm.formState.errors.bank_name.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Account Number</Label>
                  <Input placeholder="10-digit account number" maxLength={10} {...accountForm.register("account_number")} className={accountForm.formState.errors.account_number ? "border-[#E74C3C]" : ""} />
                  {accountForm.formState.errors.account_number && <p className="text-xs text-[#E74C3C]">{accountForm.formState.errors.account_number.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Account Name</Label>
                  <Input placeholder="Name on account" {...accountForm.register("account_name")} className={accountForm.formState.errors.account_name ? "border-[#E74C3C]" : ""} />
                  {accountForm.formState.errors.account_name && <p className="text-xs text-[#E74C3C]">{accountForm.formState.errors.account_name.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Additional Info <span className="text-[#666666] font-normal">(optional)</span></Label>
                  <Input placeholder="e.g. Use your name as payment reference" {...accountForm.register("additional_info")} />
                </div>
                <Button type="submit" disabled={savingAccount} className="bg-[#C2185B] hover:bg-[#a31545] text-white">
                  {savingAccount ? "Saving…" : "Save Account Details"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[#1A1A2E] flex items-center gap-2">
              <Megaphone size={16} className="text-[#C2185B]" /> Broadcast Announcement
            </CardTitle>
            <p className="text-xs text-[#666666]">Send a notification to all members at once.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={announcementForm.handleSubmit(onSendAnnouncement)} className="space-y-4 max-w-md">
              <div className="space-y-1">
                <Label>Title</Label>
                <Input placeholder="e.g. Platform Maintenance Notice" {...announcementForm.register("title")} className={announcementForm.formState.errors.title ? "border-[#E74C3C]" : ""} />
                {announcementForm.formState.errors.title && <p className="text-xs text-[#E74C3C]">{announcementForm.formState.errors.title.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Message</Label>
                <textarea {...announcementForm.register("body")} placeholder="Write your announcement here..." rows={4}
                  className={`w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C2185B]/30 resize-none ${announcementForm.formState.errors.body ? "border-[#E74C3C]" : "border-[#E0E0E0]"}`} />
                {announcementForm.formState.errors.body && <p className="text-xs text-[#E74C3C]">{announcementForm.formState.errors.body.message}</p>}
              </div>
              <Button type="submit" disabled={savingAnnouncement} className="bg-[#C2185B] hover:bg-[#a31545] text-white">
                {savingAnnouncement ? "Sending…" : "Send to All Members"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base text-[#1A1A2E]">Announcement History</CardTitle></CardHeader>
          <CardContent className="p-0">
            {loadingAnnouncements ? (
              <div className="divide-y divide-[#E0E0E0]">{[0,1,2].map((i) => <div key={i} className="px-5 py-4 space-y-1.5"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-3 w-3/4" /></div>)}</div>
            ) : announcements.length === 0 ? (
              <div className="py-10 text-center text-[#666666] text-sm"><Clock size={32} className="text-[#666666]/30 mx-auto mb-2" />No announcements sent yet.</div>
            ) : (
              <div className="divide-y divide-[#E0E0E0]">
                {announcements.map((a, i) => (
                  <div key={i} className="px-5 py-4">
                    <div className="flex justify-between items-start gap-3">
                      <p className="font-semibold text-sm text-[#1A1A2E]">{a.title}</p>
                      <p className="text-xs text-[#666666] shrink-0">{formatDateTime(a.created_at)}</p>
                    </div>
                    <p className="text-sm text-[#666666] mt-0.5 line-clamp-2">{a.body}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
