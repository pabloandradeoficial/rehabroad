// Shared light theme constants for the student area
// Every student page uses ONLY these tokens — no dark classes anywhere.

export const st = {
  // Page
  page: "min-h-screen bg-gray-50",
  pageInner: "max-w-2xl mx-auto px-4 py-4 space-y-4",

  // Header
  header: "bg-white border-b border-gray-200 px-4",
  headerInner: "max-w-5xl mx-auto py-3 flex items-center justify-between",

  // Cards
  card: "bg-white border border-gray-200 rounded-xl shadow-sm",
  cardHover: "hover:shadow-md hover:border-gray-300 transition-all cursor-pointer",
  cardPad: "p-4",
  cardPadLg: "p-5",

  // Section header with colored bar
  sectionHeader: "flex items-center gap-2 mb-3",
  sectionTitle: "text-sm font-semibold text-gray-700",
  sectionDivider: "flex-1 h-px bg-gray-200",

  // Typography
  h1: "text-2xl font-bold text-gray-900",
  h2: "text-xl font-semibold text-gray-900",
  h3: "text-base font-semibold text-gray-900",
  body: "text-sm text-gray-600 leading-relaxed",
  muted: "text-xs text-gray-400",
  label: "text-xs font-medium text-gray-500 uppercase tracking-wider",

  // Inputs
  input: "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent",
  searchInput: "bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-400",

  // Badges
  badgeRegion: "bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-2 py-0.5 text-xs font-medium",
  badgeEasy: "bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5 text-xs font-medium",
  badgeMedium: "bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5 text-xs font-medium",
  badgeHard: "bg-red-50 text-red-700 border border-red-200 rounded-full px-2 py-0.5 text-xs font-medium",

  // Filter pills
  pillActive: "bg-teal-600 text-white border border-teal-600 rounded-full px-3 py-1 text-xs font-medium",
  pillInactive: "bg-white text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-xs font-medium hover:border-gray-300 hover:text-gray-900 transition-colors",

  // Colored section blocks (border-left accent)
  sectionBlue: "bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4",
  sectionTeal: "bg-teal-50 border-l-4 border-teal-500 rounded-r-xl p-4",
  sectionAmber: "bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4",
  sectionPurple: "bg-purple-50 border-l-4 border-purple-500 rounded-r-xl p-4",
  sectionOrange: "bg-orange-50 border-l-4 border-orange-500 rounded-r-xl p-4",
  sectionRed: "bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4",
  sectionGreen: "bg-green-50 border-l-4 border-green-500 rounded-r-xl p-4",

  // Buttons
  btnPrimary: "bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors",
  btnSecondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
  btnGhost: "text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-1.5 text-sm transition-colors",

  // Progress bar
  progressTrack: "h-1.5 bg-gray-200 rounded-full overflow-hidden",
  progressFill: "h-full bg-teal-500 rounded-full transition-all duration-500",

  // Bottom nav
  bottomNav: "fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 py-1.5 px-1 md:hidden z-50 safe-area-inset-bottom shadow-lg",
  navItemActive: "flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl min-h-[52px] transition-all active:scale-95 bg-teal-50 text-teal-600",
  navItemInactive: "flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl min-h-[52px] transition-all active:scale-95 text-gray-400",
} as const;
