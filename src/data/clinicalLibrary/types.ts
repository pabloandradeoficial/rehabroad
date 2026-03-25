export interface ClinicalPage {
  id: string;
  slug: string;
  category: 'testes-ortopedicos' | 'patologias' | 'recursos-terapeuticos' | 'avaliacao-clinica';
  title: string;
  metaDescription: string;
  introduction: string;
  // For tests
  indications?: string[];
  howTo?: string[];
  interpretation?: {
    positive: string;
    negative: string;
    notes?: string;
  };
  // For pathologies
  epidemiology?: string;
  etiology?: string[];
  clinicalPresentation?: string[];
  diagnosis?: string[];
  treatment?: {
    conservative: string[];
    surgical?: string;
    prognosis: string;
  };
  redFlags?: string[];
  // For therapeutic resources
  mechanism?: string;
  parameters?: string[];
  contraindications?: string[];
  applicationProtocol?: string[];
  // For clinical evaluation
  objectives?: string[];
  procedures?: string[];
  scales?: string[];
  documentation?: string[];
  // Common
  evidence: {
    sensitivity?: string;
    specificity?: string;
    references: string[];
  };
  clinicalApplication: string;
  relatedTests?: string[];
  keywords: string[];
}

export interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const categories: CategoryInfo[] = [
  {
    id: 'testes-ortopedicos',
    name: 'Testes Ortopédicos',
    description: 'Testes especiais para avaliação musculoesquelética',
    icon: 'Stethoscope',
    color: 'teal'
  },
  {
    id: 'patologias',
    name: 'Patologias Musculoesqueléticas',
    description: 'Condições clínicas e diagnóstico diferencial',
    icon: 'Activity',
    color: 'rose'
  },
  {
    id: 'recursos-terapeuticos',
    name: 'Recursos Terapêuticos',
    description: 'Modalidades e técnicas de tratamento',
    icon: 'Zap',
    color: 'violet'
  },
  {
    id: 'avaliacao-clinica',
    name: 'Avaliação Clínica',
    description: 'Protocolos de avaliação por região',
    icon: 'ClipboardList',
    color: 'amber'
  }
];
