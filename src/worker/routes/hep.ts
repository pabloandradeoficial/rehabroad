import { Hono } from "hono";
import { authMiddleware, getInsertedId, getAppBaseUrl } from "../lib/helpers";
import { sendEmail, emailTemplates } from "../lib/email";

export const hepRouter = new Hono<{ Bindings: Env }>();

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function assertOwner(planUserId: string, userId: string): boolean {
  return planUserId === userId;
}

async function getPlanWithOwnerCheck(
  db: D1Database,
  planId: string,
  userId: string
): Promise<Record<string, unknown> | null> {
  const plan = await db
    .prepare(`SELECT * FROM hep_plans WHERE id = ?`)
    .bind(planId)
    .first<Record<string, unknown>>();

  if (!plan) return null;
  if (!assertOwner(plan.user_id as string, userId)) return null;
  return plan;
}

function computeAdherenceStatus(
  rate: number,
  lastCheckinAt: string | null
): "green" | "yellow" | "red" {
  if (lastCheckinAt) {
    const last = new Date(lastCheckinAt).getTime();
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    if (last < threeDaysAgo) return "red";
  }
  if (rate >= 80) return "green";
  if (rate >= 50) return "yellow";
  return "red";
}

// ─────────────────────────────────────────────
// FISIOTERAPEUTA — rotas autenticadas
// ─────────────────────────────────────────────

// GET /api/hep/plans?patient_id=X
hepRouter.get("/plans", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string; email: string; name: string | null };
  const patientId = c.req.query("patient_id");

  if (!patientId) {
    return c.json({ error: "patient_id é obrigatório" }, 400);
  }

  // Sync physio email so checkin notification emails can find it (fire-and-forget)
  void c.env.DB.prepare(
    `INSERT INTO user_profiles (id, email, name, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       email      = excluded.email,
       name       = excluded.name,
       updated_at = excluded.updated_at`
  ).bind(user.id, user.email ?? null, user.name ?? null, new Date().toISOString()).run();

  const { results } = await c.env.DB.prepare(
    `SELECT * FROM hep_plans WHERE patient_id = ? AND user_id = ? ORDER BY created_at DESC`
  )
    .bind(patientId, user.id)
    .all();

  return c.json({ plans: results ?? [] });
});

// POST /api/hep/plans
hepRouter.post("/plans", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const body = await c.req.json<{
    patient_id: number;
    title: string;
    description?: string;
    status?: string;
  }>();

  const { patient_id, title, description, status = "active" } = body;

  if (!patient_id || !title?.trim()) {
    return c.json({ error: "patient_id e title são obrigatórios" }, 400);
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO hep_plans (patient_id, user_id, title, description, status)
     VALUES (?, ?, ?, ?, ?)`
  )
    .bind(patient_id, user.id, title.trim(), description ?? null, status)
    .run();

  const newId = getInsertedId(result);
  const plan = await c.env.DB.prepare(`SELECT * FROM hep_plans WHERE id = ?`)
    .bind(newId)
    .first();

  return c.json({ plan, success: true }, 201);
});

// GET /api/hep/plans/:id
hepRouter.get("/plans/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const planId = c.req.param("id");

  const plan = await getPlanWithOwnerCheck(c.env.DB, planId, user.id);
  if (!plan) return c.json({ error: "Plano não encontrado" }, 404);

  const { results: exercises } = await c.env.DB.prepare(
    `SELECT * FROM hep_exercises WHERE plan_id = ? ORDER BY order_index ASC, created_at ASC`
  )
    .bind(planId)
    .all();

  const { results: unreadComments } = await c.env.DB.prepare(
    `SELECT * FROM patient_comments WHERE hep_plan_id = ? AND read_by_therapist = 0 ORDER BY created_at ASC`
  )
    .bind(planId)
    .all();

  return c.json({ plan, exercises: exercises ?? [], unreadComments: unreadComments ?? [] });
});

// PUT /api/hep/plans/:id
hepRouter.put("/plans/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const planId = c.req.param("id");

  const plan = await getPlanWithOwnerCheck(c.env.DB, planId, user.id);
  if (!plan) return c.json({ error: "Plano não encontrado" }, 404);

  const body = await c.req.json<{
    title?: string;
    description?: string;
    status?: string;
  }>();

  await c.env.DB.prepare(
    `UPDATE hep_plans
     SET title = COALESCE(?, title),
         description = COALESCE(?, description),
         status = COALESCE(?, status),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  )
    .bind(body.title ?? null, body.description ?? null, body.status ?? null, planId)
    .run();

  const updated = await c.env.DB.prepare(`SELECT * FROM hep_plans WHERE id = ?`)
    .bind(planId)
    .first();

  return c.json({ plan: updated, success: true });
});

