/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/react-app/lib/supabase";

// E2E test bypass — only active in Vite dev mode
function getE2eBypassUser(): { session: Session; user: User } | null {
  if (!import.meta.env.DEV) return null;
  
  const fakeUser = {
    id: "e2e-test-user",
    email: "pabloandradeoficial@gmail.com",
    role: "authenticated",
    aud: "authenticated",
    app_metadata: {},
    user_metadata: { name: "E2E Test User" },
    created_at: new Date().toISOString(),
  } as unknown as User;
  return { user: fakeUser, session: { user: fakeUser } as unknown as Session };
}

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isPending: boolean;
  isConfigured: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AppAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);

  const applySession = useCallback((nextSession: Session | null) => {
    setSession(nextSession);
    setUser(nextSession?.user ?? null);
  }, []);

  const refreshSession = useCallback(async () => {
    // E2E bypass: skip Supabase entirely in dev when test cookie is present
    const e2e = getE2eBypassUser();
    if (e2e) {
      applySession(e2e.session);
      setIsPending(false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      applySession(data.session ?? null);
    } catch (error) {
      applySession(null);
    } finally {
      setIsPending(false);
    }
  }, [applySession]);

  useEffect(() => {
    let isMounted = true;

    refreshSession();

    // Skip Supabase listener in E2E mode — bypass already applied
    if (getE2eBypassUser()) {
      return () => { isMounted = false; };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      applySession(nextSession ?? null);
      // Do NOT call setIsPending(false) here.
      // isPending is controlled solely by refreshSession() so that
      // INITIAL_SESSION(null) — fired by Supabase before the real session
      // is visible — cannot prematurely unblock the route tree with
      // user=null, which would send ProtectedDashboard to /login mid-load.
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [applySession, refreshSession]);

  const loginWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured) {
      throw new Error(
        "Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY."
      );
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "select_account",
          access_type: "offline",
        },
      },
    });

    if (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    applySession(null);
  }, [applySession]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      isPending,
      isConfigured: isSupabaseConfigured,
      loginWithGoogle,
      logout,
      refreshSession,
    }),
    [user, session, isPending, loginWithGoogle, logout, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAppAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAppAuth must be used within AppAuthProvider");
  }

  return context;
}