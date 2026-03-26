import { Hono } from "hono";
import { authMiddleware, isOwnerAdminEmail, optionalAuthMiddleware, getInsertedId } from "../lib/helpers";

export const adminRouter = new Hono<{ Bindings: Env }>();

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

// Get all students (admin only)
adminRouter.get("/admin/students", authMiddleware, async (c) => {
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
    stats: { totalStudents, activeToday, totalCases, avgAccuracy }
  }, 200);
});

// Get admin dashboard stats
adminRouter.get("/admin/stats", authMiddleware, adminMiddleware, async (c) => {
  const totalUsers = await c.env.DB.prepare(
    `SELECT COUNT(DISTINCT user_id) as count FROM subscriptions`
  ).first() as { count: number };

  const activeUsers = await c.env.DB.prepare(
    `SELECT COUNT(DISTINCT user_id) as count FROM patients`
  ).first() as { count: number };

  const waitlistCount = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM beta_waitlist`
  ).first() as { count: number };

  const leadsCount = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM leads`
  ).first() as { count: number };

  const paidSubscriptions = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active_paid'`
  ).first() as { count: number };

  const today = new Date().toISOString().split('T')[0];
  const registeredToday = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM subscriptions WHERE DATE(created_at) = ?`
  ).bind(today).first() as { count: number };

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
adminRouter.get("/admin/views", authMiddleware, adminMiddleware, async (c) => {
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
adminRouter.get("/admin/users", authMiddleware, adminMiddleware, async (c) => {
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
adminRouter.get("/admin/waitlist", authMiddleware, adminMiddleware, async (c) => {
  const waitlist = await c.env.DB.prepare(`
    SELECT * FROM beta_waitlist ORDER BY created_at DESC
  `).all();

  return c.json({ waitlist: waitlist.results || [] });
});

// Get leads
adminRouter.get("/admin/leads", authMiddleware, adminMiddleware, async (c) => {
  const leads = await c.env.DB.prepare(`
    SELECT * FROM leads ORDER BY created_at DESC
  `).all();

  return c.json({ leads: leads.results || [] });
});

// Get engagement metrics
adminRouter.get("/admin/engagement", authMiddleware, adminMiddleware, async (c) => {
  const avgPatients = await c.env.DB.prepare(`
    SELECT AVG(patient_count) as avg FROM (
      SELECT COUNT(*) as patient_count FROM patients GROUP BY user_id
    )
  `).first() as { avg: number | null };

  const avgEvaluations = await c.env.DB.prepare(`
    SELECT AVG(eval_count) as avg FROM (
      SELECT COUNT(*) as eval_count FROM evaluations GROUP BY patient_id
    )
  `).first() as { avg: number | null };

  const avgEvolutions = await c.env.DB.prepare(`
    SELECT AVG(evo_count) as avg FROM (
      SELECT COUNT(*) as evo_count FROM evolutions GROUP BY patient_id
    )
  `).first() as { avg: number | null };

  const forumPosts = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM forum_posts
  `).first() as { count: number };

  const forumComments = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM forum_comments
  `).first() as { count: number };

  const totalAppointments = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM appointments
  `).first() as { count: number };

  const totalExports = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM report_exports
  `).first() as { count: number };

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
adminRouter.get("/admin/export-emails", authMiddleware, adminMiddleware, async (c) => {
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

  const seen = new Set<string>();
  const uniqueEmails = allEmails.filter(e => {
    if (seen.has(e.email)) return false;
    seen.add(e.email);
    return true;
  });

  return c.json({ emails: uniqueEmails, total: uniqueEmails.length });
});
