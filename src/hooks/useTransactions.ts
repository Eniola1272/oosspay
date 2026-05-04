"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { Transaction } from "@/types";

export function useTransactions(limit = 20) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  async function fetchTransactions() {
    if (!user) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);
    setTransactions(data ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return { transactions, isLoading, refetch: fetchTransactions };
}
