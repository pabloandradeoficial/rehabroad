-- migration 28: hep plan content sections + patient comments
ALTER TABLE hep_plans ADD COLUMN diagnostico_explicado TEXT;
ALTER TABLE hep_plans ADD COLUMN orientacoes TEXT;
ALTER TABLE hep_plans ADD COLUMN metas TEXT;

CREATE TABLE IF NOT EXISTS patient_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  hep_plan_id INTEGER REFERENCES hep_plans(id),
  hep_exercise_id INTEGER REFERENCES hep_exercises(id),
  section TEXT,
  comment TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  read_by_therapist INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_patient_comments_patient ON patient_comments(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_comments_unread ON patient_comments(read_by_therapist, patient_id);
