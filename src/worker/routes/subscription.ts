import { Hono } from "hono";
import Stripe from "stripe";
import { Resend } from "resend";
import { authMiddleware, isOwnerAdminEmail } from "../lib/helpers";

export const subscriptionRouter = new Hono<{ Bindings: Env }>();

// ============================================
// BETA WAITLIST
// ============================================

subscriptionRouter.post("/beta-waitlist", async (c) => {
  const body = await c.req.json();

  if (!body.email) {
    return c.json({ error: "E-mail é obrigatório" }, 400);
  }

  const existing = await c.env.DB.prepare(
    `SELECT id FROM beta_waitlist WHERE email = ?`
  ).bind(body.email).first();

  if (existing) {
    return c.json({ message: "E-mail já cadastrado na lista de espera" }, 409);
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO beta_waitlist (name, email) VALUES (?, ?) RETURNING *`
  ).bind(body.name || null, body.email).first();

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
    }
  }

  return c.json(result, 201);
});

// Check if user's email is approved in waitlist
subscriptionRouter.get("/waitlist/check", authMiddleware, async (c) => {
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
// SUBSCRIPTION
// ============================================

// Get current user subscription
subscriptionRouter.get("/subscription", authMiddleware, async (c) => {
  const user = c.get("user");

  // E2E test bypass — return premium subscription without touching D1
  if (user!.id === "e2e-test-user") {
    return c.json({
      id: 0,
      user_id: "e2e-test-user",
      plan_type: "monthly",
      is_active: 1,
      is_admin: 0,
      status: "active_paid",
      effective_status: "active_paid",
      started_at: new Date().toISOString(),
      expires_at: null,
      trial_start_date: null,
      trial_days_remaining: null,
      is_premium: true,
    });
  }

  let subscription = await c.env.DB.prepare(
    `SELECT * FROM subscriptions WHERE user_id = ?`
  ).bind(user!.id).first() as any;

  const now = new Date().toISOString();

  const ADMIN_EMAIL = "pabloandradeoficial@gmail.com";
  const normalizedUserEmail = String(user?.email || "").trim().toLowerCase();
  const normalizedAdminEmail = ADMIN_EMAIL.trim().toLowerCase();
  const isOwnerEmail = normalizedUserEmail === normalizedAdminEmail;

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
  } else if (isOwnerEmail) {
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
  } else if (!subscription.trial_start_date && subscription.status !== 'active_paid') {
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

  let effectiveStatus = subscription.status;

  const isAdmin = subscription.is_admin === 1 || subscription.is_admin === true || isOwnerEmail;
  if (isAdmin) {
    effectiveStatus = 'active_paid';
    subscription.is_admin = 1;
    subscription.is_active = 1;
    subscription.status = 'active_paid';
    subscription.plan_type = subscription.plan_type && subscription.plan_type !== 'free'
      ? subscription.plan_type
      : 'monthly';
  } else if (subscription.status === 'beta_trial' && subscription.trial_start_date) {
    const trialStart = new Date(subscription.trial_start_date);
    const nowDate = new Date();
    const daysDiff = Math.floor((nowDate.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff > 30) {
      effectiveStatus = 'free_limited';
      await c.env.DB.prepare(
        `UPDATE subscriptions SET status = 'free_limited', is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`
      ).bind(user!.id).run();
      subscription.status = 'free_limited';
      subscription.is_active = 0;
    }
  }

  let trialDaysRemaining = null;
  if (subscription.trial_start_date && subscription.status === 'beta_trial' && !isAdmin) {
    const trialStart = new Date(subscription.trial_start_date);
    const nowDate = new Date();
    const daysDiff = Math.floor((nowDate.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
    trialDaysRemaining = Math.max(0, 30 - daysDiff);
  }

  const is_premium = effectiveStatus === 'active_paid' || effectiveStatus === 'beta_trial';

  return c.json({
    ...subscription,
    effective_status: effectiveStatus,
    trial_days_remaining: trialDaysRemaining,
    is_premium,
  });
});

// Plan configurations
const PLAN_CONFIGS = {
  monthly: {
    name: "REHABROAD - Plano Mensal",
    description: "Acesso completo às ferramentas de apoio clínico - cobrança mensal",
    amount: 2900,
    interval: "month" as const,
    intervalCount: 1,
    planType: "monthly"
  },
  semestral: {
    name: "REHABROAD - Plano Semestral",
    description: "Acesso completo às ferramentas de apoio clínico - 6 meses",
    amount: 14900,
    interval: "month" as const,
    intervalCount: 6,
    planType: "semestral"
  },
  annual: {
    name: "REHABROAD - Plano Anual",
    description: "Acesso completo às ferramentas de apoio clínico - 12 meses",
    amount: 27900,
    interval: "year" as const,
    intervalCount: 1,
    planType: "annual"
  }
};

// Create Stripe Checkout Session
subscriptionRouter.post("/subscription/checkout", authMiddleware, async (c) => {
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

  const url = new URL(c.req.url);
  const baseUrl = `${url.protocol}//${url.host}`;

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
subscriptionRouter.post("/webhooks/stripe", async (c) => {
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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const planType = session.metadata?.plan_type || "monthly";
    const stripeSubscriptionId = session.subscription as string;

    if (userId && stripeSubscriptionId) {
      const now = new Date().toISOString();
      const expiresAt = new Date();

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
subscriptionRouter.post("/subscription/cancel", authMiddleware, async (c) => {
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
    await stripe.subscriptions.cancel(subscription.stripe_subscription_id);

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
