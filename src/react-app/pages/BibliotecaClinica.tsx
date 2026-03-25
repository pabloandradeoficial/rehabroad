import { Link } from "react-router";
import { 
  Stethoscope, 
  Zap, 
  ClipboardList, 
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Search
} from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { artigos, categorias } from "@/data/bibliotecaClinica";

const iconMap: Record<string, React.ElementType> = {
  Stethoscope,
  Zap,
  ClipboardList,
  AlertTriangle
};

export default function BibliotecaClinica() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArtigos = useMemo(() => {
    return artigos.filter(artigo => {
      const matchesSearch = searchTerm === "" || 
        artigo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artigo.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || artigo.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">REHABROAD</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Entrar
              </Button>
            </Link>
            <Link to="/#beta-form">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                Testar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-medium text-teal-300">Conteúdo Educacional Gratuito</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Biblioteca Clínica para Fisioterapeutas
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Guias práticos sobre testes ortopédicos, eletroterapia, escalas clínicas e red flags. 
            Baseados em evidência científica.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              type="text"
              placeholder="Buscar por teste, técnica ou tema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory 
                  ? "bg-teal-600 text-white" 
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Todos ({artigos.length})
            </button>
            {categorias.map(cat => {
              const Icon = iconMap[cat.icon];
              const count = artigos.filter(a => a.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.id 
                      ? "bg-teal-600 text-white" 
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {filteredArtigos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Nenhum artigo encontrado para sua busca.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtigos.map(artigo => {
                const catInfo = categorias.find(c => c.id === artigo.category);
                const Icon = catInfo ? iconMap[catInfo.icon] : Stethoscope;
                
                return (
                  <Link
                    key={artigo.id}
                    to={`/biblioteca/${artigo.slug}`}
                    className="group bg-slate-900 rounded-xl border border-slate-800 hover:border-teal-500/50 p-6 transition-all hover:shadow-lg hover:shadow-teal-500/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        artigo.category === "testes-ortopedicos" ? "bg-blue-500/20 text-blue-400" :
                        artigo.category === "eletroterapia" ? "bg-amber-500/20 text-amber-400" :
                        artigo.category === "escalas-clinicas" ? "bg-emerald-500/20 text-emerald-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {Icon && <Icon className="w-6 h-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-xs font-medium uppercase tracking-wide ${
                          artigo.category === "testes-ortopedicos" ? "text-blue-400" :
                          artigo.category === "eletroterapia" ? "text-amber-400" :
                          artigo.category === "escalas-clinicas" ? "text-emerald-400" :
                          "text-red-400"
                        }`}>
                          {artigo.categoryLabel}
                        </span>
                        <h2 className="text-lg font-semibold text-white mt-1 group-hover:text-teal-400 transition-colors line-clamp-2">
                          {artigo.title}
                        </h2>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-400 mt-4 line-clamp-3">
                      {artigo.resumo}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-4 text-teal-400 text-sm font-medium">
                      <span>Ler artigo</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Aplique esse conhecimento na prática
          </h2>
          <p className="text-slate-400 mb-8">
            O RehabRoad integra testes ortopédicos, parâmetros de eletroterapia e escalas diretamente na sua avaliação.
          </p>
          <Link to="/#beta-form">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8">
              Testar Grátis por 30 Dias
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
            <Link to="/termos" className="hover:text-white">Termos</Link>
          </div>
          <p className="text-sm text-slate-500">
            © 2025 REHABROAD. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
