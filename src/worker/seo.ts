// Server-side SEO meta tag injection for Googlebot
// This runs on Cloudflare Worker, injecting correct meta tags before serving HTML

export interface SEOData {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonical: string;
  schema?: object;
}

const BASE_URL = "https://rehabroad.com.br";
const DEFAULT_OG_IMAGE = "https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/og-image.png";

// SEO data for static routes
const ROUTE_SEO: Record<string, SEOData> = {
  "/": {
    title: "Rehabroad — IA Diagnóstica para Fisioterapeutas | Prontuário + Laudo PDF",
    description: "Software de fisioterapia com IA que sugere hipóteses diagnósticas em tempo real. Prontuário eletrônico, alertas de piora e laudo PDF profissional. Teste grátis por 30 dias.",
    ogTitle: "Rehabroad — Copiloto Clínico para Fisioterapeutas",
    ogDescription: "IA que analisa achados clínicos e sugere hipóteses diagnósticas. Usado por +500 fisioterapeutas no Brasil.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: BASE_URL,
  },
  "/comparacao": {
    title: "Planilhas vs REHABROAD — Comparação de Software para Fisioterapia",
    description: "Compare planilhas Excel com o REHABROAD: prontuário eletrônico, laudos PDF automáticos, apoio diagnóstico com IA. Veja por que +500 fisioterapeutas migraram.",
    ogTitle: "Planilhas vs REHABROAD — Qual é Melhor para Fisioterapeutas?",
    ogDescription: "Comparação completa entre planilhas e software de fisioterapia profissional. Prontuário, laudos, IA diagnóstica.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/comparacao`,
  },
  "/blog": {
    title: "Blog Fisioterapia — Artigos Clínicos e Protocolos | REHABROAD",
    description: "Artigos sobre fisioterapia baseados em evidência: testes ortopédicos, protocolos de tratamento, parâmetros de eletroterapia, LGPD na saúde.",
    ogTitle: "Blog Fisioterapia — REHABROAD",
    ogDescription: "Artigos clínicos e protocolos de fisioterapia baseados em evidência científica.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/blog`,
  },
  "/biblioteca-clinica": {
    title: "Biblioteca Clínica Fisioterapia — Testes, Patologias, Recursos | REHABROAD",
    description: "Biblioteca clínica gratuita para fisioterapeutas: +40 testes ortopédicos, +60 patologias, recursos terapêuticos com evidência científica.",
    ogTitle: "Biblioteca Clínica — REHABROAD",
    ogDescription: "+100 referências clínicas gratuitas: testes ortopédicos, patologias, recursos terapêuticos.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/biblioteca-clinica`,
  },
  "/estudante": {
    title: "Modo Estudante Fisioterapia — Casos Clínicos e Módulos Gratuitos | REHABROAD",
    description: "Plataforma gratuita para estudantes de fisioterapia: casos clínicos simulados, testes ortopédicos, treino diagnóstico diário, ranking nacional.",
    ogTitle: "Modo Estudante — REHABROAD",
    ogDescription: "Aprenda fisioterapia com casos clínicos reais, testes ortopédicos e treino diário. 100% gratuito.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/estudante`,
  },
  "/login": {
    title: "Entrar — REHABROAD | Software para Fisioterapia",
    description: "Acesse sua conta REHABROAD. Prontuário eletrônico, laudos PDF e apoio diagnóstico para fisioterapeutas.",
    ogTitle: "Entrar — REHABROAD",
    ogDescription: "Acesse sua conta e gerencie seus pacientes com prontuário eletrônico inteligente.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/login`,
  },
};

// Blog article SEO (dynamic)
const BLOG_ARTICLES: Record<string, { title: string; description: string }> = {
  "teste-lachman-joelho": {
    title: "Teste de Lachman — Avaliação do LCA | Guia Completo Fisioterapia",
    description: "Como realizar o teste de Lachman para avaliação do ligamento cruzado anterior. Técnica, sensibilidade, especificidade e interpretação clínica.",
  },
  "parametros-tens-dor-lombar": {
    title: "Parâmetros TENS para Dor Lombar — Protocolo Baseado em Evidência",
    description: "Parâmetros ideais de TENS para lombalgia: frequência, intensidade, duração e posicionamento dos eletrodos com base em evidência científica.",
  },
  "avaliacao-ombro-fisioterapia": {
    title: "Avaliação do Ombro na Fisioterapia — Testes Especiais e Diagnóstico",
    description: "Guia completo de avaliação do ombro: testes de Neer, Hawkins, Speed, Jobe. Diagnóstico diferencial de lesões do manguito rotador.",
  },
  "lgpd-clinica-fisioterapia": {
    title: "LGPD na Fisioterapia — Conformidade e Proteção de Dados",
    description: "Como adequar sua clínica de fisioterapia à LGPD: prontuário eletrônico seguro, consentimento informado, direitos do paciente.",
  },
};

