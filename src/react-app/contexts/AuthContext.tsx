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
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      applySession(data.session ?? null);
    } catch (error) {
      console.error("[auth] Falha ao carregar sessão:", error);
      applySession(null);
    } finally {
      setIsPending(false);
    }
  }, [applySession]);

  useEffect(() => {
    let isMounted = true;

    refreshSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      applySession(nextSession ?? null);
      setIsPending(false);
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