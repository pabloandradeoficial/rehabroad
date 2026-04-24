import { Hono } from "hono";
import { getSEOForRoute, injectSEOTags } from "./seo";
import { sendEmail, emailTemplates } from "./lib/email";

import { authRouter } from "./routes/auth";
import { subscriptionRouter } from "./routes/subscription";
import { patientsRouter } from "./routes/patients";
import { dashboardRouter } from "./routes/dashboard";
import { agendaRouter } from "./routes/agenda";
import { financeiroRouter } from "./routes/financeiro";
import { forumRouter } from "./routes/forum";
import { adminRouter } from "./routes/admin";
import { studentRouter } from "./routes/student";
import { miscRouter } from "./routes/misc";
import { neurofluxRouter } from "./routes/neuroflux";
import { clinicalContextRouter } from "./routes/clinical-context";
import { hepRouter } from "./routes/hep";
import { patientPortalRouter } from "./routes/patient-portal";
import { rehabFriendRouter } from "./routes/rehab-friend";
import { scribeRouter } from "./routes/scribe";
import { profileRouter } from "./routes/profile";
import { studentCasesRouter, generateWeeklyCases } from "./routes/student-cases";
import { studentAnamneseRouter } from "./routes/student-anamnese";
import { comiteRouter } from "./routes/comite";

const app = new Hono<{ Bindings: Env }>();

// ============================================
// GLOBAL MIDDLEWARE
// ============================================

