import { supabase } from "@/react-app/lib/supabase";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function extractAccessTokenFromUnknown(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "string") {
    if (value.startsWith("eyJ")) return value;

    const parsed = safeJsonParse(value);
    if (parsed) {
      return extractAccessTokenFromUnknown(parsed);
    }

    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const token = extractAccessTokenFromUnknown(item);
      if (token) return token;
    }
    return null;
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;

    const directToken =
      typeof record.access_token === "string" ? record.access_token : null;
    if (directToken) return directToken;

    const nestedCandidates = [
      record.currentSession,
      record.session,
      record.data,
      record.user,
    ];

    for (const candidate of nestedCandidates) {
      const token = extractAccessTokenFromUnknown(candidate);
      if (token) return token;
    }
  }

  return null;
}

function readTokenFromStorage(storage: Storage | undefined): string | null {
  if (!storage) return null;

  const keys = Object.keys(storage).sort((a, b) => {
    const aScore =
      /(supabase|auth|token|sb-)/i.test(a) ? 1 : 0;
    const bScore =
      /(supabase|auth|token|sb-)/i.test(b) ? 1 : 0;
    return bScore - aScore;
  });

  for (const key of keys) {
    const rawValue = storage.getItem(key);
    if (!rawValue) continue;

    const token = extractAccessTokenFromUnknown(rawValue);
    if (token) return token;
  }

  return null;
}

function readTokenFromLocation(): string | null {
  if (!isBrowser()) return null;

  const hash = window.location.hash?.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;

  if (hash) {
    const hashParams = new URLSearchParams(hash);
    const hashToken = hashParams.get("access_token");
    if (hashToken) return hashToken;
  }

  const queryToken = new URLSearchParams(window.location.search).get("access_token");
  if (queryToken) return queryToken;

  return null;
}

async function getAccessToken(): Promise<string | null> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      return session.access_token;
    }
  } catch {
    // segue para os fallbacks
  }

  const locationToken = readTokenFromLocation();
  if (locationToken) return locationToken;

  if (isBrowser()) {
    const localToken = readTokenFromStorage(window.localStorage);
    if (localToken) return localToken;

    const sessionToken = readTokenFromStorage(window.sessionStorage);
    if (sessionToken) return sessionToken;
  }

  return null;
}

async function doAuthenticatedFetch(
  input: string,
  init: RequestInit,
  accessToken: string | null
): Promise<Response> {
  const headers = new Headers(init.headers || {});

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData;

  if (init.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });
}

export async function apiFetch(
  input: string,
  init: RequestInit = {}
): Promise<Response> {
  const firstToken = await getAccessToken();
  let response = await doAuthenticatedFetch(input, init, firstToken);

  if (response.status !== 401) {
    return response;
  }

  const secondToken = await getAccessToken();

  if (!secondToken || secondToken === firstToken) {
    return response;
  }

  response = await doAuthenticatedFetch(input, init, secondToken);
  return response;
}