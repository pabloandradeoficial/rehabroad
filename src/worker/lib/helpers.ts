import type { Context, MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";

export type HonoVariables = {
  user: AppUser;
  accessToken: string;
  requestId: string;
};

export type HonoApp = { Bindings: Env; Variables: HonoVariables };
export type AppContext = Context<HonoApp>;

export type AppUser = {
  id: string;
  email: string;
  name: string | null;
  google_user_data: {
    name: string | null;
    avatar_url: string | null;
  };
  user_metadata?: Record<string, unknown> | null;
  app_metadata?: Record<string, unknown> | null;
};

export type D1InsertResult = {
  meta?: {
    last_row_id?: number | string | null;
  } | null;
};

export const LEGACY_AUTH_COOKIE_NAMES = [
  "mocha_session_token",
  "MOCHA_SESSION_TOKEN",
  "sb-access-token",
  "supabase-access-token",
];

// Cloudflare's generated `Env` is a closed interface (no index signature), so it
// won't structurally cast to `Record<string, ...>`. These helpers do the necessary
// `as unknown as Record<...>` once instead of scattering it across files.
export function envAsRecord(env: Env | undefined): Record<string, unknown> | undefined {
  return env as unknown as Record<string, unknown> | undefined;
}

export function envAsStringRecord(env: Env): Record<string, string | undefined> {
  return env as unknown as Record<string, string | undefined>;
}

export const OWNER_ADMIN_EMAILS = [
  "pabloandradeoficial@gmail.com",
  "rehabroadoficial@gmail.com",
  "pablo.andrade@professor.unis.edu.br",
  "centrofisioconsultorio@gmail.com"
];

export function getOwnerAdminEmail(env?: Record<string, unknown>): string {
  const fromEnv = getEnvString(env, "ADMIN_EMAIL");
  return fromEnv ?? OWNER_ADMIN_EMAILS[0];
}

export function isOwnerAdminEmail(email: string | null | undefined, env?: Record<string, unknown>): boolean {
  if (typeof email !== "string") return false;
  const normalizedUserEmail = email.trim().toLowerCase();
  
  const fromEnv = getEnvString(env, "ADMIN_EMAIL");
  if (fromEnv && normalizedUserEmail === fromEnv.trim().toLowerCase()) {
    return true;
  }
  
  return OWNER_ADMIN_EMAILS.includes(normalizedUserEmail);
}

export function extractTokenFromCookieValue(cookieValue: string): string | null {
  if (typeof cookieValue !== "string" || !cookieValue.trim()) {
    return null;
  }

  let parsedValue = cookieValue.trim();

  if (parsedValue.startsWith("base64-")) {
    try {
      parsedValue = atob(parsedValue.slice(7));
    } catch {
      // Ignore invalid base64 cookie values
    }
  }

  try {
    const jsonValue = JSON.parse(parsedValue);

    if (
      Array.isArray(jsonValue) &&
      typeof jsonValue[0] === "string" &&
      jsonValue[0]
    ) {
      return jsonValue[0];
    }

    if (
      jsonValue &&
      typeof jsonValue.access_token === "string" &&
      jsonValue.access_token
    ) {
      return jsonValue.access_token;
    }
  } catch {
    // Ignore non-JSON cookie values
  }

  if (parsedValue.split(".").length === 3) {
    return parsedValue;
  }

  return null;
}

function getPossibleAuthCookieNames(c: AppContext): string[] {
  const cookieNames = new Set<string>(LEGACY_AUTH_COOKIE_NAMES);

  const rawCookieHeader =
    c.req.header("cookie") || c.req.header("Cookie") || "";

  for (const chunk of rawCookieHeader.split(";")) {
    const separatorIndex = chunk.indexOf("=");
    if (separatorIndex === -1) continue;

    const cookieName = chunk.slice(0, separatorIndex).trim();

    if (!cookieName) continue;

    if (/^sb-.*-auth-token(?:\.\d+)?$/i.test(cookieName)) {
      cookieNames.add(cookieName);
    }

    if (/^supabase-auth-token(?:\.\d+)?$/i.test(cookieName)) {
      cookieNames.add(cookieName);
    }
  }

  return Array.from(cookieNames);
}

export function getEnvString(env: Record<string, unknown> | undefined, key: string): string | null {
  if (!env || !(key in env)) {
    return null;
  }

  const raw = env[key];

  if (raw === null || raw === undefined) {
    return null;
  }

  if (typeof raw === "string") {
    const normalized = raw.trim();
    return normalized || null;
  }

  if (raw instanceof String) {
    const normalized = raw.toString().trim();
    return normalized || null;
  }

  return null;
}

export function getSupabaseConfig(env: Record<string, unknown> | undefined) {
  const apiUrl =
    getEnvString(env, "SUPABASE_URL") ??
    getEnvString(env, "VITE_SUPABASE_URL");

  const anonKey =
    getEnvString(env, "SUPABASE_ANON_KEY") ??
    getEnvString(env, "VITE_SUPABASE_ANON_KEY");

  return { apiUrl, anonKey };
}

export function sanitizeBaseUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
}

