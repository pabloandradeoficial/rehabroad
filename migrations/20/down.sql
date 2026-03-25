-- SQLite does not support DROP COLUMN in older versions; recreate table without category
CREATE TABLE transactions_backup AS SELECT id, user_id, patient_id, appointment_id, amount, type, payment_method, status, description, transaction_date, notes, created_at, updated_at FROM transactions;
DROP TABLE transactions;
ALTER TABLE transactions_backup RENAME TO transactions;
