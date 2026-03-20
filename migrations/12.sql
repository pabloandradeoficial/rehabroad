CREATE TABLE appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  patient_id INTEGER,
  patient_name TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 50,
  type TEXT DEFAULT 'sessao',
  notes TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_user_date ON appointments(user_id, appointment_date);