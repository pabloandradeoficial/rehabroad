import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="px-6 py-8">
        {/* Professional Identity Marker */}
        <div className="text-center mb-6">
          <p className="text-sm font-medium text-muted-foreground">
            RehabRoad – Plataforma de Apoio Clínico
          </p>
        </div>

        {/* Aviso Legal */}
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <p className="text-sm text-amber-700 dark:text-amber-400 text-center">
            <strong>REHABROAD</strong> é uma ferramenta de apoio à documentação clínica. 
            Não substitui avaliação presencial, diagnóstico fisioterapêutico nem conduta terapêutica do 
            profissional responsável, conforme a Lei nº 8.856/94 e resoluções do COFFITO.
          </p>
        </div>

        {/* Links Jurídicos */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <Link 
            to="/termos-de-uso" 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Termos de Uso
          </Link>
          <span className="text-muted-foreground/30">•</span>
          <Link 
            to="/politica-de-privacidade" 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Política de Privacidade
          </Link>
          <span className="text-muted-foreground/30">•</span>
          <Link 
            to="/politica-de-cancelamento" 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Política de Cancelamento
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2026 REHABROAD. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
