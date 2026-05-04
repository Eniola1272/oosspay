"use client";

import { useAuth } from "@/context/AuthContext";

export function useUser() {
  const { user, profile, isLoading } = useAuth();
  return { user, profile, isLoading };
}
