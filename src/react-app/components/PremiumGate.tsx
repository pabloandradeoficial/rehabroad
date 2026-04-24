/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate } from "react-router";
import { Lock, CheckCircle2, Sparkles, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { useSubscription } from "@/react-app/contexts/SubscriptionContext";

interface PremiumGateProps {
  children: React.ReactNode;
  moduleName: string;
}

const benefits = [
  "Ferramenta de apoio à organização do raciocínio clínico",
  "Documentação complementar estruturada ao prontuário",
  "Pontos de atenção baseados nas informações registradas",
  "Apoio à decisão respeitando sua autonomia profissional",
  "Indicadores visuais para acompanhamento dos prontuários",
  "Exportação de relatórios profissionais em PDF"
];

export default function PremiumGate({ children, moduleName: _moduleName }: PremiumGateProps) {
  const { isPremium, isBetaTrial, trialDaysRemaining, loading } = useSubscription();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show trial badge if user is in beta trial
  if (isPremium && isBetaTrial && trialDaysRemaining !== null) {
    return (
      <div className="space-y-4">
        {/* Trial banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Período Beta Ativo</p>
              <p className="text-sm text-muted-foreground">
                {trialDaysRemaining === 0 
                  ? "Último dia do período beta" 
                  : `${trialDaysRemaining} ${trialDaysRemaining === 1 ? "dia restante" : "dias restantes"}`
                }
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/plano")}>
            Ver Plano
          </Button>
        </div>
        {children}
      </div>
    );
  }

  if (isPremium) {
    return <>{children}</>;
  }

  // Trial expired or free_limited - show block screen
  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <CardContent className="p-8 relative">
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
              <Lock className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Trial expired message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Seu período Beta foi concluído
            </h2>
            <p className="text-muted-foreground">
              Continue com acesso completo à plataforma por R$ 29/mês
            </p>
          </div>

          {/* Unlock CTA */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-6 mb-8 border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">
                Plano Profissional
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-primary">R$ 29</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Acesso completo às ferramentas de apoio à organização clínica
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-8">
            <h4 className="font-semibold text-foreground mb-4">Recursos disponíveis:</h4>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="bg-muted/50 rounded-xl p-4 mb-8 border-l-4 border-primary">
            <p className="text-sm italic text-muted-foreground">
              "Ferramentas de apoio para organizar sua documentação clínica de forma estruturada e profissional."
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => navigate("/dashboard/plano")}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
            >
              Ativar Plano Profissional
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="w-full"
            >
              Continuar com acesso básico
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
