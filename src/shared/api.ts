/**
 * Shared API types between the Cloudflare Worker and the React app.
 *
 * Add types here only when they cross the worker<->react-app boundary
 * (response bodies, request bodies, shared enums). Keep purely UI or
 * purely backend types in their own modules.
 */

// ----------------------------------------------------------------------
// Comite (mentors + saved cases)
// ----------------------------------------------------------------------

/**
 * Raw shape returned by GET /api/comite/agents. Portuguese keys come
 * from the DB columns; the React side re-maps these into UI-friendly
 * shapes (e.g. nome -> name).
 */
export interface ComiteAgentRaw {
  id: string;
  categoria: string;
  nome: string;
  descricao_curta: string;
  icone: string;
}

/** Response from GET /api/comite/xp. */
export interface ComiteXpResponse {
  xp?: number;
  xp_total?: number;
  level?: string;
  next_level_xp?: number;
}

/** Item from GET /api/comite/library (saved agent cases). */
export interface ComiteLibraryCase {
  id: string;
  title: string;
  history_json: string | null;
  agent_name: string;
  agent_icon: string;
  created_at: string;
}

/** Chat message inside a Comite agent session. */
export interface ComiteMessage {
  role: "user" | "assistant";
  content: string;
}

// ----------------------------------------------------------------------
// Appointments
// ----------------------------------------------------------------------

/** Query key shape used by the agenda/appointments react-query. */
export type AppointmentsQueryKey = readonly [
  "appointments",
  { start?: string; end?: string },
];
