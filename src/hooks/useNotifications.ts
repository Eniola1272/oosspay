"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { AppNotification } from "@/types";

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  async function fetchNotifications() {
    if (!user) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    const list = (data ?? []) as AppNotification[];
    setNotifications(list);
    setUnreadCount(list.filter((n) => !n.is_read).length);
    setIsLoading(false);
  }

  async function markAllRead() {
    if (!user) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("notifications") as any)
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    await fetchNotifications();
  }

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return { notifications, unreadCount, isLoading, refetch: fetchNotifications, markAllRead };
}
