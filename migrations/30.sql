-- migration 30: clinical suggestion feedback loop
-- Captures fisio's reaction to each insight, hypothesis, alert, and HEP signal
-- surfaced by Apoio Clínico. Required to calibrate confidence over time —
-- without it, the rule engine has no ground truth.

CREATE TABLE IF NOT EXISTS clinical_suggestion_feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  patient_id INTEGER NOT NULL,
  -- 'insight'    → priority insights from generateStructuredSuporte
  -- 'hypothesis' → diagnostic hypotheses from DX_RULES
  -- 'alert'      → 9-rule clinical-context alerts
  -- 'hep_signal' → painful/welltolerated exercise insights
  suggestion_type TEXT NOT NULL,
  -- Stable identifier within (user, patient, type). For hypotheses this is
  -- the condition name; for insights/alerts the title; for hep_signal the
  -- exercise name. Lets us track a suggestion across time even if its
  -- confidence/wording shifts.
  suggestion_key TEXT NOT NULL,
  -- 'useful'         → fisio finds it relevant
  -- 'not_applicable' → wrong context for this patient (no harm)
  -- 'disagree'       → the suggestion is misleading / clinically wrong
  -- 'confirmed'      → diagnostic hypothesis became the working diagnosis
  feedback TEXT NOT NULL,
  notes TEXT,
  -- JSON snapshot of the suggestion at the moment of feedback (label,
  -- confidence, evidenceNote, etc.). Lets us retro-analyze without joining
  -- against current rule outputs.
  context_snapshot TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Each (fisio, patient, suggestion) gets at most one feedback row;
  -- changing your mind UPSERTs this record.
  UNIQUE(user_id, patient_id, suggestion_type, suggestion_key)
);

CREATE INDEX IF NOT EXISTS idx_csf_user ON clinical_suggestion_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_csf_patient ON clinical_suggestion_feedback(patient_id);
CREATE INDEX IF NOT EXISTS idx_csf_suggestion ON clinical_suggestion_feedback(suggestion_type, suggestion_key);
