import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAppAuth } from "@/react-app/contexts/AuthContext";
import { apiFetch } from "@/react-app/lib/api";

type SubscriptionStatus =
  | "beta_trial"
  | "active_paid"
  | "free_limited"
  | "canceled"
  | "inactive";

interface Subscription {
  id: number;
  user_id: string;
  plan_type: "free" | "monthly";
  is_active: boolean | number;
  is_admin: boolean | number;
  status: SubscriptionStatus;
  effective_status: SubscriptionStatus;
  started_at: string | null;
  expires_at: string | null;
  trial_start_date: string | null;
  trial_days_remaining: number | null;
  is_premium?: boolean;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  isPremium: boolean;
  isAdmin: boolean;
  isBetaTrial: boolean;
  isActivePaid: boolean;
  isFreeLimited: boolean;
  trialDaysRemaining: number | null;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
  activatePlan: () => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

async function parseJsonSafely<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, isPending } = useAppAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (isPending) {
      return;
    }

    if (!user) {
      setSubscription(null);
      setSubscriptionLoading(false);
      return;
    }

    try {
      setSubscriptionLoading(true);

      const res = await apiFetch("/api/subscription", {
        method: "GET",
        cache: "no-store",
      });

      if (res.status === 401) {
        setSubscription(null);
        return;
      }

      if (!res.ok) {
        const errorData = await parseJsonSafely<{ error?: string }>(res);
        throw new Error(errorData?.error || "Erro ao carregar assinatura");
      }

      const data = await parseJsonSafely<Subscription>(res);
      setSubscription(data ?? null);
    } catch (error) {
      console.error("[subscription] Error fetching subscription:", error);
      setSubscription(null);
    } finally {
      setSubscriptionLoading(false);
    }
  }, [user, isPending]);

  useEffect(() => {
    void fetchSubscription();
  }, [fetchSubscription]);

  const refreshSubscription = useCallback(async () => {
    await fetchSubscription();
  }, [fetchSubscription]);

  const activatePlan = useCallback(async (): Promise<boolean> => {
    try {
      const res = await apiFetch("/api/subscription/activate", {
        method: "POST",
        body: JSON.stringify({ plan_type: "monthly" }),
      });

      if (!res.ok) {
        return false;
      }

      await fetchSubscription();
      return true;
    } catch (error) {
      console.error("[subscription] Error activating plan:", error);
      return false;
    }
  }, [fetchSubscription]);

  const isAdmin = Boolean(subscription?.is_admin);

  const effectiveStatus =
    subscription?.effective_status || subscription?.status || "inactive";

  const isBetaTrial = effectiveStatus === "beta_trial" && !isAdmin;
  const isActivePaid = effectiveStatus === "active_paid" || isAdmin;
  const isFreeLimited =
    !isAdmin &&
    (effectiveStatus === "free_limited" ||
      effectiveStatus === "canceled" ||
      effectiveStatus === "inactive");

  const isPremium = isAdmin || isBetaTrial || isActivePaid;
  const trialDaysRemaining = subscription?.trial_days_remaining ?? null;
  const loading = isPending || subscriptionLoading;

  const value = useMemo<SubscriptionContextType>(
    () => ({
      subscription,
      isPremium,
      isAdmin,
      isBetaTrial,
      isActivePaid,
      isFreeLimited,
      trialDaysRemaining,
      loading,
      refreshSubscription,
      activatePlan,
    }),
    [
      subscription,
      isPremium,
      isAdmin,
      isBetaTrial,
      isActivePaid,
      isFreeLimited,
      trialDaysRemaining,
      loading,
      refreshSubscription,
      activatePlan,
    ]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);

  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }

  return context;
}