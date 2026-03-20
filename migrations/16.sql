ALTER TABLE student_progress ADD COLUMN xp INTEGER DEFAULT 0;
ALTER TABLE student_progress ADD COLUMN streak INTEGER DEFAULT 0;
ALTER TABLE student_progress ADD COLUMN last_streak_date TEXT;
ALTER TABLE student_progress ADD COLUMN daily_challenge_date TEXT;
ALTER TABLE student_progress ADD COLUMN daily_challenge_case_id TEXT;