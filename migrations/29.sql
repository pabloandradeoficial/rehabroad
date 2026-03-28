-- migration 29: student clinical cases (AI), region progress, flashcard progress, pro bridge

CREATE TABLE IF NOT EXISTS clinical_cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  area TEXT NOT NULL,
  regiao TEXT NOT NULL,
  dificuldade TEXT NOT NULL DEFAULT 'intermediario',
  titulo TEXT NOT NULL,
  paciente TEXT NOT NULL,           -- JSON: { nome, idade, sexo, profissao }
  historia TEXT NOT NULL,
  sintomas TEXT NOT NULL,           -- JSON array of strings
  achados_clinicos TEXT NOT NULL,   -- JSON object
  tempo_estimado INTEGER DEFAULT 5,
  hipotese_correta TEXT NOT NULL,
  alternativas TEXT NOT NULL,       -- JSON array of strings (4 options, includes hipotese_correta)
  explicacao TEXT NOT NULL,
  dica_clinica TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review', -- 'pending_review' | 'published'
  generated_by TEXT NOT NULL DEFAULT 'ai',       -- 'ai' | 'manual'
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS student_region_progress (
  student_id TEXT NOT NULL,
  regiao TEXT NOT NULL,
  casos_resolvidos INTEGER DEFAULT 0,
  casos_total INTEGER DEFAULT 10,
  acertos INTEGER DEFAULT 0,
  dominio_percent INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'locked', -- 'locked' | 'in_progress' | 'dominated'
  updated_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (student_id, regiao)
);

CREATE TABLE IF NOT EXISTS student_flashcard_progress (
  student_id TEXT NOT NULL,
  card_id TEXT NOT NULL,
  resultado TEXT NOT NULL, -- 'sabia' | 'nao_sabia' | 'quase'
  reviewed_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (student_id, card_id)
);

ALTER TABLE student_progress ADD COLUMN estagio_atual TEXT;
ALTER TABLE student_progress ADD COLUMN ponte_pro_shown INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_clinical_cases_area ON clinical_cases(area);
CREATE INDEX IF NOT EXISTS idx_clinical_cases_regiao ON clinical_cases(regiao);
CREATE INDEX IF NOT EXISTS idx_clinical_cases_status ON clinical_cases(status);
CREATE INDEX IF NOT EXISTS idx_student_region_progress_student ON student_region_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_flashcard_progress_student ON student_flashcard_progress(student_id);
