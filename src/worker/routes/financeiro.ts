/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hono } from "hono";
import { authMiddleware, getInsertedId } from "../lib/helpers";

export const financeiroRouter = new Hono<{ Bindings: Env }>();

// Get transactions with summary
financeiroRouter.get("/", authMiddleware, async (c) => {
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
financeiroRouter.get("/chart", authMiddleware, async (c) => {
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
financeiroRouter.post("/", authMiddleware, async (c) => {
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
financeiroRouter.put("/:id", authMiddleware, async (c) => {
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
financeiroRouter.delete("/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const id = c.req.param("id");

  await c.env.DB.prepare(`
    DELETE FROM transactions WHERE id = ? AND user_id = ?
  `).bind(id, user.id).run();

  return c.json({ success: true });
});
