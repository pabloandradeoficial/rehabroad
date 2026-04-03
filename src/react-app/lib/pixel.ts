/**
 * Meta Pixel utility functions
 * Pixel ID: 1446742299615173
 *
 * All functions are no-ops when fbq is not loaded (e.g. dev without internet
 * or ad-blockers), so they never throw in any environment.
 */

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq: (...args: any[]) => void;
    _fbq: unknown;
  }
}

function fbq(...args: unknown[]): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
}

/** Fire on every React Router navigation. */
export function trackPageView(): void {
  fbq("track", "PageView");
}

/**
 * Fire when a new user completes registration / first login.
 * @param email - Optional: passed as hashed data to Meta for audience matching.
 */
export function trackLead(email?: string): void {
  fbq("track", "Lead", email ? { em: email } : {});
}

/**
 * Fire when a user successfully subscribes to a paid plan.
 * @param value - Plan price in the given currency.
 * @param currency - ISO 4217 currency code (e.g. "BRL").
 */
export function trackSubscribe(value: number, currency: string): void {
  fbq("track", "Subscribe", { value, currency });
}

/** Fire when the onboarding tour is fully completed. */
export function trackCompleteRegistration(): void {
  fbq("track", "CompleteRegistration");
}
