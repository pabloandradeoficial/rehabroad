import { Hono } from "hono";
import Stripe from "stripe";
import { Resend } from "resend";
import { getCookie, setCookie } from "hono/cookie";
import { getSEOForRoute, injectSEOTags } from "./seo";

const app = new Hono<{ Bindings: Env }>();

type AppUser = {
  id: string;
  email: string;
  name: string | null;
  google_user_data: {
    name: string | null;
    avatar_url: string | null;
  };
  user_metadata?: Record<string, any> | null;
  app_metadata?: Record<string, any> | null;
};

const LEGACY_AUTH_COOKIE_NAMES = [
  "mocha_session_token",
  "MOCHA_SESSION_TOKEN",
  "sb-access-token",
  "supabase-access-token",
];

const OWNER_ADMIN_EMAIL = "pabloandradeoficial@gmail.com";

function isOwnerAdminEmail(email: string | null | undefined): boolean {
  return typeof email === "string" && email.trim().toLowerCase() === OWNER_ADMIN_EMAIL;
}

function extractTokenFromCookieValue(cookieValue: string): string | null {
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

function getPossibleAuthCookieNames(c: any): string[] {
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

function getEnvString(env: Record<string, unknown> | undefined, key: string): string | null {
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

function getSupabaseConfig(env: Record<string, unknown> | undefined) {
  const apiUrl =
    getEnvString(env, "SUPABASE_URL") ??
    getEnvString(env, "VITE_SUPABASE_URL");

  const anonKey =
    getEnvString(env, "SUPABASE_ANON_KEY") ??
    getEnvString(env, "VITE_SUPABASE_ANON_KEY");

  return { apiUrl, anonKey };
}

function sanitizeBaseUrl(value: string | null): string | null {
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

function getAppBaseUrl(c: any): string {
  const env = c.env as Record<string, unknown> | undefined;

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

function getAuthCallbackUrl(c: any): string {
  const env = c.env as Record<string, unknown> | undefined;
  const queryRedirect = c.req.query("redirectTo") || c.req.query("redirect_to");

  if (typeof queryRedirect === "string" && queryRedirect.trim()) {
    try {
      const redirectUrl = new URL(queryRedirect.trim());
      if (redirectUrl.protocol === "https:" || redirectUrl.protocol === "http:") {
        return redirectUrl.toString();
      }
    } catch {
      // Ignore invalid redirect URL from querystring
    }
  }

  const configuredCallbackUrl = getEnvString(env, "SUPABASE_AUTH_CALLBACK_URL") ??
    getEnvString(env, "AUTH_CALLBACK_URL");

  if (configuredCallbackUrl) {
    return configuredCallbackUrl;
  }

  return `${getAppBaseUrl(c)}/auth/callback`;
}

function extractAccessToken(c: any): string | null {
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
    throw new Error("SUPABASE_URL/VITE_SUPABASE_URL e SUPABASE_ANON_KEY/VITE_SUPABASE_ANON_KEY não estão configurados no worker.");
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

  const rawUser = (await response.json()) as Record<string, any>;
  const metadata = (rawUser.user_metadata ?? rawUser.raw_user_meta_data ?? {}) as Record<string, any>;

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
    user_metadata: metadata,
    app_metadata: (rawUser.app_metadata ?? null) as Record<string, any> | null,
  };
}

const authMiddleware = async (c: any, next: any) => {
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
      c.env as Record<string, unknown> | undefined
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


type D1InsertResult = {
  meta?: {
    last_row_id?: number | string | null;
  } | null;
};

function getInsertedId(result: unknown): number | string | null {
  if (!result || typeof result !== "object") {
    return null;
  }

  const meta = (result as D1InsertResult).meta;
  if (!meta || typeof meta !== "object") {
    return null;
  }

  return meta.last_row_id ?? null;
}

function normalizeDelimitedTextValue(value: unknown): string | null {
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

function splitDelimitedText(value: unknown): string[] {
  const normalized = normalizeDelimitedTextValue(value);
  if (!normalized) {
    return [];
  }

  return normalized
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeCaminhoRecord<T extends Record<string, any> | null>(record: T) {
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

// HTTPS Redirect Middleware: Force HTTPS on custom domains
app.use("*", async (c, next) => {
  const url = new URL(c.req.url);
  const proto = c.req.header("x-forwarded-proto") || url.protocol.replace(":", "");
  
  // Check if request is HTTP (not HTTPS) on custom domain
  if (proto === "http" && !url.hostname.includes("localhost")) {
    const httpsUrl = `https://${url.hostname}${url.pathname}${url.search}`;
    return c.redirect(httpsUrl, 301);
  }
  
  // Redirect www to non-www
  if (url.hostname.startsWith("www.")) {
    const nonWwwUrl = `https://${url.hostname.replace("www.", "")}${url.pathname}${url.search}`;
    return c.redirect(nonWwwUrl, 301);
  }
  
  return next();
});

// SEO Middleware: Inject meta tags for Googlebot on page requests
app.use("*", async (c, next) => {
  const url = new URL(c.req.url);
  const pathname = url.pathname;
  
  // Skip API routes, static assets, and special files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/assets/") ||
    pathname.includes(".") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return next();
  }
  
  // Check if this is a bot that needs pre-rendered meta tags
  const userAgent = c.req.header("user-agent") || "";
  const isBot = /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|discordbot/i.test(userAgent);
  
  // Get SEO data for this route
  const seo = getSEOForRoute(pathname);
  
  // If it's a bot and we have SEO data, inject it
  if (isBot && seo) {
    // Fetch the original HTML from the static assets
    const assetUrl = new URL("/", c.req.url);
    const response = await fetch(assetUrl.toString(), {
      headers: { "Accept": "text/html" }
    });
    
    if (response.ok) {
      let html = await response.text();
      html = injectSEOTags(html, seo);
      
      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  }
  
  return next();
});

// ============ STUDENT PROGRESS ENDPOINTS ============

// Optional auth middleware for students (doesn't throw, just sets user if logged in)
const optionalAuthMiddleware = async (c: any, next: any) => {
  try {
    const accessToken = extractAccessToken(c);

    if (accessToken) {
      const user = await getSupabaseUserFromAccessToken(
        accessToken,
        c.env as Record<string, unknown> | undefined
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

// Get student progress
app.get("/api/student/progress", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ loggedIn: false, progress: null }, 200);
  }

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM student_progress WHERE user_id = ?"
  ).bind(user.id).all();

  if (results.length === 0) {
    // Create initial progress record
    await c.env.DB.prepare(`
      INSERT INTO student_progress (user_id, user_email, user_name, modules_visited)
      VALUES (?, ?, ?, ?)
    `).bind(
      user.id,
      user.email,
      user.google_user_data?.name || user.email,
      "[]"
    ).run();

    return c.json({
      loggedIn: true,
      user: { id: user.id, email: user.email, name: user.google_user_data?.name },
      progress: {
        cases_completed: 0,
        cases_correct: 0,
        modules_visited: [],
        last_module: null,
        total_time_minutes: 0,
        xp: 0,
        streak: 0,
        last_streak_date: null,
        daily_challenge_date: null,
        daily_challenge_case_id: null,
        avatar_url: null
      }
    }, 200);
  }

  const progress = results[0] as any;
  return c.json({
    loggedIn: true,
    user: { id: user.id, email: user.email, name: user.google_user_data?.name },
    progress: {
      ...progress,
      modules_visited: (() => { try { return JSON.parse(progress.modules_visited || "[]"); } catch { return []; } })()
    }
  }, 200);
});

// Update student progress
app.post("/api/student/progress", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Not logged in" }, 401);
  }

  const body = await c.req.json();
  const { cases_completed, cases_correct, module_visited, time_spent_minutes, daily_completed, xp_earned } = body;

  const today = new Date().toISOString().split('T')[0];

  // Get current progress
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM student_progress WHERE user_id = ?"
  ).bind(user.id).all();

  if (results.length === 0) {
    // Create new record
    const modules = module_visited ? [module_visited] : [];
    const newStreak = daily_completed ? 1 : 0;
    const newXp = xp_earned || 0;
    
    await c.env.DB.prepare(`
      INSERT INTO student_progress (user_id, user_email, user_name, cases_completed, cases_correct, modules_visited, last_module, total_time_minutes, xp, streak, last_streak_date, daily_challenge_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      user.id,
      user.email,
      user.google_user_data?.name || user.email,
      cases_completed || 0,
      cases_correct || 0,
      JSON.stringify(modules),
      module_visited || null,
      time_spent_minutes || 0,
      newXp,
      newStreak,
      daily_completed ? today : null,
      daily_completed ? today : null
    ).run();
  } else {
    // Update existing record
    const current = results[0] as any;
    let modulesVisited: string[] = [];
    try { modulesVisited = JSON.parse(current.modules_visited || "[]"); } catch { modulesVisited = []; }
    
    if (module_visited && !modulesVisited.includes(module_visited)) {
      modulesVisited.push(module_visited);
    }

    // Calculate new values - INCREMENT cases instead of replacing
    const newCasesCompleted = (current.cases_completed || 0) + (cases_completed || 0);
    const newCasesCorrect = (current.cases_correct || 0) + (cases_correct || 0);

    // Calculate new streak
    let newStreak = current.streak || 0;
    let newXp = current.xp || 0;

    // Add XP from any case (not just daily)
    if (xp_earned && xp_earned > 0) {
      newXp += xp_earned;
    }

    if (daily_completed && current.daily_challenge_date !== today) {
      // Note: XP already added above, don't add again

      // Calculate streak
      const lastDate = current.last_streak_date;
      if (lastDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastDate === yesterdayStr) {
          // Consecutive day - increment streak
          newStreak = (current.streak || 0) + 1;
        } else if (lastDate === today) {
          // Already did today - keep streak
          newStreak = current.streak || 1;
        } else {
          // Streak broken - reset to 1
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }
    }

    await c.env.DB.prepare(`
      UPDATE student_progress 
      SET cases_completed = ?, 
          cases_correct = ?, 
          modules_visited = ?,
          last_module = COALESCE(?, last_module),
          total_time_minutes = total_time_minutes + ?,
          xp = ?,
          streak = ?,
          last_streak_date = CASE WHEN ? = 1 THEN ? ELSE last_streak_date END,
          daily_challenge_date = CASE WHEN ? = 1 THEN ? ELSE daily_challenge_date END,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).bind(
      newCasesCompleted,
      newCasesCorrect,
      JSON.stringify(modulesVisited),
      module_visited,
      time_spent_minutes || 0,
      newXp,
      newStreak,
      daily_completed ? 1 : 0,
      today,
      daily_completed ? 1 : 0,
      today,
      user.id
    ).run();
  }

  return c.json({ success: true }, 200);
});

// Student Ranking - Top students by clinical performance
app.get("/api/student/ranking", async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT 
      user_id,
      user_name,
      avatar_url,
      xp,
      cases_completed,
      cases_correct,
      streak,
      CASE 
        WHEN cases_completed > 0 
        THEN ROUND((cases_correct * 100.0 / cases_completed), 0) 
        ELSE 0 
      END as accuracy
    FROM student_progress
    WHERE cases_completed > 0
    ORDER BY accuracy DESC, cases_completed DESC, cases_correct DESC, xp DESC, streak DESC, user_name ASC
    LIMIT 50
  `).all();

  const ranking = (results || []).map((row: any, index: number) => ({
    rank: index + 1,
    user_id: row.user_id ?? null,
    user_name: row.user_name ?? null,
    avatar_url: row.avatar_url ?? null,
    xp: Number(row.xp ?? 0),
    cases_completed: Number(row.cases_completed ?? 0),
    cases_correct: Number(row.cases_correct ?? 0),
    streak: Number(row.streak ?? 0),
    accuracy: Number(row.accuracy ?? 0),
  }));

  return c.json({ ranking }, 200);
});

// ============ STUDENT AVATAR ENDPOINTS ============

// Upload student avatar
app.post("/api/student/avatar", authMiddleware, async (c) => {
  const user = c.get("user");
  
  const formData = await c.req.formData();
  const file = formData.get("avatar") as File;
  
  if (!file) {
    return c.json({ error: "No file uploaded" }, 400);
  }
  
  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return c.json({ error: "Invalid file type. Use JPEG, PNG, WebP or GIF." }, 400);
  }
  
  // Max 2MB
  if (file.size > 2 * 1024 * 1024) {
    return c.json({ error: "File too large. Max 2MB." }, 400);
  }
  
  const ext = file.name.split('.').pop() || 'jpg';
  const key = `student-avatars/${user!.id}.${ext}`;
  
  // Upload to R2
  await c.env.R2_BUCKET.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
  });
  
  const avatarUrl = `/api/student/avatar/${user!.id}.${ext}`;
  
  // Update database with avatar URL
  await c.env.DB.prepare(`
    UPDATE student_progress SET avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?
  `).bind(avatarUrl, user!.id).run();
  
  return c.json({ success: true, avatarUrl }, 200);
});

// Get student avatar
app.get("/api/student/avatar/:filename", async (c) => {
  const filename = c.req.param("filename");
  const key = `student-avatars/${filename}`;
  
  const object = await c.env.R2_BUCKET.get(key);
  
  if (!object) {
    return c.json({ error: "Avatar not found" }, 404);
  }
  
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=86400");
  
  return new Response(object.body, { headers });
});

// Delete student avatar
app.delete("/api/student/avatar", authMiddleware, async (c) => {
  const user = c.get("user");
  
  // Get current avatar URL to find the key
  const { results } = await c.env.DB.prepare(
    "SELECT avatar_url FROM student_progress WHERE user_id = ?"
  ).bind(user!.id).all();
  
  if (results.length > 0 && results[0].avatar_url) {
    const avatarUrl = results[0].avatar_url as string;
    const filename = avatarUrl.split('/').pop();
    if (filename) {
      await c.env.R2_BUCKET.delete(`student-avatars/${filename}`);
    }
  }
  
  // Clear avatar URL in database
  await c.env.DB.prepare(`
    UPDATE student_progress SET avatar_url = NULL, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?
  `).bind(user!.id).run();
  
  return c.json({ success: true }, 200);
});

// ============ STUDENT COMMUNITY ENDPOINTS ============

// Get student community posts
app.get("/api/student/community/posts", async (c) => {
  const category = c.req.query("category");
  
  let query = `
    SELECT p.*, 
      (SELECT COUNT(*) FROM student_comments WHERE post_id = p.id) as comments_count
    FROM student_posts p
  `;
  
  if (category && category !== 'all') {
    query += ` WHERE p.category = ?`;
  }
  query += ` ORDER BY p.created_at DESC LIMIT 100`;
  
  const stmt = category && category !== 'all' 
    ? c.env.DB.prepare(query).bind(category)
    : c.env.DB.prepare(query);
  
  const { results } = await stmt.all();
  return c.json({ posts: results }, 200);
});

// Get single post with comments
app.get("/api/student/community/posts/:id", async (c) => {
  const postId = c.req.param("id");
  
  const { results: postResults } = await c.env.DB.prepare(
    "SELECT * FROM student_posts WHERE id = ?"
  ).bind(postId).all();
  
  if (postResults.length === 0) {
    return c.json({ error: "Post not found" }, 404);
  }
  
  const { results: comments } = await c.env.DB.prepare(
    "SELECT * FROM student_comments WHERE post_id = ? ORDER BY is_solution DESC, likes_count DESC, created_at ASC"
  ).bind(postId).all();
  
  return c.json({ post: postResults[0], comments }, 200);
});

// Create post (requires auth)
app.post("/api/student/community/posts", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Login required" }, 401);
  }
  
  const body = await c.req.json();
  const { category, title, content } = body;
  
  if (!category || !title || !content) {
    return c.json({ error: "Missing required fields" }, 400);
  }
  
  const userName = user.google_user_data?.name || user.email.split('@')[0];
  
  const result = await c.env.DB.prepare(`
    INSERT INTO student_posts (user_id, user_name, user_email, category, title, content)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(user.id, userName, user.email, category, title, content).run();
  
  return c.json({ success: true, postId: getInsertedId(result) }, 201);
});

// Create comment (requires auth)
app.post("/api/student/community/posts/:id/comments", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Login required" }, 401);
  }
  
  const postId = c.req.param("id");
  const body = await c.req.json();
  const { content } = body;
  
  if (!content) {
    return c.json({ error: "Content required" }, 400);
  }
  
  const userName = user.google_user_data?.name || user.email.split('@')[0];
  
  await c.env.DB.prepare(`
    INSERT INTO student_comments (post_id, user_id, user_name, user_email, content)
    VALUES (?, ?, ?, ?, ?)
  `).bind(postId, user.id, userName, user.email, content).run();
  
  // Update comments count
  await c.env.DB.prepare(`
    UPDATE student_posts SET comments_count = comments_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).bind(postId).run();
  
  return c.json({ success: true }, 201);
});

// Like post (requires auth)
app.post("/api/student/community/posts/:id/like", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Login required" }, 401);
  }
  
  const postId = c.req.param("id");
  
  // Check if already liked
  const { results: existing } = await c.env.DB.prepare(
    "SELECT id FROM student_likes WHERE user_id = ? AND post_id = ?"
  ).bind(user.id, postId).all();
  
  if (existing.length > 0) {
    // Unlike
    await c.env.DB.prepare("DELETE FROM student_likes WHERE user_id = ? AND post_id = ?").bind(user.id, postId).run();
    await c.env.DB.prepare("UPDATE student_posts SET likes_count = likes_count - 1 WHERE id = ?").bind(postId).run();
    return c.json({ liked: false }, 200);
  } else {
    // Like
    await c.env.DB.prepare("INSERT INTO student_likes (user_id, post_id) VALUES (?, ?)").bind(user.id, postId).run();
    await c.env.DB.prepare("UPDATE student_posts SET likes_count = likes_count + 1 WHERE id = ?").bind(postId).run();
    return c.json({ liked: true }, 200);
  }
});

// Like comment (requires auth)
app.post("/api/student/community/comments/:id/like", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Login required" }, 401);
  }
  
  const commentId = c.req.param("id");
  
  const { results: existing } = await c.env.DB.prepare(
    "SELECT id FROM student_likes WHERE user_id = ? AND comment_id = ?"
  ).bind(user.id, commentId).all();
  
  if (existing.length > 0) {
    await c.env.DB.prepare("DELETE FROM student_likes WHERE user_id = ? AND comment_id = ?").bind(user.id, commentId).run();
    await c.env.DB.prepare("UPDATE student_comments SET likes_count = likes_count - 1 WHERE id = ?").bind(commentId).run();
    return c.json({ liked: false }, 200);
  } else {
    await c.env.DB.prepare("INSERT INTO student_likes (user_id, comment_id) VALUES (?, ?)").bind(user.id, commentId).run();
    await c.env.DB.prepare("UPDATE student_comments SET likes_count = likes_count + 1 WHERE id = ?").bind(commentId).run();
    return c.json({ liked: true }, 200);
  }
});

// Mark comment as solution (post author only)
app.post("/api/student/community/comments/:id/solution", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Login required" }, 401);
  }
  
  const commentId = c.req.param("id");
  
  // Get comment and post
  const { results: commentResults } = await c.env.DB.prepare(
    "SELECT c.*, p.user_id as post_author_id FROM student_comments c JOIN student_posts p ON c.post_id = p.id WHERE c.id = ?"
  ).bind(commentId).all();
  
  if (commentResults.length === 0) {
    return c.json({ error: "Comment not found" }, 404);
  }
  
  const comment = commentResults[0] as any;
  
  // Check if user is post author
  if (comment.post_author_id !== user.id) {
    return c.json({ error: "Only post author can mark solution" }, 403);
  }
  
  // Toggle solution
  const newStatus = comment.is_solution ? 0 : 1;
  
  // Remove any existing solution on this post
  await c.env.DB.prepare("UPDATE student_comments SET is_solution = 0 WHERE post_id = ?").bind(comment.post_id).run();
  
  if (newStatus === 1) {
    await c.env.DB.prepare("UPDATE student_comments SET is_solution = 1 WHERE id = ?").bind(commentId).run();
    await c.env.DB.prepare("UPDATE student_posts SET solution_comment_id = ? WHERE id = ?").bind(commentId, comment.post_id).run();
  } else {
    await c.env.DB.prepare("UPDATE student_posts SET solution_comment_id = NULL WHERE id = ?").bind(comment.post_id).run();
  }
  
  return c.json({ is_solution: newStatus === 1 }, 200);
});

// Get user's liked posts/comments
app.get("/api/student/community/likes", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ post_ids: [], comment_ids: [] }, 200);
  }
  
  const { results } = await c.env.DB.prepare(
    "SELECT post_id, comment_id FROM student_likes WHERE user_id = ?"
  ).bind(user.id).all();
  
  const post_ids = results.filter((r: any) => r.post_id).map((r: any) => r.post_id);
  const comment_ids = results.filter((r: any) => r.comment_id).map((r: any) => r.comment_id);
  
  return c.json({ post_ids, comment_ids }, 200);
});

// Edit comment (owner only)
app.put("/api/student/community/comments/:id", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Login required" }, 401);
  }
  
  const commentId = c.req.param("id");
  const body = await c.req.json();
  const { content } = body;
  
  if (!content?.trim()) {
    return c.json({ error: "Content required" }, 400);
  }
  
  // Check ownership
  const { results } = await c.env.DB.prepare(
    "SELECT user_id FROM student_comments WHERE id = ?"
  ).bind(commentId).all();
  
  if (results.length === 0) {
    return c.json({ error: "Comment not found" }, 404);
  }
  
  if ((results[0] as any).user_id !== user.id) {
    return c.json({ error: "Not authorized" }, 403);
  }
  
  await c.env.DB.prepare(
    "UPDATE student_comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(content.trim(), commentId).run();
  
  return c.json({ success: true }, 200);
});

// Delete comment (owner only)
app.delete("/api/student/community/comments/:id", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Login required" }, 401);
  }
  
  const commentId = c.req.param("id");
  
  // Check ownership and get post_id
  const { results } = await c.env.DB.prepare(
    "SELECT user_id, post_id, is_solution FROM student_comments WHERE id = ?"
  ).bind(commentId).all();
  
  if (results.length === 0) {
    return c.json({ error: "Comment not found" }, 404);
  }
  
  const comment = results[0] as any;
  
  if (comment.user_id !== user.id) {
    return c.json({ error: "Not authorized" }, 403);
  }
  
  // Delete comment
  await c.env.DB.prepare("DELETE FROM student_comments WHERE id = ?").bind(commentId).run();
  
  // Update comments count
  await c.env.DB.prepare(
    "UPDATE student_posts SET comments_count = comments_count - 1 WHERE id = ?"
  ).bind(comment.post_id).run();
  
  // If it was a solution, clear it
  if (comment.is_solution) {
    await c.env.DB.prepare(
      "UPDATE student_posts SET solution_comment_id = NULL WHERE id = ?"
    ).bind(comment.post_id).run();
  }
  
  // Delete associated likes
  await c.env.DB.prepare("DELETE FROM student_likes WHERE comment_id = ?").bind(commentId).run();
  
  return c.json({ success: true }, 200);
});

// Delete post (owner only)
app.delete("/api/student/community/posts/:id", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Login required" }, 401);
  }
  
  const postId = c.req.param("id");
  
  // Check ownership
  const { results } = await c.env.DB.prepare(
    "SELECT user_id FROM student_posts WHERE id = ?"
  ).bind(postId).all();
  
  if (results.length === 0) {
    return c.json({ error: "Post not found" }, 404);
  }
  
  if ((results[0] as any).user_id !== user.id) {
    return c.json({ error: "Not authorized" }, 403);
  }
  
  // Delete all associated data
  await c.env.DB.prepare("DELETE FROM student_likes WHERE post_id = ?").bind(postId).run();
  await c.env.DB.prepare("DELETE FROM student_likes WHERE comment_id IN (SELECT id FROM student_comments WHERE post_id = ?)").bind(postId).run();
  await c.env.DB.prepare("DELETE FROM student_comments WHERE post_id = ?").bind(postId).run();
  await c.env.DB.prepare("DELETE FROM student_posts WHERE id = ?").bind(postId).run();
  
  return c.json({ success: true }, 200);
});

// Admin: Get all students
app.get("/api/admin/students", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user || !isOwnerAdminEmail(user.email)) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const { results } = await c.env.DB.prepare(`
    SELECT * FROM student_progress ORDER BY updated_at DESC
  `).all();

  const students = results.map((s: any) => ({
    ...s,
    modules_visited: (() => { try { return JSON.parse(s.modules_visited || "[]"); } catch { return []; } })()
  }));

  // Get stats
  const totalStudents = students.length;
  const activeToday = students.filter((s: any) => {
    const updated = new Date(s.updated_at);
    const today = new Date();
    return updated.toDateString() === today.toDateString();
  }).length;
  const totalCases = students.reduce((sum: number, s: any) => sum + (s.cases_completed || 0), 0);
  const avgAccuracy = students.length > 0
    ? Math.round(students.reduce((sum: number, s: any) => {
        if (s.cases_completed > 0) {
          return sum + ((s.cases_correct / s.cases_completed) * 100);
        }
        return sum;
      }, 0) / students.filter((s: any) => s.cases_completed > 0).length) || 0
    : 0;

  return c.json({
    students,
    stats: {
      totalStudents,
      activeToday,
      totalCases,
      avgAccuracy
    }
  }, 200);
});

// Static pages for sitemap
const STATIC_PAGES = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/blog", priority: "0.9", changefreq: "daily" },
  { url: "/biblioteca", priority: "0.9", changefreq: "weekly" },
  { url: "/comparacao", priority: "0.8", changefreq: "monthly" },
  { url: "/fisioterapia-ortopedica", priority: "0.8", changefreq: "monthly" },
  { url: "/fisioterapia-esportiva", priority: "0.8", changefreq: "monthly" },
  { url: "/fisioterapia-neurologica", priority: "0.8", changefreq: "monthly" },
  { url: "/estudante", priority: "0.8", changefreq: "weekly" },
  { url: "/login", priority: "0.5", changefreq: "monthly" },
  { url: "/termos-de-uso", priority: "0.3", changefreq: "yearly" },
  { url: "/politica-de-privacidade", priority: "0.3", changefreq: "yearly" },
];

// Clinical library slugs for sitemap
const BIBLIOTECA_SLUGS = [
  // Testes Ortopédicos (40+)
  "teste-neer", "teste-hawkins-kennedy", "teste-jobe", "teste-drop-arm", "teste-speed", "teste-yergason",
  "teste-obrien", "teste-cross-body", "teste-apprehension", "teste-relocation", "teste-sulcus",
  "teste-lachman", "teste-gaveta-anterior", "teste-gaveta-posterior", "teste-pivot-shift",
  "teste-mcmurray", "teste-apley", "teste-thessaly", "teste-steinmann",
  "teste-lasegue", "teste-slump", "teste-elevacao-perna-reta", "teste-femoral-stretch",
  "teste-spurling", "teste-distracao-cervical", "teste-compressao-jackson", "teste-valsalva",
  "teste-faber-patrick", "teste-thomas", "teste-ober", "teste-trendelenburg", "teste-impacto-quadril",
  "teste-gaveta-anterior-tornozelo", "teste-tilt-talar", "teste-thompson", "teste-squeeze-tornozelo",
  "teste-phalen", "teste-tinel-punho", "teste-finkelstein", "teste-cozen",
  // Patologias (60+)
  "cervicalgia", "hernia-cervical", "lombalgia", "hernia-lombar", "estenose-lombar",
  "sindrome-impacto", "capsulite-adesiva", "lesao-manguito", "lesao-lca", "lesao-meniscal",
  "condromalacia", "entorse-tornozelo", "tendinopatia-aquiles", "fascite-plantar",
  "impacto-femoroacetabular", "sindrome-piriforme", "epicondilite-lateral", "tunel-carpo", "dor-toracica",
  "avc-isquemico-reabilitacao", "doenca-parkinson-fisioterapia", "esclerose-multipla-reabilitacao",
  "lesao-medular-reabilitacao", "paralisia-cerebral-fisioterapia", "artrite-reumatoide-fisioterapia",
  "fibromialgia-tratamento", "espondilite-anquilosante-exercicio", "lupus-eritematoso-sistemico-exercicio",
  "dpoc-reabilitacao-pulmonar", "asma-exercicio-fisioterapia", "tendinopatia-patelar-jumpers-knee",
  "sindrome-do-estresse-tibial-medial", "lesao-muscular-isquiotibiais", "ruptura-tendao-aquiles",
  "fratura-radio-distal-reabilitacao", "fratura-quadril-idoso", "artroplastia-total-joelho-reabilitacao",
  "artroplastia-total-quadril-reabilitacao", "reconstrucao-lca-reabilitacao", "instabilidade-cronica-tornozelo",
  "sindrome-dor-regional-complexa-crps", "dor-lombar-cronica-nao-especifica", "cefaleia-tensional-cronica",
  "disfuncao-temporomandibular-dtm", "vertigem-posicional-paroxistica-benigna", "neuropatia-periferica-diabetica",
  "sindrome-fadiga-cronica-encefalomielite-mialgica", "sindrome-pos-covid-covid-longa",
  "sarcopenia-idoso", "osteoporose-exercicio-prevencao-fraturas",
  // Recursos Terapêuticos (20)
  "tens-convencional", "tens-acupuntura", "fes-estimulacao-eletrica-funcional", "corrente-russa-kotz",
  "ultrassom-terapeutico", "laser-baixa-potencia", "ondas-curtas", "crioterapia-terapeutica",
  "termoterapia-calor", "terapia-combinada", "mobilizacao-maitland", "manipulacao-thrust",
  "liberacao-miofascial", "dry-needling", "kinesio-taping", "exercicio-terapeutico",
  "hidroterapia", "eletroestimulacao-transcraniana", "biofeedback", "realidade-virtual-reabilitacao",
  // Avaliação Clínica (37)
  "avaliacao-ombro-geral", "avaliacao-instabilidade-ombro", "avaliacao-manguito-rotador",
  "avaliacao-escapula", "avaliacao-capsulite-adesiva", "avaliacao-cervical-geral",
  "avaliacao-radiculopatia-cervical", "avaliacao-cefaleia-cervicogenica", "avaliacao-instabilidade-cervical",
  "avaliacao-cervicotoracica", "avaliacao-lombar-geral", "avaliacao-radiculopatia-lombar",
  "avaliacao-instabilidade-lombar", "avaliacao-estenose-lombar", "avaliacao-sacroiliaca",
  "avaliacao-mckenzie", "avaliacao-quadril-geral", "avaliacao-impacto-femoroacetabular",
  "avaliacao-bursite-trocantérica", "avaliacao-artrose-quadril", "avaliacao-joelho-geral",
  "avaliacao-lca", "avaliacao-menisco", "avaliacao-patelofemoral", "avaliacao-artrose-joelho",
  "avaliacao-tornozelo-geral", "avaliacao-entorse-lateral", "avaliacao-fasciite-plantar",
  "avaliacao-halux", "avaliacao-mao-punho-geral", "avaliacao-tunel-carpo",
  "avaliacao-dequervain", "avaliacao-epicondilite", "avaliacao-neurologica-screening",
  "avaliacao-equilibrio", "avaliacao-marcha", "avaliacao-espasticidade",
  "avaliacao-capacidade-funcional", "avaliacao-retorno-esporte", "avaliacao-aerobica", "avaliacao-qualidade-vida"
];

// Blog slugs for sitemap - kept in sync with blogPosts.ts
const BLOG_SLUGS = [
  "prontuario-eletronico-fisioterapia-guia-completo",
  "lgpd-fisioterapia-como-adequar-clinica",
  "tens-parametros-atualizados-2025",
  "avaliacao-fisioterapeutica-dor-lombar",
  "documentacao-coffito-normas-atualizadas",
  "eletroterapia-evidencias-cientificas",
  "marketing-digital-fisioterapeutas",
  "gestao-clinica-fisioterapia",
  "fes-eletroestimulacao-funcional-parametros",
  "ultrassom-terapeutico-guia-pratico",
  "laser-terapeutico-fisioterapia",
  "corrente-russa-parametros-fortalecimento",
  "dor-lombar-tratamento-fisioterapia",
  "dor-no-ombro-causas-tratamento",
  "hernia-de-disco-fisioterapia",
  "fascite-plantar-tratamento-completo",
  "tendinite-tendoes-inflamados",
  "bursite-causas-tratamento",
  "cervicalgia-dor-pescoco",
  "condromalacia-patelar-joelho",
  "fibromialgia-fisioterapia",
  "artrose-osteoartrite-tratamento",
  "dor-no-joelho-causas-tratamento",
  "epicondilite-cotovelo-tenista",
  "ciatica-dor-nervo-ciatico",
  "escoliose-tratamento-fisioterapia",
  "exercicios-dor-lombar-guia-completo",
  "fisioterapia-respiratoria-guia",
  "reabilitacao-avc-fisioterapia",
  "fisioterapia-esportiva-lesoes",
  "entorse-tornozelo-tratamento",
  "lesao-muscular-tratamento-fisioterapia",
  "tunel-do-carpo-fisioterapia",
  "ler-dort-prevencao-tratamento",
  "fisioterapia-idosos-geriatrica",
  "parkinson-fisioterapia-exercicios",
  "cefaleia-cervicogenica-tratamento",
  "ultrassom-terapeutico-parametros",
  "laser-baixa-potencia-aplicacoes",
  "corrente-russa-fortalecimento-muscular",
  "pilates-clinico-reabilitacao",
  "terapia-manual-tecnicas",
  "liberacao-miofascial-tecnica",
  "alongamento-muscular-beneficios",
  "crioterapia-gelo-fisioterapia",
  "reabilitacao-pos-operatorio-lca",
  "fisioterapia-pelvica-assoalho",
  "hidroterapia-fisioterapia-aquatica",
  "espondilolistese-tratamento-fisioterapia",
  "ondas-de-choque-fisioterapia",
  "como-abrir-consultorio-fisioterapia",
];

// Sitemap.xml endpoint
app.get("/sitemap.xml", async (c) => {
  // Use the request host to support custom domains
  const host = c.req.header("host") || "rehabroad.com.br";
  const baseUrl = `https://${host}`;
  const today = new Date().toISOString().split("T")[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  
  // Add static pages
  for (const page of STATIC_PAGES) {
    xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }
  
  // Add blog posts
  for (const slug of BLOG_SLUGS) {
    xml += `  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }
  
  // Add clinical library pages
  for (const slug of BIBLIOTECA_SLUGS) {
    xml += `  <url>
    <loc>${baseUrl}/biblioteca/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }
  
  xml += `</urlset>`;
  
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
});

// Robots.txt endpoint
app.get("/robots.txt", async (c) => {
  const host = c.req.header("host") || "rehabroad.com.br";
  const baseUrl = `https://${host}`;
  const robots = `User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;
  
  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
});

// ========== DOWNLOADABLE PDF DOCUMENTS ==========

// Modelo de Avaliação Fisioterapêutica PDF
app.get("/api/downloads/modelo-avaliacao.pdf", async () => {
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Modelo de Avaliação Fisioterapêutica - REHABROAD</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #333; padding: 20mm; }
    .header { text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 15px; margin-bottom: 20px; }
    .header h1 { color: #0d9488; font-size: 18pt; margin-bottom: 5px; }
    .header p { color: #666; font-size: 10pt; }
    .section { margin-bottom: 20px; }
    .section-title { background: #0d9488; color: white; padding: 8px 12px; font-size: 12pt; font-weight: bold; margin-bottom: 10px; }
    .field { display: flex; border-bottom: 1px solid #ddd; padding: 8px 0; }
    .field-label { font-weight: bold; width: 180px; flex-shrink: 0; }
    .field-value { flex: 1; border-bottom: 1px dotted #999; min-height: 20px; }
    .field-full { border-bottom: 1px solid #ddd; padding: 8px 0; }
    .field-full .field-label { display: block; margin-bottom: 5px; }
    .field-full .field-value { display: block; min-height: 60px; border: 1px solid #ddd; padding: 5px; }
    .checkbox-group { display: flex; flex-wrap: wrap; gap: 15px; padding: 10px 0; }
    .checkbox-item { display: flex; align-items: center; gap: 5px; }
    .checkbox { width: 14px; height: 14px; border: 1px solid #333; display: inline-block; }
    .two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .footer { margin-top: 40px; text-align: center; font-size: 9pt; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; font-weight: bold; }
    @media print { body { padding: 15mm; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>FICHA DE AVALIAÇÃO FISIOTERAPÊUTICA</h1>
    <p>REHABROAD - Plataforma de Apoio Clínico | www.rehabroad.com.br</p>
  </div>

  <div class="section">
    <div class="section-title">1. IDENTIFICAÇÃO DO PACIENTE</div>
    <div class="field"><span class="field-label">Nome Completo:</span><span class="field-value"></span></div>
    <div class="two-cols">
      <div class="field"><span class="field-label">Data de Nascimento:</span><span class="field-value"></span></div>
      <div class="field"><span class="field-label">Idade:</span><span class="field-value"></span></div>
    </div>
    <div class="two-cols">
      <div class="field"><span class="field-label">Sexo:</span><span class="field-value"></span></div>
      <div class="field"><span class="field-label">Estado Civil:</span><span class="field-value"></span></div>
    </div>
    <div class="field"><span class="field-label">Profissão/Ocupação:</span><span class="field-value"></span></div>
    <div class="field"><span class="field-label">Telefone:</span><span class="field-value"></span></div>
    <div class="field"><span class="field-label">E-mail:</span><span class="field-value"></span></div>
    <div class="field"><span class="field-label">Endereço:</span><span class="field-value"></span></div>
  </div>

  <div class="section">
    <div class="section-title">2. ANAMNESE</div>
    <div class="field-full">
      <span class="field-label">Queixa Principal (QP):</span>
      <div class="field-value"></div>
    </div>
    <div class="field-full">
      <span class="field-label">História da Doença Atual (HDA):</span>
      <div class="field-value" style="min-height: 80px;"></div>
    </div>
    <div class="field-full">
      <span class="field-label">História Patológica Pregressa (HPP):</span>
      <div class="field-value"></div>
    </div>
    <div class="field"><span class="field-label">Medicamentos em uso:</span><span class="field-value"></span></div>
    <div class="field"><span class="field-label">Cirurgias anteriores:</span><span class="field-value"></span></div>
    <div class="field"><span class="field-label">Alergias:</span><span class="field-value"></span></div>
  </div>

  <div class="section">
    <div class="section-title">3. AVALIAÇÃO DA DOR (EVA 0-10)</div>
    <table>
      <tr><th>Localização</th><th>Intensidade (0-10)</th><th>Tipo</th><th>Frequência</th><th>Fatores de piora/melhora</th></tr>
      <tr><td style="height:30px;"></td><td></td><td></td><td></td><td></td></tr>
      <tr><td style="height:30px;"></td><td></td><td></td><td></td><td></td></tr>
    </table>
  </div>

  <div class="section">
    <div class="section-title">4. EXAME FÍSICO</div>
    <div class="field-full">
      <span class="field-label">Inspeção/Postura:</span>
      <div class="field-value"></div>
    </div>
    <div class="field-full">
      <span class="field-label">Palpação:</span>
      <div class="field-value"></div>
    </div>
    <div class="field-full">
      <span class="field-label">Amplitude de Movimento (ADM):</span>
      <div class="field-value"></div>
    </div>
    <div class="field-full">
      <span class="field-label">Força Muscular (FM):</span>
      <div class="field-value"></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">5. TESTES ESPECIAIS</div>
    <table>
      <tr><th>Teste</th><th>Resultado</th><th>Observações</th></tr>
      <tr><td style="height:25px;"></td><td></td><td></td></tr>
      <tr><td style="height:25px;"></td><td></td><td></td></tr>
      <tr><td style="height:25px;"></td><td></td><td></td></tr>
      <tr><td style="height:25px;"></td><td></td><td></td></tr>
    </table>
  </div>

  <div class="section">
    <div class="section-title">6. DIAGNÓSTICO CINÉTICO-FUNCIONAL</div>
    <div class="field-full">
      <span class="field-label">CID-10:</span>
      <div class="field-value" style="min-height: 30px;"></div>
    </div>
    <div class="field-full">
      <span class="field-label">Diagnóstico Funcional:</span>
      <div class="field-value" style="min-height: 60px;"></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">7. OBJETIVOS E CONDUTA</div>
    <div class="field-full">
      <span class="field-label">Objetivos do Tratamento:</span>
      <div class="field-value"></div>
    </div>
    <div class="field-full">
      <span class="field-label">Conduta Fisioterapêutica Proposta:</span>
      <div class="field-value" style="min-height: 80px;"></div>
    </div>
    <div class="two-cols">
      <div class="field"><span class="field-label">Frequência:</span><span class="field-value"></span></div>
      <div class="field"><span class="field-label">Previsão de sessões:</span><span class="field-value"></span></div>
    </div>
  </div>

  <div style="margin-top: 40px; display: flex; justify-content: space-between;">
    <div style="text-align: center; width: 45%;">
      <div style="border-top: 1px solid #333; padding-top: 5px;">Assinatura do Paciente</div>
    </div>
    <div style="text-align: center; width: 45%;">
      <div style="border-top: 1px solid #333; padding-top: 5px;">Fisioterapeuta - CREFITO</div>
    </div>
  </div>

  <div class="footer">
    <p>Data da Avaliação: ____/____/________ | Local: _______________________________</p>
    <p style="margin-top: 10px;">© REHABROAD - Prontuário Eletrônico para Fisioterapeutas | Documento para uso profissional</p>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": "inline; filename=modelo-avaliacao-fisioterapeutica.html",
    },
  });
});

// Checklist LGPD PDF
app.get("/api/downloads/checklist-lgpd.pdf", async () => {
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Checklist LGPD para Fisioterapeutas - REHABROAD</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #333; padding: 20mm; }
    .header { text-align: center; border-bottom: 2px solid #8b5cf6; padding-bottom: 15px; margin-bottom: 25px; }
    .header h1 { color: #8b5cf6; font-size: 18pt; margin-bottom: 5px; }
    .header p { color: #666; font-size: 10pt; }
    .intro { background: #f5f3ff; border-left: 4px solid #8b5cf6; padding: 15px; margin-bottom: 25px; }
    .section { margin-bottom: 25px; }
    .section-title { color: #8b5cf6; font-size: 14pt; font-weight: bold; border-bottom: 2px solid #8b5cf6; padding-bottom: 8px; margin-bottom: 15px; }
    .checklist-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid #eee; }
    .checkbox { width: 20px; height: 20px; border: 2px solid #8b5cf6; flex-shrink: 0; margin-top: 2px; }
    .item-content { flex: 1; }
    .item-title { font-weight: bold; color: #333; margin-bottom: 3px; }
    .item-desc { font-size: 10pt; color: #666; }
    .priority-high { border-left: 3px solid #ef4444; padding-left: 10px; }
    .priority-medium { border-left: 3px solid #f59e0b; padding-left: 10px; }
    .footer { margin-top: 30px; text-align: center; font-size: 9pt; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
    .tip { background: #fef3c7; border: 1px solid #f59e0b; padding: 12px; margin: 15px 0; border-radius: 5px; font-size: 10pt; }
    @media print { body { padding: 15mm; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>✓ CHECKLIST LGPD PARA FISIOTERAPEUTAS</h1>
    <p>20 Itens Essenciais para Adequação à Lei Geral de Proteção de Dados</p>
    <p style="margin-top: 5px;">REHABROAD - www.rehabroad.com.br</p>
  </div>

  <div class="intro">
    <strong>Por que isso importa?</strong> A LGPD (Lei 13.709/2018) se aplica a TODOS os profissionais que coletam dados pessoais, incluindo fisioterapeutas. Multas podem chegar a R$ 50 milhões por infração. Use este checklist para garantir conformidade.
  </div>

  <div class="section">
    <div class="section-title">📋 DOCUMENTAÇÃO OBRIGATÓRIA</div>
    <div class="checklist-item priority-high">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">1. Termo de Consentimento para Tratamento de Dados</div>
        <div class="item-desc">Documento assinado pelo paciente autorizando coleta e uso de dados pessoais e de saúde.</div>
      </div>
    </div>
    <div class="checklist-item priority-high">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">2. Política de Privacidade</div>
        <div class="item-desc">Documento explicando quais dados são coletados, como são usados e por quanto tempo são armazenados.</div>
      </div>
    </div>
    <div class="checklist-item priority-medium">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">3. Registro de Operações de Tratamento</div>
        <div class="item-desc">Planilha documentando todos os processos que envolvem dados pessoais na clínica.</div>
      </div>
    </div>
    <div class="checklist-item">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">4. Contrato com Operadores de Dados</div>
        <div class="item-desc">Acordos com terceiros que acessam dados (laboratórios, sistemas, contadores).</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🔐 SEGURANÇA DA INFORMAÇÃO</div>
    <div class="checklist-item priority-high">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">5. Prontuários em Sistema Seguro</div>
        <div class="item-desc">Prontuários digitais devem estar em sistemas com criptografia e backup automático.</div>
      </div>
    </div>
    <div class="checklist-item priority-high">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">6. Senhas Fortes e Individuais</div>
        <div class="item-desc">Cada profissional com acesso deve ter login e senha próprios (mínimo 8 caracteres).</div>
      </div>
    </div>
    <div class="checklist-item priority-medium">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">7. Backup Regular dos Dados</div>
        <div class="item-desc">Backups automáticos diários em local seguro (nuvem criptografada).</div>
      </div>
    </div>
    <div class="checklist-item">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">8. Computadores com Antivírus</div>
        <div class="item-desc">Todos os dispositivos com acesso a dados devem ter antivírus atualizado.</div>
      </div>
    </div>
    <div class="checklist-item">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">9. Wi-Fi Protegido</div>
        <div class="item-desc">Rede da clínica com senha forte e separada da rede de visitantes.</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">👥 DIREITOS DOS PACIENTES</div>
    <div class="checklist-item priority-high">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">10. Canal para Solicitações de Dados</div>
        <div class="item-desc">E-mail ou formulário para pacientes solicitarem acesso, correção ou exclusão de dados.</div>
      </div>
    </div>
    <div class="checklist-item priority-medium">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">11. Processo de Exclusão de Dados</div>
        <div class="item-desc">Procedimento documentado para excluir dados quando solicitado (respeitando prazo legal de 20 anos para prontuários).</div>
      </div>
    </div>
    <div class="checklist-item">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">12. Fornecimento de Cópia dos Dados</div>
        <div class="item-desc">Capacidade de fornecer cópia dos dados do paciente em formato acessível.</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🏥 OPERAÇÕES DA CLÍNICA</div>
    <div class="checklist-item priority-medium">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">13. Treinamento da Equipe</div>
        <div class="item-desc">Secretários e auxiliares treinados sobre sigilo e proteção de dados.</div>
      </div>
    </div>
    <div class="checklist-item">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">14. Descarte Seguro de Documentos</div>
        <div class="item-desc">Documentos físicos com dados pessoais devem ser triturados antes do descarte.</div>
      </div>
    </div>
    <div class="checklist-item">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">15. Fichas de Papel em Local Trancado</div>
        <div class="item-desc">Prontuários físicos guardados em armário com chave, acesso restrito.</div>
      </div>
    </div>
    <div class="checklist-item">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">16. Não Compartilhar Dados por WhatsApp Pessoal</div>
        <div class="item-desc">Usar apenas canais oficiais e seguros para compartilhar informações de pacientes.</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">⚠️ RESPOSTA A INCIDENTES</div>
    <div class="checklist-item priority-high">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">17. Plano de Resposta a Vazamentos</div>
        <div class="item-desc">Procedimento documentado para agir em caso de vazamento de dados.</div>
      </div>
    </div>
    <div class="checklist-item priority-medium">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">18. Notificação à ANPD</div>
        <div class="item-desc">Conhecimento de que vazamentos graves devem ser notificados à Autoridade Nacional.</div>
      </div>
    </div>
    <div class="checklist-item">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">19. Registro de Incidentes</div>
        <div class="item-desc">Documentar qualquer incidente de segurança, mesmo os menores.</div>
      </div>
    </div>
    <div class="checklist-item">
      <div class="checkbox"></div>
      <div class="item-content">
        <div class="item-title">20. Encarregado de Dados (DPO)</div>
        <div class="item-desc">Definir responsável pelo tratamento de dados (pode ser o próprio profissional em clínicas pequenas).</div>
      </div>
    </div>
  </div>

  <div class="tip">
    <strong>💡 DICA:</strong> O REHABROAD já inclui recursos de conformidade LGPD: criptografia, backup automático, termos de uso, controle de acesso e auditoria. Simplifique sua adequação usando um sistema preparado.
  </div>

  <div style="background: #fee2e2; border: 1px solid #ef4444; padding: 12px; margin: 15px 0; border-radius: 5px;">
    <strong>⚠️ ATENÇÃO:</strong> Este checklist é informativo e não substitui consultoria jurídica especializada. Para adequação completa, consulte um advogado especializado em LGPD.
  </div>

  <div class="footer">
    <p>Seu progresso: _____ / 20 itens completos | Data da revisão: ____/____/________</p>
    <p style="margin-top: 10px;">© REHABROAD - Prontuário Eletrônico para Fisioterapeutas | Baixe mais materiais em rehabroad.com.br</p>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": "inline; filename=checklist-lgpd-fisioterapia.html",
    },
  });
});

// Guia TENS PDF
app.get("/api/downloads/guia-tens.pdf", async () => {
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Guia Rápido de Parâmetros TENS - REHABROAD</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.4; color: #333; padding: 15mm; }
    .header { text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 12px; margin-bottom: 15px; }
    .header h1 { color: #f59e0b; font-size: 16pt; margin-bottom: 5px; }
    .header p { color: #666; font-size: 9pt; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 9pt; }
    th { background: #f59e0b; color: white; padding: 8px 6px; text-align: left; font-weight: bold; }
    td { padding: 6px; border: 1px solid #ddd; vertical-align: top; }
    tr:nth-child(even) { background: #fffbeb; }
    .condition { font-weight: bold; color: #92400e; }
    .params { font-family: monospace; background: #f5f5f5; padding: 2px 5px; border-radius: 3px; }
    .section-title { background: #fef3c7; color: #92400e; font-size: 11pt; font-weight: bold; padding: 8px; margin: 15px 0 10px 0; }
    .legend { background: #f5f5f5; padding: 10px; margin-bottom: 15px; font-size: 9pt; }
    .legend-title { font-weight: bold; margin-bottom: 5px; }
    .footer { text-align: center; font-size: 8pt; color: #666; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 15px; }
    .note { font-size: 8pt; color: #666; font-style: italic; }
    .evidence { font-size: 8pt; color: #059669; }
    @media print { body { padding: 10mm; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>⚡ GUIA RÁPIDO DE PARÂMETROS TENS</h1>
    <p>Tabela de Referência Baseada em Evidências | REHABROAD - www.rehabroad.com.br</p>
  </div>

  <div class="legend">
    <div class="legend-title">LEGENDA:</div>
    <strong>F</strong> = Frequência (Hz) | <strong>T</strong> = Largura de Pulso (μs) | <strong>I</strong> = Intensidade | <strong>D</strong> = Duração
    <br><strong>Conv</strong> = Convencional (alta freq.) | <strong>Acup</strong> = Acupuntura (baixa freq.) | <strong>Burst</strong> = Trens de pulso
  </div>

  <div class="section-title">🦴 CONDIÇÕES MUSCULOESQUELÉTICAS</div>
  <table>
    <tr>
      <th style="width: 22%;">Condição</th>
      <th style="width: 12%;">Modo</th>
      <th style="width: 28%;">Parâmetros</th>
      <th style="width: 10%;">Duração</th>
      <th style="width: 28%;">Observações</th>
    </tr>
    <tr>
      <td class="condition">Lombalgia Aguda</td>
      <td>Conv</td>
      <td><span class="params">F: 80-100Hz | T: 100-200μs</span></td>
      <td>20-30min</td>
      <td>Eletrodos paravertebrais L3-S1 <span class="evidence">[Nível A]</span></td>
    </tr>
    <tr>
      <td class="condition">Lombalgia Crônica</td>
      <td>Acup/Burst</td>
      <td><span class="params">F: 2-4Hz | T: 200-250μs</span></td>
      <td>30-45min</td>
      <td>Alternar com Conv; pontos gatilho <span class="evidence">[Nível A]</span></td>
    </tr>
    <tr>
      <td class="condition">Cervicalgia</td>
      <td>Conv</td>
      <td><span class="params">F: 80-100Hz | T: 100-150μs</span></td>
      <td>20min</td>
      <td>Cuidado com artéria carótida; não aplicar anterior</td>
    </tr>
    <tr>
      <td class="condition">Osteoartrose Joelho</td>
      <td>Conv</td>
      <td><span class="params">F: 80-100Hz | T: 100-200μs</span></td>
      <td>30-60min</td>
      <td>Eletrodos peripatelares <span class="evidence">[Nível A]</span></td>
    </tr>
    <tr>
      <td class="condition">Síndrome Miofascial</td>
      <td>Acup</td>
      <td><span class="params">F: 2-10Hz | T: 200-300μs</span></td>
      <td>20-30min</td>
      <td>Diretamente sobre pontos gatilho</td>
    </tr>
    <tr>
      <td class="condition">Epicondilite Lateral</td>
      <td>Conv</td>
      <td><span class="params">F: 80-100Hz | T: 100-150μs</span></td>
      <td>20min</td>
      <td>Eletrodos cruzados sobre epicôndilo</td>
    </tr>
    <tr>
      <td class="condition">Fascite Plantar</td>
      <td>Conv</td>
      <td><span class="params">F: 80-100Hz | T: 150-200μs</span></td>
      <td>20-30min</td>
      <td>Eletrodos na fáscia e calcanhar</td>
    </tr>
  </table>

  <div class="section-title">🔌 CONDIÇÕES NEUROLÓGICAS</div>
  <table>
    <tr>
      <th style="width: 22%;">Condição</th>
      <th style="width: 12%;">Modo</th>
      <th style="width: 28%;">Parâmetros</th>
      <th style="width: 10%;">Duração</th>
      <th style="width: 28%;">Observações</th>
    </tr>
    <tr>
      <td class="condition">Neuropatia Diabética</td>
      <td>Conv</td>
      <td><span class="params">F: 50-80Hz | T: 200μs</span></td>
      <td>30min</td>
      <td>Verificar sensibilidade primeiro <span class="evidence">[Nível B]</span></td>
    </tr>
    <tr>
      <td class="condition">Síndrome Túnel Carpal</td>
      <td>Conv</td>
      <td><span class="params">F: 80-100Hz | T: 100-150μs</span></td>
      <td>20min</td>
      <td>Eletrodos palmar e dorsal do punho</td>
    </tr>
    <tr>
      <td class="condition">Dor Pós-AVC</td>
      <td>Conv/Acup</td>
      <td><span class="params">F: Variar | T: 150-250μs</span></td>
      <td>30min</td>
      <td>Ajustar conforme resposta; cuidado espasticidade</td>
    </tr>
    <tr>
      <td class="condition">Ciatalgia</td>
      <td>Burst</td>
      <td><span class="params">F: 2Hz burst | T: 200μs</span></td>
      <td>30-45min</td>
      <td>Eletrodos ao longo do trajeto do nervo</td>
    </tr>
  </table>

  <div class="section-title">🏃 PÓS-OPERATÓRIO E ESPORTE</div>
  <table>
    <tr>
      <th style="width: 22%;">Condição</th>
      <th style="width: 12%;">Modo</th>
      <th style="width: 28%;">Parâmetros</th>
      <th style="width: 10%;">Duração</th>
      <th style="width: 28%;">Observações</th>
    </tr>
    <tr>
      <td class="condition">Pós-op ATJ/ATQ</td>
      <td>Conv</td>
      <td><span class="params">F: 80-100Hz | T: 100-200μs</span></td>
      <td>30-60min</td>
      <td>Iniciar 24h pós; reduz consumo analgésicos <span class="evidence">[Nível A]</span></td>
    </tr>
    <tr>
      <td class="condition">Pós-op LCA</td>
      <td>Conv</td>
      <td><span class="params">F: 80-100Hz | T: 150μs</span></td>
      <td>20-30min</td>
      <td>Associar com crioterapia nas primeiras 72h</td>
    </tr>
    <tr>
      <td class="condition">DOMS (dor muscular tardia)</td>
      <td>Acup</td>
      <td><span class="params">F: 2-4Hz | T: 200-250μs</span></td>
      <td>20min</td>
      <td>Aplicar 24-48h após exercício</td>
    </tr>
    <tr>
      <td class="condition">Contusão/Entorse</td>
      <td>Conv</td>
      <td><span class="params">F: 100Hz | T: 100μs</span></td>
      <td>20min</td>
      <td>Fase aguda: associar crioterapia</td>
    </tr>
  </table>

  <div style="margin-top: 15px; padding: 10px; background: #ecfdf5; border: 1px solid #059669; font-size: 9pt;">
    <strong>📊 NÍVEIS DE EVIDÊNCIA:</strong>
    <span class="evidence">[Nível A]</span> = Evidência forte (múltiplos RCTs) |
    <span class="evidence">[Nível B]</span> = Evidência moderada |
    Sem marcação = Baseado em prática clínica e consenso de especialistas
  </div>

  <div style="margin-top: 10px; padding: 10px; background: #fef2f2; border: 1px solid #ef4444; font-size: 9pt;">
    <strong>⚠️ CONTRAINDICAÇÕES:</strong> Marcapasso, gestação (região abdominal/lombar), trombose ativa, área cardíaca, pele lesionada, região cervical anterior (seio carotídeo), tumores malignos, infecção local.
  </div>

  <div style="margin-top: 10px; padding: 10px; background: #f5f5f5; border: 1px solid #ddd; font-size: 9pt;">
    <strong>💡 DICAS DE APLICAÇÃO:</strong>
    <ul style="margin-left: 20px; margin-top: 5px;">
      <li>Intensidade: sensação forte mas confortável (parestesia sem contração em Conv)</li>
      <li>Posicionamento: cruzar eletrodos sobre área dolorosa ou ao longo do dermátomo</li>
      <li>Pele: limpar com álcool 70% antes; verificar gel dos eletrodos</li>
    </ul>
  </div>

  <div class="footer">
    <p>© REHABROAD - Plataforma de Apoio Clínico para Fisioterapeutas</p>
    <p>Use o módulo NeuroFlux no REHABROAD para recomendações personalizadas de eletroterapia com base em evidências.</p>
    <p style="margin-top: 5px;">Este guia é referência rápida e não substitui avaliação clínica individualizada.</p>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": "inline; filename=guia-parametros-tens.html",
    },
  });
});

// Build Google OAuth redirect URL via Supabase Auth
app.get("/api/oauth/google/redirect_url", async (c) => {
  try {
    const { apiUrl } = getSupabaseConfig(c.env as Record<string, unknown> | undefined);

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

// Legacy session exchange endpoint kept for compatibility while frontend migrates fully to Supabase callback
app.post("/api/sessions", async (c) => {
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
app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

// Logout
app.get("/api/logout", async (c) => {
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

// ============================================
// BETA WAITLIST API (Public)
// ============================================

app.post("/api/beta-waitlist", async (c) => {
  const body = await c.req.json();

  if (!body.email) {
    return c.json({ error: "E-mail é obrigatório" }, 400);
  }

  // Check if email already exists
  const existing = await c.env.DB.prepare(
    `SELECT id FROM beta_waitlist WHERE email = ?`
  ).bind(body.email).first();

  if (existing) {
    return c.json({ message: "E-mail já cadastrado na lista de espera" }, 409);
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO beta_waitlist (name, email) VALUES (?, ?) RETURNING *`
  ).bind(body.name || null, body.email).first();

  // Send email notification to admin
  if (c.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(c.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "REHABROAD <onboarding@resend.dev>",
        to: "pabloandradeoficial@gmail.com",
        subject: "🆕 Novo cadastro na lista de espera - REHABROAD",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4f46e5;">Novo Cadastro na Lista de Espera</h2>
            <p>Um novo usuário se cadastrou na lista de espera do REHABROAD:</p>
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 4px 0;"><strong>Nome:</strong> ${body.name || "Não informado"}</p>
              <p style="margin: 4px 0;"><strong>E-mail:</strong> ${body.email}</p>
              <p style="margin: 4px 0;"><strong>Data:</strong> ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              Este usuário já pode fazer login no sistema.
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
      // Don't fail the request if email fails
    }
  }

  return c.json(result, 201);
});

// Check if user's email is approved in waitlist
app.get("/api/waitlist/check", authMiddleware, async (c) => {
  const user = c.get("user");

  const waitlistEntry = await c.env.DB.prepare(
    `SELECT * FROM beta_waitlist WHERE email = ?`
  ).bind(user!.email).first() as any;

  if (!waitlistEntry) {
    return c.json({ 
      status: "not_registered",
      approved: false,
      message: "E-mail não cadastrado na lista de espera"
    });
  }

  return c.json({
    status: waitlistEntry.is_approved ? "approved" : "pending",
    approved: !!waitlistEntry.is_approved,
    message: waitlistEntry.is_approved 
      ? "Acesso aprovado" 
      : "Aguardando aprovação"
  });
});

// ============================================
// SUBSCRIPTION API
// ============================================

// Get current user subscription
app.get("/api/subscription", authMiddleware, async (c) => {
  const user = c.get("user");

  let subscription = await c.env.DB.prepare(
    `SELECT * FROM subscriptions WHERE user_id = ?`
  ).bind(user!.id).first() as any;

  const now = new Date().toISOString();

  // Admin email - auto-grant admin access
  const ADMIN_EMAIL = "pabloandradeoficial@gmail.com";
  const normalizedUserEmail = String(user?.email || "").trim().toLowerCase();
  const normalizedAdminEmail = ADMIN_EMAIL.trim().toLowerCase();
  const isOwnerEmail = normalizedUserEmail === normalizedAdminEmail;

  // Create subscription if none exists
  if (!subscription) {
    if (isOwnerEmail) {
      subscription = await c.env.DB.prepare(
        `INSERT INTO subscriptions (user_id, plan_type, status, is_active, trial_start_date, is_admin)
         VALUES (?, 'monthly', 'active_paid', 1, ?, 1)
         RETURNING *`
      ).bind(user!.id, now).first();
    } else {
      subscription = await c.env.DB.prepare(
        `INSERT INTO subscriptions (user_id, plan_type, status, is_active, trial_start_date, is_admin)
         VALUES (?, 'free', 'beta_trial', 1, ?, 0)
         RETURNING *`
      ).bind(user!.id, now).first();
    }
  }
  // If existing user is owner, always grant admin + full paid access
  else if (isOwnerEmail) {
    await c.env.DB.prepare(
      `UPDATE subscriptions
       SET is_admin = 1,
           is_active = 1,
           status = 'active_paid',
           plan_type = CASE
             WHEN plan_type IS NULL OR TRIM(plan_type) = '' OR plan_type = 'free' THEN 'monthly'
             ELSE plan_type
           END,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`
    ).bind(user!.id).run();

    subscription.is_admin = 1;
    subscription.is_active = 1;
    subscription.status = 'active_paid';
    subscription.plan_type = subscription.plan_type && subscription.plan_type !== 'free'
      ? subscription.plan_type
      : 'monthly';
  }
  // If existing subscription doesn't have trial_start_date and is not active_paid, set up beta trial
  else if (!subscription.trial_start_date && subscription.status !== 'active_paid') {
    await c.env.DB.prepare(
      `UPDATE subscriptions SET
       trial_start_date = ?,
       status = 'beta_trial',
       is_active = 1,
       updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`
    ).bind(now, user!.id).run();
    subscription.trial_start_date = now;
    subscription.status = 'beta_trial';
    subscription.is_active = 1;
  }

  // Calculate effective status based on trial duration and admin status
  let effectiveStatus = subscription.status;

  // Admins always have full access
  const isAdmin = subscription.is_admin === 1 || subscription.is_admin === true || isOwnerEmail;
  if (isAdmin) {
    effectiveStatus = 'active_paid';
    subscription.is_admin = 1;
    subscription.is_active = 1;
    subscription.status = 'active_paid';
    subscription.plan_type = subscription.plan_type && subscription.plan_type !== 'free'
      ? subscription.plan_type
      : 'monthly';
  }
  // If user is in beta_trial, check if trial has expired (30 days)
  else if (subscription.status === 'beta_trial' && subscription.trial_start_date) {
    const trialStart = new Date(subscription.trial_start_date);
    const nowDate = new Date();
    const daysDiff = Math.floor((nowDate.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff > 30) {
      // Trial expired, update to free_limited
      effectiveStatus = 'free_limited';
      await c.env.DB.prepare(
        `UPDATE subscriptions SET status = 'free_limited', is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`
      ).bind(user!.id).run();
      subscription.status = 'free_limited';
      subscription.is_active = 0;
    }
  }

  // Calculate days remaining in trial
  let trialDaysRemaining = null;
  if (subscription.trial_start_date && subscription.status === 'beta_trial' && !isAdmin) {
    const trialStart = new Date(subscription.trial_start_date);
    const nowDate = new Date();
    const daysDiff = Math.floor((nowDate.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
    trialDaysRemaining = Math.max(0, 30 - daysDiff);
  }

  return c.json({
    ...subscription,
    effective_status: effectiveStatus,
    trial_days_remaining: trialDaysRemaining
  });
});

// Plan configurations
const PLAN_CONFIGS = {
  monthly: {
    name: "REHABROAD - Plano Mensal",
    description: "Acesso completo às ferramentas de apoio clínico - cobrança mensal",
    amount: 2900, // R$ 29,00
    interval: "month" as const,
    intervalCount: 1,
    planType: "monthly"
  },
  semestral: {
    name: "REHABROAD - Plano Semestral",
    description: "Acesso completo às ferramentas de apoio clínico - 6 meses",
    amount: 14900, // R$ 149,00
    interval: "month" as const,
    intervalCount: 6,
    planType: "semestral"
  },
  annual: {
    name: "REHABROAD - Plano Anual",
    description: "Acesso completo às ferramentas de apoio clínico - 12 meses",
    amount: 27900, // R$ 279,00
    interval: "year" as const,
    intervalCount: 1,
    planType: "annual"
  }
};

// Create Stripe Checkout Session
app.post("/api/subscription/checkout", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json().catch(() => ({}));
  const planKey = (body.plan || "monthly") as keyof typeof PLAN_CONFIGS;
  
  if (!PLAN_CONFIGS[planKey]) {
    return c.json({ error: "Plano inválido" }, 400);
  }
  
  const planConfig = PLAN_CONFIGS[planKey];
  
  if (!c.env.STRIPE_SECRET_KEY) {
    return c.json({ error: "Stripe não configurado" }, 500);
  }

  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);

  // Get or create Stripe customer
  let subscription = await c.env.DB.prepare(
    `SELECT * FROM subscriptions WHERE user_id = ?`
  ).bind(user!.id).first() as any;

  let customerId = subscription?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user!.email,
      metadata: { user_id: user!.id }
    });
    customerId = customer.id;

    // Save customer ID
    if (subscription) {
      await c.env.DB.prepare(
        `UPDATE subscriptions SET stripe_customer_id = ? WHERE user_id = ?`
      ).bind(customerId, user!.id).run();
    } else {
      await c.env.DB.prepare(
        `INSERT INTO subscriptions (user_id, stripe_customer_id, plan_type, status) VALUES (?, ?, 'free', 'inactive')`
      ).bind(user!.id, customerId).run();
    }
  }

  // Get base URL from request
  const url = new URL(c.req.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // Create checkout session for subscription
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: planConfig.name,
            description: planConfig.description
          },
          unit_amount: planConfig.amount,
          recurring: { 
            interval: planConfig.interval,
            interval_count: planConfig.intervalCount
          }
        },
        quantity: 1
      }
    ],
    success_url: `${baseUrl}/dashboard/plano?success=true`,
    cancel_url: `${baseUrl}/dashboard/plano?canceled=true`,
    metadata: { user_id: user!.id, plan_type: planConfig.planType }
  });

  return c.json({ url: session.url });
});

