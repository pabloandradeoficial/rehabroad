import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAppAuth } from "@/react-app/contexts/AuthContext";

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
  is_active: boolean | number; // SQLite returns 0/1
  is_admin: boolean | number; // SQLite returns 0/1
  status: SubscriptionStatus;
  effective_status: SubscriptionStatus;
  started_at: string | null;
  expires_at: string | null;
  trial_start_date: string | null;
  trial_days_remaining: number | null;
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

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, isPending } = useAppAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    if (isPending) {
      return;
    }

    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/subscription");

      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSubscription();
  }, [user, isPending]);

  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  const activatePlan = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/subscription/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_type: "monthly" }),
      });

      if (res.ok) {
        await refreshSubscription();
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error activating plan:", error);
      return false;
    }
  };

  // SQLite returns booleans as 0/1 integers
  const isAdmin =
    subscription?.is_admin === true || subscription?.is_admin === 1;

  // Get effective status (backend already handles admin → active_paid mapping)
  const effectiveStatus =
    subscription?.effective_status || subscription?.status;

  // User has premium access if:
  // 1. Is admin (backend maps to active_paid), OR
  // 2. Status is beta_trial (within 30 days), OR
  // 3. Status is active_paid (paid subscription)
  const isBetaTrial = effectiveStatus === "beta_trial" && !isAdmin;
  const isActivePaid = effectiveStatus === "active_paid" || isAdmin;
  const isFreeLimited =
    !isAdmin &&
    (effectiveStatus === "free_limited" ||
      effectiveStatus === "canceled" ||
      effectiveStatus === "inactive");

  const isPremium = isAdmin || isBetaTrial || isActivePaid;
  const trialDaysRemaining = subscription?.trial_days_remaining ?? null;

  return (
    <SubscriptionContext.Provider
      value={{
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
      }}
    >
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