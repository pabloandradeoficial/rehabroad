CREATE TABLE IF NOT EXISTS evaluations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  type TEXT NOT NULL DEFAULT 'initial',
  chief_complaint TEXT,
  history TEXT,
  pain_level INTEGER,
  pain_location TEXT,
  functional_status TEXT,
  orthopedic_tests TEXT,
  observations TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_evaluations_patient_id
ON evaluations(patient_id);

CREATE INDEX IF NOT EXISTS idx_evaluations_type
ON evaluations(type);

CREATE INDEX IF NOT EXISTS idx_evaluations_created_at
ON evaluations(created_at);

CREATE TABLE IF NOT EXISTS evolutions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  session_date TEXT NOT NULL,
  pain_level INTEGER,
  functional_status TEXT,
  procedures TEXT,
  patient_response TEXT,
  observations TEXT,
  attendance_status TEXT NOT NULL DEFAULT 'attended',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_evolutions_patient_id
ON evolutions(patient_id);

CREATE INDEX IF NOT EXISTS idx_evolutions_session_date
ON evolutions(session_date);

CREATE INDEX IF NOT EXISTS idx_evolutions_created_at
ON evolutions(created_at);