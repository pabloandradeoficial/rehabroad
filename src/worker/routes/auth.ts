 
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import {
  authMiddleware,
  LEGACY_AUTH_COOKIE_NAMES,
  getSupabaseConfig,
  getAuthCallbackUrl,
  envAsRecord,
  envAsStringRecord,
  type HonoApp,
} from "../lib/helpers";

export const authRouter = new Hono<HonoApp>();

// Build Google OAuth redirect URL via Supabase Auth
authRouter.get("/oauth/google/redirect_url", async (c) => {
  try {
    const { apiUrl } = getSupabaseConfig(envAsRecord(c.env));

    if (!apiUrl) {
      return c.json({ error: "Supabase auth is not configured on the worker" }, 500);
    }

    const params = new URLSearchParams({
      provider: "google",
      redirect_to: getAuthCallbackUrl(c),
    });

    const redirectUrl = `${apiUrl.replace(/\/+$/, "")}/auth/v1/authorize?${params.toString()}`;
    return c.json({ redirectUrl }, 200);
  } catch (error) {
    console.error("Failed to build Supabase redirect URL:", error);
    return c.json({ error: "Failed to build redirect URL" }, 500);
  }
});

// Legacy session exchange endpoint kept for compatibility
authRouter.post("/sessions", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const accessToken = body?.access_token || body?.accessToken || null;

  if (typeof accessToken === "string" && accessToken.trim()) {
    return c.json({ success: true }, 200);
  }

  return c.json(
    {
      error: "This endpoint no longer exchanges MOCA auth codes. Complete the Google callback with Supabase on the frontend.",
    },
    400
  );
});

// Get the current user object for the frontend
authRouter.get("/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

// E2E test helper — issues a bypass cookie value so Playwright tests can authenticate.
// Double-gated: returns 403 if ENVIRONMENT === 'production' OR if TEST_SECRET is not set.
authRouter.post("/auth/test-session", async (c) => {
  const env = envAsStringRecord(c.env);

  // Explicit production block — must be first, regardless of other vars
  if (env.ENVIRONMENT === "production") {
    return c.json({ error: "forbidden" }, 403);
  }

  if (!env.TEST_SECRET) {
    return c.json({ error: "forbidden" }, 403);
  }

  const secret = c.req.header("x-test-secret");
  if (!secret || secret !== env.TEST_SECRET) {
    return c.json({ error: "unauthorized" }, 401);
  }

  // Return the bypass cookie value — the test helper injects it into the browser context
  return c.json({
    bypassCookieName: "rehabroad-test-bypass",
    bypassCookieValue: env.TEST_SECRET,
  });
});

// Logout
authRouter.get("/logout", async (c) => {
  for (const cookieName of LEGACY_AUTH_COOKIE_NAMES) {
    setCookie(c, cookieName, "", {
      httpOnly: false,
      path: "/",
      sameSite: "lax",
      secure: true,
      maxAge: 0,
    });
  }

  return c.json({ success: true }, 200);
});
