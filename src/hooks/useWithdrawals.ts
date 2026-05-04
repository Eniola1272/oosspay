"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { WithdrawalRequest } from "@/types";

export function useWithdrawals() {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  async function fetchWithdrawals() {
    if (!user) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("withdrawal_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setWithdrawals(data ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchWithdrawals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return { withdrawals, isLoading, refetch: fetchWithdrawals };
}
