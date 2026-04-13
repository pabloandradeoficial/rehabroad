# TODOS — Rehabroad

> Gerado via /plan-design-review em 2026-04-13. Ordenado por impacto.

---

## Design — Alta Prioridade

### TODO-D1: Empty state na lista de pacientes
**O que:** Criar componente `EmptyPatientState` em `src/react-app/components/`.
**Por que:** O primeiro contato do usuário novo com o app é uma tela vazia sem direção. Ativação depende de adicionar o primeiro paciente.
**Copy:** "Seu primeiro paciente está a 30 segundos de distância" + botão `+ Adicionar Primeiro Paciente` (teal-500, 48px de altura).
**Como:** Adicionar condicional no `Painel.tsx` quando `patients.length === 0` e onboarding completo.
**Esforço:** ~30min
**Depende de:** Nada

---

### TODO-D2: Error states em fluxos clínicos críticos
**O que:** Fallback manual no Scribe + retry no Rehab Friend.
**Por que:** Erros em fluxos clínicos destroem confiança. Um fisioterapeuta que perde uma evolução gerada não volta.
**Scribe:** Se API falha após gravação, mostrar textarea com o transcript bruto + "Salvar manualmente".
**Rehab Friend:** Toast "Não foi possível conectar. Tente novamente." com botão Retry visível no chat.
**Arquivo:** `ScribeButton.tsx`, `RehabFriendChat.tsx`
**Esforço:** ~1-2h
**Depende de:** Nada

---

