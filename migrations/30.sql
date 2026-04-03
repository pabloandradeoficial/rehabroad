-- Migration 30: Tabela de logs de exercícios (PBE / adesão ao tratamento)
-- Registra cada check-in do paciente com métricas clínicas detalhadas.
-- Complementa hep_checkins com chave de patient_id explícita e nomenclatura PT-BR.

CREATE TABLE IF NOT EXISTS logs_exercicios (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,

  -- Referências
  patient_id      INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  exercicio_id    INTEGER NOT NULL REFERENCES hep_exercises(id) ON DELETE CASCADE,
  plano_id        INTEGER NOT NULL REFERENCES hep_plans(id) ON DELETE CASCADE,

  -- Métricas de adesão
  concluido       INTEGER NOT NULL DEFAULT 1 CHECK (concluido IN (0, 1)),
                  -- 1 = realizado, 0 = não realizado (registro de não-adesão)

  -- Escala Visual Analógica de dor (0–10)
  nivel_dor       INTEGER CHECK (nivel_dor BETWEEN 0 AND 10),

  -- Escala de Borg CR-10 simplificada
  -- valores: 'muito_leve' | 'leve' | 'moderado' | 'intenso' | 'maximo'
  nivel_esforco   TEXT CHECK (
                    nivel_esforco IN ('muito_leve', 'leve', 'moderado', 'intenso', 'maximo')
                  ),

  -- Observações livres do paciente
  observacoes     TEXT,

  -- Timestamp automático em UTC
  registrado_em   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Índices para consultas frequentes do dashboard do fisioterapeuta
CREATE INDEX IF NOT EXISTS idx_logs_exercicios_patient
  ON logs_exercicios (patient_id, registrado_em DESC);

CREATE INDEX IF NOT EXISTS idx_logs_exercicios_exercicio
  ON logs_exercicios (exercicio_id, registrado_em DESC);

CREATE INDEX IF NOT EXISTS idx_logs_exercicios_plano
  ON logs_exercicios (plano_id, registrado_em DESC);
