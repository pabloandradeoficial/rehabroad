-- Planos de exercício domiciliar
CREATE TABLE IF NOT EXISTS hep_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Exercícios dentro do plano
CREATE TABLE IF NOT EXISTS hep_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_id INTEGER NOT NULL,
  exercise_name TEXT NOT NULL,
  exercise_category TEXT,
  sets INTEGER,
  reps TEXT,
  frequency TEXT,
  instructions TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES hep_plans(id)
);

-- Check-ins do paciente
CREATE TABLE IF NOT EXISTS hep_checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_id INTEGER NOT NULL,
  exercise_id INTEGER NOT NULL,
  completed INTEGER DEFAULT 0,
  pain_level INTEGER,
  difficulty TEXT,
  notes TEXT,
  checked_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES hep_plans(id),
  FOREIGN KEY (exercise_id) REFERENCES hep_exercises(id)
);

-- Token de acesso do paciente (sem login)
CREATE TABLE IF NOT EXISTS hep_access_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_id INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES hep_plans(id)
);

CREATE INDEX IF NOT EXISTS idx_hep_plans_patient ON hep_plans(patient_id);
CREATE INDEX IF NOT EXISTS idx_hep_checkins_plan ON hep_checkins(plan_id);
CREATE INDEX IF NOT EXISTS idx_hep_tokens_token ON hep_access_tokens(token);
