
CREATE TABLE student_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  user_email TEXT,
  user_name TEXT,
  cases_completed INTEGER DEFAULT 0,
  cases_correct INTEGER DEFAULT 0,
  modules_visited TEXT,
  last_module TEXT,
  total_time_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student_progress_user_id ON student_progress(user_id);
