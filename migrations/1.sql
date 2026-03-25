
CREATE TABLE patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  birth_date DATE,
  phone TEXT,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patients_user_id ON patients(user_id);

CREATE TABLE evaluations (
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_evaluations_patient_id ON evaluations(patient_id);

CREATE TABLE evolutions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  session_date DATE NOT NULL,
  pain_level INTEGER,
  functional_status TEXT,
  procedures TEXT,
  patient_response TEXT,
  observations TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_evolutions_patient_id ON evolutions(patient_id);
CREATE INDEX idx_evolutions_session_date ON evolutions(session_date);

CREATE TABLE caminho (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL UNIQUE,
  pain_pattern TEXT,
  aggravating_factors TEXT,
  relieving_factors TEXT,
  functional_limitations TEXT,
  treatment_goals TEXT,
  red_flags TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_caminho_patient_id ON caminho(patient_id);
