"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

export function useBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  async function fetchBalance() {
    if (!user) return;
    setIsLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.rpc as any)("get_user_balance", {
      p_user_id: user.id,
    });
    setBalance(data ?? 0);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return { balance, isLoading, refetch: fetchBalance };
}