// PATCH /api/hep/plans/:id — update text content sections only
hepRouter.patch("/plans/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const planId = c.req.param("id");

  const plan = await getPlanWithOwnerCheck(c.env.DB, planId, user.id);
  if (!plan) return c.json({ error: "Plano não encontrado" }, 404);

  const body = await c.req.json<Record<string, string | null>>();

  const ALLOWED = ["diagnostico_explicado", "orientacoes", "metas"] as const;
  const fields = ALLOWED.filter((k) => k in body);
  if (fields.length === 0) return c.json({ error: "Nenhum campo para atualizar" }, 400);

  const setClauses = fields.map((f) => `${f} = ?`).join(", ");
  const values: (string | null)[] = fields.map((f) => {
    const v = body[f];
    return typeof v === "string" && v.trim() ? v.trim() : null;
  });

  await c.env.DB.prepare(
    `UPDATE hep_plans SET ${setClauses}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  )
    .bind(...values, planId)
    .run();

  const updated = await c.env.DB.prepare(`SELECT * FROM hep_plans WHERE id = ?`).bind(planId).first();
  return c.json({ plan: updated, success: true });
});

// DELETE /api/hep/plans/:id
hepRouter.delete("/plans/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const planId = c.req.param("id");

  const plan = await getPlanWithOwnerCheck(c.env.DB, planId, user.id);
  if (!plan) return c.json({ error: "Plano não encontrado" }, 404);

  await c.env.DB.prepare(`DELETE FROM hep_checkins WHERE plan_id = ?`).bind(planId).run();
  await c.env.DB.prepare(`DELETE FROM hep_access_tokens WHERE plan_id = ?`).bind(planId).run();
  await c.env.DB.prepare(`DELETE FROM hep_exercises WHERE plan_id = ?`).bind(planId).run();
  await c.env.DB.prepare(`DELETE FROM hep_plans WHERE id = ?`).bind(planId).run();

  return c.json({ success: true });
});

// ─────────────────────────────────────────────
// EXERCÍCIOS DO PLANO
// ─────────────────────────────────────────────

// POST /api/hep/plans/:id/exercises
hepRouter.post("/plans/:id/exercises", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const planId = c.req.param("id");

  const plan = await getPlanWithOwnerCheck(c.env.DB, planId, user.id);
  if (!plan) return c.json({ error: "Plano não encontrado" }, 404);

  const body = await c.req.json<{
    exercise_name: string;
    exercise_category?: string;
    sets?: number;
    reps?: string;
    frequency?: string;
    instructions?: string;
    order_index?: number;
  }>();

  if (!body.exercise_name?.trim()) {
    return c.json({ error: "exercise_name é obrigatório" }, 400);
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO hep_exercises (plan_id, exercise_name, exercise_category, sets, reps, frequency, instructions, order_index)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      planId,
      body.exercise_name.trim(),
      body.exercise_category ?? null,
      body.sets ?? null,
      body.reps ?? null,
      body.frequency ?? null,
      body.instructions ?? null,
      body.order_index ?? 0
    )
    .run();

  const newId = getInsertedId(result);
  const exercise = await c.env.DB.prepare(`SELECT * FROM hep_exercises WHERE id = ?`)
    .bind(newId)
    .first();

  return c.json({ exercise, success: true }, 201);
});

// PUT /api/hep/exercises/:id
hepRouter.put("/exercises/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const exerciseId = c.req.param("id");

  const exercise = await c.env.DB.prepare(
    `SELECT e.*, p.user_id FROM hep_exercises e
     JOIN hep_plans p ON p.id = e.plan_id
     WHERE e.id = ?`
  )
    .bind(exerciseId)
    .first<Record<string, unknown>>();

  if (!exercise || exercise.user_id !== user.id) {
    return c.json({ error: "Exercício não encontrado" }, 404);
  }

  const body = await c.req.json<{
    exercise_name?: string;
    exercise_category?: string;
    sets?: number;
    reps?: string;
    frequency?: string;
    instructions?: string;
    order_index?: number;
  }>();

  await c.env.DB.prepare(
    `UPDATE hep_exercises
     SET exercise_name = COALESCE(?, exercise_name),
         exercise_category = COALESCE(?, exercise_category),
         sets = COALESCE(?, sets),
         reps = COALESCE(?, reps),
         frequency = COALESCE(?, frequency),
         instructions = COALESCE(?, instructions),
         order_index = COALESCE(?, order_index)
     WHERE id = ?`
  )
    .bind(
      body.exercise_name ?? null,
      body.exercise_category ?? null,
      body.sets ?? null,
      body.reps ?? null,
      body.frequency ?? null,
      body.instructions ?? null,
      body.order_index ?? null,
      exerciseId
    )
    .run();

  const updated = await c.env.DB.prepare(`SELECT * FROM hep_exercises WHERE id = ?`)
    .bind(exerciseId)
    .first();

  return c.json({ exercise: updated, success: true });
});

// DELETE /api/hep/exercises/:id
hepRouter.delete("/exercises/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const exerciseId = c.req.param("id");

  const exercise = await c.env.DB.prepare(
    `SELECT e.*, p.user_id FROM hep_exercises e
     JOIN hep_plans p ON p.id = e.plan_id
     WHERE e.id = ?`
  )
    .bind(exerciseId)
    .first<Record<string, unknown>>();

  if (!exercise || exercise.user_id !== user.id) {
    return c.json({ error: "Exercício não encontrado" }, 404);
  }

  await c.env.DB.prepare(`DELETE FROM hep_checkins WHERE exercise_id = ?`).bind(exerciseId).run();
  await c.env.DB.prepare(`DELETE FROM hep_exercises WHERE id = ?`).bind(exerciseId).run();

  return c.json({ success: true });
});

// ─────────────────────────────────────────────
// COMENTÁRIOS DO PACIENTE
// ─────────────────────────────────────────────

// PATCH /api/hep/comments/:id/read
hepRouter.patch("/comments/:id/read", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const commentId = c.req.param("id");

  // Verify the comment belongs to one of this therapist's plans
  const comment = await c.env.DB.prepare(
    `SELECT pc.id FROM patient_comments pc
     JOIN hep_plans hp ON hp.id = pc.hep_plan_id
     WHERE pc.id = ? AND hp.user_id = ?`
  )
    .bind(commentId, user.id)
    .first();

  if (!comment) return c.json({ error: "Comentário não encontrado" }, 404);

  await c.env.DB.prepare(`UPDATE patient_comments SET read_by_therapist = 1 WHERE id = ?`)
    .bind(commentId)
    .run();

  return c.json({ success: true });
});

// ─────────────────────────────────────────────
// TOKEN DE ACESSO
// ─────────────────────────────────────────────

// POST /api/hep/plans/:id/token
hepRouter.post("/plans/:id/token", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const planId = c.req.param("id");

  const plan = await getPlanWithOwnerCheck(c.env.DB, planId, user.id);
  if (!plan) return c.json({ error: "Plano não encontrado" }, 404);

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await c.env.DB.prepare(
    `INSERT INTO hep_access_tokens (plan_id, token, expires_at) VALUES (?, ?, ?)`
  )
    .bind(planId, token, expiresAt)
    .run();

  const baseUrl = getAppBaseUrl(c);
  const accessUrl = `${baseUrl}/hep/${token}`;

  return c.json({ token, accessUrl, expiresAt });
});

// ─────────────────────────────────────────────
// RELATÓRIO DE ADESÃO
// ─────────────────────────────────────────────

// GET /api/hep/plans/:id/adherence
hepRouter.get("/plans/:id/adherence", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const planId = c.req.param("id");

  const plan = await getPlanWithOwnerCheck(c.env.DB, planId, user.id);
  if (!plan) return c.json({ error: "Plano não encontrado" }, 404);

  const { results: exercises } = await c.env.DB.prepare(
    `SELECT * FROM hep_exercises WHERE plan_id = ? ORDER BY order_index ASC`
  )
    .bind(planId)
    .all<Record<string, unknown>>();

  const { results: checkins } = await c.env.DB.prepare(
    `SELECT * FROM hep_checkins WHERE plan_id = ? ORDER BY checked_at DESC`
  )
    .bind(planId)
    .all<Record<string, unknown>>();

  const totalCheckins = checkins?.length ?? 0;
  const completedCheckins = checkins?.filter((c) => c.completed === 1).length ?? 0;
  const adherenceRate = totalCheckins > 0 ? Math.round((completedCheckins / totalCheckins) * 100) : 0;

  const painValues = checkins
    ?.filter((c) => c.pain_level !== null && c.pain_level !== undefined)
    .map((c) => Number(c.pain_level)) ?? [];
  const averagePain =
    painValues.length > 0
      ? Math.round((painValues.reduce((a, b) => a + b, 0) / painValues.length) * 10) / 10
      : 0;

  const lastCheckin = checkins?.[0]?.checked_at as string | null ?? null;
  const status = computeAdherenceStatus(adherenceRate, lastCheckin);

  const exerciseBreakdown = (exercises ?? []).map((ex) => {
    const exCheckins = checkins?.filter((c) => c.exercise_id === ex.id) ?? [];
    const exCompleted = exCheckins.filter((c) => c.completed === 1).length;
    const exPainValues = exCheckins
      .filter((c) => c.pain_level !== null)
      .map((c) => Number(c.pain_level));
    const exAvgPain =
      exPainValues.length > 0
        ? Math.round((exPainValues.reduce((a, b) => a + b, 0) / exPainValues.length) * 10) / 10
        : 0;

    return {
      exerciseId: ex.id,
      name: ex.exercise_name,
      completionRate: exCheckins.length > 0 ? Math.round((exCompleted / exCheckins.length) * 100) : 0,
      averagePain: exAvgPain,
    };
  });

  return c.json({
    totalCheckins,
    completedCheckins,
    adherenceRate,
    averagePain,
    lastCheckin,
    status,
    exerciseBreakdown,
    recentCheckins: (checkins ?? []).slice(0, 5).map((c) => ({
      completed: c.completed as number,
      pain_level: c.pain_level as number | null,
      difficulty: c.difficulty as string | null,
      notes: c.notes as string | null,
      checked_at: c.checked_at as string,
    })),
  });
});

// ─────────────────────────────────────────────
// VISÃO GERAL — todos os pacientes com HEP
// ─────────────────────────────────────────────

// GET /api/hep/overview
// Returns adherence summary for all active HEP plans of the current user
hepRouter.get("/overview", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };

  const { results: plans } = await c.env.DB.prepare(
    `SELECT id, patient_id, title, status FROM hep_plans WHERE user_id = ? AND status = 'active'`
  )
    .bind(user.id)
    .all<{ id: number; patient_id: number; title: string; status: string }>();

  if (!plans || plans.length === 0) {
    return c.json({ overview: [] });
  }

  const planIds = plans.map((p) => p.id);
  const placeholders = planIds.map(() => "?").join(",");

  const { results: allCheckins } = await c.env.DB.prepare(
    `SELECT plan_id, completed, pain_level, checked_at FROM hep_checkins WHERE plan_id IN (${placeholders}) ORDER BY checked_at DESC`
  )
    .bind(...planIds)
    .all<{ plan_id: number; completed: number; pain_level: number | null; checked_at: string }>();

  const overview = plans.map((plan) => {
    const checkins = (allCheckins ?? []).filter((c) => c.plan_id === plan.id);
    const total = checkins.length;
    const completed = checkins.filter((c) => c.completed === 1).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const lastCheckin = checkins[0]?.checked_at ?? null;
    const status = computeAdherenceStatus(rate, lastCheckin);

    return {
      patientId: plan.patient_id,
      planId: plan.id,
      planTitle: plan.title,
      adherenceRate: rate,
      totalCheckins: total,
      lastCheckin,
      status,
    };
  });

  return c.json({ overview });
});

// ─────────────────────────────────────────────
// PORTAL DO PACIENTE — rotas públicas (sem auth)
// ─────────────────────────────────────────────

// GET /api/hep/patient/:token
hepRouter.get("/patient/:token", async (c) => {
  const token = c.req.param("token");

  const tokenRow = await c.env.DB.prepare(
    `SELECT * FROM hep_access_tokens WHERE token = ?`
  )
    .bind(token)
    .first<Record<string, unknown>>();

  if (!tokenRow) {
    return c.json({ error: "Token inválido" }, 404);
  }

  if (tokenRow.expires_at) {
    const expiry = new Date(tokenRow.expires_at as string).getTime();
    if (Date.now() > expiry) {
      return c.json({ error: "Token expirado" }, 410);
    }
  }

  const planId = tokenRow.plan_id;

  const plan = await c.env.DB.prepare(`SELECT * FROM hep_plans WHERE id = ?`)
    .bind(planId)
    .first();

  const { results: exercises } = await c.env.DB.prepare(
    `SELECT * FROM hep_exercises WHERE plan_id = ? ORDER BY order_index ASC, created_at ASC`
  )
    .bind(planId)
    .all();

  // Last 7 days of check-ins
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { results: recentCheckins } = await c.env.DB.prepare(
    `SELECT * FROM hep_checkins WHERE plan_id = ? AND checked_at >= ? ORDER BY checked_at DESC`
  )
    .bind(planId, sevenDaysAgo)
    .all();

  return c.json({ plan, exercises: exercises ?? [], recentCheckins: recentCheckins ?? [] });
});

// POST /api/hep/patient/:token/checkin
hepRouter.post("/patient/:token/checkin", async (c) => {
  const token = c.req.param("token");

  const tokenRow = await c.env.DB.prepare(
    `SELECT * FROM hep_access_tokens WHERE token = ?`
  )
    .bind(token)
    .first<Record<string, unknown>>();

  if (!tokenRow) {
    return c.json({ error: "Token inválido" }, 404);
  }

  if (tokenRow.expires_at) {
    const expiry = new Date(tokenRow.expires_at as string).getTime();
    if (Date.now() > expiry) {
      return c.json({ error: "Token expirado" }, 410);
    }
  }

  const planId = tokenRow.plan_id;

  const body = await c.req.json<{
    exercise_id: number;
    completed: boolean;
    pain_level?: number;
    difficulty?: string;
    notes?: string;
  }>();

  if (body.exercise_id === undefined || body.completed === undefined) {
    return c.json({ error: "exercise_id e completed são obrigatórios" }, 400);
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO hep_checkins (plan_id, exercise_id, completed, pain_level, difficulty, notes)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      planId,
      body.exercise_id,
      body.completed ? 1 : 0,
      body.pain_level ?? null,
      body.difficulty ?? null,
      body.notes ?? null
    )
    .run();

  const newId = getInsertedId(result);
  const checkin = await c.env.DB.prepare(`SELECT * FROM hep_checkins WHERE id = ?`)
    .bind(newId)
    .first();

  // ── Send emails asynchronously (fire-and-forget) ──────────────────────────
  if (c.env.RESEND_API_KEY) {
    const resendKey = c.env.RESEND_API_KEY;

    const emailWork = (async () => {
      try {
        const plan = await c.env.DB.prepare(
          `SELECT hp.id, hp.title,
                  p.name  AS patient_name, p.email AS patient_email,
                  up.name AS physio_name,  up.email AS physio_email
           FROM hep_plans hp
           JOIN patients p        ON hp.patient_id = p.id
           LEFT JOIN user_profiles up ON up.id = hp.user_id
           WHERE hp.id = ?`
        ).bind(planId).first<{
          id: number; title: string;
          patient_name: string; patient_email: string | null;
          physio_name: string | null; physio_email: string | null;
        }>();

        if (!plan) return;

        const [exercisesRes, todayCheckinsRes] = await Promise.all([
          c.env.DB.prepare(
            `SELECT exercise_name AS name, sets, reps, frequency
             FROM hep_exercises WHERE plan_id = ? ORDER BY order_index`
          ).bind(planId).all<{ name: string; sets: number | null; reps: string | null; frequency: string | null }>(),
          c.env.DB.prepare(
            `SELECT completed FROM hep_checkins
             WHERE plan_id = ? AND DATE(checked_at) = DATE('now')`
          ).bind(planId).all<{ completed: number }>(),
        ]);

        const totalExercises = exercisesRes.results.length;
        const completedToday = todayCheckinsRes.results.filter((r) => r.completed === 1).length;
        const adherenceRate = totalExercises > 0
          ? Math.round((completedToday / totalExercises) * 100)
          : 0;

        const checkinUrl = `https://rehabroad.com.br/hep/${token}`;
        const dashboardUrl = `https://rehabroad.com.br/dashboard`;

        // Email 1: confirmação para o paciente
        if (plan.patient_email) {
          const tmpl = emailTemplates.hepCheckinConfirmation({
            patientName: plan.patient_name,
            completedCount: completedToday,
            totalCount: totalExercises || 1,
            checkinUrl,
          });
          await sendEmail({ to: plan.patient_email, ...tmpl }, resendKey);
        }

        // Email 2: notificação para o fisio
        if (plan.physio_email) {
          const tmpl = emailTemplates.hepCheckinNotification({
            physioName: plan.physio_name ?? "Fisioterapeuta",
            patientName: plan.patient_name,
            completedCount: completedToday,
            totalCount: totalExercises || 1,
            adherenceRate,
            painLevel: body.pain_level,
            dashboardUrl,
          });
          await sendEmail({ to: plan.physio_email, ...tmpl }, resendKey);
        }
      } catch {
        // silently ignore — email failure must never break the checkin response
      }
    })();

    // ctx.waitUntil not available on this router; emails are best-effort
    void emailWork;
  }

  return c.json({ checkin, success: true }, 201);
});
