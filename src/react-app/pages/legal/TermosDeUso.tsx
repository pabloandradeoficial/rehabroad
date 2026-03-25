import { FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";

export default function TermosDeUsoPage() {
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
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Termos de Uso</h1>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm space-y-6">
          <p className="text-lg font-medium text-foreground">
            Termos de Uso – REHABROAD
          </p>

          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              <strong>1. Natureza da Plataforma</strong><br />
              O REHABROAD é uma plataforma digital de apoio à documentação clínica, destinada 
              exclusivamente a fisioterapeutas devidamente inscritos em Conselho Regional de 
              Fisioterapia (CREFITO), conforme a Lei nº 6.316/75 e resoluções do COFFITO.
            </p>

            <p>
              <strong>2. Finalidade</strong><br />
              A plataforma tem como finalidade auxiliar na organização de prontuário eletrônico, 
              registro de evolução clínica e apoio à documentação profissional. O REHABROAD é uma 
              ferramenta de apoio e não substitui o julgamento clínico do profissional.
            </p>

            <p>
              <strong>3. Autonomia Profissional</strong><br />
              Em conformidade com a Lei nº 8.856/94 e a Resolução COFFITO nº 414/2012, o 
              diagnóstico fisioterapêutico, a prescrição e a execução do tratamento são de 
              competência exclusiva do fisioterapeuta. A plataforma não realiza diagnóstico, 
              não prescreve tratamentos e não substitui a avaliação presencial.
            </p>

            <p>
              <strong>4. Responsabilidade Profissional</strong><br />
              O uso da plataforma é de inteira responsabilidade do fisioterapeuta usuário, que 
              responde ética, civil e profissionalmente pelas informações registradas, condutas 
              adotadas e decisões clínicas tomadas, conforme o Código de Ética Profissional 
              (Resolução COFFITO nº 424/2013).
            </p>

            <p>
              <strong>5. Prontuário Eletrônico</strong><br />
              Os registros realizados na plataforma devem seguir as diretrizes da Resolução 
              COFFITO nº 414/2012, que dispõe sobre o prontuário do paciente, sendo obrigatórios 
              os registros de avaliação, diagnóstico fisioterapêutico e evolução do tratamento.
            </p>

            <p>
              <strong>6. Assinatura e Pagamento</strong><br />
              O plano mensal no valor de R$ 29,00 concede acesso aos módulos adicionais do sistema 
              mediante pagamento recorrente. O não pagamento poderá resultar em suspensão automática 
              do acesso aos recursos premium.
            </p>

            <p>
              <strong>7. Cancelamento</strong><br />
              O usuário pode solicitar cancelamento a qualquer momento, cessando futuras cobranças. 
              Os dados do prontuário permanecem disponíveis conforme legislação vigente.
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
