import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import {
  ArrowLeft,
  Search,
  BookOpen,
  Lightbulb,
  Target,
  Stethoscope,
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  Star,
  Bone,
  Trophy,
  HeartPulse,
  Brain,
  FileText,
  FlaskConical,
} from "lucide-react";

const areaIcons: Record<string, React.ReactNode> = {
  Bone: <Bone className="w-8 h-8" />,
  Trophy: <Trophy className="w-8 h-8" />,
  HeartPulse: <HeartPulse className="w-8 h-8" />,
  Brain: <Brain className="w-8 h-8" />
};
import { educationalContents, areas, type EducationalContent } from "@/data/libraryContent";

// Map content areas to clinical case categories
const areaToCaseMapping: Record<string, string> = {
  'ortopedia': 'ombro',
  'esportiva': 'joelho',
  'geriatria': 'coluna',
  'neurologia': 'neurologia'
};

interface ContentLibraryProps {
  onBack: () => void;
  onTestCase?: (area: string) => void;
}

export default function ContentLibrary({ onBack, onTestCase }: ContentLibraryProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [completedContent, setCompletedContent] = useState<string[]>(() => {
    const saved = localStorage.getItem("rehabroad_library_completed");
    return saved ? JSON.parse(saved) : [];
  });

  const markAsCompleted = (contentId: string) => {
    const newCompleted = completedContent.includes(contentId)
      ? completedContent.filter(id => id !== contentId)
      : [...completedContent, contentId];
    setCompletedContent(newCompleted);
    localStorage.setItem("rehabroad_library_completed", JSON.stringify(newCompleted));
  };

  const filteredContents = educationalContents.filter(content => {
    const matchesArea = !selectedArea || content.area === selectedArea;
    const matchesSearch = !searchQuery ||
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesArea && matchesSearch;
  });

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'basico':
        return { label: 'Básico', color: 'bg-emerald-500/20 text-emerald-400' };
      case 'intermediario':
        return { label: 'Intermediário', color: 'bg-amber-500/20 text-amber-400' };
      case 'avancado':
        return { label: 'Avançado', color: 'bg-red-500/20 text-red-400' };
      default:
        return { label: difficulty, color: 'bg-slate-700 text-slate-400' };
    }
  };

  const ModulePage = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );

  // Content detail view
  const difficulty = selectedContent ? getDifficultyBadge(selectedContent.difficulty) : null;
  const area = selectedContent ? areas.find(a => a.id === selectedContent.area) : null;
  const isCompleted = selectedContent ? completedContent.includes(selectedContent.id) : false;

  return (
    <AnimatePresence mode="wait">
      {selectedContent ? (
        <ModulePage key="detail" className="min-h-screen bg-slate-950 pb-24 md:pb-8">
        {/* Header */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
            <button
              onClick={() => setSelectedContent(null)}
              className="flex items-center gap-2 text-slate-300 hover:text-white mb-3 sm:mb-4 transition-colors touch-manipulation p-1 -ml-1"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Voltar</span>
            </button>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${area?.gradient} text-white flex items-center justify-center flex-shrink-0`}>
                {area?.iconName && areaIcons[area.iconName]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-2">
                  {difficulty && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${difficulty.color}`}>
                    {difficulty.label}
                  </span>
                  )}
                  <span className="text-slate-400 text-xs sm:text-sm">{area?.name}</span>
                </div>
                <h1 className="text-lg sm:text-2xl font-bold text-white leading-tight">{selectedContent.title}</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
          {/* Explanation */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-2 text-teal-400 mb-2 sm:mb-3">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <h2 className="font-semibold text-sm sm:text-base text-teal-400">Explicação</h2>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">{selectedContent.explanation}</p>
          </div>

          {/* Topics */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-2 text-slate-300 mb-3 sm:mb-4">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
              <h2 className="font-semibold text-sm sm:text-base text-white">Principais Tópicos</h2>
            </div>
            <ul className="space-y-2">
              {selectedContent.topics.map((topic, index) => (
                <li key={index} className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs sm:text-sm font-medium shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-slate-300 text-sm sm:text-base">{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Points */}
          <div className="bg-amber-500/5 border-l-4 border-amber-500 rounded-r-xl p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <h2 className="font-semibold text-sm sm:text-base text-white">Pontos-Chave</h2>
            </div>
            <ul className="space-y-2 sm:space-y-3">
              {selectedContent.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 sm:gap-3">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 mt-1 shrink-0" />
                  <span className="text-slate-300 text-sm sm:text-base">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical Application */}
          <div className="bg-teal-500/5 border-l-4 border-teal-500 rounded-r-xl p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
              <h2 className="font-semibold text-sm sm:text-base text-white">Aplicação Clínica</h2>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">{selectedContent.clinicalApplication}</p>
          </div>

          {/* References */}
          {selectedContent.references && selectedContent.references.length > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 text-slate-400 mb-3 sm:mb-4">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                <h2 className="font-semibold text-sm sm:text-base text-white">Referências Científicas</h2>
              </div>
              <ol className="space-y-2 list-decimal list-inside">
                {selectedContent.references.map((reference, index) => (
                  <li key={index} className="text-xs sm:text-sm text-slate-500 leading-relaxed pl-1 italic">
                    <span className="text-slate-500">{reference}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4 pb-20 sm:pb-4">
            {onTestCase && areaToCaseMapping[selectedContent.area] && (
              <Button
                onClick={() => onTestCase(areaToCaseMapping[selectedContent.area])}
                className="flex-1 bg-violet-600 hover:bg-violet-700 text-white gap-2 h-12 sm:h-10 touch-manipulation"
              >
                <FlaskConical className="w-5 h-5" />
                Testar em Caso Clínico
              </Button>
            )}
            <Button
              onClick={() => markAsCompleted(selectedContent.id)}
              className={`flex-1 gap-2 h-12 sm:h-10 text-sm sm:text-base touch-manipulation ${
                isCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              {isCompleted ? 'Concluído ✓' : 'Marcar como Concluído'}
            </Button>
          </div>
        </div>
      </ModulePage>
      ) : (
      <ModulePage key="list" className="min-h-screen bg-slate-950 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <button
            onClick={selectedArea ? () => setSelectedArea(null) : onBack}
            className="flex items-center gap-2 text-slate-300 hover:text-white mb-3 sm:mb-4 transition-colors touch-manipulation p-1 -ml-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">{selectedArea ? 'Todas as áreas' : 'Voltar'}</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
            Biblioteca de Conteúdo
          </h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            {selectedArea
              ? `${areas.find(a => a.id === selectedArea)?.name}`
              : 'Material organizado por áreas'
            }
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        {/* Progress Stats */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-400">Seu progresso</p>
                <p className="font-bold text-white text-sm sm:text-base">
                  {completedContent.length}/{educationalContents.length} conteúdos
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="w-20 sm:w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${(completedContent.length / educationalContents.length) * 100}%` }}
                />
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
                {Math.round((completedContent.length / educationalContents.length) * 100)}%
              </p>
            </div>
          </div>
        </div>

        {!selectedArea ? (
          /* Area Selection Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {areas.map((area) => {
              const areaContents = educationalContents.filter(c => c.area === area.id);
              const completedInArea = areaContents.filter(c => completedContent.includes(c.id)).length;

              return (
                <button
                  key={area.id}
                  onClick={() => setSelectedArea(area.id)}
                  className="bg-slate-800/60 border border-slate-700/50 hover:border-teal-500/30 rounded-xl p-4 sm:p-6 text-left active:scale-[0.98] transition-all group touch-manipulation"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${area.gradient} text-white flex items-center justify-center`}>
                      {areaIcons[area.iconName]}
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-teal-400 transition-colors" />
                  </div>
                  <h3 className="font-bold text-white text-base sm:text-lg mb-0.5 sm:mb-1">{area.name}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{area.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-slate-300">
                      {areaContents.length} conteúdos
                    </span>
                    <span className="text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full bg-slate-700 text-slate-400">
                      {completedInArea}/{areaContents.length}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Content List */
          <div>
            {/* Search */}
            <div className="relative mb-4 sm:mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Buscar conteúdo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 sm:h-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500 text-base sm:text-sm"
              />
            </div>

            {/* Content Cards */}
            <div className="space-y-2 sm:space-y-3">
              {filteredContents.map((content) => {
                const difficulty = getDifficultyBadge(content.difficulty);
                const isCompleted = completedContent.includes(content.id);

                return (
                  <button
                    key={content.id}
                    onClick={() => setSelectedContent(content)}
                    className={`w-full rounded-xl p-4 sm:p-5 text-left border transition-all group active:scale-[0.98] touch-manipulation ${
                      isCompleted
                        ? 'border-teal-500/30 bg-teal-500/5'
                        : 'bg-slate-800/60 border-slate-700/50 hover:border-teal-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${difficulty.color}`}>
                            {difficulty.label}
                          </span>
                          {isCompleted && (
                            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                              Concluído
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-white group-hover:text-teal-400 transition-colors text-sm sm:text-base">
                          {content.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1 line-clamp-2">
                          {content.explanation}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-teal-400 shrink-0 transition-colors" />
                    </div>
                  </button>
                );
              })}

              {filteredContents.length === 0 && (
                <div className="text-center py-8 sm:py-12 text-slate-500">
                  <Search className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm sm:text-base">Nenhum conteúdo encontrado</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ModulePage>
      )}
    </AnimatePresence>
  );
}
