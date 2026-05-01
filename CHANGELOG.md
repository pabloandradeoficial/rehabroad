# Changelog

Todas as mudanças notáveis deste projeto são documentadas aqui.

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [Não publicado]

### Adicionado
- Middleware global de Request-ID no worker. Reaproveita `cf-ray` (ou gera UUID) e expõe via header `x-request-id`. Logs de erro agora incluem o ID para correlação em produção.
- `CHANGELOG.md`.
- E2E (Playwright) para fluxos clínicos críticos em `e2e/fluxos-criticos.spec.ts`: cadastrar paciente → abrir prontuário, abrir Scribe via Nova Evolução, abrir FAB do Rehab Friend, carregar overview do HEP. Total de 4 novos testes (× desktop+mobile = 8).
- `npm run typecheck:worker` (TS check do worker via `tsconfig.worker.json`) e `npm run typecheck` (web + worker) como scripts standalone para uso local. **Não rodam dentro de `npm run build`** — o build do Netlify só publica o frontend, e `worker-configuration.d.ts` é gitignored (gerado por `wrangler types`). Worker já tem validação no `wrangler deploy`.
- Helpers `envAsRecord(env)` / `envAsStringRecord(env)` em `worker/lib/helpers.ts` para evitar repetir `as unknown as Record<...>` ao tratar o `Env` do Cloudflare.

### Mudado
- Webhook do Stripe (`POST /api/webhooks/stripe`): cada evento agora roda dentro de try/catch que retorna 5xx em falha (Stripe re-tenta) em vez de logar silenciosamente. Logs prefixados `[STRIPE_WEBHOOK_FAIL]` / `[STRIPE_WEBHOOK_SIG_FAIL]` para alertabilidade.
- `app.onError` inclui `requestId`, método e path no log.
- `GET /api/dashboard/stats`: 3 queries de count → 1 query com subselects correlacionados; recent activities (evals + evols) usam `UNION ALL` + `LIMIT 5` em vez de duas queries + sort/concat em JS.
- `GET /api/onboarding/progress`: 5 queries booleanas → 1 query com `EXISTS()` + scalar subquery para `first_eval_patient_id`.
- Consolidados `src/data/` e `src/react-app/data/`: `neurofluxData.ts` e `testesOrtopedicos.ts` movidos para `src/data/` (raiz canônica para conteúdo estático). 7 imports atualizados.
- `knip.json` agora ignora `src/worker/env.d.ts` (era falso positivo — o arquivo é usado via TypeScript declaration merging para augmentar o `Env` do Cloudflare).

### Corrigido
- 73 erros TS pré-existentes no worker que não eram pegos no CI. Quebra: 11× cast `Env as Record<...>`, 39× `implicit any` em callbacks de `.map()`/`.filter()`, 4× possibly-undefined em cálculos de dor (`suporte.ts`), 3× imports não usados, 1× typo (`pain_patterns` → `pain_pattern`), 1× tipo do contexto Hono em `auth.ts`.
- ESLint agora ignora `coverage/` (saída do Vitest gerava 3 warnings espúrios).

### Removido
- 14 UI primitives shadcn não usadas: `accordion`, `alert-dialog`, `avatar`, `collapsible`, `field`, `input-group`, `popover`, `radio-group`, `scroll-area`, `separator`, `skeleton`, `switch`, `table`, `tooltip`. Pacote `radix-ui` mantido (tree-shaking cuida do peso).
- 23 exports não usados (flagados pelo knip) — alguns deletados por completo, outros convertidos para `internal` (sem `export`). Inclui `getCasesByCategory`/`getCasesByDifficulty`/`getCasesBySpecialty`/`getCaseById` em `clinicalCases.ts`, helpers regionais em `educationalModules.ts`, `getExerciseById`, `buscarTestes`/`buscarTestesPorCategoria`/`getIndicacoesPorRegiao`/`getSintomasPorRegiao` em `testesOrtopedicos.ts`, `getBlogPostsByCategory`, `usePatientColor`, `ADMQuickReference`, e 3 helpers de auth no worker (`getPossibleAuthCookieNames`, `extractAccessToken`, `getSupabaseUserFromAccessToken`).
- 7 helpers de animação não usados em `ModuleTransitions.tsx` — extraído `ModulePage` (único usado) para arquivo dedicado, `ModuleTransitions.tsx` deletado.
- 23 exports não usados em component libraries:
  - `microinteractions.tsx`: AnimatedButton, AnimatedCard, FeedbackToast (mantido como interno do ToastProvider), PageTransition, PulseDot, ConfettiEffect, Counter, AnimatedCounter, AnimatedCheckbox, AnimatedProgress (-518 linhas)
  - `StudentProgressWidgets.tsx`: AnimatedStat, CircularStatCard, CircularProgress, XPGainAnimation, StreakAnimation, LevelUpAnimation (-330 linhas)
  - `DashboardSkeletons.tsx`: TableSkeleton, CardListSkeleton, EmptyState, StatCardSkeleton, PatientCardSkeleton (-100 linhas)
  - `motion.tsx`: AnimatedCounter, HoverCard, DesktopAnimatedCounter (helper interno) (-37 linhas)

