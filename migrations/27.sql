-- migration 27: patient portal support
-- patients.email already exists (migration 1), add index for lookup performance
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);

-- physio-written notes visible to the patient in the portal
ALTER TABLE patients ADD COLUMN patient_notes TEXT;
