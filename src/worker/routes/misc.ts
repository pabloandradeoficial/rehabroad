import { Hono } from "hono";
import { authMiddleware, getInsertedId } from "../lib/helpers";

export const miscRouter = new Hono<{ Bindings: Env }>();

// ============================================
// SITEMAP & ROBOTS
// ============================================

const STATIC_PAGES = [
  { url: "/blog", priority: "0.9", changefreq: "daily" },
  { url: "/biblioteca", priority: "0.9", changefreq: "weekly" },
  { url: "/comparacao", priority: "0.8", changefreq: "monthly" },
  { url: "/fisioterapia-ortopedica", priority: "0.8", changefreq: "monthly" },
  { url: "/fisioterapia-esportiva", priority: "0.8", changefreq: "monthly" },
  { url: "/fisioterapia-neurologica", priority: "0.8", changefreq: "monthly" },
  { url: "/estudante", priority: "0.8", changefreq: "weekly" },
  { url: "/login", priority: "0.5", changefreq: "monthly" },
  { url: "/termos-de-uso", priority: "0.3", changefreq: "yearly" },
  { url: "/politica-de-privacidade", priority: "0.3", changefreq: "yearly" },
];

const BIBLIOTECA_SLUGS = [
  "teste-neer", "teste-hawkins-kennedy", "teste-jobe", "teste-drop-arm", "teste-speed", "teste-yergason",
  "teste-obrien", "teste-cross-body", "teste-apprehension", "teste-relocation", "teste-sulcus",
  "teste-lachman", "teste-gaveta-anterior", "teste-gaveta-posterior", "teste-pivot-shift",
  "teste-mcmurray", "teste-apley", "teste-thessaly", "teste-steinmann",
  "teste-lasegue", "teste-slump", "teste-elevacao-perna-reta", "teste-femoral-stretch",
  "teste-spurling", "teste-distracao-cervical", "teste-compressao-jackson", "teste-valsalva",
  "teste-faber-patrick", "teste-thomas", "teste-ober", "teste-trendelenburg", "teste-impacto-quadril",
  "teste-gaveta-anterior-tornozelo", "teste-tilt-talar", "teste-thompson", "teste-squeeze-tornozelo",
  "teste-phalen", "teste-tinel-punho", "teste-finkelstein", "teste-cozen",
  "cervicalgia", "hernia-cervical", "lombalgia", "hernia-lombar", "estenose-lombar",
  "sindrome-impacto", "capsulite-adesiva", "lesao-manguito", "lesao-lca", "lesao-meniscal",
  "condromalacia", "entorse-tornozelo", "tendinopatia-aquiles", "fascite-plantar",
  "impacto-femoroacetabular", "sindrome-piriforme", "epicondilite-lateral", "tunel-carpo", "dor-toracica",
  "avc-isquemico-reabilitacao", "doenca-parkinson-fisioterapia", "esclerose-multipla-reabilitacao",
  "lesao-medular-reabilitacao", "paralisia-cerebral-fisioterapia", "artrite-reumatoide-fisioterapia",
  "fibromialgia-tratamento", "espondilite-anquilosante-exercicio", "lupus-eritematoso-sistemico-exercicio",
  "dpoc-reabilitacao-pulmonar", "asma-exercicio-fisioterapia", "tendinopatia-patelar-jumpers-knee",
  "sindrome-do-estresse-tibial-medial", "lesao-muscular-isquiotibiais", "ruptura-tendao-aquiles",
  "fratura-radio-distal-reabilitacao", "fratura-quadril-idoso", "artroplastia-total-joelho-reabilitacao",
  "artroplastia-total-quadril-reabilitacao", "reconstrucao-lca-reabilitacao", "instabilidade-cronica-tornozelo",
  "sindrome-dor-regional-complexa-crps", "dor-lombar-cronica-nao-especifica", "cefaleia-tensional-cronica",
  "disfuncao-temporomandibular-dtm", "vertigem-posicional-paroxistica-benigna", "neuropatia-periferica-diabetica",
  "sindrome-fadiga-cronica-encefalomielite-mialgica", "sindrome-pos-covid-covid-longa",
  "sarcopenia-idoso", "osteoporose-exercicio-prevencao-fraturas",
  "tens-convencional", "tens-acupuntura", "fes-estimulacao-eletrica-funcional", "corrente-russa-kotz",
  "ultrassom-terapeutico", "laser-baixa-potencia", "ondas-curtas", "crioterapia-terapeutica",
  "termoterapia-calor", "terapia-combinada", "mobilizacao-maitland", "manipulacao-thrust",
  "liberacao-miofascial", "dry-needling", "kinesio-taping", "exercicio-terapeutico",
  "hidroterapia", "eletroestimulacao-transcraniana", "biofeedback", "realidade-virtual-reabilitacao",
  "avaliacao-ombro-geral", "avaliacao-instabilidade-ombro", "avaliacao-manguito-rotador",
  "avaliacao-escapula", "avaliacao-capsulite-adesiva", "avaliacao-cervical-geral",
  "avaliacao-radiculopatia-cervical", "avaliacao-cefaleia-cervicogenica", "avaliacao-instabilidade-cervical",
  "avaliacao-cervicotoracica", "avaliacao-lombar-geral", "avaliacao-radiculopatia-lombar",
  "avaliacao-instabilidade-lombar", "avaliacao-estenose-lombar", "avaliacao-sacroiliaca",
  "avaliacao-mckenzie", "avaliacao-quadril-geral", "avaliacao-impacto-femoroacetabular",
  "avaliacao-bursite-trocantérica", "avaliacao-artrose-quadril", "avaliacao-joelho-geral",
  "avaliacao-lca", "avaliacao-menisco", "avaliacao-patelofemoral", "avaliacao-artrose-joelho",
  "avaliacao-tornozelo-geral", "avaliacao-entorse-lateral", "avaliacao-fasciite-plantar",
  "avaliacao-halux", "avaliacao-mao-punho-geral", "avaliacao-tunel-carpo",
  "avaliacao-dequervain", "avaliacao-epicondilite", "avaliacao-neurologica-screening",
  "avaliacao-equilibrio", "avaliacao-marcha", "avaliacao-espasticidade",
  "avaliacao-capacidade-funcional", "avaliacao-retorno-esporte", "avaliacao-aerobica", "avaliacao-qualidade-vida"
];

