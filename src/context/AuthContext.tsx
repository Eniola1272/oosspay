"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";

const IDLE_TIMEOUT_MS  = 30 * 60 * 1000; // 30 minutes → sign out
const IDLE_WARNING_MS  = 25 * 60 * 1000; // 25 minutes → show warning

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  updateProfile: (profile: Profile) => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  isLoading: true,
  isAdmin: false,
  isSuperAdmin: false,
  updateProfile: () => {},
  refreshProfile: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data ?? null);
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await fetchProfile(user.id);
  }, [fetchProfile, user]);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  const forceSignOut = useCallback(async () => {
    setShowWarning(false);
    await supabase.auth.signOut();
    window.location.href = "/login";
  }, [supabase]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    setShowWarning(false);
    warningRef.current = setTimeout(() => setShowWarning(true), IDLE_WARNING_MS);
    timeoutRef.current = setTimeout(forceSignOut, IDLE_TIMEOUT_MS);
  }, [forceSignOut]);

  // Start/stop idle tracking based on auth state
  useEffect(() => {
    if (!user) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowWarning(false);
      return;
    }

    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [user, resetTimer]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchProfile(user.id);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile, supabase]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAdmin: profile?.role === "admin" || profile?.role === "super_admin",
        isSuperAdmin: profile?.role === "super_admin",
        updateProfile: setProfile,
        refreshProfile,
        signOut,
      }}
    >
      {children}

      <Dialog open={showWarning} onOpenChange={() => {}}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Still there?</DialogTitle>
            <DialogDescription>
              Your session will expire in 5 minutes due to inactivity. Click below to stay signed in.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" className="flex-1" onClick={forceSignOut}>
              Sign out
            </Button>
            <Button className="flex-1 bg-[#C2185B] hover:bg-[#a31545] text-white" onClick={resetTimer}>
              Stay signed in
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
