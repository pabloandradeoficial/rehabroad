import { useState } from 'react';
import { Link } from 'react-router';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Stethoscope, 
  ClipboardList,
  CheckCircle2,
  XCircle,
  Lightbulb,
  TestTube,
  Heart,
  Clock
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { CaseShareSummary } from '@/react-app/components/CaseShareSummary';
import { 
  getCurrentWeeklyCase, 
  getWeekStartDate, 
  getWeekEndDate, 
  formatDateBR,
  getWeekNumber
} from '@/data/weeklyCases';

export default function CasoSemana() {
  const weeklyCase = getCurrentWeeklyCase();
  const { week, year } = getWeekNumber();
  const weekStart = formatDateBR(getWeekStartDate());
  const weekEnd = formatDateBR(getWeekEndDate());
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer) {
      setShowResult(true);
    }
  };

  const isCorrect = weeklyCase.diagnosticOptions.find(
    o => o.id === selectedAnswer
  )?.isCorrect;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            to="/estudante" 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Voltar</span>
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-bold text-slate-900">Caso da Semana</h1>
            <p className="text-xs text-slate-500">Semana {week}/{year}</p>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Week Info Banner */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-6 h-6" />
            <span className="font-medium">Caso válido de {weekStart} até {weekEnd}</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">{weeklyCase.title}</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {weeklyCase.specialty}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {weeklyCase.category}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {weeklyCase.estimatedTime}
            </span>
          </div>
        </div>

        {/* Patient Profile */}
        <section className="bg-white rounded-xl p-5 mb-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-slate-900">Perfil do Paciente</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Idade:</span>
              <span className="ml-2 text-slate-900">{weeklyCase.patientProfile.age} anos</span>
            </div>
            <div>
              <span className="text-slate-500">Sexo:</span>
              <span className="ml-2 text-slate-900">
                {weeklyCase.patientProfile.gender === 'M' ? 'Masculino' : 'Feminino'}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Ocupação:</span>
              <span className="ml-2 text-slate-900">{weeklyCase.patientProfile.occupation}</span>
            </div>
            {weeklyCase.patientProfile.lifestyle && (
              <div>
                <span className="text-slate-500">Estilo de vida:</span>
                <span className="ml-2 text-slate-900">{weeklyCase.patientProfile.lifestyle}</span>
              </div>
            )}
          </div>
        </section>

        {/* History */}
        <section className="bg-white rounded-xl p-5 mb-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-slate-900">História Clínica</h3>
          </div>
          <p className="text-slate-700 leading-relaxed">{weeklyCase.history}</p>
        </section>

        {/* Symptoms */}
        <section className="bg-white rounded-xl p-5 mb-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-slate-900">Sintomas Relatados</h3>
          </div>
          <ul className="space-y-2">
            {weeklyCase.symptoms.map((symptom, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                {symptom}
              </li>
            ))}
          </ul>
        </section>

        {/* Clinical Findings */}
        <section className="bg-white rounded-xl p-5 mb-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-slate-900">Achados Clínicos</h3>
          </div>
          <ul className="space-y-2">
            {weeklyCase.clinicalFindings.map((finding, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                {finding}
              </li>
            ))}
          </ul>
        </section>

        {/* Diagnostic Question */}
        {!showResult ? (
          <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">
              Qual é a hipótese diagnóstica mais provável?
            </h3>
            <div className="space-y-3 mb-6">
              {weeklyCase.diagnosticOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedAnswer(option.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === option.id
                      ? 'bg-teal-600 border-teal-400'
                      : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
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
              className="w-full bg-teal-500 hover:bg-teal-400 text-white h-12 text-lg disabled:opacity-50"
            >
              Confirmar Resposta
            </Button>
          </section>
        ) : (
          <>
            {/* Result */}
            <section className={`rounded-xl p-6 mb-4 ${
              isCorrect 
                ? 'bg-emerald-50 border-2 border-emerald-200' 
                : 'bg-rose-50 border-2 border-rose-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    <div>
                      <h3 className="font-bold text-emerald-900 text-lg">Resposta Correta!</h3>
                      <p className="text-emerald-700 text-sm">Excelente raciocínio clínico.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8 text-rose-600" />
                    <div>
                      <h3 className="font-bold text-rose-900 text-lg">Resposta Incorreta</h3>
                      <p className="text-rose-700 text-sm">Veja a explicação abaixo.</p>
                    </div>
                  </>
                )}
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Diagnóstico correto:</p>
                <p className="font-semibold text-slate-900">{weeklyCase.correctDiagnosis}</p>
              </div>
            </section>

            {/* Clinical Explanation */}
            <section className="bg-white rounded-xl p-5 mb-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-slate-900">Explicação Clínica</h3>
              </div>
              <p className="text-slate-700 leading-relaxed">{weeklyCase.clinicalExplanation}</p>
              {weeklyCase.tips && (
                <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-amber-800 text-sm">
                    <strong>Dica:</strong> {weeklyCase.tips}
                  </p>
                </div>
              )}
            </section>

            {/* Recommended Tests */}
            <section className="bg-white rounded-xl p-5 mb-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <TestTube className="w-5 h-5 text-violet-500" />
                <h3 className="font-semibold text-slate-900">Testes Recomendados</h3>
              </div>
              <ul className="space-y-2">
                {weeklyCase.recommendedTests.map((test, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                    {test}
                  </li>
                ))}
              </ul>
            </section>

            {/* Initial Treatment */}
            <section className="bg-white rounded-xl p-5 mb-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-rose-500" />
                <h3 className="font-semibold text-slate-900">Conduta Inicial</h3>
              </div>
              <ul className="space-y-2">
                {weeklyCase.initialTreatment.map((treatment, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    {treatment}
                  </li>
                ))}
              </ul>
            </section>

            {/* Share Summary */}
            <CaseShareSummary
              caseName={weeklyCase.title}
              hypothesis={weeklyCase.correctDiagnosis}
              tests={weeklyCase.recommendedTests.slice(0, 4)}
              treatment={weeklyCase.initialTreatment.slice(0, 4)}
              wasCorrect={isCorrect}
            />

            {/* Refazer Button */}
            <div className="mt-4">
              <Button
                onClick={() => {
                  setSelectedAnswer(null);
                  setShowResult(false);
                }}
                variant="outline"
                className="w-full h-12"
              >
                Refazer Caso
              </Button>
            </div>
          </>
        )}
      </main>

      {/* Disclaimer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <p>
          Este caso clínico é fictício e tem finalidade exclusivamente educacional. 
          Não substitui avaliação profissional.
        </p>
      </footer>
    </div>
  );
}