// HTTPS Redirect Middleware: Force HTTPS on custom domains
app.use("*", async (c, next) => {
  const url = new URL(c.req.url);
  const proto = c.req.header("x-forwarded-proto") || url.protocol.replace(":", "");

  if (proto === "http" && !url.hostname.includes("localhost") && url.hostname !== "127.0.0.1") {
    const httpsUrl = `https://${url.hostname}${url.pathname}${url.search}`;
    return c.redirect(httpsUrl, 301);
  }

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

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/assets/") ||
    pathname.includes(".") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return next();
  }

  const userAgent = c.req.header("user-agent") || "";
  const isBot = /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|discordbot/i.test(userAgent);

  const seo = getSEOForRoute(pathname);

  if (isBot && seo) {
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

// ============================================
// ROUTE MOUNTING
// ============================================

// Auth routes: /api/oauth/*, /api/sessions, /api/users/me, /api/logout
app.route("/api", authRouter);

// Profile routes: /api/profile, /api/profile/avatar
app.route("/api", profileRouter);

// Subscription routes: /api/beta-waitlist, /api/waitlist/*, /api/subscription/*, /api/webhooks/*
app.route("/api", subscriptionRouter);

// Patient domain routes: /api/patients/*, /api/evaluations/*, /api/evolutions/*, /api/alertas/*, /api/clinical-insights
app.route("/api", patientsRouter);

// Dashboard routes: /api/dashboard/*, /api/onboarding/*, /api/smart-alerts
app.route("/api", dashboardRouter);

// Agenda routes: /api/appointments/*
app.route("/api/appointments", agendaRouter);

// Financeiro routes: /api/transactions/*
app.route("/api/transactions", financeiroRouter);

// Forum routes: /api/forum/*
app.route("/api/forum", forumRouter);

// Admin routes: /api/admin/*
app.route("/api", adminRouter);

// Student routes: /api/student/*
app.route("/api/student", studentRouter);
app.route("/api/student", studentCasesRouter);
app.route("/api/student", studentAnamneseRouter);

// NeuroFlux routes: /api/neuroflux
app.route("/api/neuroflux", neurofluxRouter);

// Clinical Context routes: /api/clinical-context/:patient_id
app.route("/api", clinicalContextRouter);

// HEP routes: /api/hep/*
app.route("/api/hep", hepRouter);
app.route("/api/rehab-friend", rehabFriendRouter);
app.route("/api/scribe", scribeRouter);
app.route("/api/comite", comiteRouter);
app.route("/api", patientPortalRouter);

// Misc routes: sitemap.xml, robots.txt, PDF downloads, /api/contato, /api/leads, /api/track-view
app.route("/", miscRouter);

// ============================================
// CRON JOB — daily HEP reminders + low-adherence alerts
// ============================================

async function sendDailyHepReminders(env: Env) {
  if (!env.RESEND_API_KEY) return;

  // Busca todos os planos ativos com pacientes que têm email
  const activePlans = await env.DB.prepare(`
    SELECT hp.id, hp.title, hp.patient_id,
           p.name  AS patient_name,  p.email AS patient_email,
           hat.token
    FROM hep_plans hp
    JOIN patients p            ON hp.patient_id = p.id
    JOIN hep_access_tokens hat ON hat.plan_id = hp.id
    WHERE hp.status = 'active'
    AND p.email IS NOT NULL AND p.email != ''
    AND (hat.expires_at IS NULL OR hat.expires_at > datetime('now'))
  `).all<{
    id: number; title: string; patient_id: number;
    patient_name: string; patient_email: string;
    token: string;
  }>();

  for (const plan of activePlans.results) {
    // Pula se paciente já fez check-in hoje
    const todayCheckin = await env.DB.prepare(
      `SELECT COUNT(*) AS count FROM hep_checkins
       WHERE plan_id = ? AND DATE(checked_at) = DATE('now')`
    ).bind(plan.id).first<{ count: number }>();

    if (todayCheckin && todayCheckin.count > 0) continue;

    const exercises = await env.DB.prepare(
      `SELECT exercise_name AS name, sets, reps, frequency
       FROM hep_exercises WHERE plan_id = ? ORDER BY order_index LIMIT 5`
    ).bind(plan.id).all<{ name: string; sets: number | null; reps: string | null; frequency: string | null }>();

    const checkinUrl = `https://rehabroad.com.br/hep/${plan.token}`;

    const tmpl = emailTemplates.hepReminder({
      patientName: plan.patient_name,
      planTitle: plan.title,
      exercises: exercises.results,
      checkinUrl,
    });

    await sendEmail({ to: plan.patient_email, ...tmpl }, env.RESEND_API_KEY);
  }

  // ── Alerta de baixa adesão (últimos 3 dias) ──────────────────────────────
  const lowAdherencePlans = await env.DB.prepare(`
    SELECT
      hp.id, hp.patient_id, hp.user_id,
      p.name  AS patient_name,
      up.name  AS physio_name, up.email AS physio_email,
      COUNT(hc.id)                                        AS total_checkins,
      SUM(CASE WHEN hc.completed = 1 THEN 1 ELSE 0 END)  AS completed_checkins
    FROM hep_plans hp
    JOIN patients p            ON hp.patient_id = p.id
    LEFT JOIN user_profiles up ON up.id = hp.user_id
    LEFT JOIN hep_checkins hc  ON hc.plan_id = hp.id
      AND hc.checked_at >= datetime('now', '-3 days')
    WHERE hp.status = 'active'
    AND up.email IS NOT NULL
    GROUP BY hp.id
    HAVING total_checkins >= 3
      AND (CAST(completed_checkins AS FLOAT) / total_checkins) < 0.5
  `).all<{
    id: number; patient_id: number; user_id: string;
    patient_name: string;
    physio_name: string | null; physio_email: string;
    total_checkins: number; completed_checkins: number;
  }>();

  for (const plan of lowAdherencePlans.results) {
    const adherenceRate = plan.total_checkins > 0
      ? Math.round((plan.completed_checkins / plan.total_checkins) * 100)
      : 0;

    const tmpl = emailTemplates.hepLowAdherenceAlert({
      physioName: plan.physio_name ?? "Fisioterapeuta",
      patientName: plan.patient_name,
      adherenceRate,
      daysChecked: 3,
      dashboardUrl: "https://rehabroad.com.br/dashboard",
    });

    await sendEmail({ to: plan.physio_email, ...tmpl }, env.RESEND_API_KEY);
  }
}

async function sendStreakRiskEmails(env: Env) {
  if (!env.RESEND_API_KEY) return;

  // Students with streak >= 3 who haven't studied today
  const today = new Date().toISOString().split("T")[0];
  const { results } = await env.DB.prepare(`
    SELECT user_email, user_name, streak
    FROM student_progress
    WHERE streak >= 3
      AND (last_streak_date IS NULL OR last_streak_date < ?)
      AND user_email IS NOT NULL AND user_email != ''
    LIMIT 200
  `).bind(today).all<{ user_email: string; user_name: string; streak: number }>();

  for (const student of results) {
    const name = student.user_name?.split(" ")[0] || "Estudante";
    await sendEmail({
      to: student.user_email,
      subject: `⚠️ Sua sequência de ${student.streak} dias está em risco!`,
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 8px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#f97316,#ea580c);padding:32px 24px;text-align:center;">
      <div style="font-size:48px;margin-bottom:8px;">🔥</div>
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">${student.streak} dias seguidos em risco!</h1>
    </div>
    <div style="padding:24px;text-align:center;">
      <p style="color:#374151;font-size:15px;">
        Olá, <strong>${name}</strong>! Você ainda não estudou hoje.<br>
        Não perca sua sequência de <strong>${student.streak} dias</strong>!
      </p>
      <div style="margin:20px 0;">
        <a href="https://rehabroad.com.br/estudante"
           style="background:#f97316;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;display:inline-block;">
          🏃 Resolver caso agora
        </a>
      </div>
      <p style="color:#9ca3af;font-size:12px;">Leva apenas 5 minutos para manter sua sequência!</p>
    </div>
    <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #f3f4f6;">
      <p style="color:#9ca3af;font-size:11px;margin:0;">Rehabroad · Plataforma de Estudantes de Fisioterapia</p>
    </div>
  </div>
</body>
</html>`,
    }, env.RESEND_API_KEY);
  }
}

app.onError((err, c) => {
  console.error("Global Error Handler caught:", err);
  if (err instanceof SyntaxError && err.message.includes("JSON")) {
    return c.json({ error: "Invalid JSON format" }, 400);
  }
  return c.json({ error: "Internal Server Error" }, 500);
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx);
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const cron = event.cron;

    if (cron === "0 12 * * *") {
      await sendDailyHepReminders(env);
    } else if (cron === "0 9 * * 1") {
      await generateWeeklyCases(env, 3);
    } else if (cron === "0 23 * * *") {
      await sendStreakRiskEmails(env);
    }
  },
};
