import { Hono } from "hono";
import { authMiddleware, getInsertedId } from "../lib/helpers";

export const agendaRouter = new Hono<{ Bindings: Env }>();

// Get appointments for a date range
agendaRouter.get("/", authMiddleware, async (c) => {
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
agendaRouter.post("/", authMiddleware, async (c) => {
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
agendaRouter.put("/:id", authMiddleware, async (c) => {
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
agendaRouter.delete("/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const id = c.req.param("id");

  await c.env.DB.prepare(`
    DELETE FROM appointments WHERE id = ? AND user_id = ?
  `).bind(id, user.id).run();

  return c.json({ success: true });
});
