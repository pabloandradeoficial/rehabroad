import { useState, useRef, useEffect } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StickySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultsCount?: number;
  darkMode?: boolean;
}

export function StickySearch({ 
  value, 
  onChange, 
  placeholder = "Buscar...",
  resultsCount,
  darkMode = false
}: StickySearchProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fullscreenInputRef = useRef<HTMLInputElement>(null);

  // Focus fullscreen input when opened
  useEffect(() => {
    if (isFullscreen && fullscreenInputRef.current) {
      fullscreenInputRef.current.focus();
    }
  }, [isFullscreen]);

  // Close fullscreen on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  const handleMobileClick = () => {
    setIsFullscreen(true);
  };

  const handleClose = () => {
    setIsFullscreen(false);
  };

  const handleClear = () => {
    onChange('');
    if (fullscreenInputRef.current) {
      fullscreenInputRef.current.focus();
    }
  };

  // Styles based on dark mode
  const containerBg = darkMode 
    ? 'bg-slate-900/95 border-slate-800' 
    : 'bg-white/95 border-slate-200';
  const inputBg = darkMode 
    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400';
  const iconColor = darkMode ? 'text-slate-400' : 'text-slate-500';
  const resultColor = darkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <>
      {/* Sticky Search Bar */}
      <div className={`sticky top-[60px] md:top-[68px] z-40 ${containerBg} backdrop-blur-md border-b px-4 py-3`}>
        <div className="max-w-4xl mx-auto">
          {/* Desktop: Regular input */}
          <div className="hidden md:block relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${iconColor}`} />
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full pl-12 pr-10 py-3 ${inputBg} border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all`}
            />
            {value && (
              <button
                onClick={() => onChange('')}
                className={`absolute right-4 top-1/2 -translate-y-1/2 ${iconColor} hover:text-slate-700`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Mobile: Tap to open fullscreen */}
          <button
            onClick={handleMobileClick}
            className={`md:hidden w-full flex items-center gap-3 px-4 py-3 ${inputBg} border rounded-xl min-h-[48px] text-left`}
          >
            <Search className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
            <span className={value ? (darkMode ? 'text-white' : 'text-slate-900') : (darkMode ? 'text-slate-500' : 'text-slate-400')}>
              {value || placeholder}
            </span>
          </button>

          {/* Results count */}
          {resultsCount !== undefined && value && (
            <p className={`text-sm ${resultColor} mt-2`}>
              {resultsCount} {resultsCount === 1 ? 'resultado' : 'resultados'} encontrado{resultsCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Fullscreen Search Overlay (Mobile) */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-white md:hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 safe-area-inset-top">
              <button
                onClick={handleClose}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2"
              >
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </button>
              <div className="flex-1 relative">
                <input
                  ref={fullscreenInputRef}
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-base"
                />
                {value && (
                  <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Search suggestions / quick actions */}
            <div className="px-4 py-6">
              <p className="text-sm text-slate-500 mb-4">Sugestões de busca:</p>
              <div className="flex flex-wrap gap-2">
                {['Teste de Jobe', 'Lombalgia', 'TENS', 'Hérnia de disco', 'Ombro', 'Joelho'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      onChange(suggestion);
                      setIsFullscreen(false);
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-700 rounded-full text-sm min-h-[44px] transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Results count in fullscreen */}
              {resultsCount !== undefined && value && (
                <div className="mt-6 p-4 bg-teal-50 rounded-xl border border-teal-200">
                  <p className="text-teal-700 font-medium">
                    {resultsCount} {resultsCount === 1 ? 'resultado' : 'resultados'} para "{value}"
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-2 text-sm text-teal-600 font-medium hover:underline"
                  >
                    Ver resultados →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
