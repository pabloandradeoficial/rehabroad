import { useState } from 'react';
import { 
  Stethoscope, 
  CheckCircle2, 
  XCircle, 
  Lightbulb,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';

export interface MiniCase {
  id: string;
  question: string;
  context: string;
  options: { id: string; label: string; isCorrect: boolean }[];
  explanation: string;
  relatedTopic?: string;
}

interface MiniClinicalCaseProps {
  miniCase: MiniCase;
  onComplete?: (correct: boolean) => void;
}

export function MiniClinicalCase({ miniCase, onComplete }: MiniClinicalCaseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer) {
      setShowResult(true);
      const isCorrect = miniCase.options.find(o => o.id === selectedAnswer)?.isCorrect || false;
      onComplete?.(isCorrect);
    }
  };

  const isCorrect = miniCase.options.find(o => o.id === selectedAnswer)?.isCorrect;

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (!isOpen) {
    return (
      <div className="my-8 p-5 bg-gradient-to-br from-violet-900/30 to-purple-900/30 border border-violet-500/30 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-5 h-5 text-violet-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-semibold mb-1">Mini Caso Clínico</h4>
            <p className="text-slate-300 text-sm mb-3">{miniCase.context}</p>
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-violet-600 hover:bg-violet-500 text-white"
            >
              Resolver Caso
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-violet-600/20 border-b border-violet-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-5 h-5 text-violet-400" />
          <span className="font-semibold text-white">Mini Caso Clínico</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5">
        {/* Context */}
        <p className="text-slate-300 mb-4">{miniCase.context}</p>

        {!showResult ? (
          <>
            {/* Question */}
            <p className="text-white font-medium mb-4">{miniCase.question}</p>

            {/* Options */}
            <div className="space-y-2 mb-4">
              {miniCase.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedAnswer(option.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${
                    selectedAnswer === option.id
                      ? 'bg-violet-600/30 border-violet-500 text-white'
                      : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span className="font-medium mr-2">{option.id.toUpperCase()})</span>
                  {option.label}
                </button>
              ))}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50"
            >
              Confirmar Resposta
            </Button>
          </>
        ) : (
          <>
            {/* Result */}
            <div className={`p-4 rounded-lg mb-4 ${
              isCorrect 
                ? 'bg-emerald-500/20 border border-emerald-500/30' 
                : 'bg-rose-500/20 border border-rose-500/30'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-semibold text-emerald-400">Correto!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span className="font-semibold text-rose-400">Incorreto</span>
                  </>
                )}
              </div>
              <p className="text-sm text-slate-300">
                <strong className="text-white">Resposta correta:</strong>{' '}
                {miniCase.options.find(o => o.isCorrect)?.label}
              </p>
            </div>

            {/* Explanation */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <span className="font-semibold text-amber-400">Explicação</span>
              </div>
              <p className="text-slate-300 text-sm">{miniCase.explanation}</p>
            </div>

            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              Tentar Novamente
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// Pre-defined mini cases that can be embedded in blog posts
export const blogMiniCases: Record<string, MiniCase> = {
  'capsulite-adesiva': {
    id: 'mc-001',
    question: 'Qual achado clínico é mais característico da capsulite adesiva?',
    context: 'Paciente de 55 anos, diabética, refere dor e rigidez progressiva no ombro direito há 4 meses, sem história de trauma.',
    options: [
      { id: 'a', label: 'Arco doloroso entre 60-120°', isCorrect: false },
      { id: 'b', label: 'Limitação de movimentos ativos e passivos com padrão capsular', isCorrect: true },
      { id: 'c', label: 'Fraqueza isolada de rotação externa', isCorrect: false },
      { id: 'd', label: 'Crepitação à movimentação', isCorrect: false }
    ],
    explanation: 'A capsulite adesiva caracteriza-se por limitação progressiva de movimentos ativos E passivos seguindo o padrão capsular: rotação externa > abdução > rotação interna. Diabetes é um fator de risco importante.'
  },
  'hernia-discal': {
    id: 'mc-002',
    question: 'Qual teste tem maior especificidade para radiculopatia lombar?',
    context: 'Paciente de 42 anos com dor lombar irradiando para membro inferior esquerdo, com formigamento no pé.',
    options: [
      { id: 'a', label: 'Teste de Lasègue', isCorrect: false },
      { id: 'b', label: 'Teste de Lasègue cruzado', isCorrect: true },
      { id: 'c', label: 'Teste de Slump', isCorrect: false },
      { id: 'd', label: 'Teste de extensão lombar', isCorrect: false }
    ],
    explanation: 'O teste de Lasègue cruzado (elevar a perna não afetada e reproduzir sintomas na perna afetada) tem alta especificidade (>90%) para hérnia discal, embora sensibilidade baixa.'
  },
  'lca': {
    id: 'mc-003',
    question: 'Qual é o teste mais sensível para lesão do LCA?',
    context: 'Jogador de futebol sofreu entorse em rotação com pé fixo. Refere estalo no momento da lesão e sensação de instabilidade.',
    options: [
      { id: 'a', label: 'Gaveta anterior a 90°', isCorrect: false },
      { id: 'b', label: 'Teste de Lachman', isCorrect: true },
      { id: 'c', label: 'Pivot shift', isCorrect: false },
      { id: 'd', label: 'Teste de McMurray', isCorrect: false }
    ],
    explanation: 'O teste de Lachman é o mais sensível para lesão do LCA (85-95%). O pivot shift é mais específico mas menos sensível, especialmente na fase aguda com derrame e espasmo muscular.'
  },
  'sbt': {
    id: 'mc-004',
    question: 'O que indica a Síndrome da Banda Iliotibial em corredores?',
    context: 'Corredora de 32 anos com dor lateral no joelho que inicia após 5km de corrida e piora progressivamente.',
    options: [
      { id: 'a', label: 'Teste de McMurray positivo', isCorrect: false },
      { id: 'b', label: 'Teste de Noble e Ober positivos', isCorrect: true },
      { id: 'c', label: 'Teste de Lachman positivo', isCorrect: false },
      { id: 'd', label: 'Teste de compressão patelar positivo', isCorrect: false }
    ],
    explanation: 'A SBIT é comum em corredores. O teste de Noble (dor no epicôndilo lateral a 30° de flexão) e teste de Ober (encurtamento da BIT) são característicos. Fraqueza de glúteo médio é fator contribuinte.'
  },
  'tens-parametros': {
    id: 'mc-005',
    question: 'Quais parâmetros são indicados para TENS convencional analgésico?',
    context: 'Paciente com dor lombar crônica necessita de eletroterapia para alívio da dor.',
    options: [
      { id: 'a', label: 'Frequência baixa (2-10Hz), alta intensidade', isCorrect: false },
      { id: 'b', label: 'Frequência alta (80-150Hz), baixa intensidade (parestesia)', isCorrect: true },
      { id: 'c', label: 'Frequência modulada (2-150Hz), intensidade máxima tolerável', isCorrect: false },
      { id: 'd', label: 'Frequência de 50Hz, contração muscular visível', isCorrect: false }
    ],
    explanation: 'O TENS convencional usa alta frequência (80-150Hz) e baixa intensidade (apenas parestesia, sem contração). Atua pelo mecanismo de comporta da dor, com efeito imediato mas menor duração.'
  }
};
