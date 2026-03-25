import { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check,
  FileText,
  Stethoscope,
  TestTube,
  Heart,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';

interface CaseShareSummaryProps {
  caseName: string;
  hypothesis: string;
  tests: string[];
  treatment: string[];
  wasCorrect?: boolean;
}

export function CaseShareSummary({ 
  caseName, 
  hypothesis, 
  tests, 
  treatment,
  wasCorrect 
}: CaseShareSummaryProps) {
  const [copied, setCopied] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const summaryText = `📋 CASO CLÍNICO - ${caseName}

🔬 Hipótese: ${hypothesis}

🧪 Testes indicados:
${tests.map(t => `• ${t}`).join('\n')}

💊 Conduta inicial:
${treatment.map(t => `• ${t}`).join('\n')}

---
Resolvi este caso no RehabRoad
${window.location.origin}/caso-da-semana`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(summaryText)}`;
    window.open(url, '_blank');
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Caso Clínico: ${caseName}`,
        text: summaryText,
      });
    } else {
      handleCopy();
    }
  };

  if (!showSummary) {
    return (
      <Button
        onClick={() => setShowSummary(true)}
        className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white"
      >
        <FileText className="w-5 h-5 mr-2" />
        Gerar Resumo para Compartilhar
      </Button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
        <h3 className="font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Resumo do Caso
        </h3>
        <p className="text-sm text-white/80 mt-1">{caseName}</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Hypothesis */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1">HIPÓTESE DIAGNÓSTICA</p>
            <p className="text-slate-900 font-medium">{hypothesis}</p>
          </div>
        </div>

        {/* Tests */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <TestTube className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1">TESTES INDICADOS</p>
            <ul className="space-y-1">
              {tests.map((test, i) => (
                <li key={i} className="text-slate-700 text-sm flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  {test}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Treatment */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Heart className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1">CONDUTA INICIAL</p>
            <ul className="space-y-1">
              {treatment.map((item, i) => (
                <li key={i} className="text-slate-700 text-sm flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Result badge */}
        {wasCorrect !== undefined && (
          <div className={`p-3 rounded-lg text-sm font-medium text-center ${
            wasCorrect 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {wasCorrect ? '✓ Acertei este caso' : '○ Revisei este caso'}
          </div>
        )}

        {/* Share buttons */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleShareWhatsApp}
              className="bg-green-600 hover:bg-green-500 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              onClick={handleCopy}
              variant="outline"
              className="border-slate-300"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-emerald-600" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </>
              )}
            </Button>
          </div>
          <Button
            onClick={handleShareNative}
            variant="outline"
            className="w-full border-slate-300"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Mais opções
          </Button>
        </div>
      </div>
    </div>
  );
}