### TODO-D3: Remover gradientes roxo/violeta dos feature cards
**O que:** Substituir os 3 cards de `FEATURES_TOP` em `Home.tsx` por dark cards (#111827) com accent teal.
**Por que:** Roxo/violeta é o padrão #1 de AI slop e destrói a identidade teal do produto.
**Novo visual:** `bg-[#111827] border border-white/8` + ícone SVG customizado branco 32px.
**Arquivo:** `src/react-app/pages/Home.tsx` — array `FEATURES_TOP`
**Esforço:** ~1h (incluindo criar 3 SVGs simples)
**Depende de:** TODO-D4

---

### TODO-D4: Substituir emojis por ícones SVG customizados nos feature cards
**O que:** Remover 🤖 🎙️ 🏠 dos cards principais. Criar 3 SVGs:
- Rehab Friend: ícone de pulse wave + chat bubble
- Scribe: ícone de microfone com ondas
- HEP: ícone de casa + coração (home exercise)
**Por que:** Emojis rendem inconsistentemente entre plataformas e não carregam identidade.
**Arquivo:** Criar `src/react-app/components/icons/` com os 3 SVGs
**Esforço:** ~1-2h
**Depende de:** Nada

---

### TODO-D5: Reordenar seções da landing page
**O que:** Mover "Para Quem É" para logo após o Hero. Unificar `FEATURES_TOP` e `FEATURES_BOTTOM`.
**Por que:** Qualificar o visitante antes de mostrar features e preço aumenta conversão.
**Nova ordem:** Hero → Para Quem É → Problemas → Features (unificadas) → Steps → Depoimentos → Preços → FAQ → CTA
**Arquivo:** `src/react-app/pages/Home.tsx`
**Esforço:** ~45min
**Depende de:** Nada

---

## Design — Média Prioridade

### TODO-D6: Adicionar DM Sans como display font na landing
**O que:** Importar DM Sans via Google Fonts no `index.html`. Adicionar `fontFamily.display` no `tailwind.config.js`. Aplicar `font-display` nos headlines do `Home.tsx`.
**Por que:** Inter é funcional mas sem caráter. DM Sans dá personalidade à landing sem comprometer legibilidade no app.
**Esforço:** ~30min
**Depende de:** Nada

---

### TODO-D7: Substituir testimonials border-l-4 por quote em bloco
**O que:** Redesenhar seção de depoimentos em `Home.tsx`. Remover `border-l-4 bg-gray-50 rounded-r-2xl`. Usar quote em bloco: texto 24px peso 400 + avatar + nome abaixo.
**Por que:** `border-l-4` colorido é o padrão #8 de AI slop.
**Esforço:** ~30min
**Depende de:** Nada

---

### TODO-D8: Bottom navigation bar no mobile
**O que:** Criar componente `BottomNav` com 4 itens (Painel, Pacientes, Agenda, Mais) + FAB central. Exibir apenas em `< 768px`.
**Por que:** Fisioterapeuta usa o app com uma mão livre entre sessões. Bottom nav é o padrão nativo correto.
**Arquivo:** `src/react-app/components/layout/BottomNav.tsx` + integrar no `DashboardLayout`
**Esforço:** ~2-3h
**Depende de:** Nada

---

### TODO-D9: Scribe first-use celebration
**O que:** Na primeira vez que o Scribe gera uma evolução com sucesso, exibir confetti sutil (1.5s) + toast "Você acabou de economizar ~8 minutos."
**Por que:** Cria memória emocional positiva que gera retenção (Norman — nível reflective).
**Flag:** `localStorage.getItem('scribe_first_success')` — nunca repetir após a primeira vez.
**Arquivo:** `ScribeButton.tsx`
**Esforço:** ~1h
**Depende de:** Nada

---

### TODO-D10: Adicionar screenshot do app no hero da landing
**O que:** Tirar screenshot do Painel com dados fictícios/anonimizados. Criar frame de browser simples em SVG. Posicionar à direita do hero em `Home.tsx`.
**Por que:** Hero só de texto não mostra o produto. Visitante quer ver antes de clicar.
**Esforço:** ~1h (captura + frame SVG + responsive)
**Depende de:** Dados fictícios no Painel

---

### TODO-D11: Hierarquia do Painel (usuário recorrente)
**O que:** Reordenar o Painel para mostrar pacientes de hoje como primeiro elemento, com alertas clínicos em segundo lugar.
**Por que:** A hierarquia atual serve o usuário novo (onboarding checklist). O usuário recorrente precisa ver seus pacientes do dia primeiro.
**Arquivo:** `src/react-app/pages/dashboard/Painel.tsx`
**Esforço:** ~1h
**Depende de:** Campo de data na agenda de pacientes

---

## Acessibilidade

### TODO-D12: Auditoria de contraste teal-500 → teal-600 em texto
**O que:** Buscar todas as ocorrências de `text-teal-500` no codebase e substituir por `text-teal-600`.
**Por que:** teal-500 sobre branco = 3.1:1 (FALHA WCAG AA para texto normal). teal-600 = 4.5:1 (PASSA).
**Comando de busca:** `grep -r "text-teal-500" src/`
**Esforço:** ~30min
**Depende de:** Nada

---

## Engenharia — Alta Prioridade

### TODO-E1: Validação com Zod em POST/PUT de pacientes
**O que:** Adicionar schema Zod em `src/worker/routes/patients.ts` para validar body em POST e PUT. Usar `@hono/zod-validator` (já instalado).
**Por que:** `body.name` e outros campos são inseridos no D1 sem qualquer validação. Qualquer string chega direto no banco.
**Schema mínimo:** `name` (string, 2-100 chars), `email` (email opcional), `phone` (string opcional, max 20).
**Arquivo:** `src/worker/routes/patients.ts`
**Esforço:** ~45min
**Depende de:** Nada

---

### TODO-E2: Validação de tamanho de áudio no Scribe antes do atob()
**O que:** Checar `audioBase64.length` antes de chamar `atob()` em `src/worker/routes/scribe.ts`. Rejeitar com 413 se exceder ~10MB base64 (~7.5MB de áudio).
**Por que:** `atob()` é síncrono no Worker. Um arquivo grande bloqueia a CPU e pode estourar o limite de tempo do Cloudflare Worker (50ms CPU time no free tier).
**Fix:** `if (audioBase64.length > 10_000_000) return c.json({ error: 'Arquivo muito grande' }, 413)`
**Arquivo:** `src/worker/routes/scribe.ts`
**Esforço:** ~15min
**Depende de:** Nada

---

### TODO-E3: Mover email de admin para variável de ambiente
**O que:** Remover `"pabloandradeoficial@gmail.com"` hardcoded de `helpers.ts:29`, `subscription.ts:38` e `subscription.ts:120`. Usar `c.env.OWNER_ADMIN_EMAIL`.
**Por que:** Email hardcoded no bundle significa trocar o email = novo deploy. Também expõe o email pessoal no repositório.
**Como:** Adicionar `OWNER_ADMIN_EMAIL` no `wrangler.toml` (vars) e no Cloudflare dashboard (secrets).
**Arquivos:** `src/worker/lib/helpers.ts`, `src/worker/routes/subscription.ts`
**Esforço:** ~20min
**Depende de:** Nada

---

## Engenharia — Média Prioridade

### TODO-E4: Corrigir N+1 no endpoint de stats do dashboard
**O que:** Refatorar `src/worker/routes/dashboard.ts` para não buscar todos os IDs de pacientes em memória. Consolidar em queries SQL com subselects.
**Por que:** Hoje: `SELECT id FROM patients` → array de IDs → queries separadas. Com 200 pacientes = 200+ roundtrips D1 por carregamento do painel.
**Fix:** Single query com subqueries: `SELECT (SELECT COUNT(*) FROM patients WHERE user_id=?) as patients, (SELECT COUNT(*) FROM sessions WHERE ...) as sessions`
**Arquivo:** `src/worker/routes/dashboard.ts`
**Esforço:** ~1h
**Depende de:** Nada

---

### TODO-E5: Paginação no GET /patients
**O que:** Adicionar `?page=1&limit=20` em `src/worker/routes/patients.ts` GET. Adicionar `LIMIT ? OFFSET ?` na query SQL.
**Por que:** `SELECT * FROM patients WHERE user_id = ?` sem LIMIT retorna todos os pacientes de uma vez. Com 100+ pacientes, payload grande + resposta lenta.
**Response:** Incluir `{ data: [...], total, page, totalPages }` no retorno.
**Arquivo:** `src/worker/routes/patients.ts`
**Esforço:** ~1h
**Depende de:** Nada

---

### TODO-E6: Corrigir tipagem any no worker (ESLint)
**O que:** Substituir `any` explícitos nos arquivos de rotas do worker por tipos concretos. Priorizar `patients.ts`, `dashboard.ts`, `scribe.ts`.
**Por que:** `MiddlewareHandler<{Bindings: Env}>` já está disponível no Hono. Usar `any` esconde bugs de tipo e impede autocomplete correto.
**Esforço:** ~1-2h
**Depende de:** Nada

---

### TODO-E8: Corrigir open redirect em getAuthCallbackUrl
**O que:** Em `src/worker/lib/helpers.ts:175`, a função aceita `?redirectTo=https://qualquersite.com` e valida apenas o protocolo (https/http), não o domínio.
**Por que:** Permite phishing: atacante envia `rehabroad.com.br/api/oauth/google/redirect_url?redirectTo=https://evil.com` e o usuário é redirecionado para o domínio malicioso após OAuth.
**Fix:** Validar que o redirectUrl.hostname termina em `rehabroad.com.br` antes de aceitar.
```typescript
if (redirectUrl.hostname !== 'rehabroad.com.br' && !redirectUrl.hostname.endsWith('.rehabroad.com.br')) {
  // ignorar e usar callback padrão
}
```
**Arquivo:** `src/worker/lib/helpers.ts:175`
**Esforço:** ~15min
**Depende de:** Nada

---

### TODO-E9: Adicionar Content-Security-Policy no netlify.toml
**O que:** Adicionar header `Content-Security-Policy` ao bloco `[[headers]]` em `netlify.toml`.
**Por que:** Sem CSP, qualquer script injetado via XSS pode roubar cookies de sessão ou fazer chamadas externas. Netlify já serve todos os assets — CSP é trivial de adicionar.
**Valor mínimo:** `"default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co https://api.openai.com; img-src 'self' data: blob: https:"`
**Arquivo:** `netlify.toml`
**Esforço:** ~20min
**Depende de:** Nada

---

### TODO-E7: Ampliar cobertura E2E para fluxos clínicos críticos
**O que:** Adicionar testes Playwright para: criação de paciente, geração de evolução com Scribe, envio de mensagem no Rehab Friend, prescrição de HEP.
**Por que:** Hoje só existem 6 testes (Financeiro, Fórum, 2 smoke). Os fluxos que geram valor (Scribe, Rehab Friend) não têm cobertura.
**Arquivo:** `e2e/fluxos-criticos.spec.ts`
**Esforço:** ~3-4h
**Depende de:** Nada