// Stripe Webhook
app.post("/api/webhooks/stripe", async (c) => {
  if (!c.env.STRIPE_SECRET_KEY || !c.env.STRIPE_WEBHOOK_SECRET) {
    return c.json({ error: "Stripe não configurado" }, 500);
  }

  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
  const body = await c.req.text();
  const sig = c.req.header("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, c.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return c.json({ error: "Invalid signature" }, 400);
  }

  // Handle events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const planType = session.metadata?.plan_type || "monthly";
    const stripeSubscriptionId = session.subscription as string;

    if (userId && stripeSubscriptionId) {
      const now = new Date().toISOString();
      const expiresAt = new Date();
      
      // Set expiration based on plan type
      if (planType === "annual") {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else if (planType === "semestral") {
        expiresAt.setMonth(expiresAt.getMonth() + 6);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }

      await c.env.DB.prepare(
        `UPDATE subscriptions SET 
         plan_type = ?, is_active = 1, status = 'active_paid',
         stripe_subscription_id = ?, started_at = ?, expires_at = ?, 
         updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`
      ).bind(planType, stripeSubscriptionId, now, expiresAt.toISOString(), userId).run();
    }
  }

  if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    // Find user by customer ID
    const sub = await c.env.DB.prepare(
      `SELECT user_id FROM subscriptions WHERE stripe_customer_id = ?`
    ).bind(customerId).first() as any;

    if (sub) {
      const isActive = subscription.status === "active";
      const status = subscription.status === "canceled" ? "canceled" : 
                     subscription.status === "active" ? "active_paid" : "inactive";

      await c.env.DB.prepare(
        `UPDATE subscriptions SET 
         is_active = ?, status = ?, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`
      ).bind(isActive ? 1 : 0, status, sub.user_id).run();
    }
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;

    const sub = await c.env.DB.prepare(
      `SELECT user_id FROM subscriptions WHERE stripe_customer_id = ?`
    ).bind(customerId).first() as any;

    if (sub) {
      await c.env.DB.prepare(
        `UPDATE subscriptions SET 
         status = 'payment_failed', updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`
      ).bind(sub.user_id).run();
    }
  }

  return c.json({ received: true });
});

