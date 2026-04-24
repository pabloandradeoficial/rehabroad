import { useParams, Link, useNavigate } from "react-router";
import ReactMarkdown from "react-markdown";
import { Button } from "@/react-app/components/ui/button";
import { AnimateOnScroll } from "@/react-app/components/ui/motion";
import { getBlogPostBySlug, blogPosts } from "@/data/blogPosts";
import { MiniClinicalCase, blogMiniCases } from "@/react-app/components/MiniClinicalCase";
import { 
  Activity, 
  Clock, 
  Calendar, 
  ArrowLeft, 
  ArrowRight,
  User,
  Tag,
  Share2,
  BookOpen
} from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/react-app/components/ui/microinteractions";

// Map blog post slugs/categories to mini cases
const postToCaseMapping: Record<string, string> = {
  'capsulite-adesiva': 'capsulite-adesiva',
  'ombro-congelado': 'capsulite-adesiva',
  'hernia-discal': 'hernia-discal',
  'lombalgia': 'hernia-discal',
  'dor-lombar': 'hernia-discal',
  'lca': 'lca',
  'ligamento-cruzado': 'lca',
  'lachman': 'lca',
  'joelho': 'lca',
  'banda-iliotibial': 'sbt',
  'corrida': 'sbt',
  'tens': 'tens-parametros',
  'eletroterapia': 'tens-parametros',
  'estimulacao': 'tens-parametros',
};

// FAQ data for specific articles (used for FAQPage schema)
const articleFAQs: Record<string, Array<{ question: string; answer: string }>> = {
  'teste-de-lachman': [
    {
      question: "O Teste de Lachman pode ser realizado em fase aguda?",
      answer: "Sim, o Teste de Lachman pode e deve ser realizado na fase aguda. Na verdade, é mais fidedigno nas primeiras horas após o trauma, antes do edema e espasmo muscular se instalarem. Em casos de hemartrose importante, a aspiração do líquido pode facilitar o exame. Estudos mostram que a sensibilidade do teste diminui após 48-72h devido à resposta inflamatória."
    },
    {
      question: "Qual a diferença entre Lachman e Gaveta Anterior?",
      answer: "A principal diferença está na posição do joelho: o Lachman é realizado com 20-30° de flexão (isquiotibiais relaxados, mais sensível), enquanto a Gaveta Anterior é feita com 90° de flexão (isquiotibiais podem proteger, menos sensível). O Lachman tem sensibilidade de ~85%, enquanto a Gaveta Anterior tem ~70%."
    },
    {
      question: "O teste é válido sem exame de imagem?",
      answer: "Sim, o Teste de Lachman tem alta acurácia e é válido clinicamente mesmo sem ressonância magnética. Em muitos contextos (pronto-atendimento, consultório, beira de campo), o teste clínico é suficiente para diagnóstico presuntivo e tomada de decisão inicial. A ressonância é indicada para confirmar a lesão, avaliar estruturas associadas (meniscos, outros ligamentos) e planejamento cirúrgico."
    }
  ]
};

// Custom SEO titles for specific articles
const customSEOTitles: Record<string, string> = {
  'teste-de-lachman': 'Teste de Lachman: Como Realizar Passo a Passo | Rehabroad'
};

function getMiniCaseForPost(slug: string, category: string): string | null {
  // Check direct slug mapping
  for (const [key, caseId] of Object.entries(postToCaseMapping)) {
    if (slug.includes(key)) return caseId;
  }
  // Check category mapping
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('ombro')) return 'capsulite-adesiva';
  if (categoryLower.includes('coluna') || categoryLower.includes('lombar')) return 'hernia-discal';
  if (categoryLower.includes('joelho') || categoryLower.includes('esport')) return 'lca';
  if (categoryLower.includes('eletro')) return 'tens-parametros';
  return null;
}

