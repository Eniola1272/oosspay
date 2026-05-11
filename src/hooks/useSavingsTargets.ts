"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { SavingsTarget } from "@/types";

export function useSavingsTargets() {
  const { user } = useAuth();
  const [targets, setTargets] = useState<SavingsTarget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTargets = useCallback(async () => {
    if (!user) {
      setTargets([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("savings_targets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTargets(
        (data ?? []).map((target: any) => ({
          ...target,
          status: target.status ?? "active",
          current_amount: Number(target.current_amount ?? 0),
          target_amount: Number(target.target_amount),
        }))
      );
    }

    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  return { targets, isLoading, refetch: fetchTargets };
}