const BLOG_SLUGS = [
  "prontuario-eletronico-fisioterapia-guia-completo",
  "lgpd-fisioterapia-como-adequar-clinica",
  "tens-parametros-atualizados-2025",
  "avaliacao-fisioterapeutica-dor-lombar",
  "documentacao-coffito-normas-atualizadas",
  "eletroterapia-evidencias-cientificas",
  "marketing-digital-fisioterapeutas",
  "gestao-clinica-fisioterapia",
  "fes-eletroestimulacao-funcional-parametros",
  "ultrassom-terapeutico-guia-pratico",
  "laser-terapeutico-fisioterapia",
  "corrente-russa-parametros-fortalecimento",
  "dor-lombar-tratamento-fisioterapia",
  "dor-no-ombro-causas-tratamento",
  "hernia-de-disco-fisioterapia",
  "fascite-plantar-tratamento-completo",
  "tendinite-tendoes-inflamados",
  "bursite-causas-tratamento",
  "cervicalgia-dor-pescoco",
  "condromalacia-patelar-joelho",
  "fibromialgia-fisioterapia",
  "artrose-osteoartrite-tratamento",
  "dor-no-joelho-causas-tratamento",
  "epicondilite-cotovelo-tenista",
  "ciatica-dor-nervo-ciatico",
  "escoliose-tratamento-fisioterapia",
  "exercicios-dor-lombar-guia-completo",
  "fisioterapia-respiratoria-guia",
  "reabilitacao-avc-fisioterapia",
  "fisioterapia-esportiva-lesoes",
  "entorse-tornozelo-tratamento",
  "lesao-muscular-tratamento-fisioterapia",
  "tunel-do-carpo-fisioterapia",
  "ler-dort-prevencao-tratamento",
  "fisioterapia-idosos-geriatrica",
  "parkinson-fisioterapia-exercicios",
  "cefaleia-cervicogenica-tratamento",
  "ultrassom-terapeutico-parametros",
  "laser-baixa-potencia-aplicacoes",
  "corrente-russa-fortalecimento-muscular",
  "pilates-clinico-reabilitacao",
  "terapia-manual-tecnicas",
  "liberacao-miofascial-tecnica",
  "alongamento-muscular-beneficios",
  "crioterapia-gelo-fisioterapia",
  "reabilitacao-pos-operatorio-lca",
  "fisioterapia-pelvica-assoalho",
  "hidroterapia-fisioterapia-aquatica",
  "espondilolistese-tratamento-fisioterapia",
  "ondas-de-choque-fisioterapia",
  "como-abrir-consultorio-fisioterapia",
];

