DROP INDEX IF EXISTS idx_transactions_patient;
DROP INDEX IF EXISTS idx_transactions_date;
DROP INDEX IF EXISTS idx_transactions_user_id;
DROP TABLE IF EXISTS transactions;

ALTER TABLE appointments DROP COLUMN price;
ALTER TABLE appointments DROP COLUMN is_paid;