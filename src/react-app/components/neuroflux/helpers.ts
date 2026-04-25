import type { ClinicalData } from "@/react-app/data/neurofluxData";

export type Patient = {
  id: number;
  name: string;
  birth_date: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Evaluation = {
  id: number;
  patient_id: number;
  type: string;
  chief_complaint: string | null;
  history: string | null;
  pain_level: number | null;
  pain_location: string | null;
  functional_status: string | null;
  orthopedic_tests: string | null;
  observations: string | null;
  created_at: string;
};

export type Mode = "free" | "patient";

export const EMPTY_FORM: ClinicalData = {
  diagnosis: "",
  tissue: null,
  pathophysiology: null,
  phase: null,
  objective: null,
  irritability: null,
};

export const scientificReferences = [
  { category: "TENS", refs: ["Sluka KA, Walsh D. J Pain. 2003;4(3):109-21.", "Johnson MI et al. Eur J Pain. 2022;26(1):29-44.", "Vance CG et al. Pain Manag. 2014;4(3):197-209."] },
  { category: "Ultrassom Terapêutico", refs: ["Watson T. Ultrasonics. 2008;48(4):321-9.", "Miller DL et al. J Ultrasound Med. 2012;31(4):623-34.", "Robertson VJ, Baker KG. Phys Ther. 2001;81(7):1339-50."] },
  { category: "Laserterapia", refs: ["Chung H et al. Ann Biomed Eng. 2012;40(2):516-33.", "Huang YY et al. Dose Response. 2009;7(4):358-83.", "Bjordal JM et al. Clin Rehabil. 2008;22(10-11):952-65."] },
  { category: "Crioterapia", refs: ["Bleakley C et al. Am J Sports Med. 2004;32(1):251-61.", "Malanga GA et al. Postgrad Med. 2015;127(1):57-65.", "Kwiecien SY, McHugh MP. Eur J Appl Physiol. 2021;121(8):2125-42."] },
  { category: "Termoterapia", refs: ["Nadler SF et al. Pain Physician. 2004;7(3):395-9.", "Petrofsky J et al. J Med Eng Technol. 2009;33(5):361-9.", "Malanga GA et al. Postgrad Med. 2015;127(1):57-65."] },
];

export function inferTissue(text: string): string | null {
  const t = text.toLowerCase();
  if (/tend[aã]o|tendino|tendinite|tendinopatia|tendinop/.test(t)) return "Tendão";
  if (/ligamento|entorse|lca|lcp|lcl|lcm|lcfl/.test(t)) return "Ligamento";
  if (/m[uú]sculo|mialgia|contratura|distens[aã]o|ruptura muscular|strain/.test(t)) return "Músculo";
  if (/c[aá]psula|capsulite/.test(t)) return "Cápsula Articular";
  return null;
}

export function inferPathophysiology(diagnosis: string, history?: string | null): string | null {
  const text = `${diagnosis} ${history ?? ""}`.toLowerCase();
  if (/cirurg|p[oó]s.?op|operatório|p[oó]s.?cirúrg/.test(text)) return "Pós-operatório";
  if (/crôni|desgaste|artrose|degener|osteoartrite|artrit/.test(text)) return "Desgaste / Crônico";
  if (/sobrecarga|overuse|uso excessivo|repetitivo|esportivo/.test(text)) return "Sobrecarga / Irritado";
  if (/agudo|inflamat|inflama[cç][aã]|trauma|queda/.test(text)) return "Inflamatório Agudo";
  return null;
}

export function inferIrritability(painLevel: number | null): string | null {
  if (painLevel === null || painLevel === undefined) return null;
  if (painLevel > 7) return "Alta";
  if (painLevel > 4) return "Média";
  return "Baixa";
}

export function mapPatientToNeuroflux(
  patient: Patient,
  latestEval?: Evaluation | null
): { data: Partial<ClinicalData>; autoFilled: Set<keyof ClinicalData> } {
  const filled: Partial<ClinicalData> = {};
  const autoFilled = new Set<keyof ClinicalData>();

  const rawDiagnosis = latestEval?.chief_complaint?.trim() || patient.notes?.trim() || "";
  if (rawDiagnosis) {
    filled.diagnosis = rawDiagnosis;
    autoFilled.add("diagnosis");
  }

  const diagText = rawDiagnosis;

  const tissue = inferTissue(diagText);
  if (tissue) {
    filled.tissue = tissue;
    autoFilled.add("tissue");
  }

  const pathophysiology = inferPathophysiology(diagText, latestEval?.history);
  if (pathophysiology) {
    filled.pathophysiology = pathophysiology;
    autoFilled.add("pathophysiology");
  }

  const irritability = inferIrritability(latestEval?.pain_level ?? null);
  if (irritability) {
    filled.irritability = irritability;
    autoFilled.add("irritability");
  }

  return { data: filled, autoFilled };
}
