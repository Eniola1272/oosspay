"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { Plus, Target, Pencil, Trash2 } from "lucide-react";
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
import { createClient } from "@/lib/supabase/client";
import { savingsTargetSchema, type SavingsTargetInput } from "@/lib/validations";
import { toast } from "sonner";
import type { SavingsTarget } from "@/types";

function TargetModal({
  open, onClose, editing, onSaved
}: {
  open: boolean; onClose: () => void; editing?: SavingsTarget | null; onSaved: () => void;
}) {
  const { user } = useAuth();
  const supabase = createClient();
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;
    if (editing) {
      const { error } = await sb.from("savings_targets").update({
        name: data.name, target_amount: data.target_amount, deadline: data.deadline || null,
      }).eq("id", editing.id);
      if (error) { toast.error(error.message); } else { toast.success("Target updated!"); onSaved(); onClose(); }
    } else {
      const { error } = await sb.from("savings_targets").insert({
        user_id: user.id, name: data.name, target_amount: data.target_amount, deadline: data.deadline || null,
      });
      if (error) { toast.error(error.message); } else { toast.success("Target created!"); onSaved(); onClose(); }
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
            <Button type="button" variant="outline" onClick={() => { onClose(); reset(); }} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-[#C2185B] hover:bg-[#a31545] text-white">
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
  const supabase = createClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SavingsTarget | null>(null);

  const active = targets.filter((t) => t.status === "active");
  const completed = targets.filter((t) => t.status === "completed");

  async function deleteTarget(id: string) {
    if (!confirm("Delete this savings target?")) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("savings_targets").delete().eq("id", id);
    if (error) { toast.error(error.message); } else { toast.success("Target deleted"); refetch(); }
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E]">My Savings Targets</h1>
          <p className="text-sm text-[#666666] mt-1">Set goals, track your progress, and celebrate every milestone.</p>
        </div>
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
                <div key={t.id} className="relative group">
                  <SavingsTargetCard target={t} />
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditing(t); setModalOpen(true); }}
                      className="p-1.5 bg-white rounded-lg border border-[#E0E0E0] hover:border-[#C2185B] text-[#666666] hover:text-[#C2185B]">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => deleteTarget(t.id)}
                      className="p-1.5 bg-white rounded-lg border border-[#E0E0E0] hover:border-[#E74C3C] text-[#666666] hover:text-[#E74C3C]">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
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
  );
}