// Cancel subscription
app.post("/api/subscription/cancel", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!c.env.STRIPE_SECRET_KEY) {
    return c.json({ error: "Stripe não configurado" }, 500);
  }

  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);

  const subscription = await c.env.DB.prepare(
    `SELECT stripe_subscription_id, status FROM subscriptions WHERE user_id = ?`
  ).bind(user!.id).first() as any;

  if (!subscription) {
    return c.json({ error: "Assinatura não encontrada" }, 404);
  }

  if (!subscription.stripe_subscription_id) {
    return c.json({ error: "Nenhuma assinatura ativa para cancelar" }, 400);
  }

  try {
    // Cancel on Stripe
    await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
    
    // Update local database
    await c.env.DB.prepare(
      `UPDATE subscriptions SET 
       status = 'canceled', 
       is_active = 0, 
       stripe_subscription_id = NULL,
       updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`
    ).bind(user!.id).run();

    return c.json({ success: true, message: "Assinatura cancelada com sucesso" });
  } catch (error: any) {
    console.error("Stripe cancel error:", error);
    
    // If subscription already canceled or doesn't exist on Stripe, update local DB anyway
    if (error.code === 'resource_missing' || error.message?.includes('No such subscription')) {
      await c.env.DB.prepare(
        `UPDATE subscriptions SET 
         status = 'canceled', 
         is_active = 0, 
         stripe_subscription_id = NULL,
         updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`
      ).bind(user!.id).run();
      
      return c.json({ success: true, message: "Assinatura cancelada" });
    }
    
    return c.json({ 
      error: "Erro ao cancelar assinatura no Stripe", 
      details: error.message 
    }, 500);
  }
});

