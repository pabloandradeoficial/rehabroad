/**
 * DESIGN SYSTEM — REHABROAD
 * Fonte única de verdade para tokens visuais de toda a interface.
 *
 * Regras:
 * - Usar sempre variáveis CSS do tema (bg-card, text-foreground, etc.)
 * - Nunca hardcodar cores diretamente nas páginas
 * - Importar DS onde precisar de classes padronizadas
 */

export const DS = {
  // ─── Tipografia ──────────────────────────────────────────────────────────────
  text: {
    pageTitle:    "text-2xl font-bold tracking-tight text-foreground",
    sectionTitle: "text-base font-bold text-foreground",
    cardTitle:    "text-sm font-semibold text-foreground",
    body:         "text-sm text-muted-foreground",
    caption:      "text-xs text-muted-foreground",
    label:        "text-xs font-medium text-muted-foreground uppercase tracking-wide",
  },

  // ─── Cards ───────────────────────────────────────────────────────────────────
  card: {
    base:      "bg-card border border-border rounded-2xl shadow-sm",
    padding:   "p-6",
    paddingSm: "p-4",
    hover:     "hover:shadow-md transition-shadow duration-200",
  },

  // ─── Header de página (padrão único para TODAS as páginas do dashboard) ──────
  pageHeader: {
    wrapper:    "relative rounded-2xl bg-card border border-border shadow-sm overflow-hidden p-6",
    accent:     "absolute top-0 left-0 right-0 h-1",
    inner:      "relative flex flex-col sm:flex-row sm:items-center justify-between gap-4",
    iconGroup:  "flex items-start gap-4",
    iconBox:    "hidden sm:flex w-14 h-14 rounded-xl items-center justify-center shadow-lg flex-shrink-0",
    titleGroup: "flex flex-col gap-0.5",
    title:      "text-2xl font-bold tracking-tight text-foreground",
    subtitle:   "text-sm text-muted-foreground mt-1",
    actions:    "flex items-center gap-2 flex-wrap",
  },

  // ─── Badges de status ─────────────────────────────────────────────────────────
  badge: {
    green:  "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 rounded-full px-2 py-0.5 text-xs font-medium",
    yellow: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 rounded-full px-2 py-0.5 text-xs font-medium",
    red:    "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 rounded-full px-2 py-0.5 text-xs font-medium",
    purple: "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30 rounded-full px-2 py-0.5 text-xs font-medium",
    gray:   "bg-muted text-muted-foreground border border-border rounded-full px-2 py-0.5 text-xs font-medium",
    blue:   "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 rounded-full px-2 py-0.5 text-xs font-medium",
  },

  // ─── Layout / espaçamento ────────────────────────────────────────────────────
  layout: {
    pageWrapper: "space-y-6",
    sectionGap:  "space-y-4",
    cardGap:     "space-y-3",
    grid2:       "grid grid-cols-1 md:grid-cols-2 gap-4",
    grid3:       "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
    grid4:       "grid grid-cols-2 lg:grid-cols-4 gap-4",
  },

  // ─── Estados especiais ────────────────────────────────────────────────────────
  states: {
    // Empty state container
    empty:         "flex flex-col items-center justify-center py-16 text-center px-4",
    emptyIcon:     "w-12 h-12 text-muted-foreground/40 mb-4",
    emptyTitle:    "text-base font-semibold text-foreground mb-1",
    emptySubtitle: "text-sm text-muted-foreground mb-5 max-w-xs",
    // Loading
    skeleton:  "animate-pulse bg-muted rounded-xl",
    // Error inline
    errorBox:  "bg-destructive/5 border border-destructive/20 rounded-xl p-4 text-sm text-destructive flex items-start gap-3",
  },

  // ─── Cores da marca ───────────────────────────────────────────────────────────
  brand: {
    // Gradientes reutilizáveis para ícones e acentos
    gradients: {
      primary:   "from-primary via-primary/80 to-primary/60",
      blue:      "from-blue-500 via-indigo-500 to-violet-500",
      green:     "from-emerald-500 via-teal-500 to-green-500",
      purple:    "from-violet-500 via-purple-500 to-indigo-500",
      orange:    "from-orange-500 via-amber-500 to-yellow-500",
      rose:      "from-rose-500 via-pink-500 to-fuchsia-500",
      teal:      "from-teal-500 via-cyan-500 to-sky-500",
    },
  },
} as const;

// ─── Tipos utilitários ────────────────────────────────────────────────────────
export type DSGradient = keyof typeof DS.brand.gradients;
export type DSBadge    = keyof typeof DS.badge;
