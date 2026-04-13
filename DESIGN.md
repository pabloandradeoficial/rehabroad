# DESIGN.md — Rehabroad Design System

> Fonte de verdade para todas as decisões de design. Atualizar antes de implementar novos componentes.

---

## Identidade

**Produto:** Rehabroad — copiloto clínico para fisioterapeutas brasileiros.
**Tipo:** HYBRID (landing page de marketing + app workspace clínico).
**Audiência:** Fisioterapeutas formados e estudantes no Brasil. Uso clínico, mobile-first entre sessões.

---

## Paleta de Cores

| Token | Valor | Uso |
|-------|-------|-----|
| `--brand-primary` | `#0d9488` (teal-600) | Links, texto colorido, badges — WCAG AA compliant |
| `--brand-cta` | `#14b8a6` (teal-500) | Botões CTA, backgrounds coloridos grandes |
| `--brand-dark` | `#111827` (gray-900) | Hero backgrounds, cards escuros, feature cards |
| `--text-primary` | `#111827` | Títulos e texto principal |
| `--text-secondary` | `#6b7280` (gray-500) | Texto de apoio |
| `--bg-page` | `#F4F7F6` | Background do app |
| `--bg-white` | `#ffffff` | Cards e superfícies |

> **REGRA:** Usar `teal-600` (#0d9488) para texto e links coloridos (ratio 4.5:1 / WCAG AA).
> Usar `teal-500` (#14b8a6) apenas para fundos de botões CTA e containers grandes.
> **NUNCA** usar roxo/violeta — inconsistente com a identidade teal.

---

## Tipografia

| Uso | Fonte | Peso | Tamanho |
|-----|-------|------|---------|
| Headlines landing (display) | DM Sans | 700–800 | 40–64px |
| Subtítulos landing | DM Sans | 400–600 | 18–28px |
| Corpo do app | Inter | 400 | 14–16px |
| Labels e badges | Inter | 500–600 | 11–13px |

**Carregamento:** Adicionar ao `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

No `tailwind.config.js`:
```js
fontFamily: {
  display: ['DM Sans', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
}
```

---

## Componentes de UI

### Feature Cards (Landing)
- Fundo: `#111827` (dark)
- Ícone: SVG customizado, stroke 1.5, 32px, cor branca
- Borda: `1px solid rgba(255,255,255,0.08)`
- Accent: linha teal sutil no topo ou dot teal
- **NUNCA:** gradientes roxo/violeta/laranja, emojis como ícone principal

### Testimonials
- Layout: quote em bloco (24-28px, peso 400, gray-700)
- Atribuição: avatar circular (iniciais, 40px) + nome + cargo abaixo
- Sem `border-l-4`, sem fundo `gray-50`

### Pricing Cards
- Popular: `bg-teal-500 text-white scale-105` ✓ (manter)
- Outros: `bg-white border border-gray-100` ✓ (manter)

---

## Estrutura de Páginas

### Landing Page — Ordem das Seções
1. Hero (brand + headline + CTA + screenshot do app)
2. Para Quem É (qualificação do visitante)
3. Problemas (ressonância emocional)
4. Features principais (3 cards dark)
5. Como Funciona (steps 01–05)
6. Features secundárias (BarChart, NeuroFlux, Caminho)
7. Depoimentos (quote em bloco)
8. Planos de Preço
9. FAQ
10. CTA Final + Footer

### Hero
- Layout: 60% texto esquerda / 40% screenshot direita
- Screenshot: Painel com paciente anonimizado em browser frame
- Background: `#111827` full-bleed
- Headline: DM Sans 800, 52px, branco
- Sub: DM Sans 400, 20px, `gray-400`
- CTA: `bg-teal-500` pill, texto branco, `hover:bg-teal-400`

---

## Navegação Mobile (App)

**Padrão:** Bottom navigation bar — 4 itens fixos + FAB.

| Item | Ícone | Rota |
|------|-------|------|
| Painel | LayoutDashboard | `/dashboard` |
| Pacientes | Users | `/dashboard/pacientes` |
| Agenda | Calendar | `/dashboard/agenda` |
| Mais | MoreHorizontal | Drawer de ações secundárias |

**FAB:** Botão `+` teal no centro ou direita inferior. Abre modal de ação rápida: Novo Paciente / Scribe / HEP.

**Breakpoint:** `< 768px` = bottom nav. `>= 768px` = sidebar drawer.

---

## Acessibilidade

- **Contraste mínimo:** 4.5:1 para texto normal, 3:1 para texto grande (18px+)
- **teal-600** (#0d9488) obrigatório em texto colorido sobre fundo branco
- **Touch targets:** mínimo 44×44px em todos os elementos interativos mobile
- **Teclado:** todos os fluxos navegáveis por Tab/Enter/Escape
- **ARIA:** landmarks em cada página principal (nav, main, aside)
- **Reduced motion:** `prefers-reduced-motion` já implementado em `index.css` ✓

---

## Estados de Interação

| Feature | Loading | Empty | Error | Success |
|---------|---------|-------|-------|---------|
| Lista de Pacientes | `PainelSkeleton` | Mensagem contextual + CTA '+ Adicionar Primeiro Paciente' | Toast + retry | — |
| Rehab Friend | Loader2 spinner | Prompt de boas-vindas | Toast 'Tente novamente' + contador | — |
| Scribe Clínico | Animação de onda | — | Textarea fallback manual | Confetti sutil (1x first-use) + 'Você economizou ~8 min' |
| HEP Exercícios | Skeleton | 'Prescreva o primeiro exercício' + CTA | Toast contextual | — |
| NeuroFlux | Loader | — | 'Não foi possível carregar parâmetros' + retry | — |

---

## Momentos de Celebração (First-Use)

**Scribe — primeira evolução gerada com sucesso:**
1. Confetti sutil por 1.5s (Framer Motion, `prefers-reduced-motion` respeitado)
2. Toast: "Você acabou de economizar ~8 minutos. Continue assim."
3. Nunca repetir após a primeira vez (flag no localStorage: `scribe_first_success`)

---

## AI Slop — Padrões Proibidos

1. Gradientes roxo/violeta/violeta em qualquer elemento
2. Grade de 3 colunas com ícone em círculo colorido + título + 2 linhas (template SaaS)
3. Emojis como ícones de UI
4. `border-l-4` com cor em depoimentos
5. Background hero de cor sólida plana sem textura/gradiente/imagem
6. Ritmo de seções idêntico (mesma altura, mesmo espaçamento, mesmo mood)