// ============================================
// PATIENTS API
// ============================================

// Get all patients for the current user
app.get("/api/patients", authMiddleware, async (c) => {
  const user = c.get("user");
  
  const { results } = await c.env.DB.prepare(
    `SELECT * FROM patients WHERE user_id = ? ORDER BY created_at DESC`
  ).bind(user!.id).all();

  return c.json(results);
});

// Get a single patient
app.get("/api/patients/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const patientId = c.req.param("id");

  const patient = await c.env.DB.prepare(
    `SELECT * FROM patients WHERE id = ? AND user_id = ?`
  ).bind(patientId, user!.id).first();

  if (!patient) {
    return c.json({ error: "Patient not found" }, 404);
  }

  return c.json(patient);
});

// Create a patient
app.post("/api/patients", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  const result = await c.env.DB.prepare(
    `INSERT INTO patients (user_id, name, birth_date, phone, email, notes) 
     VALUES (?, ?, ?, ?, ?, ?)
     RETURNING *`
  ).bind(
    user!.id,
    body.name,
    body.birth_date || null,
    body.phone || null,
    body.email || null,
    body.notes || null
  ).first();

  return c.json(result, 201);
});

// Update a patient
app.put("/api/patients/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const patientId = c.req.param("id");
  const body = await c.req.json();

  const result = await c.env.DB.prepare(
    `UPDATE patients SET 
     name = ?, birth_date = ?, phone = ?, email = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND user_id = ?
     RETURNING *`
  ).bind(
    body.name,
    body.birth_date || null,
    body.phone || null,
    body.email || null,
    body.notes || null,
    patientId,
    user!.id
  ).first();

  if (!result) {
    return c.json({ error: "Patient not found" }, 404);
  }

  return c.json(result);
});

// Delete a patient
app.delete("/api/patients/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const patientId = c.req.param("id");

  await c.env.DB.prepare(
    `DELETE FROM patients WHERE id = ? AND user_id = ?`
  ).bind(patientId, user!.id).run();

  return c.json({ success: true });
});

// ============================================
// EVALUATIONS API
// ============================================

// Get all evaluations for a patient
app.get("/api/patients/:patientId/evaluations", authMiddleware, async (c) => {
  const user = c.get("user");
  const patientId = c.req.param("patientId");

  // First verify patient belongs to user
  const patient = await c.env.DB.prepare(
    `SELECT id FROM patients WHERE id = ? AND user_id = ?`
  ).bind(patientId, user!.id).first();

  if (!patient) {
    return c.json({ error: "Patient not found" }, 404);
  }

  const { results } = await c.env.DB.prepare(
    `SELECT * FROM evaluations WHERE patient_id = ? ORDER BY created_at DESC`
  ).bind(patientId).all();

  return c.json(results);
});

// Create an evaluation
app.post("/api/patients/:patientId/evaluations", authMiddleware, async (c) => {
  const user = c.get("user");
  const patientId = c.req.param("patientId");
  const body = await c.req.json();

  // Verify patient belongs to user
  const patient = await c.env.DB.prepare(
    `SELECT id FROM patients WHERE id = ? AND user_id = ?`
  ).bind(patientId, user!.id).first();

  if (!patient) {
    return c.json({ error: "Patient not found" }, 404);
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO evaluations (patient_id, type, chief_complaint, history, pain_level, pain_location, functional_status, orthopedic_tests, observations)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING *`
  ).bind(
    patientId,
    body.type || "initial",
    body.chief_complaint || null,
    body.history || null,
    body.pain_level || null,
    body.pain_location || null,
    body.functional_status || null,
    body.orthopedic_tests || null,
    body.observations || null
  ).first();

  return c.json(result, 201);
});

// ============================================
// CLINICAL INSIGHTS API (Anonymized aggregate data)
// ============================================

app.get("/api/clinical-insights", authMiddleware, async (c) => {
  const painLocation = c.req.query("pain_location") || "";
  const chiefComplaint = c.req.query("chief_complaint") || "";
  
  if (!painLocation && !chiefComplaint) {
    return c.json({ similarCases: 0, topDiagnoses: [], topTests: [] });
  }

  // Normalize pain location for matching
  const locationKeywords = painLocation.toLowerCase().split(/[\s,]+/).filter(Boolean);
  const complaintKeywords = chiefComplaint.toLowerCase().split(/[\s,]+/).filter(Boolean);
  
  // Build LIKE conditions for flexible matching
  const likeConditions: string[] = [];
  const likeValues: string[] = [];
  
  for (const keyword of [...locationKeywords, ...complaintKeywords]) {
    if (keyword.length >= 3) {
      likeConditions.push("(LOWER(pain_location) LIKE ? OR LOWER(chief_complaint) LIKE ?)");
      likeValues.push(`%${keyword}%`, `%${keyword}%`);
    }
  }
  
  if (likeConditions.length === 0) {
    return c.json({ similarCases: 0, topDiagnoses: [], topTests: [] });
  }

  // Count similar cases (anonymized - no user/patient info)
  const countQuery = `SELECT COUNT(*) as count FROM evaluations WHERE ${likeConditions.join(" OR ")}`;
  const countResult = await c.env.DB.prepare(countQuery).bind(...likeValues).first<{ count: number }>();
  const similarCases = countResult?.count || 0;

  // Get chief complaints for diagnosis frequency (anonymized)
  const diagnosisQuery = `
    SELECT chief_complaint, COUNT(*) as count 
    FROM evaluations 
    WHERE chief_complaint IS NOT NULL AND chief_complaint != '' AND (${likeConditions.join(" OR ")})
    GROUP BY chief_complaint 
    ORDER BY count DESC 
    LIMIT 5
  `;
  const diagnosisResults = await c.env.DB.prepare(diagnosisQuery).bind(...likeValues).all<{ chief_complaint: string; count: number }>();
  
  const totalDiagnoses = diagnosisResults.results?.reduce((sum, d) => sum + d.count, 0) || 1;
  const topDiagnoses = (diagnosisResults.results || []).slice(0, 3).map(d => ({
    name: d.chief_complaint,
    count: d.count,
    percentage: Math.round((d.count / totalDiagnoses) * 100)
  }));

  // Get orthopedic tests frequency (anonymized)
  const testsQuery = `
    SELECT orthopedic_tests FROM evaluations 
    WHERE orthopedic_tests IS NOT NULL AND orthopedic_tests != '' AND (${likeConditions.join(" OR ")})
  `;
  const testsResults = await c.env.DB.prepare(testsQuery).bind(...likeValues).all<{ orthopedic_tests: string }>();
  
  // Parse and count individual tests
  const testCounts: Record<string, number> = {};
  for (const row of testsResults.results || []) {
    try {
      const tests = JSON.parse(row.orthopedic_tests);
      if (Array.isArray(tests)) {
        for (const test of tests) {
          if (typeof test === 'string' && test.trim()) {
            testCounts[test.trim()] = (testCounts[test.trim()] || 0) + 1;
          }
        }
      }
    } catch {
      // If not JSON, try comma-separated
      const tests = row.orthopedic_tests.split(',').map((t: string) => t.trim()).filter(Boolean);
      for (const test of tests) {
        testCounts[test] = (testCounts[test] || 0) + 1;
      }
    }
  }
  
  const topTests = Object.entries(testCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  return c.json({
    similarCases,
    topDiagnoses,
    topTests
  });
});

// Update an evaluation
app.put("/api/evaluations/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const evalId = c.req.param("id");
  const body = await c.req.json();

  // Verify evaluation belongs to user's patient
  const evaluation = await c.env.DB.prepare(
    `SELECT e.id FROM evaluations e 
     JOIN patients p ON e.patient_id = p.id 
     WHERE e.id = ? AND p.user_id = ?`
  ).bind(evalId, user!.id).first();

  if (!evaluation) {
    return c.json({ error: "Evaluation not found" }, 404);
  }

  const result = await c.env.DB.prepare(
    `UPDATE evaluations SET 
     chief_complaint = ?, history = ?, pain_level = ?, pain_location = ?, 
     functional_status = ?, orthopedic_tests = ?, observations = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?
     RETURNING *`
  ).bind(
    body.chief_complaint || null,
    body.history || null,
    body.pain_level || null,
    body.pain_location || null,
    body.functional_status || null,
    body.orthopedic_tests || null,
    body.observations || null,
    evalId
  ).first();

  return c.json(result);
});

// ============================================
// EVOLUTIONS API
// ============================================

// Get all evolutions for a patient
app.get("/api/patients/:patientId/evolutions", authMiddleware, async (c) => {
  const user = c.get("user");
  const patientId = c.req.param("patientId");

  const patient = await c.env.DB.prepare(
    `SELECT id FROM patients WHERE id = ? AND user_id = ?`
  ).bind(patientId, user!.id).first();

  if (!patient) {
    return c.json({ error: "Patient not found" }, 404);
  }

  const { results } = await c.env.DB.prepare(
    `SELECT * FROM evolutions WHERE patient_id = ? ORDER BY session_date DESC, created_at DESC`
  ).bind(patientId).all();

  return c.json(results);
});

// Create an evolution
app.post("/api/patients/:patientId/evolutions", authMiddleware, async (c) => {
  const user = c.get("user");
  const patientId = c.req.param("patientId");
  const body = await c.req.json();

  const patient = await c.env.DB.prepare(
    `SELECT id FROM patients WHERE id = ? AND user_id = ?`
  ).bind(patientId, user!.id).first();

  if (!patient) {
    return c.json({ error: "Patient not found" }, 404);
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO evolutions (patient_id, session_date, pain_level, functional_status, procedures, patient_response, observations, attendance_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING *`
  ).bind(
    patientId,
    body.session_date || new Date().toISOString().split("T")[0],
    body.pain_level || null,
    body.functional_status || null,
    body.procedures || null,
    body.patient_response || null,
    body.observations || null,
    body.attendance_status || "attended"
  ).first();

  return c.json(result, 201);
});

// Update evolution
app.put("/api/evolutions/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const evolutionId = c.req.param("id");
  const body = await c.req.json();

  // Verify evolution belongs to user's patient
  const evolution = await c.env.DB.prepare(
    `SELECT e.* FROM evolutions e
     JOIN patients p ON e.patient_id = p.id
     WHERE e.id = ? AND p.user_id = ?`
  ).bind(evolutionId, user!.id).first();

  if (!evolution) {
    return c.json({ error: "Evolution not found" }, 404);
  }

  const result = await c.env.DB.prepare(
    `UPDATE evolutions SET
      session_date = ?,
      pain_level = ?,
      functional_status = ?,
      procedures = ?,
      patient_response = ?,
      observations = ?,
      attendance_status = ?,
      updated_at = CURRENT_TIMESTAMP
     WHERE id = ?
     RETURNING *`
  ).bind(
    body.session_date || evolution.session_date,
    body.pain_level ?? evolution.pain_level,
    body.functional_status || evolution.functional_status,
    body.procedures || evolution.procedures,
    body.patient_response || evolution.patient_response,
    body.observations || evolution.observations,
    body.attendance_status || evolution.attendance_status,
    evolutionId
  ).first();

  return c.json(result);
});

// ============================================
// CAMINHO (PATHWAY) API
// ============================================

// Get caminho data for a patient
app.get("/api/patients/:patientId/caminho", authMiddleware, async (c) => {
  const user = c.get("user");
  const patientId = c.req.param("patientId");

  const patient = await c.env.DB.prepare(
    `SELECT id FROM patients WHERE id = ? AND user_id = ?`
  ).bind(patientId, user!.id).first();

  if (!patient) {
    return c.json({ error: "Patient not found" }, 404);
  }

  const caminho = await c.env.DB.prepare(
    `SELECT * FROM caminho WHERE patient_id = ?`
  ).bind(patientId).first();

  return c.json(normalizeCaminhoRecord(caminho as Record<string, any> | null));
});

// Create or update caminho
app.post("/api/patients/:patientId/caminho", authMiddleware, async (c) => {
  const user = c.get("user");
  const patientId = c.req.param("patientId");
  const body = await c.req.json<Record<string, unknown>>();

  const patient = await c.env.DB.prepare(
    `SELECT id FROM patients WHERE id = ? AND user_id = ?`
  ).bind(patientId, user!.id).first();

  if (!patient) {
    return c.json({ error: "Patient not found" }, 404);
  }

  const normalizedPainPattern = normalizeDelimitedTextValue(
    body.pain_pattern ?? body.pain_patterns
  );

  // Check if caminho exists
  const existing = await c.env.DB.prepare(
    `SELECT id FROM caminho WHERE patient_id = ?`
  ).bind(patientId).first();

  let result;
  if (existing) {
    result = await c.env.DB.prepare(
      `UPDATE caminho SET 
       pain_pattern = ?, aggravating_factors = ?, relieving_factors = ?,
       functional_limitations = ?, treatment_goals = ?, red_flags = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE patient_id = ?
       RETURNING *`
    ).bind(
      normalizedPainPattern,
      normalizeDelimitedTextValue(body.aggravating_factors),
      normalizeDelimitedTextValue(body.relieving_factors),
      normalizeDelimitedTextValue(body.functional_limitations),
      normalizeDelimitedTextValue(body.treatment_goals),
      normalizeDelimitedTextValue(body.red_flags),
      patientId
    ).first();
  } else {
    result = await c.env.DB.prepare(
      `INSERT INTO caminho (patient_id, pain_pattern, aggravating_factors, relieving_factors, functional_limitations, treatment_goals, red_flags)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       RETURNING *`
    ).bind(
      patientId,
      normalizedPainPattern,
      normalizeDelimitedTextValue(body.aggravating_factors),
      normalizeDelimitedTextValue(body.relieving_factors),
      normalizeDelimitedTextValue(body.functional_limitations),
      normalizeDelimitedTextValue(body.treatment_goals),
      normalizeDelimitedTextValue(body.red_flags)
    ).first();
  }

  return c.json(normalizeCaminhoRecord(result as Record<string, any> | null), existing ? 200 : 201);
});

// ============================================
// SUPORTE (SUPPORT) API - Read Only
// ============================================

// Get support suggestions for a patient
app.get("/api/patients/:patientId/suporte", authMiddleware, async (c) => {
  const user = c.get("user");
  const patientId = c.req.param("patientId");

  const patient = await c.env.DB.prepare(
    `SELECT id FROM patients WHERE id = ? AND user_id = ?`
  ).bind(patientId, user!.id).first();

  if (!patient) {
    return c.json({ error: "Patient not found" }, 404);
  }

  // Get evaluation data
  const evaluation = await c.env.DB.prepare(
    `SELECT * FROM evaluations WHERE patient_id = ? AND type = 'initial' ORDER BY created_at DESC LIMIT 1`
  ).bind(patientId).first();

  // Get caminho data
  const caminho = await c.env.DB.prepare(
    `SELECT * FROM caminho WHERE patient_id = ?`
  ).bind(patientId).first();

  // Get latest evolution
  const latestEvolution = await c.env.DB.prepare(
    `SELECT * FROM evolutions WHERE patient_id = ? ORDER BY session_date DESC LIMIT 1`
  ).bind(patientId).first();

  // Generate structured support data
  const structured = generateStructuredSuporte(evaluation, caminho, latestEvolution);

  return c.json({
    evaluation,
    caminho,
    latestEvolution,
    suggestions: structured.insights.map(i => `${i.title}: ${i.description}`),
    structured
  });
});

// Types for structured clinical support
interface ClinicalInsight {
  category: "pain" | "progression" | "region" | "caminho" | "evolution" | "alert";
  priority: "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  actions?: string[];
}

interface DiagnosticHypothesis {
  condition: string;
  confidence: "alta" | "média" | "baixa";
  reasoning: string[];
  differentials: string[];
  suggestedTests: string[];
}

interface StructuredSuporte {
  painStatus: {
    level: number | null;
    severity: "none" | "low" | "moderate" | "high";
    trend: "improving" | "stable" | "worsening" | null;
    changePercent: number | null;
  };
  insights: ClinicalInsight[];
  nextSteps: string[];
  diagnosticHypotheses: DiagnosticHypothesis[];
}

