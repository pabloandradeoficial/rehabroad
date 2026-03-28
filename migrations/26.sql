-- migration 26: add email and name to user_profiles for cron/notification queries
ALTER TABLE user_profiles ADD COLUMN email TEXT;
ALTER TABLE user_profiles ADD COLUMN name TEXT;
