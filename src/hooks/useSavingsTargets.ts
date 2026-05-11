"use client";

import { useCallback, useEffect, useState } from "react";
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
    const response = await fetch("/api/savings-targets");
    const result = await response.json().catch(() => ({ targets: [] }));

    if (response.ok) {
      setTargets(
        ((result.targets ?? []) as SavingsTarget[]).map((target) => ({
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTargets();
  }, [fetchTargets]);

  return { targets, isLoading, refetch: fetchTargets };
}
