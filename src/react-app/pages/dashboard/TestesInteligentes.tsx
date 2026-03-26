import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Stethoscope, 
  AlertTriangle, 
  ChevronRight,
  Search,
  User,
  MapPin,
  Info,
  CheckCircle2,
  Sparkles,
  Target,
  BookOpen,
  PlayCircle,
  Lightbulb,
  Activity,
  FileText,
  Zap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { usePatients } from "@/react-app/hooks/usePatients";
import { useSuporte } from "@/react-app/hooks/useSuporte";
import PremiumGate from "@/react-app/components/PremiumGate";
import { PageTransition, Spinner } from "@/react-app/components/ui/microinteractions";
import { 
  testesOrtopedicos,
  regioes, 
  type TesteOrtopedico 
} from "@/react-app/data/testesOrtopedicos";

// Mapeamento de locais de dor para regiões de teste
const localParaRegiao: Record<string, string> = {
  "pescoço": "cervical",
  "cervical": "cervical",
  "nuca": "cervical",
  "lombar": "lombar",
  "costas": "lombar",
  "coluna": "lombar",
  "ciático": "lombar",
  "ciática": "lombar",
  "ombro": "ombro",
  "cotovelo": "cotovelo",
  "punho": "punho",
  "mão": "punho",
  "carpo": "punho",
  "quadril": "quadril",
  "virilha": "quadril",
  "joelho": "joelho",
  "tornozelo": "tornozelo",
  "pé": "tornozelo",
};

// Ícones por categoria
const categoriaIcons: Record<string, React.ReactNode> = {
  "Impacto Subacromial": <Target className="w-4 h-4" />,
  "Impacto": <Target className="w-4 h-4" />,
  "Manguito Rotador": <Activity className="w-4 h-4" />,
  "Instabilidade": <Zap className="w-4 h-4" />,
  "Tendinopatia do Bíceps": <Activity className="w-4 h-4" />,
  "Radiculopatia": <Sparkles className="w-4 h-4" />,
  "Tensão Neural": <Sparkles className="w-4 h-4" />,
  "Facetário/Estenose": <Target className="w-4 h-4" />,
  "Epicondilite Lateral": <Activity className="w-4 h-4" />,
  "Epicondilite Medial": <Activity className="w-4 h-4" />,
  "Síndrome do Túnel do Carpo": <Sparkles className="w-4 h-4" />,
  "Tenossinovite de De Quervain": <Activity className="w-4 h-4" />,
  "Articulação/Sacroilíaca": <Target className="w-4 h-4" />,
  "Impacto Femoroacetabular": <Target className="w-4 h-4" />,
  "Encurtamento Muscular": <Activity className="w-4 h-4" />,
  "Banda Iliotibial": <Activity className="w-4 h-4" />,
  "Ligamento Cruzado Anterior": <Zap className="w-4 h-4" />,
  "Ligamento Cruzado Posterior": <Zap className="w-4 h-4" />,
  "Menisco": <Target className="w-4 h-4" />,
  "Menisco/Ligamentar": <Target className="w-4 h-4" />,
  "Ligamentos Colaterais": <Zap className="w-4 h-4" />,
  "Instabilidade Anterior": <Zap className="w-4 h-4" />,
  "Instabilidade Lateral": <Zap className="w-4 h-4" />,
  "Tendão de Aquiles": <Activity className="w-4 h-4" />,
  "Sindesmose": <Target className="w-4 h-4" />,
};

