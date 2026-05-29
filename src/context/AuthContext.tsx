"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";

const IDLE_TIMEOUT_MS  = 30 * 60 * 1000; // 30 minutes → sign out
const IDLE_WARNING_MS  = 25 * 60 * 1000; // 25 minutes → show warning
const LAST_ACTIVE_KEY  = "oosspay_last_active";      // persists across browser closes
const PERSIST_THROTTLE = 60_000;                     // write localStorage at most once/min

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

  const fetchProfile = useCallback(async (_userId: string) => {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) {
        // Do NOT silently assign role:"user" — leave profile null so isAdmin/isSuperAdmin
        // correctly return false. The UI will retry on the next auth state change.
        console.warn("[AuthContext] /api/profile returned", response.status);
        setProfile(null);
        return;
      }
      const result = await response.json();
      setProfile(result.profile ?? null);
    } catch (e) {
      // Keep current profile on transient network errors rather than wiping admin access
      console.warn("[AuthContext] /api/profile network error", e);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await fetchProfile(user.id);
  }, [fetchProfile, user]);

  async function signOut() {
    localStorage.removeItem(LAST_ACTIVE_KEY);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  const forceSignOut = useCallback(async () => {
    localStorage.removeItem(LAST_ACTIVE_KEY);
    setShowWarning(false);
    await supabase.auth.signOut();
    window.location.href = "/login";
  }, [supabase]);

  // Write last-active to localStorage (throttled — avoids a write on every mousemove)
  const persistLastActive = useCallback(() => {
    const now = Date.now();
    const stored = Number(localStorage.getItem(LAST_ACTIVE_KEY) ?? 0);
    if (now - stored > PERSIST_THROTTLE) {
      localStorage.setItem(LAST_ACTIVE_KEY, String(now));
    }
  }, []);

  // Check whether the stored last-active time has already passed the idle threshold.
  // Used on mount and when the user switches back to this tab.
  const checkSessionExpiry = useCallback(async () => {
    const stored = localStorage.getItem(LAST_ACTIVE_KEY);
    if (stored && Date.now() - Number(stored) > IDLE_TIMEOUT_MS) {
      await forceSignOut();
    }
  }, [forceSignOut]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    setShowWarning(false);
    persistLastActive();
    warningRef.current = setTimeout(() => setShowWarning(true), IDLE_WARNING_MS);
    timeoutRef.current = setTimeout(forceSignOut, IDLE_TIMEOUT_MS);
  }, [forceSignOut, persistLastActive]);

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

    // When the user returns to this tab after being away, check whether the
    // persisted last-active time already passed the threshold.
    const handleVisibility = () => {
      if (document.visibilityState === "visible") checkSessionExpiry();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      document.removeEventListener("visibilitychange", handleVisibility);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [user, resetTimer, checkSessionExpiry]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        // Sign out immediately if the session went idle while the browser was closed
        const stored = localStorage.getItem(LAST_ACTIVE_KEY);
        if (stored && Date.now() - Number(stored) > IDLE_TIMEOUT_MS) {
          localStorage.removeItem(LAST_ACTIVE_KEY);
          await supabase.auth.signOut();
          window.location.href = "/login";
          return;
        }
        // Seed the timestamp on first load so future checks have a reference point
        if (!stored) localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
        await fetchProfile(user.id);
      }
      setUser(user);
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
