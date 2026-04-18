import { useState, useEffect } from "react";
import {
  GraduationCap,
  Trophy,
  Target,
  BookOpen,
  Activity,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { Spinner } from "@/react-app/components/ui/microinteractions";
import { apiFetch } from "@/react-app/lib/api";

interface Student {
  id: number;
  user_id: string;
  user_email: string;
  user_name: string;
  cases_completed: number;
  cases_correct: number;
  modules_visited: string[];
  last_module: string;
  total_time_minutes: number;
  created_at: string;
  updated_at: string;
}

interface StudentStats {
  totalStudents: number;
  activeToday: number;
  totalCases: number;
  avgAccuracy: number;
}

const MODULE_NAMES: Record<string, string> = {
  "pain-map": "Mapa da Dor",
  muscles: "Músculos-Chave",
  tests: "Testes Ortopédicos",
  treatments: "Condutas Iniciais",
  cases: "Casos Clínicos",
};

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data?.reason === "string" && data.reason.trim()) {
      return data.reason;
    }
    if (typeof data?.error === "string" && data.error.trim()) {
      return data.error;
    }
    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export default function AdminEstudante() {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await apiFetch("/api/admin/students", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(await parseErrorMessage(res, "Acesso não autorizado"));
      }

      const data = await res.json();
      setStudents(data.students || []);
      setStats(data.stats || null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="p-8">
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-destructive">
                <GraduationCap className="w-6 h-6" />
                <p className="font-medium">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Painel Estudantes</h1>
            <p className="text-muted-foreground">Acompanhe o uso do Modo Estudante</p>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-8 h-8 text-violet-500" />
                  <div>
                    <p className="text-2xl font-bold text-violet-700">{stats.totalStudents}</p>
                    <p className="text-xs text-violet-600">Total Estudantes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-8 h-8 text-emerald-500" />
                  <div>
                    <p className="text-2xl font-bold text-emerald-700">{stats.activeToday}</p>
                    <p className="text-xs text-emerald-600">Ativos Hoje</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold text-blue-700">{stats.totalCases}</p>
                    <p className="text-xs text-blue-600">Casos Resolvidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-amber-500" />
                  <div>
                    <p className="text-2xl font-bold text-amber-700">{stats.avgAccuracy}%</p>
                    <p className="text-xs text-amber-600">Média Acertos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Uso por Módulo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(MODULE_NAMES).map(([key, name]) => {
                const count = students.filter((s) => s.modules_visited?.includes(key)).length;
                const percentage = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
                return (
                  <div key={key} className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{count}</p>
                    <p className="text-xs text-muted-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">({percentage}%)</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-violet-500" />
              Estudantes Cadastrados ({students.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Nome</th>
                    <th className="text-left py-3 px-2 font-medium">Email</th>
                    <th className="text-center py-3 px-2 font-medium">Casos</th>
                    <th className="text-center py-3 px-2 font-medium">Acertos</th>
                    <th className="text-center py-3 px-2 font-medium">Módulos</th>
                    <th className="text-left py-3 px-2 font-medium">Cadastro</th>
                    <th className="text-left py-3 px-2 font-medium">Último Acesso</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const accuracy =
                      student.cases_completed > 0
                        ? Math.round((student.cases_correct / student.cases_completed) * 100)
                        : 0;

                    return (
                      <tr key={student.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2 font-medium">{student.user_name || "-"}</td>
                        <td className="py-3 px-2 text-muted-foreground">{student.user_email}</td>
                        <td className="py-3 px-2 text-center">
                          <Badge variant="outline" className="gap-1">
                            <Trophy className="w-3 h-3" />
                            {student.cases_completed}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Badge className={accuracy >= 70 ? "bg-emerald-500" : accuracy >= 50 ? "bg-amber-500" : "bg-slate-400"}>
                            {accuracy}%
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Badge variant="secondary">
                            {student.modules_visited?.length || 0}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground text-xs">
                          {formatDate(student.created_at)}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground text-xs">
                          {formatDate(student.updated_at)}
                        </td>
                      </tr>
                    );
                  })}

                  {students.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        Nenhum estudante cadastrado ainda
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}