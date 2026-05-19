"use client";

import { useState } from "react";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { Plus, Target } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { SavingsTargetCard } from "@/components/dashboard/SavingsTargetCard";
import { useSavingsTargets } from "@/hooks/useSavingsTargets";
import { useAuth } from "@/context/AuthContext";
import { savingsTargetSchema, type SavingsTargetInput } from "@/lib/validations";
import { toast } from "sonner";
import type { SavingsTarget } from "@/types";

function TargetModal({
  open, onClose, editing, onSaved
}: {
  open: boolean; onClose: () => void; editing?: SavingsTarget | null; onSaved: () => void | Promise<void>;
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SavingsTargetInput>({
    resolver: zodResolver(savingsTargetSchema),
    defaultValues: editing ? {
      name: editing.name,
      target_amount: editing.target_amount,
      deadline: editing.deadline ?? "",
    } : {},
  });

  async function onSubmit(data: SavingsTargetInput) {
    if (!user) return;
    setLoading(true);
    if (editing) {
      const response = await fetch("/api/savings-targets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing.id, ...data }),
      });
      const result = await response.json();
      if (!response.ok) { toast.error(result.error ?? "Could not update target"); } else { toast.success("Target updated!"); await onSaved(); onClose(); }
    } else {
      const response = await fetch("/api/savings-targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) { toast.error(result.error ?? "Could not create target"); } else { toast.success("Target created!"); await onSaved(); onClose(); }
    }
    setLoading(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); reset(); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Savings Target" : "Create a New Savings Target"}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-[#666666] -mt-2">
          Give your goal a name, set an amount, and optionally pick a deadline. We&apos;ll track the rest.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label>Target Name</Label>
            <Input placeholder="e.g. Rent Fund, New Phone, Emergency Savings" {...register("name")}
              className={errors.name ? "border-[#E74C3C]" : ""} />
            {errors.name && <p className="text-xs text-[#E74C3C]">{errors.name.message}</p>}
          </div>
          <div className="space-y-1">
            <Label>Target Amount (₦)</Label>
            <Input type="number" placeholder="e.g. 200000" {...register("target_amount", { valueAsNumber: true })}
              className={errors.target_amount ? "border-[#E74C3C]" : ""} />
            {errors.target_amount && <p className="text-xs text-[#E74C3C]">{errors.target_amount.message}</p>}
          </div>
          <div className="space-y-1">
            <Label>Deadline (Optional)</Label>
            <Input type="date" {...register("deadline")} min={new Date().toISOString().split("T")[0]} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => { onClose(); reset(); }} className="flex-1 h-12 rounded-xl">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1 h-12 rounded-xl bg-[#C2185B] hover:bg-[#a31545] text-white">
              {loading ? "Saving…" : editing ? "Save Changes" : "Create Target"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function SavingsPage() {
  const { targets, isLoading, refetch } = useSavingsTargets();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SavingsTarget | null>(null);

  const active = targets.filter((t) => t.status === "active");
  const completed = targets.filter((t) => t.status === "completed");

  async function deleteTarget(id: string) {
    if (!confirm("Delete this savings target?")) return;
    const response = await fetch(`/api/savings-targets?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) { toast.error(result.error ?? "Could not delete target"); } else { toast.success("Target deleted"); refetch(); }
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 lg:pb-6">
      <DashboardTopBar title="My Savings Targets" subtitle="Set goals, track your progress, and celebrate every milestone." />
      <div className="p-5 lg:p-6 space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => { setEditing(null); setModalOpen(true); }}
            className="bg-[#C2185B] hover:bg-[#a31545] text-white">
            <Plus size={16} className="mr-2" /> Create New Target
          </Button>
        </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[0,1,2].map((i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      ) : active.length === 0 && completed.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E0E0E0] py-20 text-center space-y-4">
          <Target size={48} className="text-[#C2185B]/30 mx-auto" />
          <div>
            <p className="text-lg font-bold text-[#1A1A2E]">You Haven&apos;t Set Any Targets Yet</p>
            <p className="text-sm text-[#666666] mt-1 max-w-xs mx-auto">
              People who set specific savings goals save 3x more than those who don&apos;t. Name your goal, set an amount, and let OOSSPAY help you get there.
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="bg-[#C2185B] hover:bg-[#a31545] text-white">
            Create My First Target
          </Button>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4">
              {active.map((t) => (
                <SavingsTargetCard
                  key={t.id}
                  target={t}
                  onEdit={() => { setEditing(t); setModalOpen(true); }}
                  onDelete={() => deleteTarget(t.id)}
                />
              ))}
            </div>
          )}

          {completed.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer list-none flex items-center gap-2 text-sm font-semibold text-[#666666] hover:text-[#1A1A2E]">
                <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
                Completed Targets ({completed.length})
              </summary>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {completed.map((t) => <SavingsTargetCard key={t.id} target={t} />)}
              </div>
            </details>
          )}
        </>
      )}

        <TargetModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          editing={editing}
          onSaved={refetch}
        />
      </div>
    </div>
  );
}
