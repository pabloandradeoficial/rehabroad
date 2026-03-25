CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  patient_id INTEGER,
  appointment_id INTEGER,
  amount REAL NOT NULL,
  type TEXT NOT NULL DEFAULT 'income',
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  description TEXT,
  transaction_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_patient ON transactions(patient_id);

ALTER TABLE appointments ADD COLUMN price REAL;
ALTER TABLE appointments ADD COLUMN is_paid BOOLEAN DEFAULT 0;