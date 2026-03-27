import { Hono } from "hono";
import { getSEOForRoute, injectSEOTags } from "./seo";

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
import { rehabFriendRouter } from "./routes/rehab-friend";

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

// NeuroFlux routes: /api/neuroflux
app.route("/api/neuroflux", neurofluxRouter);

// Clinical Context routes: /api/clinical-context/:patient_id
app.route("/api", clinicalContextRouter);

// HEP routes: /api/hep/*
app.route("/api/hep", hepRouter);
app.route("/api/rehab-friend", rehabFriendRouter);

// Misc routes: sitemap.xml, robots.txt, PDF downloads, /api/contato, /api/leads, /api/track-view
app.route("/", miscRouter);

export default app;
