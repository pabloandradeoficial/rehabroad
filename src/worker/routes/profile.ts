import { Hono } from "hono";
import { authMiddleware } from "../lib/helpers";

export const profileRouter = new Hono<{ Bindings: Env }>();

// GET /api/profile — return current user's profile row merged with Supabase identity
profileRouter.get("/profile", authMiddleware, async (c) => {
  const user = c.get("user");

  const row = await c.env.DB.prepare(
    `SELECT * FROM user_profiles WHERE id = ?`
  )
    .bind(user!.id)
    .first();

  // Keep email + name in sync so cron jobs can look them up without auth
  await c.env.DB.prepare(
    `INSERT INTO user_profiles (id, email, name, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       email      = excluded.email,
       name       = excluded.name,
       updated_at = excluded.updated_at`
  )
    .bind(user!.id, user!.email ?? null, user!.name ?? null, new Date().toISOString())
    .run();

  return c.json({
    id: user!.id,
    email: user!.email,
    name: user!.name,
    google_avatar_url: user!.google_user_data?.avatar_url ?? null,
    specialty: (row as any)?.specialty ?? null,
    crefito: (row as any)?.crefito ?? null,
    city: (row as any)?.city ?? null,
    state: (row as any)?.state ?? null,
    phone: (row as any)?.phone ?? null,
    avatar_url: (row as any)?.avatar_url ?? null,
    bio: (row as any)?.bio ?? null,
  });
});

// PUT /api/profile — upsert editable profile fields
profileRouter.put("/profile", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  const { specialty, crefito, city, state, phone, avatar_url, bio } = body;

  await c.env.DB.prepare(
    `INSERT INTO user_profiles (id, specialty, crefito, city, state, phone, avatar_url, bio, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       specialty  = excluded.specialty,
       crefito    = excluded.crefito,
       city       = excluded.city,
       state      = excluded.state,
       phone      = excluded.phone,
       avatar_url = excluded.avatar_url,
       bio        = excluded.bio,
       updated_at = excluded.updated_at`
  )
    .bind(
      user!.id,
      specialty ?? null,
      crefito ?? null,
      city ?? null,
      state ?? null,
      phone ?? null,
      avatar_url ?? null,
      bio ?? null,
      new Date().toISOString()
    )
    .run();

  return c.json({ success: true });
});

// POST /api/profile/avatar — store image as base64 data URL (max 500 KB)
profileRouter.post("/profile/avatar", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const { imageBase64, mimeType } = body;

  if (!imageBase64 || typeof imageBase64 !== "string") {
    return c.json({ error: "imageBase64 obrigatório." }, 400);
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(mimeType)) {
    return c.json({ error: "Tipo de imagem não suportado. Use JPEG, PNG ou WebP." }, 400);
  }

  // ~700k base64 chars ≈ 500 KB binary
  if (imageBase64.length > 700_000) {
    return c.json({ error: "Imagem muito grande. Máximo 500 KB." }, 400);
  }

  const dataUrl = `data:${mimeType};base64,${imageBase64}`;

  await c.env.DB.prepare(
    `INSERT INTO user_profiles (id, avatar_url, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET avatar_url = excluded.avatar_url, updated_at = excluded.updated_at`
  )
    .bind(user!.id, dataUrl, new Date().toISOString())
    .run();

  return c.json({ avatar_url: dataUrl });
});
