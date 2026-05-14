"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Shield, AlertTriangle, BadgeCheck, Camera, Loader2 } from "lucide-react";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { getInitials, formatDate } from "@/lib/utils";
import { toast } from "sonner";

const NIGERIAN_BANKS = [
  "Access Bank","Citibank","Ecobank","FCMB","Fidelity Bank","First Bank","GTBank","Heritage Bank",
  "Jaiz Bank","Keystone Bank","Kuda Bank","Opay","PalmPay","Polaris Bank","Providus Bank",
  "Stanbic IBTC","Standard Chartered","Sterling Bank","SunTrust Bank","UBA","Union Bank",
  "Unity Bank","Wema Bank","Zenith Bank",
];

export default function ProfilePage() {
  const { profile, isLoading, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2 MB.");
      return;
    }

    // Immediate local preview
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/profile/avatar", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Could not upload avatar.");
        setAvatarPreview(null);
      } else {
        updateProfile(json.profile);
        toast.success("Profile picture updated!");
      }
    } catch {
      toast.error("Network error. Please try again.");
      setAvatarPreview(null);
    } finally {
      setAvatarUploading(false);
      // Reset input so the same file can be re-selected after an error
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        bank_name: profile.bank_name ?? "",
        bank_account_number: profile.bank_account_number ?? "",
        bank_account_name: profile.bank_account_name ?? "",
      });
    }
  }, [profile, reset]);

  async function onSubmitPersonal(data: ProfileInput) {
    if (!profile) return;
    setSaving(true);
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) {
      toast.error(result.error ?? "Could not update personal information");
    } else {
      updateProfile(result.profile);
      reset({
        full_name: result.profile.full_name ?? "",
        phone: result.profile.phone ?? "",
        bank_name: result.profile.bank_name ?? "",
        bank_account_number: result.profile.bank_account_number ?? "",
        bank_account_name: result.profile.bank_account_name ?? "",
      });
      toast.success("Personal information updated!");
    }
  }

  async function onSubmitBank(data: ProfileInput) {
    if (!profile) return;
    setSaving(true);
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) {
      toast.error(result.error ?? "Could not update bank details");
    } else {
      updateProfile(result.profile);
      reset({
        full_name: result.profile.full_name ?? "",
        phone: result.profile.phone ?? "",
        bank_name: result.profile.bank_name ?? "",
        bank_account_number: result.profile.bank_account_number ?? "",
        bank_account_name: result.profile.bank_account_name ?? "",
      });
      toast.success("Bank details updated!");
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardTopBar title="My Profile" subtitle="Manage your personal information and account settings." />
        <div className="p-5 lg:p-6 space-y-6 max-w-2xl">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-52 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 lg:pb-6">
      <DashboardTopBar title="My Profile" subtitle="Manage your personal information and account settings." />
      <div className="p-5 lg:p-6 space-y-6 max-w-2xl">

      {/* Profile header */}
      <Card>
        <CardContent className="flex items-center gap-5 p-6">
          {/* Avatar with upload overlay */}
          <div className="relative shrink-0 group">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-[#C2185B] flex items-center justify-center text-white text-2xl font-bold">
              {(avatarPreview || profile?.avatar_url) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview ?? profile!.avatar_url!}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                profile?.full_name ? getInitials(profile.full_name) : <User size={28} />
              )}
            </div>

            {/* Upload overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
              aria-label="Change profile picture"
            >
              {avatarUploading
                ? <Loader2 size={18} className="text-white animate-spin" />
                : <Camera size={18} className="text-white" />}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={onAvatarChange}
            />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-lg font-bold text-[#1A1A2E]">{profile?.full_name ?? "—"}</p>
              {profile?.role && (
                <Badge className={
                  profile.role === "super_admin"
                    ? "bg-amber-500 text-white text-[10px] gap-1"
                    : profile.role === "admin"
                    ? "bg-[#C2185B] text-white text-[10px] gap-1"
                    : "bg-[#E0E0E0] text-[#666666] text-[10px] gap-1"
                }>
                  <BadgeCheck size={10} />
                  {profile.role === "super_admin" ? "Super Admin" : profile.role === "admin" ? "Admin" : "Member"}
                </Badge>
              )}
            </div>
            <p className="text-sm text-[#666666]">{profile?.email}</p>
            {profile?.created_at && (
              <p className="text-xs text-[#666666]/70">Member since {formatDate(profile.created_at)}</p>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="text-xs text-[#C2185B] font-medium hover:underline disabled:opacity-50 mt-0.5"
            >
              {avatarUploading ? "Uploading…" : "Change photo"}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Personal info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-[#1A1A2E] flex items-center gap-2">
            <User size={16} className="text-[#C2185B]" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitPersonal)} className="space-y-4">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input placeholder="Your full name" {...register("full_name")}
                className={errors.full_name ? "border-[#E74C3C]" : ""} />
              {errors.full_name && <p className="text-xs text-[#E74C3C]">{errors.full_name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Email Address</Label>
              <Input value={profile?.email ?? ""} disabled className="bg-[#FAFAFA] text-[#666666]" />
              <p className="text-xs text-[#666666]">Contact support to change your email.</p>
            </div>
            <div className="space-y-1">
              <Label>Phone Number</Label>
              <Input placeholder="08012345678" {...register("phone")}
                className={errors.phone ? "border-[#E74C3C]" : ""} />
              {errors.phone && <p className="text-xs text-[#E74C3C]">{errors.phone.message}</p>}
            </div>
            <Button type="submit" disabled={saving} className="bg-[#C2185B] hover:bg-[#a31545] text-white">
              {saving ? "Saving…" : "Update Personal Info"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Bank details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-[#1A1A2E]">Bank Details</CardTitle>
          <p className="text-xs text-[#666666]">These details are used when you request a withdrawal. Make sure they&apos;re accurate.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitBank)} className="space-y-4">
            <div className="space-y-1">
              <Label>Bank Name</Label>
              <select {...register("bank_name")}
                className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C2185B]/30">
                <option value="">Select your bank</option>
                {NIGERIAN_BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Account Number</Label>
              <Input placeholder="10-digit account number" maxLength={10} {...register("bank_account_number")}
                className={errors.bank_account_number ? "border-[#E74C3C]" : ""} />
              {errors.bank_account_number && <p className="text-xs text-[#E74C3C]">{errors.bank_account_number.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Account Name</Label>
              <Input placeholder="Name on bank account" {...register("bank_account_name")} />
            </div>
            <Button type="submit" disabled={saving} className="bg-[#C2185B] hover:bg-[#a31545] text-white">
              {saving ? "Saving…" : "Update Bank Details"}
            </Button>
            <p className="text-xs text-[#666666]">
              Your bank details are only used for processing your withdrawal requests.
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-[#1A1A2E] flex items-center gap-2">
            <Shield size={16} className="text-[#C2185B]" /> Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="border-[#C2185B] text-[#C2185B]">Change Password</Button>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-[#E74C3C]/30">
        <CardHeader>
          <CardTitle className="text-base text-[#E74C3C] flex items-center gap-2">
            <AlertTriangle size={16} /> Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <button onClick={() => setDeleteOpen(true)} className="text-sm text-[#E74C3C] hover:underline font-medium">
            Delete My Account
          </button>
        </CardContent>
      </Card>

      {/* Delete account confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#E74C3C]">Delete Account</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all savings data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <p className="text-sm text-[#666666]">Type <strong>DELETE</strong> to confirm:</p>
            <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="DELETE" />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDeleteOpen(false)} className="flex-1">Cancel</Button>
              <Button
                disabled={deleteConfirm !== "DELETE"}
                className="flex-1 bg-[#E74C3C] hover:bg-red-700 text-white"
                onClick={() => toast.error("Please contact support to delete your account.")}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
