"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { SavingsTarget } from "@/types";

export function useSavingsTargets() {
  const { user } = useAuth();
  const [targets, setTargets] = useState<SavingsTarget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  async function fetchTargets() {
    if (!user) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("savings_targets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setTargets(data ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchTargets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return { targets, isLoading, refetch: fetchTargets };
}