// Cores por região
const regiaoColors: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
  cervical: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-600 dark:text-violet-400", gradient: "from-violet-500 to-purple-600" },
  lombar: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-600 dark:text-blue-400", gradient: "from-blue-500 to-cyan-600" },
  ombro: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-600 dark:text-emerald-400", gradient: "from-emerald-500 to-teal-600" },
  cotovelo: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-600 dark:text-amber-400", gradient: "from-amber-500 to-orange-600" },
  punho: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-600 dark:text-rose-400", gradient: "from-rose-500 to-pink-600" },
  quadril: { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-600 dark:text-indigo-400", gradient: "from-indigo-500 to-violet-600" },
  joelho: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-600 dark:text-cyan-400", gradient: "from-cyan-500 to-blue-600" },
  tornozelo: { bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-600 dark:text-teal-400", gradient: "from-teal-500 to-emerald-600" },
};

// Card de teste individual expandível
function TesteCard({ teste, expandido, onToggle, index, isRecomendado }: {
  teste: TesteOrtopedico;
  expandido: boolean;
  onToggle: () => void;
  index: number;
  isRecomendado?: boolean;
}) {
  const colors = regiaoColors[teste.regiao] || regiaoColors.ombro;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div 
        className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
          expandido 
            ? `${colors.border} ${colors.bg} shadow-lg` 
            : "border-border/50 hover:border-border bg-card hover:bg-muted/30"
        }`}
      >
        {/* Header clicável */}
        <button
          onClick={onToggle}
          className="w-full p-5 text-left"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white shadow-lg`}>
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground truncate">{teste.nome}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary" className={`text-xs ${colors.bg} ${colors.text} border-0`}>
                      {categoriaIcons[teste.tags?.categoria] || <Target className="w-3 h-3" />}
                      <span className="ml-1">{teste.tags?.categoria || "Geral"}</span>
                    </Badge>
                    {isRecomendado && (
                      <Badge className="text-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 border gap-1">
                        <Sparkles className="w-3 h-3" />
                        Recomendado
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{teste.objetivo}</p>
            </div>
            <motion.div
              animate={{ rotate: expandido ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 mt-1"
            >
              <ChevronRight className={`w-5 h-5 ${expandido ? colors.text : "text-muted-foreground"}`} />
            </motion.div>
          </div>
        </button>

        {/* Conteúdo expandido */}
        <AnimatePresence>
          {expandido && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-4 border-t border-border/50 pt-4">
                {/* Execução */}
                {teste.execucao && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <PlayCircle className="w-4 h-4 text-primary" />
                      Como Executar
                    </div>
                    <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 text-sm text-muted-foreground leading-relaxed border border-border/30">
                      {teste.execucao}
                    </div>
                  </div>
                )}

                {/* Resultado Positivo */}
                {teste.resultadoPositivo && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Resultado Positivo
                    </div>
                    <div className="bg-emerald-500/10 rounded-xl p-4 text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed border border-emerald-500/20">
                      {teste.resultadoPositivo}
                    </div>
                  </div>
                )}

                {/* Interpretação */}
                {teste.interpretacao && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      Interpretação Clínica
                    </div>
                    <div className="bg-amber-500/10 rounded-xl p-4 text-sm text-amber-700 dark:text-amber-300 leading-relaxed border border-amber-500/20">
                      {teste.interpretacao}
                    </div>
                  </div>
                )}

                {/* Tags/Indicações */}
                {teste.tags?.indicacoes && teste.tags.indicacoes.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                      <FileText className="w-3 h-3" />
                      Indicações
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {teste.tags.indicacoes.map((ind, i) => (
                        <Badge key={i} variant="outline" className="text-xs font-normal">
                          {ind}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Grupo de testes por categoria
function CategoriaGroup({
  categoria,
  testes,
  testeExpandido,
  onToggleTeste,
  regiao,
  isRecomendado
}: {
  categoria: string;
  testes: TesteOrtopedico[];
  testeExpandido: string | null;
  onToggleTeste: (id: string) => void;
  regiao: string;
  isRecomendado?: boolean;
}) {
  const [expandida, setExpandida] = useState(true);
  const colors = regiaoColors[regiao] || regiaoColors.ombro;

  return (
    <div className="space-y-3">
      <button
        onClick={() => setExpandida(!expandida)}
        className="flex items-center gap-3 w-full group"
      >
        <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center ${colors.text}`}>
          {categoriaIcons[categoria] || <Target className="w-4 h-4" />}
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {categoria}
          </h3>
          <p className="text-xs text-muted-foreground">{testes.length} teste{testes.length > 1 ? "s" : ""}</p>
        </div>
        <motion.div animate={{ rotate: expandida ? 90 : 0 }}>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expandida && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-3 pl-11 overflow-hidden"
          >
            {testes.map((teste, index) => (
              <TesteCard
                key={teste.id}
                teste={teste}
                expandido={testeExpandido === teste.id}
                onToggle={() => onToggleTeste(teste.id)}
                index={index}
                isRecomendado={isRecomendado}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Botão de região anatômica
function RegiaoButton({ 
  regiao, 
  label, 
  selected, 
  onClick,
  count,
  detected
}: { 
  regiao: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  count: number;
  detected?: boolean;
}) {
  const colors = regiaoColors[regiao] || regiaoColors.ombro;
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
        selected 
          ? `${colors.border} ${colors.bg} shadow-lg` 
          : "border-border/50 hover:border-border bg-card hover:bg-muted/30"
      }`}
    >
      {detected && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 shadow-lg">
            <Sparkles className="w-3 h-3 mr-0.5" />
            Auto
          </Badge>
        </div>
      )}
      <div className={`w-10 h-10 rounded-xl mb-3 bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white shadow-lg`}>
        <MapPin className="w-5 h-5" />
      </div>
      <h3 className={`font-semibold ${selected ? colors.text : "text-foreground"}`}>{label}</h3>
      <p className="text-xs text-muted-foreground mt-0.5">{count} testes</p>
    </motion.button>
  );
}

function TestesInteligentesContent() {
  const { patients, loading: patientsLoading } = usePatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const { suporte, loading: suporteLoading } = useSuporte(selectedPatientId || null);
  
  const [regiaoSelecionada, setRegiaoSelecionada] = useState<string>("");
  const [testeExpandido, setTesteExpandido] = useState<string | null>(null);

  // Detectar região automaticamente baseado no local da dor
  const regiaoDetectada = useMemo(() => {
    const localDor = suporte?.evaluation?.pain_location;
    if (!localDor || typeof localDor !== "string") return null;
    
    const local = localDor.toLowerCase().trim();
    for (const [keyword, regiao] of Object.entries(localParaRegiao)) {
      if (local.includes(keyword)) {
        return regiao;
      }
    }
    return null;
  }, [suporte?.evaluation?.pain_location]);

  // Região efetiva (manual tem prioridade)
  const regiaoEfetiva = regiaoSelecionada || regiaoDetectada || "";

  // Buscar testes filtrados pela região
  const testesFiltrados = useMemo(() => {
    if (!regiaoEfetiva) return [];
    return testesOrtopedicos.filter(t => t.regiao === regiaoEfetiva);
  }, [regiaoEfetiva]);

  // Agrupar testes por categoria
  const testesPorCategoria = useMemo(() => {
    const grupos: Record<string, TesteOrtopedico[]> = {};
    testesFiltrados.forEach(teste => {
      const cat = teste.tags?.categoria || "Outros";
      if (!grupos[cat]) grupos[cat] = [];
      grupos[cat].push(teste);
    });
    return grupos;
  }, [testesFiltrados]);

  // Contar testes por região
  const contagemPorRegiao = useMemo(() => {
    const contagem: Record<string, number> = {};
    Object.keys(regioes).forEach(r => {
      contagem[r] = testesOrtopedicos.filter(t => t.regiao === r).length;
    });
    return contagem;
  }, []);

  // Extrair dados do paciente
  const localDor = suporte?.evaluation?.pain_location || "";
  const queixaPrincipal = suporte?.evaluation?.chief_complaint || "";

  // Loading
  if (patientsLoading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white shadow-xl shadow-primary/25">
                <Stethoscope className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Testes Inteligentes
                </h1>
                <p className="text-muted-foreground">
                  Biblioteca completa de testes ortopédicos organizados por região
                </p>
              </div>
            </div>

            {/* Seletor de paciente */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="flex-1 max-w-md">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Selecione um paciente para sugestões personalizadas
                </label>
                <Select value={selectedPatientId} onValueChange={(v) => {
                  setSelectedPatientId(v);
                  setRegiaoSelecionada("");
                  setTesteExpandido(null);
                }}>
                  <SelectTrigger className="bg-background/80 backdrop-blur-sm">
                    <User className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Selecionar paciente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.length === 0 ? (
                      <SelectItem value="empty" disabled>Nenhum paciente cadastrado</SelectItem>
                    ) : (
                      patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Dados do paciente (se selecionado) */}
        {selectedPatientId && !suporteLoading && (localDor || queixaPrincipal) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-muted/50 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Info className="w-4 h-4 text-primary" />
                  </div>
                  Informações do Paciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {localDor && (
                    <div className="p-4 rounded-2xl bg-background border border-border/50">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Local da Dor</span>
                      <p className="mt-1.5 font-medium">{localDor}</p>
                      {regiaoDetectada && (
                        <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary border-0">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {regioes[regiaoDetectada]} detectado
                        </Badge>
                      )}
                    </div>
                  )}
                  {queixaPrincipal && (
                    <div className="p-4 rounded-2xl bg-background border border-border/50">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Queixa Principal</span>
                      <p className="mt-1.5 font-medium line-clamp-2">{queixaPrincipal}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Grid de regiões anatômicas */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Selecione a Região Anatômica</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(regioes).map(([key, label]) => (
              <RegiaoButton
                key={key}
                regiao={key}
                label={label}
                selected={regiaoEfetiva === key}
                onClick={() => {
                  setRegiaoSelecionada(key);
                  setTesteExpandido(null);
                }}
                count={contagemPorRegiao[key] || 0}
                detected={key === regiaoDetectada}
              />
            ))}
          </div>
        </div>

        {/* Testes da região selecionada */}
        {regiaoEfetiva && (
          <motion.div
            key={regiaoEfetiva}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${regiaoColors[regiaoEfetiva]?.gradient || "from-primary to-primary/70"} flex items-center justify-center text-white shadow-lg`}>
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        Testes para {regioes[regiaoEfetiva]}
                      </CardTitle>
                      <CardDescription>
                        {testesFiltrados.length} teste{testesFiltrados.length > 1 ? "s" : ""} disponíve{testesFiltrados.length > 1 ? "is" : "l"}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {Object.keys(testesPorCategoria).length} categoria{Object.keys(testesPorCategoria).length > 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {testesFiltrados.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Nenhum teste encontrado para esta região.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {selectedPatientId && regiaoDetectada && regiaoDetectada === regiaoEfetiva && (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                            Testes Recomendados para este Paciente
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Todos os testes abaixo são relevantes para o local de dor identificado na avaliação.
                          </p>
                        </div>
                      </div>
                    )}
                    {Object.entries(testesPorCategoria).map(([categoria, testes]) => (
                      <CategoriaGroup
                        key={categoria}
                        categoria={categoria}
                        testes={testes}
                        testeExpandido={testeExpandido}
                        onToggleTeste={(id) => setTesteExpandido(testeExpandido === id ? null : id)}
                        regiao={regiaoEfetiva}
                        isRecomendado={!!(selectedPatientId && regiaoDetectada && regiaoDetectada === regiaoEfetiva)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Estado vazio - nenhuma região selecionada */}
        {!regiaoEfetiva && (
          <Card className="border-dashed border-2 bg-muted/30">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Search className="w-8 h-8 text-primary/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Selecione uma região anatômica
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Escolha uma região acima para visualizar os testes ortopédicos disponíveis 
                {!selectedPatientId && " ou selecione um paciente para sugestões automáticas"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Aviso legal */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex gap-4 py-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <strong>Aviso:</strong> As informações são para apoio clínico e <strong>não substituem o julgamento profissional</strong>. 
              Este módulo não diagnostica e não prescreve tratamentos.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}

export default function TestesInteligentesPage() {
  return (
    <PremiumGate moduleName="Testes Inteligentes">
      <TestesInteligentesContent />
    </PremiumGate>
  );
}
