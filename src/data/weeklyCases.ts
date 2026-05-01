// Casos Clínicos da Semana - Rotação semanal baseada na data

import { ClinicalCase, clinicalCases } from './clinicalCases';

export interface WeeklyCase {
  weekNumber: number;
  year: number;
  caseId: string;
  publishDate: string;
}

// Função para obter o número da semana do ano
export function getWeekNumber(date: Date = new Date()): { week: number; year: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { week: weekNo, year: d.getUTCFullYear() };
}

// Função para obter o caso da semana atual
function getWeeklyCase(): ClinicalCase {
  const { week, year } = getWeekNumber();
  // Usa uma combinação de semana e ano para selecionar o caso
  // Isso garante rotação consistente e previsível
  const index = ((year * 52) + week) % clinicalCases.length;
  return clinicalCases[index];
}

// Função para obter a data de início da semana atual
export function getWeekStartDate(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Ajusta para segunda-feira
  return new Date(now.setDate(diff));
}

// Função para obter a data de fim da semana atual
export function getWeekEndDate(): Date {
  const start = getWeekStartDate();
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
}

// Formata a data no padrão brasileiro
export function formatDateBR(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

// Casos destacados para semanas específicas (opcional)
// Permite curadoria manual de casos especiais
const featuredWeeklyCases: WeeklyCase[] = [
  // Exemplo: caso específico para a primeira semana de 2025
  // { weekNumber: 1, year: 2025, caseId: 'caso-001', publishDate: '2025-01-06' }
];

// Verifica se há um caso curado para a semana atual
function getCuratedWeeklyCase(): ClinicalCase | null {
  const { week, year } = getWeekNumber();
  const featured = featuredWeeklyCases.find(
    c => c.weekNumber === week && c.year === year
  );
  if (featured) {
    return clinicalCases.find(c => c.id === featured.caseId) || null;
  }
  return null;
}

// Função principal: retorna o caso da semana (curado ou automático)
export function getCurrentWeeklyCase(): ClinicalCase {
  return getCuratedWeeklyCase() || getWeeklyCase();
}