## [2026-04-27]

### Segurança / Dependências
- `chore(deps)`: 7 vulnerabilidades restantes zeradas (`f260fab`).
- Lint: 0 errors (15 warnings residuais — todos `react-refresh/only-export-components` em UI primitives e contexts).

### Tipos
- Eliminados todos os `any` explícitos restantes:
  - `worker/Env` agora tipado com `D1Database`/`R2Bucket` (`00a63c0`).
  - Charts tooltips e hooks (`0af101d`).
  - `patients/{evolutions,alertas,clinical-summary}` (`36a7ee5`).
  - `patients/suporte.ts` (`a37b2b5`).
  - 13 `no-explicit-any` removidos via `src/shared/api.ts` compartilhado entre worker e react-app (`76b6cae`).

### Testes
- `test(react-app)`: testes unitários para `whatsapp` e `admHighlight` (`244569d`).

### Refatoração (split de god components)
- `NeuroFlux` → 5 sub-arquivos (`df36a5e`).
- `Agenda` → 5 sub-arquivos (`8b204d7`).
- `StudentHub` → 8 sub-arquivos (`6f8e914`).
- `Painel` → dialogs + activities card extraídos (`7914479`).
- `PatientDetail` → 4 dialogs + tabs evaluations/evolutions extraídos (`dc8372e`, `0dbcc80`).
- `worker/routes/patients.ts` → modularizado em `patients/{crud,schema,evaluations,evolutions,alertas,suporte,clinical-summary,clinical-insights,caminho}.ts` (`4ea8a1e`, `7a23cf8`).

### Performance / Bundle
- Lazy-load de `recharts` e `jspdf` (`daadb4d`).
- Eliminadas N+1 no dashboard + paginação no `GET /patients` (`5e75a9f`).

### Hooks
- 6 warnings de `react-hooks/exhaustive-deps` resolvidos (`b54c8e4`).

### UX
- Anti-FOUC: classe de tema aplicada antes do mount; CSP apertada (`77c7c98`).
- Flicker em transições de rota corrigido (`44a5f21`).

## [2026-04-23] — Auditoria

Documento completo: [`AUDIT-2026-04-23.md`](./AUDIT-2026-04-23.md).

### Segurança
- **[Crítico]** XSS em `RehabFriendChat` (regex markdown + `dangerouslySetInnerHTML`) → substituído por `react-markdown` (`afb28a7`).
- **[Médio]** XSS latente em `BlogPost` (mesmo padrão) → `react-markdown`.
- **[Baixo]** JSON-LD em `BibliotecaClinicaPage` agora escapa `<`.
- **[Médio]** PII redatada em `forum.ts` (e-mail removido do log).
- **[Baixo]** Check de admin redundante em `admin.ts` consolidado no middleware.
- **[Médio]** Open redirect em `getAuthCallbackUrl`: hostname agora validado contra allowlist `rehabroad.com.br` (`e919b25`).
- **[Médio]** CSP em `netlify.toml` (`ef947d9`).
- **[Médio]** Validação de tamanho de áudio no Scribe (`atob` gate ~10MB) (`ef947d9`).
- **[Médio]** Email de admin movido para `OWNER_ADMIN_EMAIL` env var (`ef947d9`).

### Validação
- Schema Zod em `POST`/`PUT /patients` (`5238c77`).

### Dependências
- 31 → 6 → 0 vulnerabilidades.
- Removidos `react-snap` (não usado) e `@cloudflare/vite-plugin` (devDep não usada).

### Dead code
- 19 arquivos órfãos removidos (`4341a37`).

### Build
- Removido `chunkSizeWarningLimit: 5000` em `vite.config.ts` (avisos de 500KB+ voltaram a aparecer).