// Helper function to generate structured clinical support data
function generateStructuredSuporte(evaluation: any, caminho: any, evolution: any): StructuredSuporte {
  const insights: ClinicalInsight[] = [];
  const nextSteps: string[] = [];

  const painLevel = evolution?.pain_level ?? evaluation?.pain_level;
  const initialPain = evaluation?.pain_level;
  const currentPain = evolution?.pain_level;
  const painLocation = evaluation?.pain_location || "";
  const chiefComplaint = evaluation?.chief_complaint || "";

  // Calculate pain status
  let severity: "none" | "low" | "moderate" | "high" = "none";
  let trend: "improving" | "stable" | "worsening" | null = null;
  let changePercent: number | null = null;

  if (painLevel !== null && painLevel !== undefined) {
    if (painLevel >= 7) severity = "high";
    else if (painLevel >= 4) severity = "moderate";
    else if (painLevel >= 1) severity = "low";
    else severity = "none";

    if (initialPain !== null && currentPain !== null) {
      const diff = initialPain - currentPain;
      if (diff > 0) {
        trend = "improving";
        changePercent = Math.round((diff / initialPain) * 100);
      } else if (diff < 0) {
        trend = "worsening";
        changePercent = Math.round((Math.abs(diff) / initialPain) * 100);
      } else {
        trend = "stable";
        changePercent = 0;
      }
    }
  }

  // Generate insights based on pain level
  if (!evaluation) {
    insights.push({
      category: "alert",
      priority: "info",
      title: "Avaliação Pendente",
      description: "Complete a avaliação inicial para ativar o apoio clínico.",
      actions: ["Registrar queixa principal", "Documentar EVA inicial", "Exame físico"]
    });
  } else {
    // Pain-based insights
    if (severity === "high") {
      insights.push({
        category: "pain",
        priority: "high",
        title: "Dor Intensa",
        description: "Priorizar analgesia antes de exercícios intensos.",
        actions: ["TENS 100-150Hz", "Crioterapia 15-20min", "Mobilização neural suave"]
      });
    } else if (severity === "moderate") {
      insights.push({
        category: "pain",
        priority: "medium",
        title: "Dor Moderada",
        description: "Fase adequada para combinar analgesia com cinesioterapia.",
        actions: ["Terapia manual graus I-II", "Alongamentos suaves", "Isometria progressiva"]
      });
    } else if (severity === "low") {
      insights.push({
        category: "pain",
        priority: "low",
        title: "Dor Leve",
        description: "Momento ideal para progressão funcional.",
        actions: ["Fortalecimento isotônico", "Propriocepção", "Retorno às atividades"]
      });
    }

    // Progression insights
    if (trend === "improving" && changePercent) {
      insights.push({
        category: "progression",
        priority: "low",
        title: "Evolução Positiva",
        description: `Redução de ${changePercent}% na dor. Manter abordagem atual.`,
        actions: ["Progressão gradual de cargas", "Documentar técnicas eficazes"]
      });
    } else if (trend === "worsening") {
      insights.push({
        category: "progression",
        priority: "high",
        title: "Atenção: Piora",
        description: "Paciente com aumento da dor. Reavaliar conduta.",
        actions: ["Verificar sobrecarga", "Considerar nova avaliação", "Ajustar plano"]
      });
    }

    // Region-specific insights
    const regiaoLower = painLocation.toLowerCase();
    if (regiaoLower.includes("ombro") || regiaoLower.includes("shoulder")) {
      insights.push({
        category: "region",
        priority: "info",
        title: "Ombro",
        description: "Atenção à estabilidade escapular e manguito rotador.",
        actions: ["Testes de Neer/Hawkins", "Fortalecimento serrátil", "Mobilidade glenoumeral"]
      });
    } else if (regiaoLower.includes("coluna") || regiaoLower.includes("lombar") || regiaoLower.includes("cervical")) {
      insights.push({
        category: "region",
        priority: "info",
        title: "Coluna",
        description: "Avaliar padrão de dor e controle motor profundo.",
        actions: ["Estabilização segmentar", "Avaliação postural", "Orientação ergonômica"]
      });
    } else if (regiaoLower.includes("joelho") || regiaoLower.includes("knee")) {
      insights.push({
        category: "region",
        priority: "info",
        title: "Joelho",
        description: "Avaliar alinhamento e controle neuromuscular.",
        actions: ["Exercícios CCA/CCF", "Propriocepção", "Análise da marcha"]
      });
    }

    // Caminho insights
    if (caminho?.red_flags && caminho.red_flags !== "none") {
      insights.push({
        category: "alert",
        priority: "high",
        title: "Red Flags",
        description: "Sinais de alerta identificados. Considerar encaminhamento.",
        actions: ["Avaliação médica", "Exames complementares", "Documentar conduta"]
      });
    }

    // Evolution insights
    if (evolution) {
      if (evolution.patient_response === "positive") {
        nextSteps.push("Manter abordagem atual");
        nextSteps.push("Considerar progressão de cargas");
      } else if (evolution.patient_response === "negative") {
        insights.push({
          category: "evolution",
          priority: "high",
          title: "Resposta Negativa",
          description: "Paciente não responde ao tratamento atual.",
          actions: ["Reavaliação completa", "Ajuste de técnicas", "Avaliar fatores psicossociais"]
        });
      }
    }

    // Chronic condition
    if (chiefComplaint.toLowerCase().includes("crônic") || chiefComplaint.toLowerCase().includes("meses")) {
      insights.push({
        category: "alert",
        priority: "info",
        title: "Condição Crônica",
        description: "Considerar abordagem biopsicossocial.",
        actions: ["Educação em dor", "Pacing de atividades", "Expectativas realistas"]
      });
    }
  }

  // Generate next steps if empty
  if (nextSteps.length === 0) {
    if (!evaluation) {
      nextSteps.push("Completar avaliação inicial");
    } else if (!caminho) {
      nextSteps.push("Preencher módulo Caminho");
    } else if (!evolution) {
      nextSteps.push("Registrar primeira evolução");
    } else {
      nextSteps.push("Continuar plano terapêutico");
    }
  }

  // Generate diagnostic hypotheses
  const diagnosticHypotheses = generateDiagnosticHypotheses(evaluation, caminho, evolution);

  return {
    painStatus: {
      level: painLevel ?? null,
      severity,
      trend,
      changePercent
    },
    insights,
    nextSteps,
    diagnosticHypotheses
  };
}

// Generate diagnostic hypotheses based on all patient data
function generateDiagnosticHypotheses(evaluation: any, caminho: any, _evolution: any): DiagnosticHypothesis[] {
  const hypotheses: DiagnosticHypothesis[] = [];
  
  if (!evaluation) return hypotheses;

  const painLocation = (evaluation.pain_location || "").toLowerCase();
  const chiefComplaint = (evaluation.chief_complaint || "").toLowerCase();
  
  // Parse caminho data
  const painPatterns = splitDelimitedText(caminho?.pain_pattern ?? caminho?.pain_patterns);
  const aggravatingFactors = splitDelimitedText(caminho?.aggravating_factors);
  const relievingFactors = splitDelimitedText(caminho?.relieving_factors);
  const functionalLimitations = splitDelimitedText(caminho?.functional_limitations);
  const redFlags = splitDelimitedText(caminho?.red_flags);

  // ========== SHOULDER CONDITIONS ==========
  if (painLocation.includes("ombro") || painLocation.includes("shoulder") || painLocation.includes("deltóide") || painLocation.includes("deltoide")) {
    // Síndrome do Impacto
    const impactReasons: string[] = [];
    if (aggravatingFactors.some((f: string) => 
      f.includes("elevação") || f.includes("acima") || f.includes("levantar") || 
      f.includes("erguer") || f.includes("braço") || f.includes("alto") ||
      f.includes("pentear") || f.includes("vestir") || f.includes("alcançar"))) {
      impactReasons.push("Dor ao elevar o braço acima de 90°");
    }
    if (painPatterns.some((p: string) => p.includes("movimento") || p.includes("mexer") || p.includes("mover"))) {
      impactReasons.push("Dor relacionada ao movimento");
    }
    if (chiefComplaint.includes("arco doloroso") || chiefComplaint.includes("abdução") || 
        chiefComplaint.includes("abrir o braço") || chiefComplaint.includes("lateral")) {
      impactReasons.push("Arco doloroso na abdução");
    }
    if (impactReasons.length >= 1) {
      hypotheses.push({
        condition: "Síndrome do Impacto do Ombro",
        confidence: impactReasons.length >= 2 ? "alta" : "média",
        reasoning: impactReasons.length > 0 ? impactReasons : ["Localização de dor compatível"],
        differentials: ["Tendinopatia do Manguito Rotador", "Bursite Subacromial", "Capsulite Adesiva"],
        suggestedTests: ["Teste de Neer", "Teste de Hawkins-Kennedy", "Teste de Jobe"]
      });
    }

    // Capsulite Adesiva
    const capsuliteReasons: string[] = [];
    if (functionalLimitations.some((l: string) => 
      l.includes("rotação") || l.includes("rigidez") || l.includes("duro") || 
      l.includes("preso") || l.includes("limitado") || l.includes("não consegue"))) {
      capsuliteReasons.push("Limitação de rotação externa");
    }
    if (chiefComplaint.includes("congelado") || chiefComplaint.includes("rígido") || 
        chiefComplaint.includes("travado") || chiefComplaint.includes("preso") ||
        chiefComplaint.includes("não mexe") || chiefComplaint.includes("duro") ||
        chiefComplaint.includes("trancado")) {
      capsuliteReasons.push("Relato de ombro congelado/travado");
    }
    if (painPatterns.some((p: string) => 
      p.includes("noturna") || p.includes("repouso") || p.includes("dormir") || 
      p.includes("noite") || p.includes("deitar"))) {
      capsuliteReasons.push("Dor noturna significativa");
    }
    if (capsuliteReasons.length >= 1) {
      hypotheses.push({
        condition: "Capsulite Adesiva (Ombro Congelado)",
        confidence: capsuliteReasons.length >= 2 ? "alta" : "média",
        reasoning: capsuliteReasons,
        differentials: ["Artrose Glenoumeral", "Lesão SLAP", "Síndrome do Impacto"],
        suggestedTests: ["Amplitude de Movimento Passiva", "Rotação Externa Passiva", "Teste de Apley"]
      });
    }

    // Ombro Genérico (fallback)
    if (hypotheses.filter(h => h.condition.includes("Ombro") || h.condition.includes("Capsulite")).length === 0) {
      hypotheses.push({
        condition: "Omalgia Mecânica",
        confidence: "média",
        reasoning: ["Dor localizada no ombro", "Requer avaliação clínica detalhada"],
        differentials: ["Síndrome do Impacto", "Tendinopatia", "Bursite", "Capsulite"],
        suggestedTests: ["Teste de Neer", "Teste de Jobe", "Amplitude de Movimento Ativa/Passiva"]
      });
    }
  }

  // ========== SPINE CONDITIONS ==========
  if (painLocation.includes("lombar") || painLocation.includes("coluna") || painLocation.includes("costas") ||
      painLocation.includes("espinha") || painLocation.includes("dorsal") || painLocation.includes("baixa") ||
      painLocation.includes("quadril") || painLocation.includes("sacro") || painLocation.includes("cóccix")) {
    // Hérnia de Disco / Radiculopatia
    const herniaReasons: string[] = [];
    if (chiefComplaint.includes("irradiada") || chiefComplaint.includes("perna") || chiefComplaint.includes("formigamento") ||
        chiefComplaint.includes("desce") || chiefComplaint.includes("descer") || chiefComplaint.includes("glúteo") ||
        chiefComplaint.includes("bunda") || chiefComplaint.includes("nádega") || chiefComplaint.includes("coxa") ||
        chiefComplaint.includes("dormente") || chiefComplaint.includes("queimando") || chiefComplaint.includes("choque") ||
        chiefComplaint.includes("ciático") || chiefComplaint.includes("ciática")) {
      herniaReasons.push("Dor irradiada para membro inferior");
    }
    if (painPatterns.some((p: string) => 
      p.includes("sentar") || p.includes("flexão") || p.includes("sentado") || 
      p.includes("abaixar") || p.includes("curvar"))) {
      herniaReasons.push("Piora com flexão/sentado");
    }
    if (aggravatingFactors.some((f: string) => 
      f.includes("tosse") || f.includes("espirro") || f.includes("força") || f.includes("evacuar"))) {
      herniaReasons.push("Piora com tosse/espirro (Valsalva)");
    }
    if (herniaReasons.length >= 1) {
      hypotheses.push({
        condition: "Hérnia Discal Lombar / Radiculopatia",
        confidence: herniaReasons.length >= 2 ? "alta" : "média",
        reasoning: herniaReasons,
        differentials: ["Estenose Lombar", "Síndrome Piriforme", "Dor Lombar Mecânica"],
        suggestedTests: ["Lasègue (SLR)", "Slump Test", "Dermátomos/Miótomos", "Reflexos L4-S1"]
      });
    }

    // Dor Lombar Mecânica
    const mecanicaReasons: string[] = [];
    if (relievingFactors.some((f: string) => 
      f.includes("repouso") || f.includes("deitado") || f.includes("parado") || 
      f.includes("quieto") || f.includes("descansando"))) {
      mecanicaReasons.push("Alívio com repouso");
    }
    if (aggravatingFactors.some((f: string) => 
      f.includes("movimento") || f.includes("carregar") || f.includes("peso") ||
      f.includes("levantar") || f.includes("trabalho") || f.includes("esforço") ||
      f.includes("pegar") || f.includes("agachar") || f.includes("curvar"))) {
      mecanicaReasons.push("Piora com atividade física");
    }
    if (!chiefComplaint.includes("irradiada") && !chiefComplaint.includes("perna") && !chiefComplaint.includes("desce")) {
      mecanicaReasons.push("Dor localizada sem irradiação");
    }
    if (mecanicaReasons.length >= 1) {
      hypotheses.push({
        condition: "Dor Lombar Mecânica (Inespecífica)",
        confidence: mecanicaReasons.length >= 2 ? "alta" : "média",
        reasoning: mecanicaReasons,
        differentials: ["Hérnia Discal", "Espondilolistese", "Disfunção Sacroilíaca"],
        suggestedTests: ["Teste de Kemp", "Teste de Schober", "Palpação Segmentar"]
      });
    }

    // Lombalgia Genérica (fallback)
    if (hypotheses.filter(h => h.condition.includes("Lombar") || h.condition.includes("Discal")).length === 0) {
      hypotheses.push({
        condition: "Lombalgia Mecânica",
        confidence: "média",
        reasoning: ["Dor na região lombar/coluna", "Requer avaliação postural e funcional"],
        differentials: ["Dor Muscular", "Disfunção Articular", "Hérnia Discal", "Espondilolistese"],
        suggestedTests: ["Teste de Schober", "Palpação Paravertebral", "Teste de Kemp", "Avaliação Postural"]
      });
    }
  }

  // ========== CERVICAL CONDITIONS ==========
  if (painLocation.includes("cervical") || painLocation.includes("pescoço") || painLocation.includes("nuca") ||
      painLocation.includes("trapézio") || painLocation.includes("trapezio") || painLocation.includes("ombro superior")) {
    const cervicalReasons: string[] = [];
    if (chiefComplaint.includes("cefaleia") || chiefComplaint.includes("dor de cabeça") ||
        chiefComplaint.includes("cabeça") || chiefComplaint.includes("enxaqueca") || 
        chiefComplaint.includes("latejando") || chiefComplaint.includes("pressão na cabeça")) {
      cervicalReasons.push("Cefaleia associada");
    }
    if (aggravatingFactors.some((f: string) => 
      f.includes("computador") || f.includes("celular") || f.includes("postura") ||
      f.includes("trabalho") || f.includes("sentado") || f.includes("dirigir") ||
      f.includes("tela") || f.includes("notebook") || f.includes("escrevendo"))) {
      cervicalReasons.push("Piora com postura mantida");
    }
    if (functionalLimitations.some((l: string) => 
      l.includes("rotação") || l.includes("olhar") || l.includes("virar") ||
      l.includes("lado") || l.includes("girar") || l.includes("movimento"))) {
      cervicalReasons.push("Limitação de rotação cervical");
    }
    if (chiefComplaint.includes("tensão") || chiefComplaint.includes("contratura") ||
        chiefComplaint.includes("duro") || chiefComplaint.includes("travado") ||
        chiefComplaint.includes("nó") || chiefComplaint.includes("apertado")) {
      cervicalReasons.push("Tensão muscular cervical");
    }
    if (chiefComplaint.includes("braço") || chiefComplaint.includes("mão") ||
        chiefComplaint.includes("formigamento") || chiefComplaint.includes("dormente")) {
      cervicalReasons.push("Possível irradiação para membro superior");
    }
    if (cervicalReasons.length >= 1) {
      hypotheses.push({
        condition: "Cervicalgia Mecânica / Tensional",
        confidence: cervicalReasons.length >= 2 ? "alta" : "média",
        reasoning: cervicalReasons,
        differentials: ["Cervicobraquialgia", "Hérnia Cervical", "Síndrome do Desfiladeiro Torácico"],
        suggestedTests: ["Teste de Spurling", "Teste de Distração", "Amplitude de Movimento"]
      });
    }

    // Cervicalgia Genérica (fallback)
    if (hypotheses.filter(h => h.condition.includes("Cervical")).length === 0) {
      hypotheses.push({
        condition: "Cervicalgia",
        confidence: "média",
        reasoning: ["Dor na região cervical/pescoço", "Avaliar postura e ergonomia"],
        differentials: ["Tensão Muscular", "Disfunção Articular", "Hérnia Cervical"],
        suggestedTests: ["Amplitude de Movimento", "Palpação Muscular", "Teste de Spurling"]
      });
    }
  }

  // ========== KNEE CONDITIONS ==========
  if (painLocation.includes("joelho") || painLocation.includes("knee") || painLocation.includes("perna") ||
      painLocation.includes("patela") || painLocation.includes("rótula")) {
    // Lesão de Ligamento
    const ligamentoReasons: string[] = [];
    if (chiefComplaint.includes("torção") || chiefComplaint.includes("trauma") || chiefComplaint.includes("entorse") ||
        chiefComplaint.includes("torceu") || chiefComplaint.includes("virou") || chiefComplaint.includes("pisou") ||
        chiefComplaint.includes("futebol") || chiefComplaint.includes("esporte") || chiefComplaint.includes("jogo") ||
        chiefComplaint.includes("caiu") || chiefComplaint.includes("queda") || chiefComplaint.includes("bateu")) {
      ligamentoReasons.push("História de trauma/torção");
    }
    if (chiefComplaint.includes("instável") || chiefComplaint.includes("falseio") ||
        chiefComplaint.includes("falhando") || chiefComplaint.includes("cedendo") ||
        chiefComplaint.includes("inseguro") || chiefComplaint.includes("frouxo") ||
        chiefComplaint.includes("escapando") || chiefComplaint.includes("solta")) {
      ligamentoReasons.push("Sensação de instabilidade");
    }
    if (chiefComplaint.includes("estalo") || chiefComplaint.includes("clique") || chiefComplaint.includes("estalou")) {
      ligamentoReasons.push("Relato de estalo no momento da lesão");
    }
    if (ligamentoReasons.length >= 1) {
      hypotheses.push({
        condition: "Lesão Ligamentar do Joelho",
        confidence: ligamentoReasons.length >= 2 ? "alta" : "média",
        reasoning: ligamentoReasons,
        differentials: ["Lesão de LCA", "Lesão de LCM", "Lesão Meniscal"],
        suggestedTests: ["Teste de Gaveta Anterior/Posterior", "Teste de Lachman", "Teste de Varo/Valgo"]
      });
    }

    // Lesão Meniscal
    const meniscoReasons: string[] = [];
    if (chiefComplaint.includes("trava") || chiefComplaint.includes("bloqueia") || 
        chiefComplaint.includes("prende") || chiefComplaint.includes("travando")) {
      meniscoReasons.push("Bloqueio articular");
    }
    if (chiefComplaint.includes("estalo") || chiefComplaint.includes("clique") ||
        chiefComplaint.includes("barulho") || chiefComplaint.includes("crepitação")) {
      meniscoReasons.push("Crepitação/estalidos");
    }
    if (chiefComplaint.includes("inchaço") || chiefComplaint.includes("inchado") ||
        chiefComplaint.includes("derrame") || chiefComplaint.includes("líquido")) {
      meniscoReasons.push("Edema articular");
    }
    if (meniscoReasons.length >= 1) {
      hypotheses.push({
        condition: "Lesão Meniscal",
        confidence: meniscoReasons.length >= 2 ? "alta" : "média",
        reasoning: meniscoReasons,
        differentials: ["Lesão de LCA", "Condropatia", "Artrose"],
        suggestedTests: ["Teste de McMurray", "Teste de Apley", "Teste de Thessaly"]
      });
    }

    // Condropatia / Síndrome Patelofemoral
    const patelaReasons: string[] = [];
    if (painLocation.includes("anterior") || painLocation.includes("frente") ||
        chiefComplaint.includes("frente do joelho") || chiefComplaint.includes("na frente")) {
      patelaReasons.push("Dor anterior do joelho");
    }
    if (aggravatingFactors.some((f: string) => 
      f.includes("escada") || f.includes("agachar") || f.includes("sentar") ||
      f.includes("ajoelhar") || f.includes("subir") || f.includes("descer") ||
      f.includes("levantar") || f.includes("cinema") || f.includes("carro"))) {
      patelaReasons.push("Piora com escadas/agachamento");
    }
    if (chiefComplaint.includes("flexão") || chiefComplaint.includes("flexiona") || 
        chiefComplaint.includes("dobrar") || chiefComplaint.includes("dobrando") ||
        chiefComplaint.includes("movimento") || chiefComplaint.includes("mexer")) {
      patelaReasons.push("Dor ao flexionar o joelho");
    }
    if (patelaReasons.length >= 1) {
      hypotheses.push({
        condition: "Síndrome da Dor Patelofemoral",
        confidence: patelaReasons.length >= 2 ? "alta" : "média",
        reasoning: patelaReasons,
        differentials: ["Condromalácia Patelar", "Tendinopatia Patelar", "Bursite Pré-patelar"],
        suggestedTests: ["Teste de Clarke", "Teste de Compressão Patelar", "Avaliação do Ângulo Q"]
      });
    }

    // Artrose de Joelho
    const artroseReasons: string[] = [];
    if (chiefComplaint.includes("desgaste") || chiefComplaint.includes("artrose") ||
        chiefComplaint.includes("idade") || chiefComplaint.includes("anos")) {
      artroseReasons.push("Provável processo degenerativo");
    }
    if (chiefComplaint.includes("rigidez") || chiefComplaint.includes("duro") ||
        chiefComplaint.includes("manhã") || chiefComplaint.includes("acordar")) {
      artroseReasons.push("Rigidez matinal");
    }
    if (artroseReasons.length >= 1) {
      hypotheses.push({
        condition: "Osteoartrose de Joelho",
        confidence: artroseReasons.length >= 2 ? "alta" : "média",
        reasoning: artroseReasons,
        differentials: ["Lesão Meniscal", "Condropatia", "Artrite Inflamatória"],
        suggestedTests: ["Avaliação de Crepitação", "Amplitude de Movimento", "Força Muscular"]
      });
    }

    // Gonalgia Mecânica (fallback when no specific condition matches)
    if (hypotheses.filter(h => 
      h.condition.includes("Joelho") || h.condition.includes("Patelofemoral") || 
      h.condition.includes("Ligamentar") || h.condition.includes("Meniscal") ||
      h.condition.includes("Gonalgia") || h.condition.includes("Osteoartrose")).length === 0) {
      const genericReasons: string[] = ["Dor localizada no joelho"];
      if (chiefComplaint.includes("dor")) genericReasons.push("Queixa principal de dor");
      if (chiefComplaint.includes("forte") || chiefComplaint.includes("intensa") || chiefComplaint.includes("muito")) {
        genericReasons.push("Intensidade elevada");
      }
      hypotheses.push({
        condition: "Gonalgia Mecânica",
        confidence: "média",
        reasoning: genericReasons,
        differentials: ["Síndrome Patelofemoral", "Lesão Meniscal", "Tendinopatia", "Artrose de Joelho"],
        suggestedTests: ["Teste de McMurray", "Teste de Apley", "Avaliação de Instabilidade", "Palpação de Estruturas"]
      });
    }
  }

  // ========== ANKLE/FOOT CONDITIONS ==========
  if (painLocation.includes("tornozelo") || painLocation.includes("pé") || painLocation.includes("ankle") || 
      painLocation.includes("foot") || painLocation.includes("calcanhar") || painLocation.includes("planta") ||
      painLocation.includes("dedos") || painLocation.includes("metatarso")) {
    const tornozReasons: string[] = [];
    if (chiefComplaint.includes("torção") || chiefComplaint.includes("entorse") ||
        chiefComplaint.includes("torceu") || chiefComplaint.includes("virou") ||
        chiefComplaint.includes("pisou em falso") || chiefComplaint.includes("pisou errado") ||
        chiefComplaint.includes("degrau") || chiefComplaint.includes("buraco")) {
      tornozReasons.push("História de entorse");
    }
    if (aggravatingFactors.some((f: string) => 
      f.includes("caminhar") || f.includes("pisar") || f.includes("andar") ||
      f.includes("correr") || f.includes("apoiar") || f.includes("subir") ||
      f.includes("terreno"))) {
      tornozReasons.push("Dor ao apoiar o pé");
    }
    if (chiefComplaint.includes("inchado") || chiefComplaint.includes("inchaço") ||
        chiefComplaint.includes("roxo") || chiefComplaint.includes("edema")) {
      tornozReasons.push("Edema/hematoma presente");
    }
    if (tornozReasons.length >= 1) {
      hypotheses.push({
        condition: "Entorse de Tornozelo / Instabilidade",
        confidence: tornozReasons.length >= 2 ? "alta" : "média",
        reasoning: tornozReasons,
        differentials: ["Lesão de LTFA", "Fratura por estresse", "Tendinopatia dos Fibulares"],
        suggestedTests: ["Teste de Gaveta Anterior", "Teste de Talar Tilt", "Teste de Squeeze"]
      });
    }

    // Fasciite Plantar
    const fasciiteReasons: string[] = [];
    if (chiefComplaint.includes("calcanhar") || chiefComplaint.includes("planta") || 
        chiefComplaint.includes("primeiro passo") || chiefComplaint.includes("primeiros passos") ||
        chiefComplaint.includes("levantar da cama") || chiefComplaint.includes("acordar") ||
        chiefComplaint.includes("manhã") || chiefComplaint.includes("sola")) {
      fasciiteReasons.push("Dor em região plantar/calcanhar");
      fasciiteReasons.push("Dor típica nos primeiros passos");
    }
    if (chiefComplaint.includes("queimando") || chiefComplaint.includes("ardendo") ||
        chiefComplaint.includes("fisgada") || chiefComplaint.includes("pontada")) {
      fasciiteReasons.push("Dor tipo queimação/pontada");
    }
    if (fasciiteReasons.length >= 1) {
      hypotheses.push({
        condition: "Fasciite Plantar",
        confidence: fasciiteReasons.length >= 2 ? "alta" : "média",
        reasoning: fasciiteReasons,
        differentials: ["Esporão de Calcâneo", "Síndrome do Túnel do Tarso", "Fratura por Estresse"],
        suggestedTests: ["Palpação do Calcâneo", "Windlass Test", "Avaliação da Dorsiflexão"]
      });
    }

    // Tendinopatia de Aquiles
    const aquilesReasons: string[] = [];
    if (chiefComplaint.includes("aquiles") || chiefComplaint.includes("tendão") ||
        chiefComplaint.includes("atrás do tornozelo") || chiefComplaint.includes("panturrilha")) {
      aquilesReasons.push("Dor na região do tendão de Aquiles");
    }
    if (aggravatingFactors.some((f: string) => 
      f.includes("correr") || f.includes("pular") || f.includes("saltar") ||
      f.includes("subir") || f.includes("ponta do pé"))) {
      aquilesReasons.push("Piora com atividades de impacto");
    }
    if (aquilesReasons.length >= 1) {
      hypotheses.push({
        condition: "Tendinopatia de Aquiles",
        confidence: aquilesReasons.length >= 2 ? "alta" : "média",
        reasoning: aquilesReasons,
        differentials: ["Bursite Retrocalcânea", "Fasciite Plantar", "Ruptura Parcial"],
        suggestedTests: ["Teste de Thompson", "Palpação do Tendão", "Teste de Royal London"]
      });
    }

    // Pé/Tornozelo Genérico (fallback)
    if (hypotheses.filter(h => 
      h.condition.includes("Tornozelo") || h.condition.includes("Fasciite") || 
      h.condition.includes("Aquiles")).length === 0) {
      hypotheses.push({
        condition: "Dor no Pé/Tornozelo",
        confidence: "média",
        reasoning: ["Dor localizada no pé ou tornozelo", "Requer avaliação biomecânica"],
        differentials: ["Entorse", "Fasciite", "Tendinopatia", "Metatarsalgia"],
        suggestedTests: ["Avaliação da Marcha", "Palpação de Estruturas", "Amplitude de Movimento"]
      });
    }
  }

  // ========== CHRONIC PAIN / GENERAL ==========
  if (chiefComplaint.includes("crônic") || chiefComplaint.includes("meses") || chiefComplaint.includes("anos") ||
      chiefComplaint.includes("muito tempo") || chiefComplaint.includes("sempre") || chiefComplaint.includes("antigo") ||
      chiefComplaint.includes("desde") || chiefComplaint.includes("há muito") || chiefComplaint.includes("recorrente") ||
      chiefComplaint.includes("vai e volta") || chiefComplaint.includes("nunca some")) {
    const chronicReasons: string[] = ["Duração prolongada dos sintomas"];
    if (chiefComplaint.includes("todo lugar") || chiefComplaint.includes("várias partes") ||
        chiefComplaint.includes("generalizada") || chiefComplaint.includes("corpo todo")) {
      chronicReasons.push("Dor difusa/generalizada");
    }
    if (chiefComplaint.includes("cansaço") || chiefComplaint.includes("fadiga") ||
        chiefComplaint.includes("sono") || chiefComplaint.includes("dormir")) {
      chronicReasons.push("Fadiga/alteração do sono associada");
    }
    hypotheses.push({
      condition: "Dor Crônica / Sensibilização Central",
      confidence: chronicReasons.length >= 2 ? "alta" : "média",
      reasoning: chronicReasons,
      differentials: ["Fibromialgia", "Síndrome Miofascial", "Condição reumática"],
      suggestedTests: ["Avaliação de Pontos-Gatilho", "Questionário de Catastrofização", "Avaliação Biopsicossocial"]
    });
  }

  // ========== MUSCLE/GENERAL PAIN ==========
  if (chiefComplaint.includes("musculo") || chiefComplaint.includes("músculo") ||
      chiefComplaint.includes("muscular") || chiefComplaint.includes("contratura") ||
      chiefComplaint.includes("tensão") || chiefComplaint.includes("nó") ||
      chiefComplaint.includes("endurecido") || chiefComplaint.includes("espasmo")) {
    hypotheses.push({
      condition: "Dor Muscular / Síndrome Miofascial",
      confidence: "média",
      reasoning: ["Sintomas compatíveis com dor muscular", "Possíveis pontos-gatilho"],
      differentials: ["Tensão Muscular", "Pontos-Gatilho", "Contratura"],
      suggestedTests: ["Palpação de Pontos-Gatilho", "Avaliação de Encurtamentos", "Teste de Força"]
    });
  }

  // ========== POSTURAL CONDITIONS ==========
  if (chiefComplaint.includes("postura") || chiefComplaint.includes("torto") ||
      chiefComplaint.includes("curvado") || chiefComplaint.includes("escoliose") ||
      chiefComplaint.includes("cifose") || chiefComplaint.includes("lordose") ||
      chiefComplaint.includes("desalinhado") || chiefComplaint.includes("desnivelado")) {
    hypotheses.push({
      condition: "Disfunção Postural",
      confidence: "média",
      reasoning: ["Alteração postural relatada", "Possível desequilíbrio muscular"],
      differentials: ["Escoliose", "Hipercifose", "Hiperlordose", "Desequilíbrio Muscular"],
      suggestedTests: ["Avaliação Postural", "Teste de Flexibilidade", "Avaliação de Força"]
    });
  }

  // ========== RED FLAGS ==========
  if (redFlags.length > 0 && !redFlags.includes("none")) {
    hypotheses.push({
      condition: "⚠️ Red Flags Identificados - Avaliação Médica Prioritária",
      confidence: "alta",
      reasoning: ["Sinais de alerta identificados no Caminho Clínico", "Possível patologia grave subjacente"],
      differentials: ["Fratura", "Infecção", "Neoplasia", "Síndrome da Cauda Equina"],
      suggestedTests: ["Encaminhamento médico urgente", "Exames de imagem", "Exames laboratoriais"]
    });
  }

  return hypotheses;
}

