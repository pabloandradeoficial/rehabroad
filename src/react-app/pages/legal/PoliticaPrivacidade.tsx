import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";

export default function PoliticaPrivacidadePage() {
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
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Política de Privacidade</h1>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm space-y-6">
          <p className="text-lg font-medium text-foreground">
            Política de Privacidade – REHABROAD (LGPD)
          </p>

          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              <strong>1. Coleta de Dados</strong><br />
              A plataforma realiza a coleta e armazenamento de dados fornecidos pelo usuário 
              profissional (fisioterapeuta) e dados clínicos inseridos no sistema referentes 
              aos pacientes atendidos.
            </p>

            <p>
              <strong>2. Dados Sensíveis</strong><br />
              Os dados tratados podem incluir informações pessoais e dados sensíveis de saúde, 
              sendo utilizados exclusivamente para fins de organização clínica e acompanhamento 
              profissional, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </p>

            <p>
              <strong>3. Sigilo Profissional</strong><br />
              Em conformidade com o Código de Ética Profissional (Resolução COFFITO nº 424/2013), 
              o fisioterapeuta é responsável pela manutenção do sigilo profissional sobre as 
              informações dos pacientes. A plataforma fornece os meios técnicos de proteção, 
              mas a responsabilidade pelo uso adequado é do profissional.
            </p>

            <p>
              <strong>4. Segurança</strong><br />
              A plataforma compromete-se a adotar medidas de segurança técnicas e administrativas 
              para proteção das informações armazenadas, incluindo criptografia e controle de acesso.
            </p>

            <p>
              <strong>5. Compartilhamento</strong><br />
              Os dados não serão compartilhados com terceiros, exceto por obrigação legal ou 
              mediante autorização expressa do profissional e/ou paciente.
            </p>

            <p>
              <strong>6. Direitos do Titular</strong><br />
              O usuário e os pacientes cujos dados estejam registrados poderão solicitar acesso, 
              correção ou exclusão de dados armazenados, respeitando prazos legais de guarda de 
              prontuário estabelecidos pelo COFFITO e legislação civil.
            </p>

            <p>
              <strong>7. Retenção de Dados</strong><br />
              Os dados do prontuário eletrônico serão mantidos pelo prazo mínimo estabelecido 
              pela legislação aplicável à guarda de documentos de saúde.
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
