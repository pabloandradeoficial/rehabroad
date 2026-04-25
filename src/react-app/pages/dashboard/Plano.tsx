import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { CheckCircle2, Sparkles, Crown, Check, Route, HeartPulse, Bell, FileText, XCircle, AlertTriangle, ClipboardCheck, Clock, Brain, Star, Zap, Award, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { Checkbox } from "@/react-app/components/ui/checkbox";
import { useSubscription } from "@/react-app/contexts/SubscriptionContext";
import { cn } from "@/react-app/lib/utils";
import { motion } from "framer-motion";
import { Spinner, useToast } from "@/react-app/components/ui/microinteractions";
import { MobileHeader } from "@/react-app/components/layout/MobileHeader";

const benefits = [
  "Ferramenta de apoio à organização do raciocínio clínico",
  "Documentação complementar estruturada ao prontuário",
  "Pontos de atenção baseados nas informações registradas",
  "NeuroFlux: apoio à decisão em eletroterapia com evidências científicas",
  "Indicadores visuais para acompanhamento dos prontuários",
  "Exportação de relatórios profissionais em PDF"
];

const featuresIncluidas = [
  "✓ Prontuário completo",
  "✓ Apoio Clínico com IA",
  "✓ NeuroFlux eletroterapia",
  "✓ Caminho Clínico",
  "✓ Exercícios filtrados por quadro clínico",
  "✓ Dashboard de progresso",
  "✓ Agenda + Financeiro",
  "✓ Exportação PDF",
  "✓ Testes clínicos validados",
  "✓ Comunidade de fisioterapeutas",
  "✓ Rehab Friend (IA)",
  "✓ Scribe Clínico",
  "✓ Plano Domiciliar (HEP)",
];

const modules = [
  { name: "Caminho", icon: Route, description: "Documentação complementar estruturada" },
  { name: "Apoio Clínico", icon: HeartPulse, description: "Pontos de atenção ao raciocínio clínico" },
  { name: "Testes Inteligentes", icon: ClipboardCheck, description: "Sugestão de testes clínicos por região anatômica" },
  { name: "Indicadores", icon: Bell, description: "Visualização do status dos prontuários" },
  { name: "Exportação", icon: FileText, description: "Relatórios profissionais em PDF" },
  { name: "NeuroFlux", icon: Brain, description: "Apoio à decisão em eletroterapia com parâmetros baseados em evidências" }
];

const plans = [
  {
    id: "monthly",
    name: "Mensal",
    price: 97,
    priceLabel: "97",
    period: "/mês",
    subtitle: "Cobrança mensal recorrente",
    description: "Acesso completo · Cancele quando quiser",
    highlight: false,
    savings: null,
    perks: ["Rehab Friend (15 msgs/dia)", "Scribe Clínico", "Plano Domiciliar (HEP)", "Suporte prioritário"],
  },
  {
    id: "semestral",
    name: "Semestral",
    price: 77,
    priceLabel: "77",
    period: "/mês",
    subtitle: "R$ 462 cobrado a cada 6 meses",
    description: "Equivale a 2 meses grátis",
    highlight: true,
    savings: "Economia de R$ 120/ano",
    perks: ["Tudo do Mensal", "2 meses grátis por semestre", "Prioridade em novidades"],
  },
  {
    id: "annual",
    name: "Anual",
    price: 67,
    priceLabel: "67",
    period: "/mês",
    subtitle: "R$ 804 cobrado anualmente",
    description: "Equivale a 4 meses grátis",
    highlight: false,
    savings: "Economia de R$ 360/ano",
    perks: ["Tudo do Semestral", "4 meses grátis por ano", "Suporte VIP", "Atualizações vitalícias"],
  },
];

export default function PlanoPage() {
  const { isPremium, isBetaTrial, isActivePaid, trialDaysRemaining, loading, refreshSubscription } = useSubscription();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState("semestral");
  const [activating, setActivating] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const success = searchParams.get("success") === "true";
  const canceled = searchParams.get("canceled") === "true";

  // Refresh subscription status when returning from Stripe
  useEffect(() => {
    if (success) {
      refreshSubscription();
      toast.showSuccess("Assinatura ativada com sucesso!");
    }
    if (canceled) {
      toast.showInfo("Checkout cancelado.");
    }
  }, [success, canceled, refreshSubscription, toast]);

  // Clear URL params after showing message
  useEffect(() => {
    if (success || canceled) {
      const timer = setTimeout(() => {
        setSearchParams({});
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, canceled, setSearchParams]);

  const handleActivate = async () => {
    if (!termsAccepted) {
      setError("Você precisa aceitar os termos para continuar.");
      return;
    }

    setActivating(true);
    setError(null);

    try {
      const response = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan: selectedPlan })
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Erro ao criar sessão de pagamento");
        setActivating(false);
      }
    } catch {
      setError("Erro ao conectar com o servidor");
      setActivating(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Tem certeza que deseja cancelar sua assinatura? Você perderá o acesso às ferramentas premium.")) {
      return;
    }

    setCanceling(true);
    setError(null);

    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
        credentials: "include"
      });

      if (response.ok) {
        refreshSubscription();
      } else {
        const data = await response.json();
        setError(data.error || "Erro ao cancelar assinatura");
      }
    } catch {
      setError("Erro ao conectar com o servidor");
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <>
      <div className="md:hidden">
        <MobileHeader />
      </div>
      <>
      <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Planos Premium</h1>
          {isBetaTrial && (
            <Badge className="bg-primary text-white">Beta Trial</Badge>
          )}
          {isActivePaid && (
            <Badge className="bg-emerald-500 text-white">Ativo</Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Escolha o plano ideal para suas necessidades
        </p>
      </motion.div>

      {/* Success Message */}
      {success && (
        <Card className="mb-6 bg-card border-border border-l-4 border-l-emerald-500 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <div>
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                Pagamento confirmado!
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-500">
                Seu plano foi ativado com sucesso. Aproveite todas as ferramentas!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Canceled Message */}
      {canceled && (
        <Card className="mb-6 bg-card border-border border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="font-semibold text-yellow-700 dark:text-yellow-400">
                Pagamento cancelado
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-500">
                Você pode tentar novamente quando quiser.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Beta Trial Status */}
      {isBetaTrial && trialDaysRemaining !== null && (
        <Card className="mb-6 bg-card border-border border-l-4 border-l-primary shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            <div className="flex-1">
              <p className="font-semibold text-primary">
                Período Beta Ativo
              </p>
              <p className="text-sm text-muted-foreground">
                {trialDaysRemaining === 0
                  ? "Último dia do período beta - aproveite todos os recursos!"
                  : `${trialDaysRemaining} ${trialDaysRemaining === 1 ? "dia restante" : "dias restantes"} de acesso completo`
                }
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{trialDaysRemaining}</p>
              <p className="text-xs text-muted-foreground">{trialDaysRemaining === 1 ? "dia" : "dias"}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trial nudge banner */}
      {!isPremium && (
        <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-xl p-4 text-center mb-8">
          <p className="text-teal-800 dark:text-teal-300 font-medium">
            🎉 Você está no período de teste gratuito de 30 dias
          </p>
          <p className="text-teal-600 dark:text-teal-400 text-sm mt-1">
            Escolha um plano antes do período terminar para continuar tendo acesso.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <Card className="mb-6 bg-card border-border border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-500" />
            <div>
              <p className="font-semibold text-red-700 dark:text-red-400">
                Erro
              </p>
              <p className="text-sm text-red-600 dark:text-red-500">
                {error}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Subscription Status */}
      {isPremium && (
        <Card className="mb-6 bg-card border-border border-l-4 border-l-emerald-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-lg">
                    Plano Premium Ativo
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Você tem acesso a todas as ferramentas de apoio clínico
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCancel}
                disabled={canceling}
                variant="outline"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                {canceling ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Cancelando...
                  </>
                ) : (
                  "Cancelar assinatura"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid - always visible */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              onClick={() => !isPremium && setSelectedPlan(plan.id)}
              className={cn(
                "transition-all duration-200 relative overflow-hidden",
                !isPremium && "cursor-pointer",
                !isPremium && selectedPlan === plan.id
                  ? "border-2 border-primary ring-2 ring-primary/20 bg-primary/5"
                  : "border-border",
                !isPremium && selectedPlan !== plan.id && "hover:border-primary/50",
                plan.highlight && !isPremium && "md:-translate-y-2"
              )}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-xs font-semibold py-1 text-center">
                  <Star className="w-3 h-3 inline mr-1" />
                  Mais Popular
                </div>
              )}
              
              <CardContent className={cn("p-6", plan.highlight && "pt-10")}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                  {!isPremium && (
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      selectedPlan === plan.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    )}>
                      {selectedPlan === plan.id && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <span className="text-4xl font-bold text-foreground">{plan.priceLabel}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{plan.subtitle}</p>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                </div>

                {plan.savings && (
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 mb-3">
                    {plan.savings}
                  </Badge>
                )}

                <ul className="space-y-1 mt-2">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

      {/* NeuroFlux Bonus Section */}
      <Card className="mb-8 border-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl" />
        
        <CardContent className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Icon and Badge */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full p-1.5 shadow-lg">
                  <Gift className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg px-3 py-1">
                  <Award className="w-3 h-3 mr-1" />
                  BÔNUS EXCLUSIVO
                </Badge>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                NeuroFlux
                <span className="text-amber-300 ml-2">✨</span>
              </h3>
              
              <p className="text-white/90 text-lg mb-4 max-w-2xl">
                Sistema inteligente de apoio à decisão clínica em <span className="font-semibold text-amber-300">eletroterapia</span>. 
                Receba recomendações personalizadas com parâmetros baseados em evidências científicas atualizadas.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { icon: Zap, label: "TENS" },
                  { icon: Zap, label: "Ultrassom" },
                  { icon: Zap, label: "Laser" },
                  { icon: Zap, label: "Termoterapia" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                    <item.icon className="w-4 h-4 text-amber-300" />
                    <span className="text-white text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Value highlight */}
            <div className="flex-shrink-0 text-center md:text-right">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Valor incluído</p>
                <p className="text-amber-300 font-bold text-xl">GRÁTIS</p>
                <p className="text-white/80 text-xs mt-1">em todos os planos</p>
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Parâmetros Precisos", desc: "Frequência, intensidade, tempo e técnica de aplicação" },
                { title: "Base Científica", desc: "Referências e níveis de evidência para cada modalidade" },
                { title: "Contraindicações", desc: "Alertas de segurança e precauções importantes" }
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{feature.title}</p>
                    <p className="text-white/70 text-xs">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Benefits & Checkout Card */}
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          
          <CardHeader className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <CardTitle>Recursos Premium</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="relative">
            {/* All-inclusive features list */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Tudo incluído em todos os planos
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {featuresIncluidas.map((feature) => (
                  <span key={feature} className="text-sm text-foreground/80">{feature}</span>
                ))}
              </div>
            </div>

            <div className={cn("space-y-3 border-t border-border pt-4", !isPremium && "mb-6")}>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            {!isPremium && (
              <div className="space-y-4">
                {/* Selected Plan Summary */}
                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">Plano selecionado:</span>
                    <span className="font-bold text-primary">
                      {selectedPlanData?.name} - R$ {selectedPlanData?.price}
                    </span>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => {
                      setTermsAccepted(checked === true);
                      setError(null);
                    }}
                    className="mt-0.5"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    Li e concordo com os{" "}
                    <Link to="/termos-de-uso" className="text-primary hover:underline" target="_blank">
                      Termos de Uso
                    </Link>
                    ,{" "}
                    <Link to="/politica-de-privacidade" className="text-primary hover:underline" target="_blank">
                      Política de Privacidade
                    </Link>
                    {" "}e{" "}
                    <Link to="/politica-de-cancelamento" className="text-primary hover:underline" target="_blank">
                      Política de Cancelamento
                    </Link>
                  </label>
                </div>

                <Button
                  onClick={handleActivate}
                  disabled={activating || !termsAccepted}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 disabled:opacity-50"
                >
                  {activating ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Redirecionando...
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      Ativar Plano {selectedPlanData?.name}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Pagamento processado de forma segura via Stripe
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modules Unlocked */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground text-lg">
            Ferramentas de Apoio {isPremium ? "Ativas" : ""}
          </h3>
          
          {modules.map((module) => (
            <Card 
              key={module.name} 
              className={isPremium ? "border-emerald-500/30 bg-emerald-500/5" : "border-muted"}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isPremium 
                    ? "bg-emerald-500/20 text-emerald-500" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  <module.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{module.name}</h4>
                    {isPremium && (
                      <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                        <Check className="w-3 h-3 mr-1" />
                        Ativo
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}

        </div>
      </div>
    </div>
    </>
    </>
  );
}