// generateSuggestions removed - using generateStructuredSuporte directly

// ============================================
// ALERTAS (ALERTS) API
// ============================================

// Get alert status for a patient
app.get("/api/patients/:patientId/alertas", authMiddleware, async (c) => {
  const user = c.get("user");
  const patientId = c.req.param("patientId");

  const patient = await c.env.DB.prepare(
    `SELECT * FROM patients WHERE id = ? AND user_id = ?`
  ).bind(patientId, user!.id).first();

  if (!patient) {
    return c.json({ error: "Patient not found" }, 404);
  }

  // Get all evolutions
  const { results: evolutions } = await c.env.DB.prepare(
    `SELECT * FROM evolutions WHERE patient_id = ? ORDER BY session_date ASC`
  ).bind(patientId).all();

  // Get initial evaluation
  const initialEval = await c.env.DB.prepare(
    `SELECT * FROM evaluations WHERE patient_id = ? AND type = 'initial' ORDER BY created_at ASC LIMIT 1`
  ).bind(patientId).first();

  // Calculate alert status
  const alertStatus = calculateAlertStatus(initialEval, evolutions as any[]);

  return c.json({
    status: alertStatus.status,
    color: alertStatus.color,
    message: alertStatus.message,
    details: alertStatus.details,
    evolutionCount: evolutions.length,
    lastEvolution: evolutions.length > 0 ? evolutions[evolutions.length - 1] : null
  });
});

// Get alerts overview for all patients
app.get("/api/alertas/overview", authMiddleware, async (c) => {
  const user = c.get("user");

  const { results: patients } = await c.env.DB.prepare(
    `SELECT p.*, 
     (SELECT COUNT(*) FROM evolutions WHERE patient_id = p.id) as evolution_count,
     (SELECT pain_level FROM evolutions WHERE patient_id = p.id ORDER BY session_date DESC LIMIT 1) as last_pain_level,
     (SELECT pain_level FROM evaluations WHERE patient_id = p.id AND type = 'initial' ORDER BY created_at ASC LIMIT 1) as initial_pain_level
     FROM patients p WHERE p.user_id = ?`
  ).bind(user!.id).all();

  const overview = patients.map((patient: any) => {
    let status: "green" | "yellow" | "red" = "yellow";
    let message = "Aguardando avaliação";

    if (patient.initial_pain_level !== null && patient.last_pain_level !== null) {
      const improvement = patient.initial_pain_level - patient.last_pain_level;
      if (improvement >= 2) {
        status = "green";
        message = "Evolução adequada";
      } else if (improvement >= 0) {
        status = "yellow";
        message = "Evolução lenta";
      } else {
        status = "red";
        message = "Atenção - possível piora";
      }
    } else if (patient.evolution_count === 0) {
      status = "yellow";
      message = "Sem evoluções registradas";
    }

    return {
      id: patient.id,
      name: patient.name,
      status,
      message,
      evolutionCount: patient.evolution_count
    };
  });

  return c.json(overview);
});

function calculateAlertStatus(initialEval: any, evolutions: any[]): {
  status: "green" | "yellow" | "red";
  color: string;
  message: string;
  details: string[];
} {
  const details: string[] = [];

  if (!initialEval) {
    return {
      status: "yellow",
      color: "#eab308",
      message: "Avaliação inicial pendente",
      details: ["Complete a avaliação inicial para acompanhar a evolução do paciente."]
    };
  }

  if (evolutions.length === 0) {
    return {
      status: "yellow",
      color: "#eab308",
      message: "Aguardando primeira evolução",
      details: ["Registre a primeira sessão de evolução para iniciar o monitoramento."]
    };
  }

  const initialPain = initialEval.pain_level || 0;
  const lastEvolution = evolutions[evolutions.length - 1];
  const currentPain = lastEvolution.pain_level || 0;
  const painDiff = initialPain - currentPain;

  // Calculate trend over last 3 evolutions
  const recentEvolutions = evolutions.slice(-3);
  let trend = "stable";
  if (recentEvolutions.length >= 2) {
    const painValues = recentEvolutions.map((e: any) => e.pain_level || 0);
    const firstPain = painValues[0];
    const lastPain = painValues[painValues.length - 1];
    if (lastPain < firstPain) trend = "improving";
    else if (lastPain > firstPain) trend = "worsening";
  }

  details.push(`Dor inicial: ${initialPain}/10`);
  details.push(`Dor atual: ${currentPain}/10`);
  details.push(`Sessões registradas: ${evolutions.length}`);

  if (painDiff >= 3 || (currentPain <= 3 && trend === "improving")) {
    return {
      status: "green",
      color: "#22c55e",
      message: "Evolução adequada",
      details: [...details, "Paciente apresenta melhora significativa."]
    };
  }

  if (painDiff >= 1 || trend === "stable") {
    return {
      status: "yellow",
      color: "#eab308",
      message: "Atenção - evolução lenta",
      details: [...details, "Considerar reavaliação do plano terapêutico."]
    };
  }

  return {
    status: "red",
    color: "#ef4444",
    message: "Alerta - estagnação ou piora",
    details: [...details, "Recomenda-se reavaliação urgente do paciente."]
  };
}

// ============================================
// CLINICAL SUMMARY API
// ============================================

