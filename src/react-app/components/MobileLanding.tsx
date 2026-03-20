import { Link } from "react-router";
import { Star, Shield, FileText, Zap, Clock, CheckCircle } from "lucide-react";

/**
 * Ultra-lightweight mobile landing page
 * No animations, no heavy components, instant load
 */
export default function MobileLanding() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-lg">REHABROAD</span>
        </div>
        <Link 
          to="/login" 
          className="text-sm text-teal-400 font-medium"
        >
          Entrar
        </Link>
      </header>

      {/* Main content */}
      <main className="px-4 pt-6 pb-24">
        {/* Social proof badge */}
        <div className="inline-flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-full text-sm mb-6">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-slate-300">+500 fisioterapeutas usam para</span>
          <span className="text-teal-400 font-medium">confirmar hipóteses</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl font-bold leading-tight mb-4">
          A IA que ajuda fisioterapeutas a{" "}
          <span className="text-teal-400">chegar ao diagnóstico certo mais rápido</span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base mb-6">
          Analisa achados clínicos, sugere hipóteses diagnósticas baseadas em evidência e gera laudos profissionais em minutos.
        </p>

        {/* Primary CTA */}
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold py-4 px-6 rounded-xl text-lg shadow-lg shadow-teal-500/25 active:scale-[0.98] transition-transform"
        >
          Testar Grátis por 30 Dias
        </Link>

        {/* Trust pills */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <span className="text-xs text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-full">
            Sem cartão
          </span>
          <span className="text-xs text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-full">
            Cancelamento imediato
          </span>
          <span className="text-xs text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-full">
            100% online
          </span>
        </div>

        {/* Features */}
        <div className="mt-10 space-y-4">
          <h2 className="text-lg font-semibold text-slate-300 mb-4">
            O que você ganha:
          </h2>
          
          <div className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">Laudos em PDF</h3>
              <p className="text-sm text-slate-400">Prontos para enviar ou imprimir</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">IA Diagnóstica</h3>
              <p className="text-sm text-slate-400">Hipóteses baseadas nos achados clínicos</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">Evoluções Rápidas</h3>
              <p className="text-sm text-slate-400">Registre em 2 minutos, não 20</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">Conforme LGPD</h3>
              <p className="text-sm text-slate-400">Dados seguros, criptografia SSL 256-bit</p>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-10 bg-gradient-to-br from-slate-800 to-slate-800/50 p-5 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-1 mb-3">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <p className="text-slate-300 text-sm italic mb-3">
            "A IA me ajuda a confirmar hipóteses diagnósticas que eu já suspeitava. Economizo tempo e tenho mais segurança nas decisões clínicas."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500/30 flex items-center justify-center">
              <span className="text-teal-400 font-semibold text-sm">CS</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Dra. Camila Santos</p>
              <p className="text-xs text-slate-500">CREFITO-3 • São Paulo</p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex justify-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-xs text-slate-400 font-medium">LGPD</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg">
            <CheckCircle className="w-5 h-5 text-teal-400" />
            <span className="text-xs text-slate-400 font-medium">COFFITO</span>
          </div>
        </div>

        {/* Student Section */}
        <div className="mt-10 bg-gradient-to-br from-violet-900/40 to-slate-800/50 p-5 rounded-xl border border-violet-500/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎓</span>
            <h3 className="font-semibold text-white">Modo Estudante</h3>
            <span className="bg-violet-500/30 text-violet-300 text-xs px-2 py-0.5 rounded-full font-medium">
              Grátis
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Casos clínicos, testes ortopédicos, módulos de estudo e treino diário para você se preparar para a prática.
          </p>
          <Link
            to="/estudante"
            className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 px-4 rounded-xl text-sm active:scale-[0.98] transition-all"
          >
            Acessar Modo Estudante
          </Link>
        </div>
      </main>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pt-8">
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold py-4 px-6 rounded-xl text-base shadow-lg shadow-teal-500/30 active:scale-[0.98] transition-transform"
        >
          Testar Grátis — 30 Dias
        </Link>
      </div>
    </div>
  );
}
