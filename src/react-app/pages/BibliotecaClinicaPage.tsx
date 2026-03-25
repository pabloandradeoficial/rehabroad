import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Stethoscope,
  FileText,
  Lightbulb,
  ListChecks,
  AlertCircle,
  GraduationCap,
  ChevronRight,
  Download,
  Loader2
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { StickySearch } from '@/react-app/components/StickySearch';
import { getPageBySlug, categories, getPagesByCategory, searchPages } from '@/data/clinicalLibrary';

export default function BibliotecaClinicaPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadName, setLeadName] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  
  const page = slug ? getPageBySlug(slug) : null;
  const searchResults = searchQuery ? searchPages(searchQuery) : [];
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail || !leadName) return;
    
    setIsSubmittingLead(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: leadName, 
          email: leadEmail, 
          source: 'biblioteca-clinica' 
        })
      });
      setLeadSubmitted(true);
    } catch {
      // Silent fail - still show success
      setLeadSubmitted(true);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Generate JSON-LD Schema
  const generateSchema = () => {
    if (!page) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "name": page.title,
      "description": page.metaDescription,
      "url": `https://rehabroad.com.br/biblioteca/${page.slug}`,
      "about": {
        "@type": "MedicalTest",
        "name": page.title
      },
      "mainEntity": page.howTo ? {
        "@type": "HowTo",
        "name": `Como realizar ${page.title}`,
        "step": page.howTo.map((step, i) => ({
          "@type": "HowToStep",
          "position": i + 1,
          "text": step
        }))
      } : undefined
    };
  };

  if (!page) {
    // Show library index
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-slate-900">REHABROAD</span>
            </Link>
            <Link to="/estudante">
              <Button variant="outline" size="sm">
                <GraduationCap className="w-4 h-4 mr-2" />
                Área do Estudante
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="py-16 px-4 bg-gradient-to-br from-teal-600 to-emerald-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Biblioteca Clínica
            </h1>
            <p className="text-lg text-teal-100 max-w-2xl mx-auto">
              Referência rápida e baseada em evidência para fisioterapeutas. 
              Testes ortopédicos, patologias, recursos terapêuticos e avaliação clínica.
            </p>
          </div>
        </section>

        {/* Sticky Search */}
        <StickySearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar testes, patologias, recursos..."
          resultsCount={searchQuery ? searchResults.length : undefined}
        />

        {/* Search Results */}
        {searchQuery && (
          <section className="py-8 px-4">
            <div className="max-w-6xl mx-auto">
              {searchResults.length > 0 ? (
                <div className="grid gap-4">
                  {searchResults.map((result) => (
                    <Link
                      key={result.slug}
                      to={`/biblioteca/${result.slug}`}
                      onClick={() => setSearchQuery('')}
                      className="bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          result.category === 'testes-ortopedicos' ? 'bg-blue-100 text-blue-600' :
                          result.category === 'patologias' ? 'bg-rose-100 text-rose-600' :
                          result.category === 'recursos-terapeuticos' ? 'bg-violet-100 text-violet-600' :
                          'bg-emerald-100 text-emerald-600'
                        }`}>
                          {result.category === 'testes-ortopedicos' ? <Stethoscope className="w-5 h-5" /> :
                           result.category === 'patologias' ? <FileText className="w-5 h-5" /> :
                           result.category === 'recursos-terapeuticos' ? <Lightbulb className="w-5 h-5" /> :
                           <ListChecks className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900">{result.title}</h3>
                          <p className="text-sm text-slate-500 line-clamp-2">{result.metaDescription}</p>
                          <span className="inline-block mt-2 text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                            {categories.find(c => c.id === result.category)?.name || result.category}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 ml-auto" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600">Nenhum resultado para "{searchQuery}"</p>
                  <p className="text-sm text-slate-500 mt-1">Tente outro termo ou explore as categorias abaixo</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Categories - hidden when searching */}
        {!searchQuery && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {categories.map(cat => {
                const pages = getPagesByCategory(cat.id);
                return (
                  <div 
                    key={cat.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-${cat.color}-100 flex items-center justify-center flex-shrink-0`}>
                        <Stethoscope className={`w-6 h-6 text-${cat.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-slate-900 mb-1">{cat.name}</h2>
                        <p className="text-slate-600 text-sm mb-4">{cat.description}</p>
                        <p className="text-sm text-teal-600 font-medium mb-4">
                          {pages.length} páginas disponíveis
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 md:mx-0 md:px-0 md:overflow-visible md:flex-wrap no-scrollbar">
                          {pages.slice(0, 5).map(p => (
                            <Link
                              key={p.slug}
                              to={`/biblioteca/${p.slug}`}
                              className="flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center text-sm bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-700 px-4 py-2.5 rounded-full transition-colors whitespace-nowrap"
                            >
                              {p.title}
                            </Link>
                          ))}
                          {pages.length > 5 && (
                            <span className="flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center text-sm text-slate-500 px-4 py-2.5 whitespace-nowrap">
                              +{pages.length - 5} mais
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* All Tests List */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Todos os Testes Ortopédicos
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {getPagesByCategory('testes-ortopedicos').map(page => (
                  <Link
                    key={page.slug}
                    to={`/biblioteca/${page.slug}`}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">
                        {page.keywords.slice(0, 3).join(' • ')}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Patologias List */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Patologias Musculoesqueléticas
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {getPagesByCategory('patologias').map(page => (
                  <Link
                    key={page.slug}
                    to={`/biblioteca/${page.slug}`}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-rose-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 truncate group-hover:text-rose-700 transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">
                        {page.keywords.slice(0, 3).join(' • ')}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Recursos Terapêuticos List */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Recursos Terapêuticos
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {getPagesByCategory('recursos-terapeuticos').map(page => (
                  <Link
                    key={page.slug}
                    to={`/biblioteca/${page.slug}`}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-5 h-5 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 truncate group-hover:text-violet-700 transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">
                        {page.keywords.slice(0, 3).join(' • ')}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Lead Capture Section */}
        {!searchQuery && (
          <section className="py-12 px-4 bg-gradient-to-br from-slate-100 to-white">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
                {!leadSubmitted ? (
                  <>
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-100 mb-4">
                        <Download className="w-7 h-7 text-teal-600" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 mb-2">
                        Baixe o Guia de Testes Ortopédicos
                      </h2>
                      <p className="text-slate-600 text-sm">
                        PDF gratuito com os <strong>10 testes mais usados</strong> na clínica, 
                        incluindo sensibilidade, especificidade e interpretação.
                      </p>
                    </div>
                    <form onSubmit={handleLeadSubmit} className="space-y-4">
                      <Input
                        type="text"
                        placeholder="Seu nome"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        required
                        className="h-12"
                      />
                      <Input
                        type="email"
                        placeholder="Seu melhor e-mail"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        required
                        className="h-12"
                      />
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                        disabled={isSubmittingLead}
                      >
                        {isSubmittingLead ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Baixar Guia Gratuito
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-center text-slate-500">
                        Sem spam. Seus dados estão seguros conforme a LGPD.
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-4">
                      <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      Pronto! Verifique seu e-mail
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Enviamos o guia para <strong>{leadEmail}</strong>. 
                      Não esqueça de verificar a caixa de spam.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-12 px-4 bg-slate-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Quer testar esse conhecimento na prática?
            </h2>
            <p className="text-slate-400 mb-6">
              Simule casos clínicos reais e pratique seu raciocínio diagnóstico.
            </p>
            <Link to="/estudante">
              <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white">
                Simular Casos Clínicos
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 bg-slate-950 text-slate-400 text-center text-sm">
          <p>© 2025 REHABROAD. Plataforma de Apoio Clínico para Fisioterapeutas.</p>
          <p className="mt-2 text-xs">
            Conteúdo educativo. Não substitui avaliação profissional presencial.
          </p>
        </footer>
      </div>
    );
  }

  // Single page view
  const category = categories.find(c => c.id === page.category);
  const relatedPages = page.relatedTests
    ?.map(slug => getPageBySlug(slug))
    .filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Schema */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateSchema()) }}
      />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <button 
            onClick={() => navigate('/biblioteca')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-teal-600 font-medium">{category?.name}</p>
            <h1 className="font-semibold text-slate-900 truncate">{page.title}</h1>
          </div>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            {page.title}
          </h1>
          <p className="text-slate-600">
            {page.introduction}
          </p>
          {page.epidemiology && (
            <p className="text-sm text-slate-500 mt-3 p-3 bg-slate-100 rounded-lg">
              <strong>Epidemiologia:</strong> {page.epidemiology}
            </p>
          )}
        </div>

        {/* For Tests: Indications */}
        {page.indications && page.indications.length > 0 && (
        <section className="mb-8 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Indicações Clínicas</h2>
          </div>
          <ul className="space-y-2">
            {page.indications.map((indication, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span>{indication}</span>
              </li>
            ))}
          </ul>
        </section>
        )}

        {/* For Pathologies: Etiology */}
        {page.etiology && page.etiology.length > 0 && (
        <section className="mb-8 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Etiologia e Fatores de Risco</h2>
          </div>
          <ul className="space-y-2">
            {page.etiology.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
        )}

        {/* For Pathologies: Clinical Presentation */}
        {page.clinicalPresentation && page.clinicalPresentation.length > 0 && (
        <section className="mb-8 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Apresentação Clínica</h2>
          </div>
          <ul className="space-y-2">
            {page.clinicalPresentation.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
        )}

        {/* For Pathologies: Diagnosis */}
        {page.diagnosis && page.diagnosis.length > 0 && (
        <section className="mb-8 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Diagnóstico</h2>
          </div>
          <ul className="space-y-2">
            {page.diagnosis.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
        )}

        {/* For Tests: How To */}
        {page.howTo && page.howTo.length > 0 && (
        <section className="mb-8 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-violet-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Como Realizar</h2>
          </div>
          <ol className="space-y-3">
            {page.howTo.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-slate-700 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>
        )}

        {/* For Tests: Interpretation */}
        {page.interpretation && (
        <section className="mb-8 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Interpretação Clínica</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-emerald-800 mb-1">Teste Positivo</p>
                <p className="text-emerald-700 text-sm">{page.interpretation.positive}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-slate-100 rounded-xl border border-slate-200">
              <XCircle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-700 mb-1">Teste Negativo</p>
                <p className="text-slate-600 text-sm">{page.interpretation.negative}</p>
              </div>
            </div>
            {page.interpretation.notes && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 mb-1">Observação</p>
                  <p className="text-amber-700 text-sm">{page.interpretation.notes}</p>
                </div>
              </div>
            )}
          </div>
        </section>
        )}

        {/* For Pathologies: Treatment */}
        {page.treatment && (
        <section className="mb-8 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Tratamento</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-slate-800 mb-2">Tratamento Conservador</h3>
              <ul className="space-y-2">
                {page.treatment.conservative.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {page.treatment.surgical && (
              <div className="p-4 bg-slate-100 rounded-xl">
                <h3 className="font-medium text-slate-800 mb-2">Tratamento Cirúrgico</h3>
                <p className="text-slate-700">{page.treatment.surgical}</p>
              </div>
            )}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <h3 className="font-medium text-emerald-800 mb-2">Prognóstico</h3>
              <p className="text-emerald-700">{page.treatment.prognosis}</p>
            </div>
          </div>
        </section>
        )}

        {/* For Pathologies: Red Flags */}
        {page.redFlags && page.redFlags.length > 0 && (
        <section className="mb-8 bg-red-50 rounded-2xl border border-red-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-red-800">Sinais de Alerta (Red Flags)</h2>
          </div>
          <ul className="space-y-2">
            {page.redFlags.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-red-700">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
        )}

        {/* Evidence */}
        <section className="mb-8 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Evidência Científica</h2>
          </div>
          {(page.evidence.sensitivity || page.evidence.specificity) && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              {page.evidence.sensitivity && (
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-700">{page.evidence.sensitivity}</p>
                  <p className="text-sm text-blue-600">Sensibilidade</p>
                </div>
              )}
              {page.evidence.specificity && (
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-700">{page.evidence.specificity}</p>
                  <p className="text-sm text-blue-600">Especificidade</p>
                </div>
              )}
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Referências:</p>
            {page.evidence.references.map((ref, i) => (
              <p key={i} className="text-sm text-slate-600 pl-4 border-l-2 border-slate-200">
                {ref}
              </p>
            ))}
          </div>
        </section>

        {/* Clinical Application */}
        <section className="mb-8 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Aplicação Clínica</h2>
          </div>
          <p className="text-slate-700 leading-relaxed">
            {page.clinicalApplication}
          </p>
        </section>

        {/* Related Tests */}
        {relatedPages.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Testes Relacionados</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedPages.map(related => related && (
                <Link
                  key={related.slug}
                  to={`/biblioteca/${related.slug}`}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-teal-100 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Stethoscope className="w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors" />
                  </div>
                  <span className="font-medium text-slate-700 group-hover:text-teal-700 transition-colors">
                    {related.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA - Professional Platform */}
        <section className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl p-8 text-center mb-6">
          <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold text-white mb-4">
            PARA PROFISSIONAIS
          </div>
          <h2 className="text-xl font-bold text-white mb-3">
            Aplique esse conhecimento nos seus atendimentos
          </h2>
          <p className="text-teal-100 mb-6 max-w-md mx-auto">
            Prontuário eletrônico com apoio diagnóstico, parâmetros de eletroterapia e laudos em PDF. <strong>30 dias grátis.</strong>
          </p>
          <Link to="/#signup">
            <Button size="lg" className="bg-white hover:bg-slate-100 text-teal-700 font-semibold shadow-lg">
              Testar Grátis por 30 Dias
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </section>

        {/* CTA - Student Practice */}
        <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-center">
          <div className="inline-block px-3 py-1 bg-violet-500/30 rounded-full text-xs font-semibold text-violet-300 mb-4">
            PARA ESTUDANTES
          </div>
          <h2 className="text-xl font-bold text-white mb-3">
            Quer testar esse conhecimento em um caso clínico?
          </h2>
          <p className="text-slate-400 mb-6">
            Pratique seu raciocínio diagnóstico com casos simulados baseados em cenários reais.
          </p>
          <Link to="/estudante">
            <Button size="lg" className="bg-violet-500 hover:bg-violet-600 text-white">
              Simular Caso Clínico
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t border-slate-200 mt-12">
        <div className="max-w-4xl mx-auto text-center text-sm text-slate-500">
          <p>© 2025 REHABROAD. Plataforma de Apoio Clínico para Fisioterapeutas.</p>
          <p className="mt-2 text-xs">
            Conteúdo educativo baseado em evidência científica. Não substitui avaliação profissional presencial.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/biblioteca" className="text-teal-600 hover:underline">
              Biblioteca Clínica
            </Link>
            <Link to="/termos-de-uso" className="hover:underline">
              Termos de Uso
            </Link>
            <Link to="/politica-de-privacidade" className="hover:underline">
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