app.get("/api/patients/:patientId/clinical-summary", authMiddleware, async (c) => {
  const user = c.get("user");
  const patientId = c.req.param("patientId");

  const patient = await c.env.DB.prepare(
    `SELECT * FROM patients WHERE id = ? AND user_id = ?`
  ).bind(patientId, user!.id).first() as any;

  if (!patient) {
    return c.json({ error: "Patient not found" }, 404);
  }

  // Get all evaluations
  const { results: evaluations } = await c.env.DB.prepare(
    `SELECT * FROM evaluations WHERE patient_id = ? ORDER BY created_at ASC`
  ).bind(patientId).all();

  // Get all evolutions
  const { results: evolutions } = await c.env.DB.prepare(
    `SELECT * FROM evolutions WHERE patient_id = ? ORDER BY session_date ASC`
  ).bind(patientId).all();

  // Get caminho data
  const caminho = await c.env.DB.prepare(
    `SELECT * FROM caminho WHERE patient_id = ?`
  ).bind(patientId).first() as any;

  // Calculate metrics
  const initialEval = evaluations.find((e: any) => e.type === "initial") as any;
  const lastEvolution = evolutions.length > 0 ? evolutions[evolutions.length - 1] as any : null;
  
  const initialPain = initialEval?.pain_level ?? null;
  const currentPain = lastEvolution?.pain_level ?? initialPain;
  const painChange = initialPain !== null && currentPain !== null ? initialPain - currentPain : null;

  // Calculate days since start
  const firstDate = initialEval?.created_at || patient.created_at;
  const daysSinceStart = Math.floor(
    (Date.now() - new Date(firstDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Determine response pattern from evolutions
  let responsePattern: "positive" | "neutral" | "negative" | "mixed" | null = null;
  if (evolutions.length > 0) {
    const responses = evolutions.map((e: any) => e.patient_response).filter(Boolean);
    const positiveCount = responses.filter((r: string) => r === "positive").length;
    const negativeCount = responses.filter((r: string) => r === "negative").length;
    const neutralCount = responses.filter((r: string) => r === "neutral").length;
    
    if (responses.length > 0) {
      if (positiveCount > negativeCount && positiveCount > neutralCount) {
        responsePattern = "positive";
      } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
        responsePattern = "negative";
      } else if (positiveCount > 0 && negativeCount > 0) {
        responsePattern = "mixed";
      } else {
        responsePattern = "neutral";
      }
    }
  }

  // Generate highlights
  const highlights: { type: "positive" | "neutral" | "warning" | "critical"; text: string }[] = [];

  if (painChange !== null) {
    if (painChange >= 3) {
      highlights.push({ type: "positive", text: `Redução significativa de dor: ${painChange} pontos` });
    } else if (painChange > 0) {
      highlights.push({ type: "positive", text: `Melhora na dor: ${painChange} ponto${painChange > 1 ? "s" : ""}` });
    } else if (painChange < 0) {
      highlights.push({ type: "warning", text: `Aumento de dor: ${Math.abs(painChange)} ponto${Math.abs(painChange) > 1 ? "s" : ""}` });
    }
  }

  if (currentPain !== null) {
    if (currentPain >= 7) {
      highlights.push({ type: "critical", text: `Dor intensa atual: ${currentPain}/10` });
    } else if (currentPain <= 3 && currentPain > 0) {
      highlights.push({ type: "positive", text: `Dor controlada: ${currentPain}/10` });
    } else if (currentPain === 0) {
      highlights.push({ type: "positive", text: "Paciente sem dor" });
    }
  }

  if (responsePattern === "positive") {
    highlights.push({ type: "positive", text: "Resposta predominantemente positiva às sessões" });
  } else if (responsePattern === "negative") {
    highlights.push({ type: "warning", text: "Resposta negativa frequente - considerar ajuste" });
  }

  if (caminho?.red_flags) {
    highlights.push({ type: "critical", text: "Red flags identificados no Caminho Clínico" });
  }

  if (evolutions.length === 0 && evaluations.length > 0 && daysSinceStart > 7) {
    highlights.push({ type: "warning", text: `${daysSinceStart} dias sem registro de evolução` });
  }

  // Generate summary text
  let summaryText = "";
  if (!initialEval) {
    summaryText = "Paciente cadastrado, aguardando avaliação inicial para início do acompanhamento clínico estruturado.";
  } else if (evolutions.length === 0) {
    summaryText = `Avaliação inicial registrada com queixa de "${initialEval.chief_complaint || "não especificada"}". Dor inicial: ${initialPain ?? "não informada"}/10. Aguardando registro de sessões de evolução para análise de progressão.`;
  } else {
    const sessions = evolutions.length;
    const painStatus = currentPain !== null 
      ? currentPain <= 3 ? "controlada" : currentPain >= 7 ? "intensa" : "moderada"
      : "não avaliada";
    
    summaryText = `Paciente com ${sessions} ${sessions === 1 ? "sessão" : "sessões"} de tratamento em ${daysSinceStart} dias. `;
    
    if (painChange !== null && painChange > 0) {
      summaryText += `Apresenta evolução positiva com redução de ${painChange} pontos na escala de dor. `;
    } else if (painChange !== null && painChange < 0) {
      summaryText += `Atenção: aumento de ${Math.abs(painChange)} pontos na dor desde avaliação inicial. `;
    }
    
    summaryText += `Dor atual ${painStatus}${currentPain !== null ? ` (${currentPain}/10)` : ""}. `;
    
    if (responsePattern === "positive") {
      summaryText += "Boa resposta ao tratamento nas últimas sessões.";
    } else if (responsePattern === "mixed") {
      summaryText += "Resposta variável - monitorar padrão nas próximas sessões.";
    } else if (responsePattern === "negative") {
      summaryText += "Considerar reavaliação do plano terapêutico.";
    }
  }

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (!initialEval) {
    recommendations.push("Realizar avaliação inicial completa");
  }
  
  if (evolutions.length === 0 && initialEval) {
    recommendations.push("Registrar primeira sessão de evolução");
  }
  
  if (currentPain !== null && currentPain >= 7) {
    recommendations.push("Priorizar manejo da dor com TENS ou crioterapia");
    recommendations.push("Considerar ajuste de carga nos exercícios");
  }
  
  if (painChange !== null && painChange < 0) {
    recommendations.push("Reavaliar abordagem terapêutica");
    recommendations.push("Investigar possíveis fatores de piora");
  }
  
  if (caminho?.treatment_goals) {
    recommendations.push("Revisar progresso em relação aos objetivos definidos");
  }
  
  if (!caminho && initialEval) {
    recommendations.push("Completar documentação no módulo Caminho Clínico");
  }

  if (evolutions.length >= 5 && painChange !== null && painChange >= 3) {
    recommendations.push("Considerar critérios para alta ou manutenção");
  }

  return c.json({
    patientId: patient.id,
    patientName: patient.name,
    summaryText,
    highlights,
    metrics: {
      currentPain,
      initialPain,
      painChange,
      sessionsCount: evolutions.length,
      daysSinceStart,
      lastSessionDate: lastEvolution?.session_date || null,
      responsePattern
    },
    recommendations
  });
});

// ============================================
// DASHBOARD STATS API
// ============================================

app.get("/api/dashboard/stats", authMiddleware, async (c) => {
  const user = c.get("user");

  // Get total patients
  const patientsResult = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM patients WHERE user_id = ?`
  ).bind(user!.id).first() as any;

  // Get patient IDs for this user
  const { results: patientIds } = await c.env.DB.prepare(
    `SELECT id FROM patients WHERE user_id = ?`
  ).bind(user!.id).all();

  const patientIdList = patientIds.map((p: any) => p.id);
  
  let totalEvaluations = 0;
  let totalEvolutions = 0;
  let recentActivities: any[] = [];

  if (patientIdList.length > 0) {
    // Get total evaluations
    const evalResult = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM evaluations WHERE patient_id IN (SELECT id FROM patients WHERE user_id = ?)`
    ).bind(user!.id).first() as any;
    totalEvaluations = evalResult?.count || 0;

    // Get total evolutions
    const evolResult = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM evolutions WHERE patient_id IN (SELECT id FROM patients WHERE user_id = ?)`
    ).bind(user!.id).first() as any;
    totalEvolutions = evolResult?.count || 0;

    // Get recent activities (last 5 evaluations and evolutions combined)
    const { results: recentEvals } = await c.env.DB.prepare(
      `SELECT e.id, e.created_at, e.type, p.id as patient_id, p.name as patient_name, 'evaluation' as activity_type
       FROM evaluations e
       JOIN patients p ON e.patient_id = p.id
       WHERE p.user_id = ?
       ORDER BY e.created_at DESC
       LIMIT 5`
    ).bind(user!.id).all();

    const { results: recentEvols } = await c.env.DB.prepare(
      `SELECT e.id, e.created_at, e.session_date, p.id as patient_id, p.name as patient_name, 'evolution' as activity_type
       FROM evolutions e
       JOIN patients p ON e.patient_id = p.id
       WHERE p.user_id = ?
       ORDER BY e.created_at DESC
       LIMIT 5`
    ).bind(user!.id).all();

    // Combine and sort by date
    const allActivities = [
      ...recentEvals.map((a: any) => ({
        id: a.id,
        type: "evaluation" as const,
        patientName: a.patient_name,
        patientId: a.patient_id,
        date: a.created_at,
        description: a.type === "initial" ? "Avaliação inicial criada" : "Reavaliação registrada"
      })),
      ...recentEvols.map((a: any) => ({
        id: a.id,
        type: "evolution" as const,
        patientName: a.patient_name,
        patientId: a.patient_id,
        date: a.created_at,
        description: "Evolução registrada"
      }))
    ];

    recentActivities = allActivities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  // Find last activity date
  let lastActivityDate: string | null = null;
  if (recentActivities.length > 0) {
    lastActivityDate = recentActivities[0].date;
  }

  return c.json({
    stats: {
      totalPatients: patientsResult?.count || 0,
      totalEvaluations,
      totalEvolutions,
      lastActivityDate
    },
    recentActivities
  });
});

// ============================================
// DASHBOARD CHARTS API
// ============================================

app.get("/api/dashboard/charts", authMiddleware, async (c) => {
  const user = c.get("user");

  // Get patient IDs for this user
  const { results: patientIds } = await c.env.DB.prepare(
    `SELECT id FROM patients WHERE user_id = ?`
  ).bind(user!.id).all();

  const patientIdList = patientIds.map((p: any) => p.id);

  // Initialize response data
  const chartData = {
    weeklyActivity: [] as { week: string; evolutions: number; evaluations: number }[],
    painTrend: [] as { date: string; avgPain: number; sessions: number }[],
    statusDistribution: { green: 0, yellow: 0, red: 0 },
    monthlyGrowth: [] as { month: string; patients: number; evolutions: number }[]
  };

  if (patientIdList.length === 0) {
    return c.json(chartData);
  }

  // Weekly activity (last 8 weeks)
  const { results: weeklyEvols } = await c.env.DB.prepare(
    `SELECT
      strftime('%Y-%W', session_date) as week,
      COUNT(*) as count
    FROM evolutions
    WHERE patient_id IN (SELECT id FROM patients WHERE user_id = ?)
      AND session_date >= date('now', '-8 weeks')
    GROUP BY week
    ORDER BY week ASC`
  ).bind(user!.id).all();

  const { results: weeklyEvals } = await c.env.DB.prepare(
    `SELECT
      strftime('%Y-%W', created_at) as week,
      COUNT(*) as count
    FROM evaluations
    WHERE patient_id IN (SELECT id FROM patients WHERE user_id = ?)
      AND created_at >= date('now', '-8 weeks')
    GROUP BY week
    ORDER BY week ASC`
  ).bind(user!.id).all();

  // Create weekly map
  const weeklyMap = new Map<string, { evolutions: number; evaluations: number }>();
  for (let i = 7; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - (i * 7));
    const weekKey = `${d.getFullYear()}-${String(Math.ceil((d.getDate() + new Date(d.getFullYear(), d.getMonth(), 1).getDay()) / 7)).padStart(2, '0')}`;
    weeklyMap.set(weekKey, { evolutions: 0, evaluations: 0 });
  }

  weeklyEvols.forEach((r: any) => {
    if (weeklyMap.has(r.week)) {
      weeklyMap.get(r.week)!.evolutions = r.count;
    }
  });
  weeklyEvals.forEach((r: any) => {
    if (weeklyMap.has(r.week)) {
      weeklyMap.get(r.week)!.evaluations = r.count;
    }
  });

  const weekNames = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Atual'];
  let weekIdx = 0;
  weeklyMap.forEach((data) => {
    chartData.weeklyActivity.push({
      week: weekNames[weekIdx] || `Sem ${weekIdx + 1}`,
      evolutions: data.evolutions,
      evaluations: data.evaluations
    });
    weekIdx++;
  });

  // Pain trend (last 30 days, grouped by 5-day periods)
  const { results: painData } = await c.env.DB.prepare(
    `SELECT
      session_date,
      pain_level
    FROM evolutions
    WHERE patient_id IN (SELECT id FROM patients WHERE user_id = ?)
      AND session_date >= date('now', '-30 days')
      AND pain_level IS NOT NULL
    ORDER BY session_date ASC`
  ).bind(user!.id).all();

  // Group by 5-day periods
  const painPeriods = new Map<string, { total: number; count: number }>();
  painData.forEach((r: any) => {
    const date = new Date(r.session_date);
    const periodStart = new Date(date);
    periodStart.setDate(periodStart.getDate() - (periodStart.getDate() % 5));
    const key = periodStart.toISOString().split('T')[0];
    
    if (!painPeriods.has(key)) {
      painPeriods.set(key, { total: 0, count: 0 });
    }
    const period = painPeriods.get(key)!;
    period.total += r.pain_level;
    period.count += 1;
  });

  painPeriods.forEach((data, dateKey) => {
    const d = new Date(dateKey);
    chartData.painTrend.push({
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      avgPain: Math.round((data.total / data.count) * 10) / 10,
      sessions: data.count
    });
  });

  // Status distribution (from alertas logic)
  for (const patientId of patientIdList) {
    const { results: evolutions } = await c.env.DB.prepare(
      `SELECT pain_level, session_date FROM evolutions 
       WHERE patient_id = ? ORDER BY session_date DESC LIMIT 3`
    ).bind(patientId).all();

    if (evolutions.length === 0) {
      chartData.statusDistribution.yellow += 1;
    } else {
      const recentPains = evolutions.map((e: any) => e.pain_level).filter((p: any) => p !== null);
      if (recentPains.length >= 2) {
        const trend = recentPains[0] - recentPains[recentPains.length - 1];
        if (trend < 0) {
          chartData.statusDistribution.green += 1;
        } else if (trend > 2 || recentPains[0] >= 7) {
          chartData.statusDistribution.red += 1;
        } else {
          chartData.statusDistribution.yellow += 1;
        }
      } else {
        chartData.statusDistribution.yellow += 1;
      }
    }
  }

  // Monthly growth (last 6 months)
  const { results: monthlyPatients } = await c.env.DB.prepare(
    `SELECT 
      strftime('%Y-%m', created_at) as month,
      COUNT(*) as count
    FROM patients 
    WHERE user_id = ?
      AND created_at >= date('now', '-6 months')
    GROUP BY month
    ORDER BY month ASC`
  ).bind(user!.id).all();

  const { results: monthlyEvols } = await c.env.DB.prepare(
    `SELECT
      strftime('%Y-%m', session_date) as month,
      COUNT(*) as count
    FROM evolutions
    WHERE patient_id IN (SELECT id FROM patients WHERE user_id = ?)
      AND session_date >= date('now', '-6 months')
    GROUP BY month
    ORDER BY month ASC`
  ).bind(user!.id).all();

  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthlyMap = new Map<string, { patients: number; evolutions: number }>();
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap.set(key, { patients: 0, evolutions: 0 });
  }

  monthlyPatients.forEach((r: any) => {
    if (monthlyMap.has(r.month)) {
      monthlyMap.get(r.month)!.patients = r.count;
    }
  });
  monthlyEvols.forEach((r: any) => {
    if (monthlyMap.has(r.month)) {
      monthlyMap.get(r.month)!.evolutions = r.count;
    }
  });

  monthlyMap.forEach((data, monthKey) => {
    const [, m] = monthKey.split('-');
    chartData.monthlyGrowth.push({
      month: monthNames[parseInt(m) - 1],
      patients: data.patients,
      evolutions: data.evolutions
    });
  });

  return c.json(chartData);
});

// ============================================
// ONBOARDING PROGRESS API
// ============================================

app.get("/api/onboarding/progress", authMiddleware, async (c) => {
  const user = c.get("user");

  // Get patient IDs for this user
  const { results: patients } = await c.env.DB.prepare(
    `SELECT id FROM patients WHERE user_id = ?`
  ).bind(user!.id).all();

  const hasPatient = patients.length > 0;
  const patientIdList = patients.map((p: any) => p.id);

  let hasEvaluation = false;
  let hasObjectives = false;
  let hasEvolution = false;
  let hasReport = false;
  let firstEvaluationPatientId: number | null = null;

  if (patientIdList.length > 0) {
    // Check for evaluations
    const evalResult = await c.env.DB.prepare(
      `SELECT e.id, e.patient_id FROM evaluations e 
       JOIN patients p ON e.patient_id = p.id 
       WHERE p.user_id = ? 
       ORDER BY e.created_at ASC LIMIT 1`
    ).bind(user!.id).first() as any;
    
    hasEvaluation = !!evalResult;
    if (evalResult) {
      firstEvaluationPatientId = evalResult.patient_id;
    }

    // Check for treatment objectives (caminho with treatment_goals)
    const objectivesResult = await c.env.DB.prepare(
      `SELECT c.id FROM caminho c 
       JOIN patients p ON c.patient_id = p.id 
       WHERE p.user_id = ? AND c.treatment_goals IS NOT NULL AND c.treatment_goals != ''
       LIMIT 1`
    ).bind(user!.id).first();
    hasObjectives = !!objectivesResult;

    // Check for evolutions
    const evolResult = await c.env.DB.prepare(
      `SELECT e.id FROM evolutions e 
       JOIN patients p ON e.patient_id = p.id 
       WHERE p.user_id = ? 
       LIMIT 1`
    ).bind(user!.id).first();
    hasEvolution = !!evolResult;

    // Check for reports (we'll track this via a separate table or assume it's done if they have evaluations + evolutions)
    // For now, we consider report "done" if user has generated at least one export
    const reportResult = await c.env.DB.prepare(
      `SELECT id FROM report_exports WHERE user_id = ? LIMIT 1`
    ).bind(user!.id).first();
    hasReport = !!reportResult;
  }

  return c.json({
    hasPatient,
    hasEvaluation,
    hasObjectives,
    hasEvolution,
    hasReport,
    firstEvaluationPatientId,
  });
});

// Track report export for onboarding
app.post("/api/onboarding/report-exported", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  await c.env.DB.prepare(
    `INSERT INTO report_exports (user_id, patient_id) VALUES (?, ?)`
  ).bind(user!.id, body.patientId || null).run();

  return c.json({ success: true });
});

// ============================================
// SMART ALERTS API
// ============================================

app.get("/api/smart-alerts", authMiddleware, async (c) => {
  const user = c.get("user");

  // Get all patients with their latest data
  const { results: patients } = await c.env.DB.prepare(
    `SELECT p.id, p.name, p.created_at FROM patients p WHERE p.user_id = ?`
  ).bind(user!.id).all();

  const alerts: any[] = [];
  const weeklyPriorities: any[] = [];
  const now = new Date();

  for (const patient of patients as any[]) {
    // Get latest evolution with pain level
    const latestEvolution = await c.env.DB.prepare(
      `SELECT ev.id, ev.pain_level, ev.session_date, ev.created_at
       FROM evolutions ev
       WHERE ev.patient_id = ?
       ORDER BY ev.created_at DESC
       LIMIT 1`
    ).bind(patient.id).first() as any;

    // Get latest evaluation with pain level
    const latestEvaluation = await c.env.DB.prepare(
      `SELECT e.id, e.pain_level, e.created_at
       FROM evaluations e
       WHERE e.patient_id = ?
       ORDER BY e.created_at DESC
       LIMIT 1`
    ).bind(patient.id).first() as any;

    // Get evolution count
    const evolCount = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM evolutions WHERE patient_id = ?`
    ).bind(patient.id).first() as any;

    const evolutionCount = evolCount?.count || 0;

    // Determine latest activity date
    const latestActivityDate = latestEvolution?.created_at || latestEvaluation?.created_at || patient.created_at;
    const daysSinceActivity = Math.floor((now.getTime() - new Date(latestActivityDate).getTime()) / (1000 * 60 * 60 * 24));

    // Get current pain level
    const currentPainLevel = latestEvolution?.pain_level ?? latestEvaluation?.pain_level ?? null;

    // Alert: High pain (EVA >= 7)
    if (currentPainLevel !== null && currentPainLevel >= 7) {
      alerts.push({
        id: alerts.length + 1,
        patientId: patient.id,
        patientName: patient.name,
        type: "high_pain",
        severity: currentPainLevel >= 8 ? "critical" : "warning",
        title: `Dor Elevada (EVA ${currentPainLevel})`,
        description: `Paciente apresenta nível de dor ${currentPainLevel}/10, requer atenção imediata.`,
        actionLabel: "Ver Prontuário",
        painLevel: currentPainLevel,
      });
    }

    // Alert: No evolution registered
    if (evolutionCount === 0 && latestEvaluation) {
      const daysSinceEval = Math.floor((now.getTime() - new Date(latestEvaluation.created_at).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceEval >= 3) {
        alerts.push({
          id: alerts.length + 1,
          patientId: patient.id,
          patientName: patient.name,
          type: "no_evolution",
          severity: daysSinceEval >= 7 ? "warning" : "info",
          title: "Sem Evolução Registrada",
          description: `Paciente avaliado há ${daysSinceEval} dias sem nenhuma evolução.`,
          actionLabel: "Registrar Evolução",
          daysSince: daysSinceEval,
        });
      }
    }

    // Alert: Inactive (14+ days)
    if (daysSinceActivity >= 14) {
      alerts.push({
        id: alerts.length + 1,
        patientId: patient.id,
        patientName: patient.name,
        type: "inactive",
        severity: daysSinceActivity >= 30 ? "warning" : "info",
        title: "Paciente Inativo",
        description: `Sem atividade há ${daysSinceActivity} dias. Verificar continuidade.`,
        actionLabel: "Verificar Paciente",
        daysSince: daysSinceActivity,
      });
    }

    // Check for stagnant/increasing pain (compare last 2 evolutions)
    if (evolutionCount >= 2) {
      const { results: lastTwoEvols } = await c.env.DB.prepare(
        `SELECT pain_level FROM evolutions WHERE patient_id = ? AND pain_level IS NOT NULL ORDER BY created_at DESC LIMIT 2`
      ).bind(patient.id).all();
      
      if (lastTwoEvols.length === 2) {
        const [latest, previous] = lastTwoEvols as any[];
        if (latest.pain_level !== null && previous.pain_level !== null && latest.pain_level >= previous.pain_level && latest.pain_level >= 5) {
          alerts.push({
            id: alerts.length + 1,
            patientId: patient.id,
            patientName: patient.name,
            type: "stagnant_pain",
            severity: "warning",
            title: "Dor Não Evoluindo",
            description: `Dor mantida ou aumentada nas últimas sessões (${previous.pain_level} → ${latest.pain_level}).`,
            actionLabel: "Revisar Conduta",
            painLevel: latest.pain_level,
          });
        }
      }
    }

    // Weekly priorities: patients needing attention this week
    let priorityReason = null;
    let priorityLevel = 3;

    if (currentPainLevel !== null && currentPainLevel >= 7) {
      priorityReason = `Dor elevada (EVA ${currentPainLevel})`;
      priorityLevel = 1;
    } else if (evolutionCount === 0 && latestEvaluation) {
      priorityReason = "Aguardando primeira evolução";
      priorityLevel = 2;
    } else if (daysSinceActivity >= 7 && daysSinceActivity < 14) {
      priorityReason = `Última atividade há ${daysSinceActivity} dias`;
      priorityLevel = 2;
    }

    if (priorityReason) {
      weeklyPriorities.push({
        id: weeklyPriorities.length + 1,
        patientId: patient.id,
        patientName: patient.name,
        reason: priorityReason,
        priority: priorityLevel,
      });
    }
  }

  // Sort alerts by severity
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  alerts.sort((a, b) => severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder]);

  // Sort weekly priorities
  weeklyPriorities.sort((a, b) => a.priority - b.priority);

  const stats = {
    criticalCount: alerts.filter(a => a.severity === "critical").length,
    warningCount: alerts.filter(a => a.severity === "warning").length,
    totalPatientsNeedingAttention: new Set([...alerts.map(a => a.patientId), ...weeklyPriorities.map(p => p.patientId)]).size,
  };

  return c.json({
    alerts: alerts.slice(0, 10), // Limit to 10 alerts
    weeklyPriorities: weeklyPriorities.slice(0, 5), // Top 5 priorities
    stats,
  });
});

// ============================================
// CONTATO / SUPORTE API
// ============================================

// Submit support message
app.post("/api/contato", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  if (!body.name || !body.email || !body.subject || !body.message) {
    return c.json({ error: "Todos os campos são obrigatórios" }, 400);
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO support_messages (user_id, name, email, subject, message)
     VALUES (?, ?, ?, ?, ?)
     RETURNING *`
  ).bind(
    user!.id,
    body.name,
    body.email,
    body.subject,
    body.message
  ).first();

  return c.json(result, 201);
});

// Lead capture endpoint (public - no auth required)
app.post("/api/leads", async (c) => {
  const body = await c.req.json<{ name: string; email: string; source?: string }>();
  
  if (!body.name || !body.email) {
    return c.json({ error: "Nome e email são obrigatórios" }, 400);
  }

  // Check if lead already exists
  const existing = await c.env.DB.prepare(
    "SELECT id FROM leads WHERE email = ?"
  ).bind(body.email).first();

  if (existing) {
    return c.json({ success: true, message: "Lead já cadastrado" });
  }

  const result = await c.env.DB.prepare(
    "INSERT INTO leads (name, email, source, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))"
  ).bind(body.name, body.email, body.source || 'website').run();

  return c.json({ success: true, id: getInsertedId(result) }, 201);
});

// Track page views (public - no auth required)
app.post("/api/track-view", async (c) => {
  const body = await c.req.json<{ page?: string; visitorId?: string }>().catch(() => ({ page: 'home', visitorId: null as string | null }));
  
  await c.env.DB.prepare(
    "INSERT INTO site_views (page, visitor_id, created_at, updated_at) VALUES (?, ?, datetime('now'), datetime('now'))"
  ).bind(body.page || 'home', body.visitorId || null).run();

  return c.json({ success: true });
});

// ============================================
// ADMIN API
// ============================================

// Admin middleware - checks if user is admin
const adminMiddleware = async (c: any, next: any) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Não autenticado" }, 401);
  }

  if (!isOwnerAdminEmail(user.email)) {
    return c.json({ error: "Acesso não autorizado" }, 403);
  }

  await next();
};

// Get admin dashboard stats
app.get("/api/admin/stats", authMiddleware, adminMiddleware, async (c) => {
  // Total users with subscriptions
  const totalUsers = await c.env.DB.prepare(
    `SELECT COUNT(DISTINCT user_id) as count FROM subscriptions`
  ).first() as { count: number };

  // Users with patients (active users)
  const activeUsers = await c.env.DB.prepare(
    `SELECT COUNT(DISTINCT user_id) as count FROM patients`
  ).first() as { count: number };

  // Beta waitlist count
  const waitlistCount = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM beta_waitlist`
  ).first() as { count: number };

  // Leads count
  const leadsCount = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM leads`
  ).first() as { count: number };

  // Paid subscriptions
  const paidSubscriptions = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active_paid'`
  ).first() as { count: number };

  // Users registered today
  const today = new Date().toISOString().split('T')[0];
  const registeredToday = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM subscriptions WHERE DATE(created_at) = ?`
  ).bind(today).first() as { count: number };

  // Users registered this week
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const registeredThisWeek = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM subscriptions WHERE DATE(created_at) >= ?`
  ).bind(weekAgo).first() as { count: number };

  return c.json({
    totalUsers: totalUsers?.count || 0,
    activeUsers: activeUsers?.count || 0,
    waitlistCount: waitlistCount?.count || 0,
    leadsCount: leadsCount?.count || 0,
    paidSubscriptions: paidSubscriptions?.count || 0,
    registeredToday: registeredToday?.count || 0,
    registeredThisWeek: registeredThisWeek?.count || 0
  });
});

