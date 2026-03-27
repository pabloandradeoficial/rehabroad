ALTER TABLE neuroflux_consultations ADD COLUMN patient_id TEXT;
CREATE INDEX IF NOT EXISTS idx_neuroflux_patient ON neuroflux_consultations(patient_id, created_at DESC);
