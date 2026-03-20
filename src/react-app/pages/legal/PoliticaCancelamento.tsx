import { XCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";

export default function PoliticaCancelamentoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/dashboard/plano">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
            <XCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Política de Cancelamento</h1>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm space-y-6">
          <p className="text-lg font-medium text-foreground">
            Política de Cancelamento – REHABROAD
          </p>

          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              <strong>1. Cobrança Recorrente</strong><br />
              A assinatura do plano mensal possui cobrança recorrente no valor de R$ 29,00 por mês.
            </p>

            <p>
              <strong>2. Cancelamento</strong><br />
              O cancelamento pode ser realizado a qualquer momento pelo usuário dentro da plataforma, 
              na seção "Plano Mensal".
            </p>

            <p>
              <strong>3. Acesso Após Cancelamento</strong><br />
              O cancelamento impede novas cobranças, permanecendo o acesso ativo aos recursos premium 
              até o final do período já pago.
            </p>

            <p>
              <strong>4. Reembolso</strong><br />
              Não há reembolso proporcional após início do ciclo mensal, conforme o Código de Defesa 
              do Consumidor para serviços digitais de acesso imediato.
            </p>

            <p>
              <strong>5. Inadimplência</strong><br />
              Em caso de inadimplência, o acesso aos recursos premium poderá ser suspenso até 
              regularização. Os dados do prontuário permanecem acessíveis no modo básico.
            </p>

            <p>
              <strong>6. Dados do Prontuário</strong><br />
              Independente do status da assinatura, os dados registrados no prontuário eletrônico 
              permanecem armazenados e acessíveis conforme prazos legais de guarda de documentos 
              de saúde estabelecidos pelo COFFITO.
            </p>
          </div>

          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Vigência: Janeiro de 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
