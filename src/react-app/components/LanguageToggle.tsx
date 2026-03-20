import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function LanguageToggle({ variant = 'default', className = '' }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleLanguage}
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-white/10 ${className}`}
        title={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase">{language}</span>
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-1 p-1 bg-slate-800/50 rounded-full ${className}`}>
      <button
        onClick={() => setLanguage('pt')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          language === 'pt'
            ? 'bg-primary text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        PT
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-primary text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
}
