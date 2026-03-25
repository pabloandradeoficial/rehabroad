import { useParams, Link, useNavigate } from "react-router";
import { 
  Stethoscope, 
  Zap, 
  ClipboardList, 
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  BookOpen,
  ExternalLink
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { getArtigoBySlug, artigos, categorias } from "@/data/bibliotecaClinica";
import { useEffect } from "react";

const iconMap: Record<string, React.ElementType> = {
  Stethoscope,
  Zap,
  ClipboardList,
  AlertTriangle
};

export default function BibliotecaArtigo() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const artigo = getArtigoBySlug(slug || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!artigo) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Artigo não encontrado</h1>
          <Link to="/biblioteca">
            <Button className="bg-teal-600 hover:bg-teal-700">
              Voltar para Biblioteca
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const catInfo = categorias.find(c => c.id === artigo.category);
  const Icon = catInfo ? iconMap[catInfo.icon] : Stethoscope;

  // Related articles
  const relatedArtigos = artigos
    .filter(a => a.category === artigo.category && a.id !== artigo.id)
    .slice(0, 3);

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": artigo.title,
    "description": artigo.metaDescription,
    "author": {
      "@type": "Organization",
      "name": "REHABROAD"
    },
    "publisher": {
      "@type": "Organization",
      "name": "REHABROAD",
      "logo": {
        "@type": "ImageObject",
        "url": "https://rehabroad.com.br/favicon.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://rehabroad.com.br/biblioteca/${artigo.slug}`
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* SEO Meta via useEffect would go here in a real app */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">REHABROAD</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link to="/biblioteca">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Biblioteca
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Article Header */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/biblioteca" className="hover:text-white">Biblioteca</Link>
            <span>/</span>
            <span className="text-teal-400">{artigo.categoryLabel}</span>
          </nav>

          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4 ${
            artigo.category === "testes-ortopedicos" ? "bg-blue-500/20 text-blue-400" :
            artigo.category === "eletroterapia" ? "bg-amber-500/20 text-amber-400" :
            artigo.category === "escalas-clinicas" ? "bg-emerald-500/20 text-emerald-400" :
            "bg-red-500/20 text-red-400"
          }`}>
            {Icon && <Icon className="w-4 h-4" />}
            {artigo.categoryLabel}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            {artigo.title}
          </h1>

          <p className="text-lg text-slate-300">
            {artigo.resumo}
          </p>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          
          {/* O que é */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-teal-400" />
              O que é
            </h2>
            <p className="text-slate-300 leading-relaxed">
              {artigo.oQueE}
            </p>
          </section>

          {/* Como realizar */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Stethoscope className="w-6 h-6 text-teal-400" />
              Como realizar
            </h2>
            <div className="space-y-3">
              {artigo.comoRealizar.map((step, index) => (
                <div key={index} className="flex items-start gap-3 bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <span className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-slate-300">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Interpretação clínica */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-teal-400" />
              Interpretação clínica
            </h2>
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {artigo.interpretacao}
              </p>
            </div>
          </section>

          {/* Evidência científica */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              Evidência científica
            </h2>
            <div className="bg-emerald-500/10 rounded-xl p-6 border border-emerald-500/20">
              <p className="text-slate-300 leading-relaxed">
                {artigo.evidencia}
              </p>
            </div>
          </section>

          {/* Aplicação clínica */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-amber-400" />
              Aplicação clínica
            </h2>
            <p className="text-slate-300 leading-relaxed">
              {artigo.aplicacao}
            </p>
          </section>

          {/* Dicas práticas */}
          {artigo.dicasPraticas && artigo.dicasPraticas.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-white mb-4">💡 Dicas práticas</h3>
              <ul className="space-y-2">
                {artigo.dicasPraticas.map((dica, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                    {dica}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Cuidados */}
          {artigo.cuidados && artigo.cuidados.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-white mb-4">⚠️ Cuidados e contraindicações</h3>
              <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
                <ul className="space-y-2">
                  {artigo.cuidados.map((cuidado, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-300">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      {cuidado}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* CTA - Integration with Product */}
          <section className="!mt-12">
            <div className="bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-2xl p-6 sm:p-8 border border-teal-500/30 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Executar essa avaliação no RehabRoad
              </h3>
              <p className="text-slate-300 mb-6 max-w-xl mx-auto">
                O RehabRoad integra testes ortopédicos, parâmetros de eletroterapia e escalas 
                diretamente no prontuário eletrônico. Experimente grátis por 30 dias.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/#beta-form")}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Testar Grátis por 30 Dias
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 w-full sm:w-auto">
                    Já tenho conta
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Keywords */}
          <section className="pt-6 border-t border-slate-800">
            <p className="text-sm text-slate-500 mb-3">Palavras-chave:</p>
            <div className="flex flex-wrap gap-2">
              {artigo.keywords.map((keyword, index) => (
                <span key={index} className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </section>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArtigos.length > 0 && (
        <section className="py-12 px-4 sm:px-6 bg-slate-900/50 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-6">Artigos relacionados</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedArtigos.map(related => (
                <Link
                  key={related.id}
                  to={`/biblioteca/${related.slug}`}
                  className="group bg-slate-900 rounded-xl border border-slate-800 hover:border-teal-500/50 p-4 transition-all"
                >
                  <h3 className="font-semibold text-white group-hover:text-teal-400 transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                    {related.resumo}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">REHABROAD</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/blog" className="hover:text-white">Blog</Link>
            <Link to="/biblioteca" className="hover:text-white">Biblioteca</Link>
          </div>
          <p className="text-sm text-slate-500">
            © 2025 REHABROAD
          </p>
        </div>
      </footer>
    </div>
  );
}