miscRouter.get("/sitemap.xml", async (c) => {
  const host = c.req.header("host") || "rehabroad.com.br";
  const baseUrl = `https://${host}`;
  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const page of STATIC_PAGES) {
    xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  for (const slug of BLOG_SLUGS) {
    xml += `  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  for (const slug of BIBLIOTECA_SLUGS) {
    xml += `  <url>
    <loc>${baseUrl}/biblioteca/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
});

miscRouter.get("/robots.txt", async (c) => {
  const host = c.req.header("host") || "rehabroad.com.br";
  const baseUrl = `https://${host}`;
  const robots = `User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(robots, {
    headers: { "Content-Type": "text/plain" },
  });
});

// ============================================
// DOWNLOADABLE PDF DOCUMENTS
// ============================================

miscRouter.get("/api/downloads/modelo-avaliacao.pdf", async () => {
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Modelo de Avaliação Fisioterapêutica - REHABROAD</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #333; padding: 20mm; }
    .header { text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 15px; margin-bottom: 20px; }
    .header h1 { color: #0d9488; font-size: 18pt; margin-bottom: 5px; }
    .header p { color: #666; font-size: 10pt; }
    .section { margin-bottom: 20px; }
    .section-title { background: #0d9488; color: white; padding: 8px 12px; font-size: 12pt; font-weight: bold; margin-bottom: 10px; }
    .field { display: flex; border-bottom: 1px solid #ddd; padding: 8px 0; }
    .field-label { font-weight: bold; width: 180px; flex-shrink: 0; }
    .field-value { flex: 1; border-bottom: 1px dotted #999; min-height: 20px; }
    .field-full { border-bottom: 1px solid #ddd; padding: 8px 0; }
    .field-full .field-label { display: block; margin-bottom: 5px; }
    .field-full .field-value { display: block; min-height: 60px; border: 1px solid #ddd; padding: 5px; }
    .checkbox-group { display: flex; flex-wrap: wrap; gap: 15px; padding: 10px 0; }
    .checkbox-item { display: flex; align-items: center; gap: 5px; }
    .checkbox { width: 14px; height: 14px; border: 1px solid #333; display: inline-block; }
    .two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .footer { margin-top: 40px; text-align: center; font-size: 9pt; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; font-weight: bold; }
    @media print { body { padding: 15mm; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>FICHA DE AVALIAÇÃO FISIOTERAPÊUTICA</h1>
    <p>REHABROAD - Plataforma de Apoio Clínico | www.rehabroad.com.br</p>
  </div>
  <div class="section">
    <div class="section-title">1. IDENTIFICAÇÃO DO PACIENTE</div>
    <div class="field"><span class="field-label">Nome Completo:</span><span class="field-value"></span></div>
    <div class="two-cols">
      <div class="field"><span class="field-label">Data de Nascimento:</span><span class="field-value"></span></div>
      <div class="field"><span class="field-label">Idade:</span><span class="field-value"></span></div>
    </div>
    <div class="two-cols">
      <div class="field"><span class="field-label">Sexo:</span><span class="field-value"></span></div>
      <div class="field"><span class="field-label">Estado Civil:</span><span class="field-value"></span></div>
    </div>
    <div class="field"><span class="field-label">Profissão/Ocupação:</span><span class="field-value"></span></div>
    <div class="field"><span class="field-label">Telefone:</span><span class="field-value"></span></div>
    <div class="field"><span class="field-label">E-mail:</span><span class="field-value"></span></div>
    <div class="field"><span class="field-label">Endereço:</span><span class="field-value"></span></div>
  </div>
  <div class="section">
    <div class="section-title">2. ANAMNESE</div>
    <div class="field-full"><span class="field-label">Queixa Principal (QP):</span><div class="field-value"></div></div>
    <div class="field-full"><span class="field-label">História da Doença Atual (HDA):</span><div class="field-value" style="min-height: 80px;"></div></div>
    <div class="field-full"><span class="field-label">História Patológica Pregressa (HPP):</span><div class="field-value"></div></div>
    <div class="field"><span class="field-label">Medicamentos em uso:</span><span class="field-value"></span></div>
    <div class="field"><span class="field-label">Cirurgias anteriores:</span><span class="field-value"></span></div>
    <div class="field"><span class="field-label">Alergias:</span><span class="field-value"></span></div>
  </div>
  <div class="section">
    <div class="section-title">3. AVALIAÇÃO DA DOR (EVA 0-10)</div>
    <table>
      <tr><th>Localização</th><th>Intensidade (0-10)</th><th>Tipo</th><th>Frequência</th><th>Fatores de piora/melhora</th></tr>
      <tr><td style="height:30px;"></td><td></td><td></td><td></td><td></td></tr>
      <tr><td style="height:30px;"></td><td></td><td></td><td></td><td></td></tr>
    </table>
  </div>
  <div class="section">
    <div class="section-title">4. EXAME FÍSICO</div>
    <div class="field-full"><span class="field-label">Inspeção/Postura:</span><div class="field-value"></div></div>
    <div class="field-full"><span class="field-label">Palpação:</span><div class="field-value"></div></div>
    <div class="field-full"><span class="field-label">Amplitude de Movimento (ADM):</span><div class="field-value"></div></div>
    <div class="field-full"><span class="field-label">Força Muscular (FM):</span><div class="field-value"></div></div>
  </div>
  <div class="section">
    <div class="section-title">5. TESTES ESPECIAIS</div>
    <table>
      <tr><th>Teste</th><th>Resultado</th><th>Observações</th></tr>
      <tr><td style="height:25px;"></td><td></td><td></td></tr>
      <tr><td style="height:25px;"></td><td></td><td></td></tr>
      <tr><td style="height:25px;"></td><td></td><td></td></tr>
      <tr><td style="height:25px;"></td><td></td><td></td></tr>
    </table>
  </div>
  <div class="section">
    <div class="section-title">6. DIAGNÓSTICO CINÉTICO-FUNCIONAL</div>
    <div class="field-full"><span class="field-label">CID-10:</span><div class="field-value" style="min-height: 30px;"></div></div>
    <div class="field-full"><span class="field-label">Diagnóstico Funcional:</span><div class="field-value" style="min-height: 60px;"></div></div>
  </div>
  <div class="section">
    <div class="section-title">7. OBJETIVOS E CONDUTA</div>
    <div class="field-full"><span class="field-label">Objetivos do Tratamento:</span><div class="field-value"></div></div>
    <div class="field-full"><span class="field-label">Conduta Fisioterapêutica Proposta:</span><div class="field-value" style="min-height: 80px;"></div></div>
    <div class="two-cols">
      <div class="field"><span class="field-label">Frequência:</span><span class="field-value"></span></div>
      <div class="field"><span class="field-label">Previsão de sessões:</span><span class="field-value"></span></div>
    </div>
  </div>
  <div style="margin-top: 40px; display: flex; justify-content: space-between;">
    <div style="text-align: center; width: 45%;"><div style="border-top: 1px solid #333; padding-top: 5px;">Assinatura do Paciente</div></div>
    <div style="text-align: center; width: 45%;"><div style="border-top: 1px solid #333; padding-top: 5px;">Fisioterapeuta - CREFITO</div></div>
  </div>
  <div class="footer">
    <p>Data da Avaliação: ____/____/________ | Local: _______________________________</p>
    <p style="margin-top: 10px;">© REHABROAD - Prontuário Eletrônico para Fisioterapeutas | Documento para uso profissional</p>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": "inline; filename=modelo-avaliacao-fisioterapeutica.html",
    },
  });
});

miscRouter.get("/api/downloads/checklist-lgpd.pdf", async () => {
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Checklist LGPD para Fisioterapeutas - REHABROAD</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #333; padding: 20mm; }
    .header { text-align: center; border-bottom: 2px solid #8b5cf6; padding-bottom: 15px; margin-bottom: 25px; }
    .header h1 { color: #8b5cf6; font-size: 18pt; margin-bottom: 5px; }
    .header p { color: #666; font-size: 10pt; }
    .intro { background: #f5f3ff; border-left: 4px solid #8b5cf6; padding: 15px; margin-bottom: 25px; }
    .section { margin-bottom: 25px; }
    .section-title { color: #8b5cf6; font-size: 14pt; font-weight: bold; border-bottom: 2px solid #8b5cf6; padding-bottom: 8px; margin-bottom: 15px; }
    .checklist-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid #eee; }
    .checkbox { width: 20px; height: 20px; border: 2px solid #8b5cf6; flex-shrink: 0; margin-top: 2px; }
    .item-content { flex: 1; }
    .item-title { font-weight: bold; color: #333; margin-bottom: 3px; }
    .item-desc { font-size: 10pt; color: #666; }
    .priority-high { border-left: 3px solid #ef4444; padding-left: 10px; }
    .priority-medium { border-left: 3px solid #f59e0b; padding-left: 10px; }
    .footer { margin-top: 30px; text-align: center; font-size: 9pt; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
    .tip { background: #fef3c7; border: 1px solid #f59e0b; padding: 12px; margin: 15px 0; border-radius: 5px; font-size: 10pt; }
    @media print { body { padding: 15mm; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>✓ CHECKLIST LGPD PARA FISIOTERAPEUTAS</h1>
    <p>20 Itens Essenciais para Adequação à Lei Geral de Proteção de Dados</p>
    <p style="margin-top: 5px;">REHABROAD - www.rehabroad.com.br</p>
  </div>
  <div class="intro">
    <strong>Por que isso importa?</strong> A LGPD (Lei 13.709/2018) se aplica a TODOS os profissionais que coletam dados pessoais, incluindo fisioterapeutas. Multas podem chegar a R$ 50 milhões por infração. Use este checklist para garantir conformidade.
  </div>
  <div class="section">
    <div class="section-title">📋 DOCUMENTAÇÃO OBRIGATÓRIA</div>
    <div class="checklist-item priority-high"><div class="checkbox"></div><div class="item-content"><div class="item-title">1. Termo de Consentimento para Tratamento de Dados</div><div class="item-desc">Documento assinado pelo paciente autorizando coleta e uso de dados pessoais e de saúde.</div></div></div>
    <div class="checklist-item priority-high"><div class="checkbox"></div><div class="item-content"><div class="item-title">2. Política de Privacidade</div><div class="item-desc">Documento explicando quais dados são coletados, como são usados e por quanto tempo são armazenados.</div></div></div>
    <div class="checklist-item priority-medium"><div class="checkbox"></div><div class="item-content"><div class="item-title">3. Registro de Operações de Tratamento</div><div class="item-desc">Planilha documentando todos os processos que envolvem dados pessoais na clínica.</div></div></div>
    <div class="checklist-item"><div class="checkbox"></div><div class="item-content"><div class="item-title">4. Contrato com Operadores de Dados</div><div class="item-desc">Acordos com terceiros que acessam dados (laboratórios, sistemas, contadores).</div></div></div>
  </div>
  <div class="section">
    <div class="section-title">🔐 SEGURANÇA DA INFORMAÇÃO</div>
    <div class="checklist-item priority-high"><div class="checkbox"></div><div class="item-content"><div class="item-title">5. Prontuários em Sistema Seguro</div><div class="item-desc">Prontuários digitais devem estar em sistemas com criptografia e backup automático.</div></div></div>
    <div class="checklist-item priority-high"><div class="checkbox"></div><div class="item-content"><div class="item-title">6. Senhas Fortes e Individuais</div><div class="item-desc">Cada profissional com acesso deve ter login e senha próprios (mínimo 8 caracteres).</div></div></div>
    <div class="checklist-item priority-medium"><div class="checkbox"></div><div class="item-content"><div class="item-title">7. Backup Regular dos Dados</div><div class="item-desc">Backups automáticos diários em local seguro (nuvem criptografada).</div></div></div>
    <div class="checklist-item"><div class="checkbox"></div><div class="item-content"><div class="item-title">8. Computadores com Antivírus</div><div class="item-desc">Todos os dispositivos com acesso a dados devem ter antivírus atualizado.</div></div></div>
    <div class="checklist-item"><div class="checkbox"></div><div class="item-content"><div class="item-title">9. Wi-Fi Protegido</div><div class="item-desc">Rede da clínica com senha forte e separada da rede de visitantes.</div></div></div>
  </div>
  <div class="section">
    <div class="section-title">👥 DIREITOS DOS PACIENTES</div>
    <div class="checklist-item priority-high"><div class="checkbox"></div><div class="item-content"><div class="item-title">10. Canal para Solicitações de Dados</div><div class="item-desc">E-mail ou formulário para pacientes solicitarem acesso, correção ou exclusão de dados.</div></div></div>
    <div class="checklist-item priority-medium"><div class="checkbox"></div><div class="item-content"><div class="item-title">11. Processo de Exclusão de Dados</div><div class="item-desc">Procedimento documentado para excluir dados quando solicitado (respeitando prazo legal de 20 anos para prontuários).</div></div></div>
    <div class="checklist-item"><div class="checkbox"></div><div class="item-content"><div class="item-title">12. Fornecimento de Cópia dos Dados</div><div class="item-desc">Capacidade de fornecer cópia dos dados do paciente em formato acessível.</div></div></div>
  </div>
  <div class="section">
    <div class="section-title">🏥 OPERAÇÕES DA CLÍNICA</div>
    <div class="checklist-item priority-medium"><div class="checkbox"></div><div class="item-content"><div class="item-title">13. Treinamento da Equipe</div><div class="item-desc">Secretários e auxiliares treinados sobre sigilo e proteção de dados.</div></div></div>
    <div class="checklist-item"><div class="checkbox"></div><div class="item-content"><div class="item-title">14. Descarte Seguro de Documentos</div><div class="item-desc">Documentos físicos com dados pessoais devem ser triturados antes do descarte.</div></div></div>
    <div class="checklist-item"><div class="checkbox"></div><div class="item-content"><div class="item-title">15. Fichas de Papel em Local Trancado</div><div class="item-desc">Prontuários físicos guardados em armário com chave, acesso restrito.</div></div></div>
    <div class="checklist-item"><div class="checkbox"></div><div class="item-content"><div class="item-title">16. Não Compartilhar Dados por WhatsApp Pessoal</div><div class="item-desc">Usar apenas canais oficiais e seguros para compartilhar informações de pacientes.</div></div></div>
  </div>
  <div class="section">
    <div class="section-title">⚠️ RESPOSTA A INCIDENTES</div>
    <div class="checklist-item priority-high"><div class="checkbox"></div><div class="item-content"><div class="item-title">17. Plano de Resposta a Vazamentos</div><div class="item-desc">Procedimento documentado para agir em caso de vazamento de dados.</div></div></div>
    <div class="checklist-item priority-medium"><div class="checkbox"></div><div class="item-content"><div class="item-title">18. Notificação à ANPD</div><div class="item-desc">Conhecimento de que vazamentos graves devem ser notificados à Autoridade Nacional.</div></div></div>
    <div class="checklist-item"><div class="checkbox"></div><div class="item-content"><div class="item-title">19. Registro de Incidentes</div><div class="item-desc">Documentar qualquer incidente de segurança, mesmo os menores.</div></div></div>
    <div class="checklist-item"><div class="checkbox"></div><div class="item-content"><div class="item-title">20. Encarregado de Dados (DPO)</div><div class="item-desc">Definir responsável pelo tratamento de dados (pode ser o próprio profissional em clínicas pequenas).</div></div></div>
  </div>
  <div class="tip"><strong>💡 DICA:</strong> O REHABROAD já inclui recursos de conformidade LGPD: criptografia, backup automático, termos de uso, controle de acesso e auditoria. Simplifique sua adequação usando um sistema preparado.</div>
  <div style="background: #fee2e2; border: 1px solid #ef4444; padding: 12px; margin: 15px 0; border-radius: 5px;"><strong>⚠️ ATENÇÃO:</strong> Este checklist é informativo e não substitui consultoria jurídica especializada. Para adequação completa, consulte um advogado especializado em LGPD.</div>
  <div class="footer">
    <p>Seu progresso: _____ / 20 itens completos | Data da revisão: ____/____/________</p>
    <p style="margin-top: 10px;">© REHABROAD - Prontuário Eletrônico para Fisioterapeutas | Baixe mais materiais em rehabroad.com.br</p>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": "inline; filename=checklist-lgpd-fisioterapia.html",
    },
  });
});

miscRouter.get("/api/downloads/guia-tens.pdf", async () => {
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Guia Rápido de Parâmetros TENS - REHABROAD</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.4; color: #333; padding: 15mm; }
    .header { text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 12px; margin-bottom: 15px; }
    .header h1 { color: #f59e0b; font-size: 16pt; margin-bottom: 5px; }
    .header p { color: #666; font-size: 9pt; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 9pt; }
    th { background: #f59e0b; color: white; padding: 8px 6px; text-align: left; font-weight: bold; }
    td { padding: 6px; border: 1px solid #ddd; vertical-align: top; }
    tr:nth-child(even) { background: #fffbeb; }
    .condition { font-weight: bold; color: #92400e; }
    .params { font-family: monospace; background: #f5f5f5; padding: 2px 5px; border-radius: 3px; }
    .section-title { background: #fef3c7; color: #92400e; font-size: 11pt; font-weight: bold; padding: 8px; margin: 15px 0 10px 0; }
    .legend { background: #f5f5f5; padding: 10px; margin-bottom: 15px; font-size: 9pt; }
    .legend-title { font-weight: bold; margin-bottom: 5px; }
    .footer { text-align: center; font-size: 8pt; color: #666; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 15px; }
    .evidence { font-size: 8pt; color: #059669; }
    @media print { body { padding: 10mm; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>⚡ GUIA RÁPIDO DE PARÂMETROS TENS</h1>
    <p>Tabela de Referência Baseada em Evidências | REHABROAD - www.rehabroad.com.br</p>
  </div>
  <div class="legend">
    <div class="legend-title">LEGENDA:</div>
    <strong>F</strong> = Frequência (Hz) | <strong>T</strong> = Largura de Pulso (μs) | <strong>I</strong> = Intensidade | <strong>D</strong> = Duração
    <br><strong>Conv</strong> = Convencional (alta freq.) | <strong>Acup</strong> = Acupuntura (baixa freq.) | <strong>Burst</strong> = Trens de pulso
  </div>
  <div class="section-title">🦴 CONDIÇÕES MUSCULOESQUELÉTICAS</div>
  <table>
    <tr><th style="width: 22%;">Condição</th><th style="width: 12%;">Modo</th><th style="width: 28%;">Parâmetros</th><th style="width: 10%;">Duração</th><th style="width: 28%;">Observações</th></tr>
    <tr><td class="condition">Lombalgia Aguda</td><td>Conv</td><td><span class="params">F: 80-100Hz | T: 100-200μs</span></td><td>20-30min</td><td>Eletrodos paravertebrais L3-S1 <span class="evidence">[Nível A]</span></td></tr>
    <tr><td class="condition">Lombalgia Crônica</td><td>Acup/Burst</td><td><span class="params">F: 2-4Hz | T: 200-250μs</span></td><td>30-45min</td><td>Alternar com Conv; pontos gatilho <span class="evidence">[Nível A]</span></td></tr>
    <tr><td class="condition">Cervicalgia</td><td>Conv</td><td><span class="params">F: 80-100Hz | T: 100-150μs</span></td><td>20min</td><td>Cuidado com artéria carótida; não aplicar anterior</td></tr>
    <tr><td class="condition">Osteoartrose Joelho</td><td>Conv</td><td><span class="params">F: 80-100Hz | T: 100-200μs</span></td><td>30-60min</td><td>Eletrodos peripatelares <span class="evidence">[Nível A]</span></td></tr>
    <tr><td class="condition">Síndrome Miofascial</td><td>Acup</td><td><span class="params">F: 2-10Hz | T: 200-300μs</span></td><td>20-30min</td><td>Diretamente sobre pontos gatilho</td></tr>
    <tr><td class="condition">Epicondilite Lateral</td><td>Conv</td><td><span class="params">F: 80-100Hz | T: 100-150μs</span></td><td>20min</td><td>Eletrodos cruzados sobre epicôndilo</td></tr>
    <tr><td class="condition">Fascite Plantar</td><td>Conv</td><td><span class="params">F: 80-100Hz | T: 150-200μs</span></td><td>20-30min</td><td>Eletrodos na fáscia e calcanhar</td></tr>
  </table>
  <div class="section-title">🔌 CONDIÇÕES NEUROLÓGICAS</div>
  <table>
    <tr><th style="width: 22%;">Condição</th><th style="width: 12%;">Modo</th><th style="width: 28%;">Parâmetros</th><th style="width: 10%;">Duração</th><th style="width: 28%;">Observações</th></tr>
    <tr><td class="condition">Neuropatia Diabética</td><td>Conv</td><td><span class="params">F: 50-80Hz | T: 200μs</span></td><td>30min</td><td>Verificar sensibilidade primeiro <span class="evidence">[Nível B]</span></td></tr>
    <tr><td class="condition">Síndrome Túnel Carpal</td><td>Conv</td><td><span class="params">F: 80-100Hz | T: 100-150μs</span></td><td>20min</td><td>Eletrodos palmar e dorsal do punho</td></tr>
    <tr><td class="condition">Dor Pós-AVC</td><td>Conv/Acup</td><td><span class="params">F: Variar | T: 150-250μs</span></td><td>30min</td><td>Ajustar conforme resposta; cuidado espasticidade</td></tr>
    <tr><td class="condition">Ciatalgia</td><td>Burst</td><td><span class="params">F: 2Hz burst | T: 200μs</span></td><td>30-45min</td><td>Eletrodos ao longo do trajeto do nervo</td></tr>
  </table>
  <div class="section-title">🏃 PÓS-OPERATÓRIO E ESPORTE</div>
  <table>
    <tr><th style="width: 22%;">Condição</th><th style="width: 12%;">Modo</th><th style="width: 28%;">Parâmetros</th><th style="width: 10%;">Duração</th><th style="width: 28%;">Observações</th></tr>
    <tr><td class="condition">Pós-op ATJ/ATQ</td><td>Conv</td><td><span class="params">F: 80-100Hz | T: 100-200μs</span></td><td>30-60min</td><td>Iniciar 24h pós; reduz consumo analgésicos <span class="evidence">[Nível A]</span></td></tr>
    <tr><td class="condition">Pós-op LCA</td><td>Conv</td><td><span class="params">F: 80-100Hz | T: 150μs</span></td><td>20-30min</td><td>Associar com crioterapia nas primeiras 72h</td></tr>
    <tr><td class="condition">DOMS (dor muscular tardia)</td><td>Acup</td><td><span class="params">F: 2-4Hz | T: 200-250μs</span></td><td>20min</td><td>Aplicar 24-48h após exercício</td></tr>
    <tr><td class="condition">Contusão/Entorse</td><td>Conv</td><td><span class="params">F: 100Hz | T: 100μs</span></td><td>20min</td><td>Fase aguda: associar crioterapia</td></tr>
  </table>
  <div style="margin-top: 15px; padding: 10px; background: #ecfdf5; border: 1px solid #059669; font-size: 9pt;">
    <strong>📊 NÍVEIS DE EVIDÊNCIA:</strong>
    <span class="evidence">[Nível A]</span> = Evidência forte (múltiplos RCTs) |
    <span class="evidence">[Nível B]</span> = Evidência moderada |
    Sem marcação = Baseado em prática clínica e consenso de especialistas
  </div>
  <div style="margin-top: 10px; padding: 10px; background: #fef2f2; border: 1px solid #ef4444; font-size: 9pt;">
    <strong>⚠️ CONTRAINDICAÇÕES:</strong> Marcapasso, gestação (região abdominal/lombar), trombose ativa, área cardíaca, pele lesionada, região cervical anterior (seio carotídeo), tumores malignos, infecção local.
  </div>
  <div style="margin-top: 10px; padding: 10px; background: #f5f5f5; border: 1px solid #ddd; font-size: 9pt;">
    <strong>💡 DICAS DE APLICAÇÃO:</strong>
    <ul style="margin-left: 20px; margin-top: 5px;">
      <li>Intensidade: sensação forte mas confortável (parestesia sem contração em Conv)</li>
      <li>Posicionamento: cruzar eletrodos sobre área dolorosa ou ao longo do dermátomo</li>
      <li>Pele: limpar com álcool 70% antes; verificar gel dos eletrodos</li>
    </ul>
  </div>
  <div class="footer">
    <p>© REHABROAD - Plataforma de Apoio Clínico para Fisioterapeutas</p>
    <p>Use o módulo NeuroFlux no REHABROAD para recomendações personalizadas de eletroterapia com base em evidências.</p>
    <p style="margin-top: 5px;">Este guia é referência rápida e não substitui avaliação clínica individualizada.</p>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": "inline; filename=guia-parametros-tens.html",
    },
  });
});

// ============================================
// CONTATO / SUPORTE API
// ============================================

miscRouter.post("/api/contato", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  if (!body.name || !body.email || !body.subject || !body.message) {
    return c.json({ error: "Todos os campos são obrigatórios" }, 400);
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO support_messages (user_id, name, email, subject, message)
     VALUES (?, ?, ?, ?, ?)
     RETURNING *`
  ).bind(
    user!.id,
    body.name,
    body.email,
    body.subject,
    body.message
  ).first();

  return c.json(result, 201);
});

miscRouter.post("/api/leads", async (c) => {
  const body = await c.req.json<{ name: string; email: string; source?: string }>();

  if (!body.name || !body.email) {
    return c.json({ error: "Nome e email são obrigatórios" }, 400);
  }

  const existing = await c.env.DB.prepare(
    "SELECT id FROM leads WHERE email = ?"
  ).bind(body.email).first();

  if (existing) {
    return c.json({ success: true, message: "Lead já cadastrado" });
  }

  const result = await c.env.DB.prepare(
    "INSERT INTO leads (name, email, source, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))"
  ).bind(body.name, body.email, body.source || 'website').run();

  return c.json({ success: true, id: getInsertedId(result) }, 201);
});

miscRouter.post("/api/track-view", async (c) => {
  const body = await c.req.json<{ page?: string; visitorId?: string }>().catch(() => ({ page: 'home', visitorId: null as string | null }));

  await c.env.DB.prepare(
    "INSERT INTO site_views (page, visitor_id, created_at, updated_at) VALUES (?, ?, datetime('now'), datetime('now'))"
  ).bind(body.page || 'home', body.visitorId || null).run();

  return c.json({ success: true });
});