// Get site views stats
app.get("/api/admin/views", authMiddleware, adminMiddleware, async (c) => {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const totalViews = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM site_views`
  ).first() as { count: number };

  const todayViews = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM site_views WHERE DATE(created_at) = ?`
  ).bind(today).first() as { count: number };

  const weekViews = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM site_views WHERE DATE(created_at) >= ?`
  ).bind(weekAgo).first() as { count: number };

  const monthViews = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM site_views WHERE DATE(created_at) >= ?`
  ).bind(monthAgo).first() as { count: number };

  const uniqueVisitors = await c.env.DB.prepare(
    `SELECT COUNT(DISTINCT visitor_id) as count FROM site_views WHERE visitor_id IS NOT NULL`
  ).first() as { count: number };

  // Daily views for last 7 days
  const dailyViews = await c.env.DB.prepare(`
    SELECT DATE(created_at) as date, COUNT(*) as views
    FROM site_views 
    WHERE DATE(created_at) >= ?
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `).bind(weekAgo).all() as { results: { date: string; views: number }[] };

  return c.json({
    total: totalViews?.count || 0,
    today: todayViews?.count || 0,
    week: weekViews?.count || 0,
    month: monthViews?.count || 0,
    uniqueVisitors: uniqueVisitors?.count || 0,
    dailyViews: dailyViews?.results || []
  });
});

// Get all users list
app.get("/api/admin/users", authMiddleware, adminMiddleware, async (c) => {
  const users = await c.env.DB.prepare(`
    SELECT 
      s.user_id,
      s.plan_type,
      s.status,
      s.is_active,
      s.is_admin,
      s.created_at,
      s.trial_start_date,
      s.stripe_customer_id,
      (SELECT COUNT(*) FROM patients WHERE user_id = s.user_id) as patients_count,
      (SELECT COUNT(*) FROM evaluations e 
       INNER JOIN patients p ON e.patient_id = p.id 
       WHERE p.user_id = s.user_id) as evaluations_count,
      (SELECT MAX(p.created_at) FROM patients p WHERE p.user_id = s.user_id) as last_activity
    FROM subscriptions s
    ORDER BY s.created_at DESC
  `).all();

  return c.json({ users: users.results || [] });
});

// Get beta waitlist
app.get("/api/admin/waitlist", authMiddleware, adminMiddleware, async (c) => {
  const waitlist = await c.env.DB.prepare(`
    SELECT * FROM beta_waitlist ORDER BY created_at DESC
  `).all();

  return c.json({ waitlist: waitlist.results || [] });
});

// Get leads
app.get("/api/admin/leads", authMiddleware, adminMiddleware, async (c) => {
  const leads = await c.env.DB.prepare(`
    SELECT * FROM leads ORDER BY created_at DESC
  `).all();

  return c.json({ leads: leads.results || [] });
});

// Get engagement metrics
app.get("/api/admin/engagement", authMiddleware, adminMiddleware, async (c) => {
  // Average patients per user
  const avgPatients = await c.env.DB.prepare(`
    SELECT AVG(patient_count) as avg FROM (
      SELECT COUNT(*) as patient_count FROM patients GROUP BY user_id
    )
  `).first() as { avg: number | null };

  // Average evaluations per patient
  const avgEvaluations = await c.env.DB.prepare(`
    SELECT AVG(eval_count) as avg FROM (
      SELECT COUNT(*) as eval_count FROM evaluations GROUP BY patient_id
    )
  `).first() as { avg: number | null };

  // Average evolutions per patient
  const avgEvolutions = await c.env.DB.prepare(`
    SELECT AVG(evo_count) as avg FROM (
      SELECT COUNT(*) as evo_count FROM evolutions GROUP BY patient_id
    )
  `).first() as { avg: number | null };

  // Total forum posts
  const forumPosts = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM forum_posts
  `).first() as { count: number };

  // Total forum comments
  const forumComments = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM forum_comments
  `).first() as { count: number };

  // Total appointments
  const totalAppointments = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM appointments
  `).first() as { count: number };

  // Total report exports
  const totalExports = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM report_exports
  `).first() as { count: number };

  // Feature usage (based on data presence)
  const usersWithPatients = await c.env.DB.prepare(`
    SELECT COUNT(DISTINCT user_id) as count FROM patients
  `).first() as { count: number };

  const usersWithEvaluations = await c.env.DB.prepare(`
    SELECT COUNT(DISTINCT p.user_id) as count 
    FROM patients p 
    INNER JOIN evaluations e ON p.id = e.patient_id
  `).first() as { count: number };

  const usersWithEvolutions = await c.env.DB.prepare(`
    SELECT COUNT(DISTINCT p.user_id) as count 
    FROM patients p 
    INNER JOIN evolutions ev ON p.id = ev.patient_id
  `).first() as { count: number };

  const usersWithAppointments = await c.env.DB.prepare(`
    SELECT COUNT(DISTINCT user_id) as count FROM appointments
  `).first() as { count: number };

  const usersWithForum = await c.env.DB.prepare(`
    SELECT COUNT(DISTINCT user_id) as count FROM forum_posts
  `).first() as { count: number };

  // Top users by activity
  const topUsers = await c.env.DB.prepare(`
    SELECT 
      s.user_id,
      s.plan_type,
      s.status,
      (SELECT COUNT(*) FROM patients WHERE user_id = s.user_id) as patients,
      (SELECT COUNT(*) FROM evaluations e 
       INNER JOIN patients p ON e.patient_id = p.id 
       WHERE p.user_id = s.user_id) as evaluations,
      (SELECT COUNT(*) FROM evolutions ev 
       INNER JOIN patients p ON ev.patient_id = p.id 
       WHERE p.user_id = s.user_id) as evolutions,
      (SELECT COUNT(*) FROM appointments WHERE user_id = s.user_id) as appointments,
      (SELECT COUNT(*) FROM forum_posts WHERE user_id = s.user_id) as posts
    FROM subscriptions s
    ORDER BY patients DESC, evaluations DESC
    LIMIT 10
  `).all();

  return c.json({
    averages: {
      patientsPerUser: avgPatients?.avg ? Math.round(avgPatients.avg * 10) / 10 : 0,
      evaluationsPerPatient: avgEvaluations?.avg ? Math.round(avgEvaluations.avg * 10) / 10 : 0,
      evolutionsPerPatient: avgEvolutions?.avg ? Math.round(avgEvolutions.avg * 10) / 10 : 0
    },
    totals: {
      forumPosts: forumPosts?.count || 0,
      forumComments: forumComments?.count || 0,
      appointments: totalAppointments?.count || 0,
      reportExports: totalExports?.count || 0
    },
    featureAdoption: {
      patients: usersWithPatients?.count || 0,
      evaluations: usersWithEvaluations?.count || 0,
      evolutions: usersWithEvolutions?.count || 0,
      appointments: usersWithAppointments?.count || 0,
      forum: usersWithForum?.count || 0
    },
    topUsers: topUsers.results || []
  });
});

// Export all emails (waitlist + leads combined)
app.get("/api/admin/export-emails", authMiddleware, adminMiddleware, async (c) => {
  const waitlist = await c.env.DB.prepare(`
    SELECT name, email, 'waitlist' as source, created_at FROM beta_waitlist
  `).all();

  const leads = await c.env.DB.prepare(`
    SELECT name, email, COALESCE(source, 'landing') as source, created_at FROM leads
  `).all();

  const allEmails = [
    ...(waitlist.results || []),
    ...(leads.results || [])
  ] as { email: string; name: string | null; source: string; created_at: string }[];
  
  allEmails.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Remove duplicates by email
  const seen = new Set<string>();
  const uniqueEmails = allEmails.filter(e => {
    if (seen.has(e.email)) return false;
    seen.add(e.email);
    return true;
  });

  return c.json({ emails: uniqueEmails, total: uniqueEmails.length });
});

// ============== APPOINTMENTS (AGENDA) ==============

// Get appointments for a date range
app.get("/api/appointments", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const startDate = c.req.query("start") || new Date().toISOString().split("T")[0];
  const endDate = c.req.query("end") || startDate;

  const appointments = await c.env.DB.prepare(`
    SELECT a.*, p.name as patient_full_name, p.phone as patient_phone
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    WHERE a.user_id = ? AND a.appointment_date BETWEEN ? AND ?
    ORDER BY a.appointment_date, a.appointment_time
  `).bind(user.id, startDate, endDate).all();

  return c.json({ appointments: appointments.results || [] });
});

// Create appointment
app.post("/api/appointments", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const body = await c.req.json();

  const result = await c.env.DB.prepare(`
    INSERT INTO appointments (user_id, patient_id, patient_name, appointment_date, appointment_time, duration_minutes, type, notes, status, price, is_paid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    user.id,
    body.patient_id || null,
    body.patient_name || null,
    body.appointment_date,
    body.appointment_time,
    body.duration_minutes || 50,
    body.type || "sessao",
    body.notes || null,
    "scheduled",
    body.price || null,
    body.is_paid ? 1 : 0
  ).run();

  return c.json({ success: true, id: getInsertedId(result) });
});

// Update appointment
app.put("/api/appointments/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const id = c.req.param("id");
  const body = await c.req.json();

  await c.env.DB.prepare(`
    UPDATE appointments SET
      patient_id = ?,
      patient_name = ?,
      appointment_date = ?,
      appointment_time = ?,
      duration_minutes = ?,
      type = ?,
      notes = ?,
      status = ?,
      price = ?,
      is_paid = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).bind(
    body.patient_id || null,
    body.patient_name || null,
    body.appointment_date,
    body.appointment_time,
    body.duration_minutes || 50,
    body.type || "sessao",
    body.notes || null,
    body.status || "scheduled",
    body.price !== undefined ? body.price : null,
    body.is_paid ? 1 : 0,
    id,
    user.id
  ).run();

  return c.json({ success: true });
});

// Delete appointment
app.delete("/api/appointments/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const id = c.req.param("id");

  await c.env.DB.prepare(`
    DELETE FROM appointments WHERE id = ? AND user_id = ?
  `).bind(id, user.id).run();

  return c.json({ success: true });
});

// ============ FINANCIAL/TRANSACTIONS ENDPOINTS ============

// Get transactions with summary
app.get("/api/transactions", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const startDate = c.req.query("start_date");
  const endDate = c.req.query("end_date");

  let query = `
    SELECT t.*, p.name as patient_name
    FROM transactions t
    LEFT JOIN patients p ON t.patient_id = p.id
    WHERE t.user_id = ?
  `;
  const params: (string | number)[] = [user.id];

  if (startDate) {
    query += ` AND t.transaction_date >= ?`;
    params.push(startDate);
  }
  if (endDate) {
    query += ` AND t.transaction_date <= ?`;
    params.push(endDate);
  }

  query += ` ORDER BY t.transaction_date DESC, t.created_at DESC`;

  const transactions = await c.env.DB.prepare(query).bind(...params).all();

  // Calculate summary
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

  const summaryResult = await c.env.DB.prepare(`
    SELECT
      SUM(CASE WHEN type = 'income' AND status = 'paid' THEN amount ELSE 0 END) as total_paid,
      SUM(CASE WHEN type = 'income' AND status = 'pending' THEN amount ELSE 0 END) as total_pending,
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
      COUNT(DISTINCT CASE WHEN patient_id IS NOT NULL THEN patient_id END) as total_patients,
      SUM(CASE WHEN type = 'income' AND status != 'cancelled' AND transaction_date >= ? AND transaction_date <= ? THEN amount ELSE 0 END) as monthly_income,
      SUM(CASE WHEN type = 'income' AND status = 'pending' AND transaction_date >= ? AND transaction_date <= ? THEN amount ELSE 0 END) as monthly_pending,
      SUM(CASE WHEN type = 'expense' AND status != 'cancelled' AND transaction_date >= ? AND transaction_date <= ? THEN amount ELSE 0 END) as monthly_expenses
    FROM transactions WHERE user_id = ?
  `).bind(monthStart, monthEnd, monthStart, monthEnd, monthStart, monthEnd, user.id).first() as any;

  const monthlyIncome = summaryResult?.monthly_income || 0;
  const monthlyExpenses = summaryResult?.monthly_expenses || 0;

  return c.json({
    transactions: transactions.results || [],
    summary: {
      total_paid: summaryResult?.total_paid || 0,
      total_pending: summaryResult?.total_pending || 0,
      total_income: summaryResult?.total_income || 0,
      total_patients: summaryResult?.total_patients || 0,
      monthly_income: monthlyIncome,
      monthly_pending: summaryResult?.monthly_pending || 0,
      monthly_expenses: monthlyExpenses,
      net_profit: monthlyIncome - monthlyExpenses,
    }
  });
});

// Get 6-month income vs expenses chart data
app.get("/api/transactions/chart", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };

  const { results } = await c.env.DB.prepare(`
    SELECT
      strftime('%Y-%m', transaction_date) as month,
      SUM(CASE WHEN type = 'income' AND status != 'cancelled' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type = 'expense' AND status != 'cancelled' THEN amount ELSE 0 END) as expenses
    FROM transactions
    WHERE user_id = ?
      AND transaction_date >= date('now', '-5 months', 'start of month')
      AND status != 'cancelled'
    GROUP BY month
    ORDER BY month ASC
  `).bind(user.id).all() as { results: Array<{ month: string; income: number; expenses: number }> };

  // Fill in all 6 months (even if no data)
  const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const chartData: { month: string; income: number; expenses: number }[] = [];
  const dataMap = new Map((results || []).map((r) => [r.month, r]));

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const row = dataMap.get(key);
    chartData.push({
      month: monthNames[d.getMonth()],
      income: row?.income || 0,
      expenses: row?.expenses || 0,
    });
  }

  return c.json(chartData);
});

// Create transaction
app.post("/api/transactions", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const body = await c.req.json();

  const { patient_id, appointment_id, amount, type, payment_method, status, description, transaction_date, notes, category } = body;

  if (!amount || !transaction_date) {
    return c.json({ error: "Amount and transaction_date are required" }, 400);
  }

  const result = await c.env.DB.prepare(`
    INSERT INTO transactions (user_id, patient_id, appointment_id, amount, type, payment_method, status, description, transaction_date, notes, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    user.id,
    patient_id || null,
    appointment_id || null,
    amount,
    type || "income",
    payment_method || null,
    status || "pending",
    description || null,
    transaction_date,
    notes || null,
    category || null
  ).run();

  return c.json({ id: getInsertedId(result), success: true });
});

// Update transaction
app.put("/api/transactions/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const id = c.req.param("id");
  const body = await c.req.json();

  const { patient_id, appointment_id, amount, type, payment_method, status, description, transaction_date, notes, category } = body;

  await c.env.DB.prepare(`
    UPDATE transactions SET
      patient_id = ?,
      appointment_id = ?,
      amount = ?,
      type = ?,
      payment_method = ?,
      status = ?,
      description = ?,
      transaction_date = ?,
      notes = ?,
      category = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).bind(
    patient_id || null,
    appointment_id || null,
    amount,
    type || "income",
    payment_method || null,
    status || "pending",
    description || null,
    transaction_date,
    notes || null,
    category || null,
    id,
    user.id
  ).run();

  return c.json({ success: true });
});

// Delete transaction
app.delete("/api/transactions/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const id = c.req.param("id");

  await c.env.DB.prepare(`
    DELETE FROM transactions WHERE id = ? AND user_id = ?
  `).bind(id, user.id).run();

  return c.json({ success: true });
});

// ============ FORUM ENDPOINTS ============

// Get all forum posts
app.get("/api/forum/posts", authMiddleware, async (c) => {
  const category = c.req.query("category");
  
  let query = `SELECT * FROM forum_posts`;
  const params: string[] = [];
  
  if (category && category !== "all") {
    query += ` WHERE category = ?`;
    params.push(category);
  }
  
  query += ` ORDER BY COALESCE(is_pinned, 0) DESC, created_at DESC`;
  
  const stmt = params.length > 0 
    ? c.env.DB.prepare(query).bind(...params)
    : c.env.DB.prepare(query);
    
  const { results } = await stmt.all();
  return c.json(results || []);
});

// Create forum post
app.post("/api/forum/posts", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string; email: string; name?: string };
  const body = await c.req.json();
  
  const { category, title, content } = body;
  
  if (!category || !title || !content) {
    return c.json({ error: "Category, title and content are required" }, 400);
  }
  
  const userName = user.name || user.email.split("@")[0];
  
  const result = await c.env.DB.prepare(`
    INSERT INTO forum_posts (user_id, user_name, category, title, content)
    VALUES (?, ?, ?, ?, ?)
  `).bind(user.id, userName, category, title, content).run();

  const newId = getInsertedId(result);

  // SELECT immediately after INSERT on the same D1 connection is always consistent.
  // Returning the full row avoids a separate GET that could hit an unsynced replica.
  const newPost = await c.env.DB.prepare(
    `SELECT * FROM forum_posts WHERE id = ?`
  ).bind(newId).first();

  return c.json({ post: newPost, success: true });
});

// Get single post with comments
app.get("/api/forum/posts/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");
  
  const post = await c.env.DB.prepare(`
    SELECT * FROM forum_posts WHERE id = ?
  `).bind(id).first();
  
  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }
  
  const { results: comments } = await c.env.DB.prepare(`
    SELECT * FROM forum_comments WHERE post_id = ? ORDER BY created_at ASC
  `).bind(id).all();
  
  return c.json({ post, comments: comments || [] });
});

// Add comment to post
app.post("/api/forum/posts/:id/comments", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string; email: string; name?: string };
  const postId = c.req.param("id");
  const body = await c.req.json();
  
  const { content } = body;
  
  if (!content) {
    return c.json({ error: "Content is required" }, 400);
  }
  
  const userName = user.name || user.email.split("@")[0];
  
  await c.env.DB.prepare(`
    INSERT INTO forum_comments (post_id, user_id, user_name, content)
    VALUES (?, ?, ?, ?)
  `).bind(postId, user.id, userName, content).run();
  
  // Update comments count
  await c.env.DB.prepare(`
    UPDATE forum_posts SET comments_count = comments_count + 1 WHERE id = ?
  `).bind(postId).run();
  
  return c.json({ success: true });
});

// Like/unlike post
app.post("/api/forum/posts/:id/like", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const postId = c.req.param("id");
  
  // Check if already liked
  const existing = await c.env.DB.prepare(`
    SELECT id FROM forum_likes WHERE user_id = ? AND post_id = ?
  `).bind(user.id, postId).first();
  
  if (existing) {
    // Unlike
    await c.env.DB.prepare(`
      DELETE FROM forum_likes WHERE user_id = ? AND post_id = ?
    `).bind(user.id, postId).run();
    
    await c.env.DB.prepare(`
      UPDATE forum_posts SET likes_count = likes_count - 1 WHERE id = ?
    `).bind(postId).run();
    
    return c.json({ liked: false });
  } else {
    // Like
    await c.env.DB.prepare(`
      INSERT INTO forum_likes (user_id, post_id) VALUES (?, ?)
    `).bind(user.id, postId).run();
    
    await c.env.DB.prepare(`
      UPDATE forum_posts SET likes_count = likes_count + 1 WHERE id = ?
    `).bind(postId).run();
    
    return c.json({ liked: true });
  }
});

// Delete post (author or admin only)
app.delete("/api/forum/posts/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as AppUser;
  const id = c.req.param("id");

  const post = await c.env.DB.prepare(`
    SELECT user_id FROM forum_posts WHERE id = ?
  `).bind(id).first() as { user_id: string } | null;

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  const isOwner = post.user_id === user.id;
  const isAdmin = isOwnerAdminEmail(user.email);

  if (!isOwner && !isAdmin) {
    console.error(`[forum delete] unauthorized: post.user_id=${post.user_id} user.id=${user.id} user.email=${user.email}`);
    return c.json({ error: "Not authorized" }, 403);
  }
  
  // Delete comments and likes first
  await c.env.DB.prepare(`DELETE FROM forum_comments WHERE post_id = ?`).bind(id).run();
  await c.env.DB.prepare(`DELETE FROM forum_likes WHERE post_id = ?`).bind(id).run();
  await c.env.DB.prepare(`DELETE FROM forum_posts WHERE id = ?`).bind(id).run();
  
  return c.json({ success: true });
});

// Check if user liked a post
app.get("/api/forum/posts/:id/liked", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const postId = c.req.param("id");
  
  const existing = await c.env.DB.prepare(`
    SELECT id FROM forum_likes WHERE user_id = ? AND post_id = ?
  `).bind(user.id, postId).first();
  
  return c.json({ liked: !!existing });
});

// Edit post (author only)
app.put("/api/forum/posts/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const id = c.req.param("id");
  const { title, content, category } = await c.req.json();
  
  const post = await c.env.DB.prepare(`
    SELECT user_id FROM forum_posts WHERE id = ?
  `).bind(id).first() as { user_id: string } | null;
  
  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }
  
  if (post.user_id !== user.id) {
    return c.json({ error: "Not authorized" }, 403);
  }
  
  await c.env.DB.prepare(`
    UPDATE forum_posts SET title = ?, content = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).bind(title, content, category, id).run();
  
  return c.json({ success: true });
});

// Edit comment (author only)
app.put("/api/forum/comments/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const id = c.req.param("id");
  const { content } = await c.req.json();
  
  const comment = await c.env.DB.prepare(`
    SELECT user_id FROM forum_comments WHERE id = ?
  `).bind(id).first() as { user_id: string } | null;
  
  if (!comment) {
    return c.json({ error: "Comment not found" }, 404);
  }
  
  if (comment.user_id !== user.id) {
    return c.json({ error: "Not authorized" }, 403);
  }
  
  await c.env.DB.prepare(`
    UPDATE forum_comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).bind(content, id).run();
  
  return c.json({ success: true });
});

export default app;
