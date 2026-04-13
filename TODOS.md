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
