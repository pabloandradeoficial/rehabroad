import { useState, useMemo } from 'react';
import { ArrowLeft, Search, MessageSquare, ClipboardList, AlertTriangle, FileText, ChevronRight, BookOpen, AlertCircle, Lightbulb, XCircle } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { getAnamneseByCategory, type AnamneseTopic } from '@/data/educationalModules';

interface AnamneseModuleProps {
  onBack: () => void;
}

const categories = [
  { id: 'all', name: 'Todos', icon: BookOpen },
  { id: 'entrevista', name: 'Entrevista', icon: MessageSquare },
  { id: 'avaliacao', name: 'Avaliação Física', icon: ClipboardList },
  { id: 'bandeiras', name: 'Bandeiras', icon: AlertTriangle },
  { id: 'documentacao', name: 'Documentação', icon: FileText }
];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  entrevista: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  avaliacao: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  bandeiras: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  documentacao: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' }
};

export default function AnamneseModule({ onBack }: AnamneseModuleProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<AnamneseTopic | null>(null);

  const filteredTopics = useMemo(() => {
    let topics = getAnamneseByCategory(selectedCategory);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      topics = topics.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
    }
    return topics;
  }, [selectedCategory, searchQuery]);

  if (selectedTopic) {
    const colors = categoryColors[selectedTopic.category];
    return (
      <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => setSelectedTopic(null)} className="gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Title Card */}
          <div className={`rounded-2xl p-6 ${colors.bg} ${colors.border} border`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                {selectedTopic.category === 'entrevista' && <MessageSquare className={`w-6 h-6 ${colors.text}`} />}
                {selectedTopic.category === 'avaliacao' && <ClipboardList className={`w-6 h-6 ${colors.text}`} />}
                {selectedTopic.category === 'bandeiras' && <AlertTriangle className={`w-6 h-6 ${colors.text}`} />}
                {selectedTopic.category === 'documentacao' && <FileText className={`w-6 h-6 ${colors.text}`} />}
              </div>
              <div>
                <span className={`text-xs font-medium ${colors.text} uppercase tracking-wide`}>
                  {categories.find(c => c.id === selectedTopic.category)?.name}
                </span>
                <h1 className="text-2xl font-bold text-slate-900 mt-1">{selectedTopic.name}</h1>
                <p className="text-slate-600 mt-2">{selectedTopic.description}</p>
              </div>
            </div>
          </div>

          {/* Key Questions */}
          {selectedTopic.keyQuestions && selectedTopic.keyQuestions.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Perguntas-Chave
              </h2>
              <div className="space-y-3">
                {selectedTopic.keyQuestions.map((question, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-slate-700 italic">"{question}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Techniques */}
          {selectedTopic.techniques && selectedTopic.techniques.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-emerald-600" />
                Técnicas e Ferramentas
              </h2>
              <div className="grid gap-3">
                {selectedTopic.techniques.map((technique, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl">
                    <ChevronRight className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">{technique}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Red Flags */}
          {selectedTopic.redFlags && selectedTopic.redFlags.length > 0 && (
            <div className="bg-white rounded-2xl border border-rose-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Sinais de Alerta
              </h2>
              <div className="grid gap-2">
                {selectedTopic.redFlags.map((flag, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">{flag}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Tips */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              Dicas Clínicas
            </h2>
            <div className="grid gap-2">
              {selectedTopic.clinicalTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
                  <p className="text-slate-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-slate-500" />
              Erros Comuns a Evitar
            </h2>
            <div className="grid gap-2">
              {selectedTopic.commonMistakes.map((mistake, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-100 rounded-xl">
                  <XCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-600">{mistake}</p>
                </div>
              ))}
            </div>
          </div>

          {/* References */}
          <div className="bg-slate-100 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Referências
            </h2>
            <ul className="space-y-1">
              {selectedTopic.references.map((ref, idx) => (
                <li key={idx} className="text-sm text-slate-600">{ref}</li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <h1 className="text-lg font-semibold text-slate-900">Anamnese e Avaliação</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Anamnese e Avaliação</h2>
              <p className="text-blue-100 text-sm">Entrevista clínica, exame físico e documentação</p>
            </div>
          </div>
          <p className="text-blue-100 text-sm">
            Domine as técnicas de coleta de história clínica, avaliação física sistemática e identificação de bandeiras vermelhas.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar tópico..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Topics Grid */}
        <div className="grid gap-4">
          {filteredTopics.map(topic => {
            const colors = categoryColors[topic.category];
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className="bg-white rounded-xl border border-slate-200 p-5 text-left hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      {topic.category === 'entrevista' && <MessageSquare className={`w-5 h-5 ${colors.text}`} />}
                      {topic.category === 'avaliacao' && <ClipboardList className={`w-5 h-5 ${colors.text}`} />}
                      {topic.category === 'bandeiras' && <AlertTriangle className={`w-5 h-5 ${colors.text}`} />}
                      {topic.category === 'documentacao' && <FileText className={`w-5 h-5 ${colors.text}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                          {categories.find(c => c.id === topic.category)?.name}
                        </span>
                        {topic.redFlags && topic.redFlags.length > 0 && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                            {topic.redFlags.length} alertas
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {topic.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{topic.description}</p>
                      {topic.keyQuestions && (
                        <p className="text-xs text-slate-400 mt-2">
                          {topic.keyQuestions.length} perguntas-chave
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                </div>
              </button>
            );
          })}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Nenhum tópico encontrado</p>
          </div>
        )}
      </main>
    </div>
  );
}
