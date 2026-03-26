CREATE TABLE IF NOT EXISTS neuroflux_consultations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  tissue TEXT,
  pathophysiology TEXT,
  phase TEXT,
  objective TEXT,
  irritability TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_neuroflux_user ON neuroflux_consultations(user_id, created_at DESC);