// Generate Article schema for SEO
function generateArticleSchema(post: {
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "REHABROAD",
      "logo": {
        "@type": "ImageObject",
        "url": "https://rehabroad.com.br/favicon.png"
      }
    },
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://rehabroad.com.br/blog/${post.slug}`
    },
    "image": "https://rehabroad.com.br/favicon.png"
  };
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (post) {
      // Update document title (use custom SEO title if available)
      document.title = customSEOTitles[post.slug] || `${post.title} | REHABROAD Blog`;
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', post.metaDescription);
      
      // Add Article schema
      let schemaScript = document.getElementById('article-schema') as HTMLScriptElement | null;
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'article-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(generateArticleSchema(post));
      
      // Add FAQPage schema if article has FAQs
      const faqs = articleFAQs[post.slug];
      if (faqs && faqs.length > 0) {
        let faqSchemaScript = document.getElementById('faq-schema') as HTMLScriptElement | null;
        if (!faqSchemaScript) {
          faqSchemaScript = document.createElement('script');
          faqSchemaScript.id = 'faq-schema';
          faqSchemaScript.type = 'application/ld+json';
          document.head.appendChild(faqSchemaScript);
        }
        const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        };
        faqSchemaScript.textContent = JSON.stringify(faqSchema);
      }
      
      // Update Open Graph tags
      const ogTags = [
        { property: 'og:title', content: post.title },
        { property: 'og:description', content: post.excerpt },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: `https://rehabroad.com.br/blog/${post.slug}` },
      ];
      
      ogTags.forEach(({ property, content }) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      });
    }
    
    return () => {
      // Cleanup on unmount
      document.title = 'REHABROAD - Prontuário Eletrônico para Fisioterapeutas';
      // Remove FAQ schema if it exists
      const faqSchema = document.getElementById('faq-schema');
      if (faqSchema) faqSchema.remove();
    };
  }, [slug, post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Artigo não encontrado</h1>
          <Link to="/blog">
            <Button>Voltar ao Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Find related posts (by category and tags)
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id)
    .map(p => {
      let score = 0;
      if (p.category === post.category) score += 3;
      const sharedTags = p.tags.filter(t => post.tags.includes(t));
      score += sharedTags.length;
      return { ...p, score };
    })
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.showSuccess("Link copiado!");
    }
  };

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
            <Link to="/blog">
              <Button variant="ghost" className="text-teal-400 hover:text-teal-300 hover:bg-white/10">
                Blog
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

      {/* Article */}
      <article className="pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <AnimateOnScroll animation="fadeUp">
            <button 
              onClick={() => navigate("/blog")}
              className="flex items-center gap-2 text-slate-200 hover:text-teal-400 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Blog
            </button>
          </AnimateOnScroll>

          {/* Header */}
          <AnimateOnScroll animation="fadeUp">
            <div className="mb-8">
              {/* Category */}
              <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-400 text-sm font-semibold rounded-full mb-4">
                {post.category}
              </span>
              
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
                {post.title}
              </h1>
              
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-200 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} min de leitura</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-slate-800/50 text-slate-200 text-xs rounded-full">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Share Button */}
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg transition-colors text-sm"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar
              </button>
            </div>
          </AnimateOnScroll>

          {/* Content */}
          <AnimateOnScroll animation="fadeUp">
            <div
              className="prose prose-invert prose-lg max-w-none
                prose-headings:!text-white prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:!text-white prose-p:leading-relaxed
                prose-strong:!text-white prose-strong:font-semibold
                prose-ul:!text-white prose-ol:!text-white
                prose-li:!text-white prose-li:my-1
                prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline
                prose-hr:border-slate-600
                prose-blockquote:border-l-teal-500 prose-blockquote:bg-slate-800/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:!text-white
                [&_*]:!text-white [&_a]:!text-teal-400
              "
            >
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </AnimateOnScroll>

          {/* Mini Clinical Case - Interactive learning */}
          {getMiniCaseForPost(post.slug, post.category) && blogMiniCases[getMiniCaseForPost(post.slug, post.category)!] && (
            <AnimateOnScroll animation="fadeUp">
              <div className="mt-10">
                <MiniClinicalCase 
                  miniCase={blogMiniCases[getMiniCaseForPost(post.slug, post.category)!]} 
                />
              </div>
            </AnimateOnScroll>
          )}

          {/* CTA Box */}
          <AnimateOnScroll animation="fadeUp">
            <div className="mt-12 p-8 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Coloque em prática com o RehabRoad
                  </h3>
                  <p className="text-white/90 mb-4">
                    Prontuário eletrônico pensado por fisioterapeutas. Avaliação estruturada, 
                    apoio à decisão clínica e parâmetros de eletroterapia baseados em evidência.
                  </p>
                  <Link to="/">
                    <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white">
                      Testar Grátis por 30 Dias
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <AnimateOnScroll animation="fadeUp">
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-white mb-6">Artigos Relacionados</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
                      <div className="group p-5 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-teal-500/50 transition-all h-full">
                        <span className="text-xs text-teal-400 font-medium">{relatedPost.category}</span>
                        <h3 className="text-white font-semibold mt-2 group-hover:text-teal-400 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-slate-200 text-sm mt-2 line-clamp-2">{relatedPost.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          )}

          {/* More Articles */}
          <AnimateOnScroll animation="fadeUp">
            <div className="mt-12 p-6 bg-slate-900/30 border border-slate-800 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Continue Lendo</h3>
              <div className="space-y-3">
                {blogPosts
                  .filter(p => p.id !== post.id && !relatedPosts.find(r => r.id === p.id))
                  .slice(0, 5)
                  .map(p => (
                    <Link 
                      key={p.id} 
                      to={`/blog/${p.slug}`}
                      className="block text-slate-300 hover:text-teal-400 transition-colors text-sm"
                    >
                      → {p.title}
                    </Link>
                  ))}
              </div>
              <Link to="/blog" className="inline-block mt-4 text-teal-400 hover:text-teal-300 text-sm font-medium">
                Ver todos os artigos →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </article>

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