// Biblioteca Clínica dynamic SEO
const BIBLIOTECA_CATEGORIES: Record<string, { title: string; description: string }> = {
  "testes-ortopedicos": {
    title: "Testes Ortopédicos Fisioterapia — Biblioteca Clínica | REHABROAD",
    description: "Biblioteca de testes ortopédicos para fisioterapeutas: técnica, interpretação, sensibilidade e especificidade de cada teste.",
  },
  "patologias": {
    title: "Patologias Musculoesqueléticas — Biblioteca Clínica | REHABROAD",
    description: "Biblioteca de patologias para fisioterapeutas: etiologia, quadro clínico, diagnóstico diferencial e tratamento baseado em evidência.",
  },
  "recursos-terapeuticos": {
    title: "Recursos Terapêuticos Fisioterapia — Biblioteca Clínica | REHABROAD",
    description: "Guia de recursos terapêuticos: eletroterapia, termoterapia, cinesioterapia com parâmetros e indicações clínicas.",
  },
  "avaliacao-clinica": {
    title: "Avaliação Clínica Fisioterapia — Biblioteca Clínica | REHABROAD",
    description: "Protocolos de avaliação fisioterapêutica por região corporal: anamnese, inspeção, palpação, testes especiais.",
  },
};

export function getSEOForRoute(pathname: string): SEOData | null {
  // Check exact match first
  if (ROUTE_SEO[pathname]) {
    return ROUTE_SEO[pathname];
  }

  // Blog articles
  if (pathname.startsWith("/blog/")) {
    const slug = pathname.replace("/blog/", "");
    const article = BLOG_ARTICLES[slug];
    if (article) {
      return {
        title: article.title,
        description: article.description,
        ogTitle: article.title,
        ogDescription: article.description,
        ogImage: DEFAULT_OG_IMAGE,
        canonical: `${BASE_URL}${pathname}`,
      };
    }
    // Generic blog article fallback
    return {
      title: "Artigo Fisioterapia | Blog REHABROAD",
      description: "Artigo sobre fisioterapia baseado em evidência científica.",
      ogTitle: "Artigo Fisioterapia | Blog REHABROAD",
      ogDescription: "Conteúdo clínico para fisioterapeutas.",
      ogImage: DEFAULT_OG_IMAGE,
      canonical: `${BASE_URL}${pathname}`,
    };
  }

  // Biblioteca categories
  if (pathname.startsWith("/biblioteca-clinica/")) {
    const slug = pathname.replace("/biblioteca-clinica/", "");
    const category = BIBLIOTECA_CATEGORIES[slug];
    if (category) {
      return {
        title: category.title,
        description: category.description,
        ogTitle: category.title,
        ogDescription: category.description,
        ogImage: DEFAULT_OG_IMAGE,
        canonical: `${BASE_URL}${pathname}`,
      };
    }
    // Generic biblioteca item fallback
    return {
      title: "Biblioteca Clínica Fisioterapia | REHABROAD",
      description: "Referência clínica para fisioterapeutas com evidência científica.",
      ogTitle: "Biblioteca Clínica | REHABROAD",
      ogDescription: "Conteúdo clínico baseado em evidência.",
      ogImage: DEFAULT_OG_IMAGE,
      canonical: `${BASE_URL}${pathname}`,
    };
  }

  return null;
}

export function injectSEOTags(html: string, seo: SEOData): string {
  // Replace title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${escapeHtml(seo.title)}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"\/>/,
    `<meta name="description" content="${escapeHtml(seo.description)}"/>`
  );

  // Replace Open Graph tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\/>/,
    `<meta property="og:title" content="${escapeHtml(seo.ogTitle)}"/>`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\/>/,
    `<meta property="og:description" content="${escapeHtml(seo.ogDescription)}"/>`
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*"[^/]*\/>/,
    `<meta property="og:image" content="${seo.ogImage}"/>`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\/>/,
    `<meta property="og:url" content="${seo.canonical}"/>`
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta property="twitter:title" content="[^"]*"\/>/,
    `<meta property="twitter:title" content="${escapeHtml(seo.ogTitle)}"/>`
  );
  html = html.replace(
    /<meta property="twitter:description" content="[^"]*"\/>/,
    `<meta property="twitter:description" content="${escapeHtml(seo.ogDescription)}"/>`
  );

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\/>/,
    `<link rel="canonical" href="${seo.canonical}"/>`
  );

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
