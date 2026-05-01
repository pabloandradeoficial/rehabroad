import { testesOrtopedicos } from './testesOrtopedicos';
import { patologias } from './patologias';
import { patologiasAdicionais } from './patologiasAdicionais';
import { recursosTerapeuticos } from './recursosTerapeuticos';
import { avaliacaoClinica } from './avaliacaoClinica';
import { ClinicalPage, categories, CategoryInfo } from './types';

export { categories };
export type { ClinicalPage, CategoryInfo };

// All clinical pages
const allClinicalPages: ClinicalPage[] = [
  ...testesOrtopedicos,
  ...patologias,
  ...patologiasAdicionais,
  ...recursosTerapeuticos,
  ...avaliacaoClinica,
];

// Get pages by category
export function getPagesByCategory(category: string): ClinicalPage[] {
  return allClinicalPages.filter(page => page.category === category);
}

// Get page by slug
export function getPageBySlug(slug: string): ClinicalPage | undefined {
  return allClinicalPages.find(page => page.slug === slug);
}

// Search pages
export function searchPages(query: string): ClinicalPage[] {
  const q = query.toLowerCase();
  return allClinicalPages.filter(page => 
    page.title.toLowerCase().includes(q) ||
    page.keywords.some(k => k.toLowerCase().includes(q)) ||
    page.introduction.toLowerCase().includes(q)
  );
}
