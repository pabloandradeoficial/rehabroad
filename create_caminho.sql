CREATE TABLE IF NOT EXISTS caminho (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL UNIQUE,
  pain_pattern TEXT,
  pain_patterns TEXT,
  aggravating_factors TEXT,
  relieving_factors TEXT,
  functional_limitations TEXT,
  treatment_goals TEXT,
  red_flags TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_caminho_patient_id
ON caminho(patient_id);