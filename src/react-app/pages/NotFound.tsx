import { Link } from "react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Activity,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5">
          <AlertTriangle className="h-10 w-10 text-amber-400" />
        </div>

        <p className="mb-2 text-sm font-semibold text-teal-400">Erro 404</p>

        <h1 className="mb-3 text-3xl font-bold md:text-4xl">
          Página não encontrada
        </h1>

        <p className="mb-8 text-slate-400">
          O endereço que você tentou abrir não existe ou foi movido.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/">
            <Button className="w-full gap-2 sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao site
            </Button>
          </Link>

          <Link to="/dashboard">
            <Button
              variant="outline"
              className="w-full gap-2 border-white/15 bg-white/5 text-white hover:bg-white/10 sm:w-auto"
            >
              <Activity className="h-4 w-4" />
              Ir para área Pro
            </Button>
          </Link>

          <Link to="/estudante">
            <Button
              variant="outline"
              className="w-full gap-2 border-white/15 bg-white/5 text-white hover:bg-white/10 sm:w-auto"
            >
              <GraduationCap className="h-4 w-4" />
              Ir para estudante
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}