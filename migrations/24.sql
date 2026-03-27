CREATE TABLE IF NOT EXISTS rehab_friend_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  patient_id INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rehab_friend_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE,
  message_count INTEGER DEFAULT 0,
  reset_at TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rf_messages_user ON rehab_friend_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_rf_usage_user ON rehab_friend_usage(user_id);