export function getAppBaseUrl(c: AppContext): string {
  const env = envAsRecord(c.env);

  const configuredBaseUrl = sanitizeBaseUrl(
    getEnvString(env, "PUBLIC_APP_URL") ??
      getEnvString(env, "SITE_URL") ??
      getEnvString(env, "APP_URL")
  );

  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  const requestUrl = new URL(c.req.url);
  if (!requestUrl.hostname.includes("workers.dev")) {
    return `${requestUrl.protocol}//${requestUrl.host}`;
  }

  return "https://rehabroad.com.br";
}

const ALLOWED_REDIRECT_HOSTS = ["rehabroad.com.br", "localhost", "127.0.0.1"];

function isSafeRedirectUrl(url: URL): boolean {
  const hostname = url.hostname.toLowerCase();
  return ALLOWED_REDIRECT_HOSTS.some(
    (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`)
  );
}

export function getAuthCallbackUrl(c: AppContext): string {
  const env = envAsRecord(c.env);
  const queryRedirect = c.req.query("redirectTo") || c.req.query("redirect_to");

  if (typeof queryRedirect === "string" && queryRedirect.trim()) {
    try {
      const redirectUrl = new URL(queryRedirect.trim());
      if (
        (redirectUrl.protocol === "https:" || redirectUrl.protocol === "http:") &&
        isSafeRedirectUrl(redirectUrl)
      ) {
        return redirectUrl.toString();
      }
    } catch {
      // Ignore invalid redirect URL from querystring
    }
  }

  const configuredCallbackUrl =
    getEnvString(env, "SUPABASE_AUTH_CALLBACK_URL") ??
    getEnvString(env, "AUTH_CALLBACK_URL");

  if (configuredCallbackUrl) {
    return configuredCallbackUrl;
  }

  return `${getAppBaseUrl(c)}/auth/callback`;
}

function extractAccessToken(c: AppContext): string | null {
  const authorizationHeader =
    c.req.header("authorization") || c.req.header("Authorization");

  if (authorizationHeader && /^Bearer\s+/i.test(authorizationHeader)) {
    const token = authorizationHeader.replace(/^Bearer\s+/i, "").trim();
    if (token) {
      return token;
    }
  }

  for (const cookieName of getPossibleAuthCookieNames(c)) {
    const cookieValue = getCookie(c, cookieName);
    const extractedToken = extractTokenFromCookieValue(cookieValue ?? "");

    if (extractedToken) {
      return extractedToken;
    }
  }

  return null;
}

async function getSupabaseUserFromAccessToken(
  accessToken: string,
  env: Record<string, unknown> | undefined
): Promise<AppUser | null> {
  const { apiUrl, anonKey } = getSupabaseConfig(env);

  if (!apiUrl || !anonKey) {
    throw new Error(
      "SUPABASE_URL/VITE_SUPABASE_URL e SUPABASE_ANON_KEY/VITE_SUPABASE_ANON_KEY não estão configurados no worker."
    );
  }

  const response = await fetch(`${apiUrl.replace(/\/+$/, "")}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Supabase user lookup failed (${response.status}): ${errorText || response.statusText}`
    );
  }

  const rawUser = (await response.json()) as Record<string, unknown>;
  const metadata = ((rawUser.user_metadata ?? rawUser.raw_user_meta_data ?? {}) as Record<string, unknown>);

  const resolvedName =
    (typeof metadata.full_name === "string" && metadata.full_name.trim()) ||
    (typeof metadata.name === "string" && metadata.name.trim()) ||
    (typeof rawUser.email === "string" && rawUser.email.includes("@")
      ? rawUser.email.split("@")[0]
      : null);

  const email = typeof rawUser.email === "string" ? rawUser.email : "";
  const id = typeof rawUser.id === "string" ? rawUser.id : "";

  if (!id || !email) {
    return null;
  }

  return {
    id,
    email,
    name: resolvedName,
    google_user_data: {
      name: resolvedName,
      avatar_url: typeof metadata.avatar_url === "string" ? metadata.avatar_url : null,
    },
    user_metadata: metadata as Record<string, unknown>,
    app_metadata: (rawUser.app_metadata ?? null) as Record<string, unknown> | null,
  };
}

export const authMiddleware: MiddlewareHandler<HonoApp> = async (c, next) => {
  // E2E test bypass — requires ENVIRONMENT !== 'production' AND TEST_SECRET set
  const _env = envAsStringRecord(c.env);
  const envTestSecret = _env.TEST_SECRET;
  const isProduction = _env.ENVIRONMENT === "production";
  if (!isProduction && envTestSecret) {
    const bypassCookie = getCookie(c, "rehabroad-test-bypass");
    if (bypassCookie === envTestSecret) {
      const testEmail = _env.TEST_USER_EMAIL ?? "e2e@rehabroad.local";
      c.set("user", {
        id: "e2e-test-user",
        email: testEmail,
        name: "E2E Test User",
        google_user_data: { name: "E2E Test User", avatar_url: null },
      });
      c.set("accessToken", "e2e-test-token");
      await next();
      return;
    }
  }

  try {
    const accessToken = extractAccessToken(c);

    if (!accessToken) {
      return c.json(
        { error: "Unauthorized", reason: "missing_access_token" },
        401
      );
    }

    const user = await getSupabaseUserFromAccessToken(
      accessToken,
      envAsRecord(c.env)
    );

    if (!user) {
      return c.json(
        { error: "Unauthorized", reason: "invalid_or_expired_token" },
        401
      );
    }

    c.set("user", user);
    c.set("accessToken", accessToken);
    await next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    return c.json(
      {
        error: "Unauthorized",
        reason:
          error instanceof Error ? error.message : "auth_middleware_failed",
      },
      401
    );
  }
};

export const optionalAuthMiddleware: MiddlewareHandler<HonoApp> = async (c, next) => {
  try {
    const accessToken = extractAccessToken(c);

    if (accessToken) {
      const user = await getSupabaseUserFromAccessToken(
        accessToken,
        envAsRecord(c.env)
      );

      if (user) {
        c.set("user", user);
        c.set("accessToken", accessToken);
      }
    }
  } catch (error) {
    console.error("Optional auth middleware error:", error);
  }

  await next();
};

export function getInsertedId(result: unknown): number | string | null {
  if (!result || typeof result !== "object") {
    return null;
  }

  const meta = (result as D1InsertResult).meta;
  if (!meta || typeof meta !== "object") {
    return null;
  }

  return meta.last_row_id ?? null;
}

export function normalizeDelimitedTextValue(value: unknown): string | null {
  if (Array.isArray(value)) {
    const normalized = value
      .map((item) => String(item).trim())
      .filter(Boolean)
      .join(", ");
    return normalized || null;
  }

  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized || null;
  }

  return null;
}

export function splitDelimitedText(value: unknown): string[] {
  const normalized = normalizeDelimitedTextValue(value);
  if (!normalized) {
    return [];
  }

  return normalized
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function normalizeCaminhoRecord<T extends Record<string, unknown> | null>(record: T) {
  if (!record) {
    return null;
  }

  const painPattern = normalizeDelimitedTextValue(
    record.pain_pattern ?? record.pain_patterns
  );

  return {
    ...record,
    pain_pattern: painPattern,
    pain_patterns: painPattern,
  };
}
