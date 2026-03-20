import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { AnimateOnScroll, StaggerContainer, StaggerItem } from "@/react-app/components/ui/motion";
import { blogPosts, blogCategories } from "@/data/blogPosts";
import { 
  Activity, 
  Clock, 
  Calendar, 
  ArrowRight, 
  BookOpen,
  Search,
  Tag
} from "lucide-react";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">REHABROAD</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link to="/blog" className="hidden md:block">
              <Button variant="ghost" className="text-teal-400 hover:text-teal-300 hover:bg-white/10">
                Blog
              </Button>
            </Link>
            <Link to="/comparacao" className="hidden md:block">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
                Comparação
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
                Entrar
              </Button>
            </Link>
            <Link to="/">
              <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white hidden sm:flex shadow-lg shadow-teal-500/25">
                Testar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateOnScroll animation="fadeUp">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 rounded-full px-4 py-2 mb-6">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-medium text-teal-300">Blog REHABROAD — Fisioterapia Baseada em Evidências</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Blog de Fisioterapia:{" "}
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Artigos e Protocolos
              </span>
            </h1>
            
            <p className="text-lg text-slate-200 max-w-2xl mx-auto mb-8">
              Conteúdo sobre prontuário eletrônico, parâmetros de eletroterapia, avaliação fisioterapêutica, 
              tratamento de dor lombar, hérnia de disco e muito mais. Atualizado semanalmente.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar artigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 sm:px-6 bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {blogCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-teal-500 text-white"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 px-4 sm:px-6 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-200">Nenhum artigo encontrado.</p>
            </div>
          ) : (
            <StaggerContainer className="grid md:grid-cols-2 gap-6">
              {filteredPosts.map((post) => (
                <StaggerItem key={post.id}>
                  <Link to={`/blog/${post.slug}`}>
                    <article className="group bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-teal-500/50 hover:bg-slate-900 transition-all duration-300">
                      {/* Category Badge */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-400 text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h2 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors mb-3 line-clamp-2">
                        {post.title}
                      </h2>
                      
                      {/* Excerpt */}
                      <p className="text-slate-200 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-slate-300 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(post.publishedAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.readTime} min de leitura</span>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="flex items-center gap-1 text-xs text-slate-300">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Read More */}
                      <div className="flex items-center gap-2 text-teal-400 text-sm font-medium group-hover:gap-3 transition-all">
                        Ler artigo
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </article>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll animation="fadeUp">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Use o REHABROAD na Sua Clínica de Fisioterapia
            </h2>
            <p className="text-slate-200 mb-8">
              Prontuário eletrônico com laudo PDF, parâmetros TENS e apoio diagnóstico.
            </p>
            <Link to="/">
              <Button size="lg" className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-8 shadow-lg shadow-teal-500/25">
                Testar Grátis por 30 Dias
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-5xl mx-auto text-center text-sm text-slate-300">
          <p>© 2025 REHABROAD. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/termos-de-uso" className="hover:text-slate-300">Termos de Uso</Link>
            <Link to="/politica-de-privacidade" className="hover:text-slate-300">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
