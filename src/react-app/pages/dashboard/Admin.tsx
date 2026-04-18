import { useState, useEffect } from "react";
import {
  Users, UserCheck, Mail, CreditCard, Calendar, TrendingUp, Clock, Shield, FileText,
  Download, BarChart3, Activity, MessageSquare, ClipboardList, Stethoscope, CalendarDays,
  GraduationCap, Trophy, Target, BookOpen, Eye, AlertTriangle, Timer
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { Button } from "@/react-app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/react-app/components/ui/tabs";
import { Spinner, useToast } from "@/react-app/components/ui/microinteractions";
import { apiFetch } from "@/react-app/lib/api";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  waitlistCount: number;
  leadsCount: number;
  paidSubscriptions: number;
  registeredToday: number;
  registeredThisWeek: number;
}

interface EngagementData {
  averages: {
    patientsPerUser: number;
    evaluationsPerPatient: number;
    evolutionsPerPatient: number;
  };
  totals: {
    forumPosts: number;
    forumComments: number;
    appointments: number;
    reportExports: number;
  };
  featureAdoption: {
    patients: number;
    evaluations: number;
    evolutions: number;
    appointments: number;
    forum: number;
  };
  topUsers: {
    user_id: string;
    plan_type: string;
    status: string;
    patients: number;
    evaluations: number;
    evolutions: number;
    appointments: number;
    posts: number;
  }[];
}

interface User {
  user_id: string;
  plan_type: string;
  status: string;
  is_active: number;
  is_admin: number;
  created_at: string;
  trial_start_date: string | null;
  stripe_customer_id: string | null;
  patients_count: number;
  evaluations_count: number;
  last_activity: string | null;
}

interface WaitlistEntry {
  id: number;
  name: string | null;
  email: string;
  is_approved: number;
  created_at: string;
}

interface Lead {
  id: number;
  name: string;
  email: string;
  source: string;
  created_at: string;
}

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

interface ViewStats {
  total: number;
  today: number;
  week: number;
  month: number;
  uniqueVisitors: number;
  dailyViews: { date: string; views: number }[];
}

interface ExportEmail {
  name: string | null;
  email: string;
  source: string;
  created_at: string;
}

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

export default function Admin() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [engagement, setEngagement] = useState<EngagementData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);
  const [viewStats, setViewStats] = useState<ViewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        statsRes,
        usersRes,
        waitlistRes,
        leadsRes,
        engagementRes,
        studentsRes,
        viewsRes,
      ] = await Promise.all([
        apiFetch("/api/admin/stats", { method: "GET", cache: "no-store" }),
        apiFetch("/api/admin/users", { method: "GET", cache: "no-store" }),
        apiFetch("/api/admin/waitlist", { method: "GET", cache: "no-store" }),
        apiFetch("/api/admin/leads", { method: "GET", cache: "no-store" }),
        apiFetch("/api/admin/engagement", { method: "GET", cache: "no-store" }),
        apiFetch("/api/admin/students", { method: "GET", cache: "no-store" }),
        apiFetch("/api/admin/views", { method: "GET", cache: "no-store" }),
      ]);

      if (!statsRes.ok || !usersRes.ok) {
        throw new Error(
          await parseErrorMessage(statsRes.ok ? usersRes : statsRes, "Acesso não autorizado")
        );
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const waitlistData = waitlistRes.ok ? await waitlistRes.json() : { waitlist: [] };
      const leadsData = leadsRes.ok ? await leadsRes.json() : { leads: [] };
      const engagementData = engagementRes.ok ? await engagementRes.json() : null;
      const studentsData = studentsRes.ok ? await studentsRes.json() : { students: [], stats: null };
      const viewsData = viewsRes.ok ? await viewsRes.json() : null;

      setStats(statsData);
      setUsers(usersData.users || []);
      setWaitlist(waitlistData.waitlist || []);
      setLeads(leadsData.leads || []);
      setEngagement(engagementData);
      setStudents(studentsData.students || []);
      setStudentStats(studentsData.stats || null);
      setViewStats(viewsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const exportEmails = async () => {
    setExporting(true);
    try {
      const res = await apiFetch("/api/admin/export-emails", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(await parseErrorMessage(res, "Erro ao exportar emails"));
      }

      const data = await res.json();

      const csv = [
        "Nome,Email,Fonte,Data",
        ...(data.emails || []).map((e: ExportEmail) =>
          `"${e.name || ""}","${e.email}","${e.source}","${e.created_at}"`
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rehabroad-emails-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.showError("Erro ao exportar dados. Tente novamente.");
    } finally {
      setExporting(false);
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

  const getDaysRemaining = (trialStartDate: string | null, status: string): number | null => {
    if (!trialStartDate) return null;
    if (status === "active_paid") return null;

    const startDate = new Date(trialStartDate);
    const expirationDate = new Date(startDate);
    expirationDate.setDate(expirationDate.getDate() + 30);

    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const getExpiringUsers = () => {
    return users
      .map((user) => ({
        ...user,
        daysRemaining: getDaysRemaining(user.trial_start_date, user.status),
      }))
      .filter((user) => user.daysRemaining !== null && user.daysRemaining <= 15)
      .sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0));
  };

  const expiringUsers = getExpiringUsers();

  const getStatusBadge = (status: string, isAdmin: number) => {
    if (isAdmin === 1) {
      return <Badge className="bg-purple-500">Admin</Badge>;
    }
    switch (status) {
      case "active_paid":
        return <Badge className="bg-emerald-500">Pago</Badge>;
      case "beta_trial":
        return <Badge className="bg-blue-500">Trial</Badge>;
      case "free_limited":
        return <Badge variant="secondary">Free</Badge>;
      case "canceled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
                <Shield className="w-6 h-6" />
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Painel Administrativo</h1>
              <p className="text-muted-foreground">Visão geral dos usuários e métricas</p>
            </div>
          </div>
          <Button
            onClick={exportEmails}
            disabled={exporting}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {exporting ? "Exportando..." : "Exportar Emails (CSV)"}
          </Button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <Card><CardContent className="pt-4 pb-4"><div className="flex items-center gap-3"><Users className="w-8 h-8 text-primary" /><div><p className="text-2xl font-bold">{stats.totalUsers}</p><p className="text-xs text-muted-foreground">Total Usuários</p></div></div></CardContent></Card>
            <Card><CardContent className="pt-4 pb-4"><div className="flex items-center gap-3"><UserCheck className="w-8 h-8 text-emerald-500" /><div><p className="text-2xl font-bold">{stats.activeUsers}</p><p className="text-xs text-muted-foreground">Ativos</p></div></div></CardContent></Card>
            <Card><CardContent className="pt-4 pb-4"><div className="flex items-center gap-3"><CreditCard className="w-8 h-8 text-amber-500" /><div><p className="text-2xl font-bold">{stats.paidSubscriptions}</p><p className="text-xs text-muted-foreground">Pagantes</p></div></div></CardContent></Card>
            <Card><CardContent className="pt-4 pb-4"><div className="flex items-center gap-3"><Mail className="w-8 h-8 text-blue-500" /><div><p className="text-2xl font-bold">{stats.waitlistCount}</p><p className="text-xs text-muted-foreground">Waitlist</p></div></div></CardContent></Card>
            <Card><CardContent className="pt-4 pb-4"><div className="flex items-center gap-3"><FileText className="w-8 h-8 text-violet-500" /><div><p className="text-2xl font-bold">{stats.leadsCount}</p><p className="text-xs text-muted-foreground">Leads</p></div></div></CardContent></Card>
            <Card><CardContent className="pt-4 pb-4"><div className="flex items-center gap-3"><Calendar className="w-8 h-8 text-rose-500" /><div><p className="text-2xl font-bold">{stats.registeredToday}</p><p className="text-xs text-muted-foreground">Hoje</p></div></div></CardContent></Card>
            <Card><CardContent className="pt-4 pb-4"><div className="flex items-center gap-3"><TrendingUp className="w-8 h-8 text-cyan-500" /><div><p className="text-2xl font-bold">{stats.registeredThisWeek}</p><p className="text-xs text-muted-foreground">Semana</p></div></div></CardContent></Card>
          </div>
        )}

        {viewStats && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="w-5 h-5 text-pink-500" />
                Visualizações do Site
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-pink-50 dark:bg-pink-950/20 rounded-lg"><p className="text-2xl font-bold text-pink-600">{viewStats.total.toLocaleString()}</p><p className="text-xs text-muted-foreground">Total</p></div>
                <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg"><p className="text-2xl font-bold text-emerald-600">{viewStats.today.toLocaleString()}</p><p className="text-xs text-muted-foreground">Hoje</p></div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg"><p className="text-2xl font-bold text-blue-600">{viewStats.week.toLocaleString()}</p><p className="text-xs text-muted-foreground">Últimos 7 dias</p></div>
                <div className="text-center p-3 bg-violet-50 dark:bg-violet-950/20 rounded-lg"><p className="text-2xl font-bold text-violet-600">{viewStats.month.toLocaleString()}</p><p className="text-xs text-muted-foreground">Últimos 30 dias</p></div>
                <div className="text-center p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg"><p className="text-2xl font-bold text-amber-600">{viewStats.uniqueVisitors.toLocaleString()}</p><p className="text-xs text-muted-foreground">Únicos</p></div>
              </div>
              {viewStats.dailyViews.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Últimos 7 dias:</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {viewStats.dailyViews.map((day) => (
                      <div key={day.date} className="text-center min-w-[60px] p-2 bg-muted/50 rounded">
                        <p className="text-sm font-semibold">{day.views}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(day.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Timer className="w-5 h-5 text-amber-600" />
              Controle de Expiração de Planos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expiringUsers.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  {expiringUsers.length} usuário(s) com plano expirando em até 15 dias
                </p>
                <div className="grid gap-3">
                  {expiringUsers.map((user) => {
                    const days = user.daysRemaining || 0;
                    const isUrgent = days <= 3;
                    const isWarning = days <= 7 && days > 3;
                    return (
                      <div
                        key={user.user_id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isUrgent
                            ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800"
                            : isWarning
                              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isUrgent && <AlertTriangle className="w-5 h-5 text-red-500" />}
                          {isWarning && <Clock className="w-5 h-5 text-amber-500" />}
                          {!isUrgent && !isWarning && <Timer className="w-5 h-5 text-slate-400" />}
                          <div>
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {user.user_id.slice(0, 12)}...
                            </code>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {user.patients_count} pacientes • {user.evaluations_count} avaliações
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={isUrgent ? "bg-red-500 text-white" : isWarning ? "bg-amber-500 text-white" : "bg-slate-500 text-white"}>
                            {days <= 0 ? "Expirado" : days === 1 ? "1 dia" : `${days} dias`}
                          </Badge>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {getStatusBadge(user.status, user.is_admin)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t">
                  <div className="text-center p-2 bg-red-100 dark:bg-red-950/40 rounded-lg">
                    <p className="text-xl font-bold text-red-600">{expiringUsers.filter(u => (u.daysRemaining || 0) <= 3).length}</p>
                    <p className="text-[10px] text-red-600/70">Crítico (≤3 dias)</p>
                  </div>
                  <div className="text-center p-2 bg-amber-100 dark:bg-amber-950/40 rounded-lg">
                    <p className="text-xl font-bold text-amber-600">{expiringUsers.filter(u => (u.daysRemaining || 0) > 3 && (u.daysRemaining || 0) <= 7).length}</p>
                    <p className="text-[10px] text-amber-600/70">Atenção (4-7 dias)</p>
                  </div>
                  <div className="text-center p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <p className="text-xl font-bold text-slate-600 dark:text-slate-300">{expiringUsers.filter(u => (u.daysRemaining || 0) > 7).length}</p>
                    <p className="text-[10px] text-muted-foreground">Normal (8-15 dias)</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Timer className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhum usuário com plano expirando nos próximos 15 dias</p>
              </div>
            )}
          </CardContent>
        </Card>

        {engagement && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Adoção de Funcionalidades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FeatureBar label="Cadastraram Pacientes" count={engagement.featureAdoption.patients} total={stats?.totalUsers || 1} icon={<Users className="w-4 h-4" />} color="bg-emerald-500" />
                <FeatureBar label="Fizeram Avaliações" count={engagement.featureAdoption.evaluations} total={stats?.totalUsers || 1} icon={<Stethoscope className="w-4 h-4" />} color="bg-blue-500" />
                <FeatureBar label="Registraram Evoluções" count={engagement.featureAdoption.evolutions} total={stats?.totalUsers || 1} icon={<ClipboardList className="w-4 h-4" />} color="bg-violet-500" />
                <FeatureBar label="Usaram Agenda" count={engagement.featureAdoption.appointments} total={stats?.totalUsers || 1} icon={<CalendarDays className="w-4 h-4" />} color="bg-amber-500" />
                <FeatureBar label="Postaram no Fórum" count={engagement.featureAdoption.forum} total={stats?.totalUsers || 1} icon={<MessageSquare className="w-4 h-4" />} color="bg-rose-500" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Métricas de Engajamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard label="Pacientes/Usuário" value={engagement.averages.patientsPerUser} icon={<Users className="w-5 h-5 text-emerald-500" />} />
                  <MetricCard label="Avaliações/Paciente" value={engagement.averages.evaluationsPerPatient} icon={<Stethoscope className="w-5 h-5 text-blue-500" />} />
                  <MetricCard label="Evoluções/Paciente" value={engagement.averages.evolutionsPerPatient} icon={<ClipboardList className="w-5 h-5 text-violet-500" />} />
                  <MetricCard label="Total Agendamentos" value={engagement.totals.appointments} icon={<CalendarDays className="w-5 h-5 text-amber-500" />} />
                  <MetricCard label="Posts no Fórum" value={engagement.totals.forumPosts} icon={<MessageSquare className="w-5 h-5 text-rose-500" />} />
                  <MetricCard label="PDFs Exportados" value={engagement.totals.reportExports} icon={<FileText className="w-5 h-5 text-cyan-500" />} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {engagement && engagement.topUsers.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Usuários Mais Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 font-medium">User ID</th>
                      <th className="text-left py-2 px-2 font-medium">Status</th>
                      <th className="text-center py-2 px-2 font-medium">Pacientes</th>
                      <th className="text-center py-2 px-2 font-medium">Avaliações</th>
                      <th className="text-center py-2 px-2 font-medium">Evoluções</th>
                      <th className="text-center py-2 px-2 font-medium">Agenda</th>
                      <th className="text-center py-2 px-2 font-medium">Posts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {engagement.topUsers.map((user, i) => (
                      <tr key={user.user_id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                              {i + 1}
                            </span>
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {user.user_id.slice(0, 8)}...
                            </code>
                          </div>
                        </td>
                        <td className="py-2 px-2">{getStatusBadge(user.status, 0)}</td>
                        <td className="py-2 px-2 text-center font-medium">{user.patients}</td>
                        <td className="py-2 px-2 text-center">{user.evaluations}</td>
                        <td className="py-2 px-2 text-center">{user.evolutions}</td>
                        <td className="py-2 px-2 text-center">{user.appointments}</td>
                        <td className="py-2 px-2 text-center">{user.posts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden space-y-4 mt-2">
                {engagement.topUsers.map((user, i) => (
                  <div key={user.user_id} className="border border-border bg-card rounded-xl p-4 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {user.user_id.slice(0, 8)}...
                        </code>
                      </div>
                      <div>{getStatusBadge(user.status, 0)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex flex-col"><span className="text-muted-foreground text-xs">Pacientes</span> <span className="font-semibold">{user.patients}</span></div>
                      <div className="flex flex-col"><span className="text-muted-foreground text-xs">Avaliações</span> <span className="font-semibold">{user.evaluations}</span></div>
                      <div className="flex flex-col"><span className="text-muted-foreground text-xs">Evoluções</span> <span className="font-semibold">{user.evolutions}</span></div>
                      <div className="flex flex-col"><span className="text-muted-foreground text-xs">Agenda</span> <span className="font-semibold">{user.appointments}</span></div>
                      <div className="col-span-2 flex justify-between items-center"><span className="text-muted-foreground text-xs">Posts no Fórum</span> <span className="font-semibold">{user.posts}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="gap-2"><Users className="w-4 h-4" />Usuários ({users.length})</TabsTrigger>
            <TabsTrigger value="waitlist" className="gap-2"><Clock className="w-4 h-4" />Waitlist ({waitlist.length})</TabsTrigger>
            <TabsTrigger value="leads" className="gap-2"><FileText className="w-4 h-4" />Leads ({leads.length})</TabsTrigger>
            <TabsTrigger value="students" className="gap-2"><GraduationCap className="w-4 h-4" />Estudantes ({students.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader><CardTitle className="text-lg">Usuários Registrados</CardTitle></CardHeader>
              <CardContent>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium">User ID</th>
                        <th className="text-left py-3 px-2 font-medium">Status</th>
                        <th className="text-left py-3 px-2 font-medium">Plano</th>
                        <th className="text-center py-3 px-2 font-medium">Dias Rest.</th>
                        <th className="text-center py-3 px-2 font-medium">Pacientes</th>
                        <th className="text-center py-3 px-2 font-medium">Avaliações</th>
                        <th className="text-left py-3 px-2 font-medium">Cadastro</th>
                        <th className="text-left py-3 px-2 font-medium">Última Atividade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.user_id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-2"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{user.user_id.slice(0, 8)}...</code></td>
                          <td className="py-3 px-2">{getStatusBadge(user.status, user.is_admin)}</td>
                          <td className="py-3 px-2 capitalize">{user.plan_type}</td>
                          <td className="py-3 px-2 text-center">
                            {(() => {
                              const days = getDaysRemaining(user.trial_start_date, user.status);
                              if (days === null) return <span className="text-muted-foreground">-</span>;
                              if (days <= 0) return <Badge className="bg-red-500">Expirado</Badge>;
                              if (days <= 3) return <Badge className="bg-red-500">{days}d</Badge>;
                              if (days <= 7) return <Badge className="bg-amber-500">{days}d</Badge>;
                              return <Badge variant="outline">{days}d</Badge>;
                            })()}
                          </td>
                          <td className="py-3 px-2 text-center"><Badge variant="outline">{user.patients_count}</Badge></td>
                          <td className="py-3 px-2 text-center"><Badge variant="outline">{user.evaluations_count}</Badge></td>
                          <td className="py-3 px-2 text-muted-foreground text-xs">{formatDate(user.created_at)}</td>
                          <td className="py-3 px-2 text-muted-foreground text-xs">{formatDate(user.last_activity)}</td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">Nenhum usuário registrado</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-4">
                  {users.map((user) => (
                    <div key={user.user_id} className="border border-border bg-card rounded-xl p-4 shadow-sm flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <code className="text-xs bg-muted px-2 py-1 rounded">{user.user_id.slice(0, 8)}...</code>
                        {getStatusBadge(user.status, user.is_admin)}
                      </div>
                      <div className="flex border-t border-b border-border py-2 my-1">
                        <div className="flex-1 border-r border-border px-2 text-center">
                          <p className="text-xs text-muted-foreground uppercase">Pacientes</p>
                          <p className="font-semibold text-lg">{user.patients_count}</p>
                        </div>
                        <div className="flex-1 border-r border-border px-2 text-center">
                          <p className="text-xs text-muted-foreground uppercase">Avaliações</p>
                          <p className="font-semibold text-lg">{user.evaluations_count}</p>
                        </div>
                        <div className="flex-1 px-2 text-center">
                          <p className="text-xs text-muted-foreground uppercase">Plano</p>
                          <p className="font-semibold text-sm mt-1 capitalize">{user.plan_type}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div>
                          <p>Cad: {formatDate(user.created_at)}</p>
                          <p>Ativ: {formatDate(user.last_activity)}</p>
                        </div>
                        <div>
                          {(() => {
                            const days = getDaysRemaining(user.trial_start_date, user.status);
                            if (days === null) return null;
                            if (days <= 0) return <Badge className="bg-red-500 scale-90 origin-right">Exp</Badge>;
                            return <Badge className="scale-90 origin-right" variant="outline">{days} dias</Badge>;
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <div className="py-8 text-center text-muted-foreground">Nenhum usuário registrado</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="waitlist">
            <Card>
              <CardHeader><CardTitle className="text-lg">Lista de Espera (Beta)</CardTitle></CardHeader>
              <CardContent>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium">#</th>
                        <th className="text-left py-3 px-2 font-medium">Nome</th>
                        <th className="text-left py-3 px-2 font-medium">Email</th>
                        <th className="text-left py-3 px-2 font-medium">Status</th>
                        <th className="text-left py-3 px-2 font-medium">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waitlist.map((entry) => (
                        <tr key={entry.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-2 text-muted-foreground">{entry.id}</td>
                          <td className="py-3 px-2">{entry.name || "-"}</td>
                          <td className="py-3 px-2">{entry.email}</td>
                          <td className="py-3 px-2">
                            {entry.is_approved === 1 ? <Badge className="bg-emerald-500">Aprovado</Badge> : <Badge variant="secondary">Pendente</Badge>}
                          </td>
                          <td className="py-3 px-2 text-muted-foreground text-xs">{formatDate(entry.created_at)}</td>
                        </tr>
                      ))}
                      {waitlist.length === 0 && (
                        <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Nenhum registro na lista de espera</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-3">
                  {waitlist.map((entry) => (
                    <div key={entry.id} className="border border-border bg-card rounded-lg p-4 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold">{entry.name || "Sem nome"}</div>
                        {entry.is_approved === 1 ? <Badge className="bg-emerald-500">Aprovado</Badge> : <Badge variant="secondary">Pendente</Badge>}
                      </div>
                      <div className="text-sm text-blue-500 break-all">{entry.email}</div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>ID: {entry.id}</span>
                        <span>{formatDate(entry.created_at)}</span>
                      </div>
                    </div>
                  ))}
                  {waitlist.length === 0 && (
                    <div className="py-8 text-center text-muted-foreground">Nenhum registro na lista de espera</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads">
            <Card>
              <CardHeader><CardTitle className="text-lg">Leads Capturados</CardTitle></CardHeader>
              <CardContent>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium">#</th>
                        <th className="text-left py-3 px-2 font-medium">Nome</th>
                        <th className="text-left py-3 px-2 font-medium">Email</th>
                        <th className="text-left py-3 px-2 font-medium">Fonte</th>
                        <th className="text-left py-3 px-2 font-medium">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr key={lead.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-2 text-muted-foreground">{lead.id}</td>
                          <td className="py-3 px-2">{lead.name}</td>
                          <td className="py-3 px-2">{lead.email}</td>
                          <td className="py-3 px-2"><Badge variant="outline">{lead.source}</Badge></td>
                          <td className="py-3 px-2 text-muted-foreground text-xs">{formatDate(lead.created_at)}</td>
                        </tr>
                      ))}
                      {leads.length === 0 && (
                        <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Nenhum lead capturado</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-3">
                  {leads.map((lead) => (
                    <div key={lead.id} className="border border-border bg-card rounded-lg p-4 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold">{lead.name || "Sem nome"}</div>
                        <Badge variant="outline">{lead.source}</Badge>
                      </div>
                      <div className="text-sm text-blue-500 break-all">{lead.email}</div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>ID: {lead.id}</span>
                        <span>{formatDate(lead.created_at)}</span>
                      </div>
                    </div>
                  ))}
                  {leads.length === 0 && (
                    <div className="py-8 text-center text-muted-foreground">Nenhum lead capturado</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <div className="space-y-6">
              {studentStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card><CardContent className="pt-4 pb-4"><div className="flex items-center gap-3"><GraduationCap className="w-8 h-8 text-violet-500" /><div><p className="text-2xl font-bold">{studentStats.totalStudents}</p><p className="text-xs text-muted-foreground">Total Estudantes</p></div></div></CardContent></Card>
                  <Card><CardContent className="pt-4 pb-4"><div className="flex items-center gap-3"><Activity className="w-8 h-8 text-emerald-500" /><div><p className="text-2xl font-bold">{studentStats.activeToday}</p><p className="text-xs text-muted-foreground">Ativos Hoje</p></div></div></CardContent></Card>
                  <Card><CardContent className="pt-4 pb-4"><div className="flex items-center gap-3"><BookOpen className="w-8 h-8 text-blue-500" /><div><p className="text-2xl font-bold">{studentStats.totalCases}</p><p className="text-xs text-muted-foreground">Casos Resolvidos</p></div></div></CardContent></Card>
                  <Card><CardContent className="pt-4 pb-4"><div className="flex items-center gap-3"><Target className="w-8 h-8 text-amber-500" /><div><p className="text-2xl font-bold">{studentStats.avgAccuracy}%</p><p className="text-xs text-muted-foreground">Média Acertos</p></div></div></CardContent></Card>
                </div>
              )}

              <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><GraduationCap className="w-5 h-5 text-violet-500" />Estudantes Cadastrados</CardTitle></CardHeader>
                <CardContent>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-medium">Nome</th>
                          <th className="text-left py-3 px-2 font-medium">Email</th>
                          <th className="text-center py-3 px-2 font-medium">Casos</th>
                          <th className="text-center py-3 px-2 font-medium">Acertos</th>
                          <th className="text-center py-3 px-2 font-medium">Módulos</th>
                          <th className="text-left py-3 px-2 font-medium">Último Acesso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => {
                          const accuracy = student.cases_completed > 0 ? Math.round((student.cases_correct / student.cases_completed) * 100) : 0;
                          return (
                            <tr key={student.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-2 font-medium">{student.user_name || "-"}</td>
                              <td className="py-3 px-2 text-muted-foreground">{student.user_email}</td>
                              <td className="py-3 px-2 text-center"><Badge variant="outline" className="gap-1"><Trophy className="w-3 h-3" />{student.cases_completed}</Badge></td>
                              <td className="py-3 px-2 text-center"><Badge className={accuracy >= 70 ? "bg-emerald-500" : accuracy >= 50 ? "bg-amber-500" : "bg-slate-400"}>{accuracy}%</Badge></td>
                              <td className="py-3 px-2 text-center"><Badge variant="secondary">{student.modules_visited?.length || 0}</Badge></td>
                              <td className="py-3 px-2 text-muted-foreground text-xs">{formatDate(student.updated_at)}</td>
                            </tr>
                          );
                        })}
                        {students.length === 0 && (
                          <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Nenhum estudante cadastrado</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="md:hidden space-y-4">
                    {students.map((student) => {
                      const accuracy = student.cases_completed > 0 ? Math.round((student.cases_correct / student.cases_completed) * 100) : 0;
                      return (
                        <div key={student.id} className="border border-border bg-card rounded-xl p-4 shadow-sm flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold">{student.user_name || "-"}</div>
                              <div className="text-xs text-muted-foreground">{student.user_email}</div>
                            </div>
                            <Badge className={accuracy >= 70 ? "bg-emerald-500" : accuracy >= 50 ? "bg-amber-500" : "bg-slate-400"}>{accuracy}% acerto</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-1 py-3 border-y border-border">
                            <div className="flex items-center justify-center flex-col">
                              <span className="text-xs text-muted-foreground uppercase">Casos Resolvidos</span>
                              <span className="font-bold flex items-center gap-1 mt-1 text-lg"><Trophy className="w-4 h-4 text-yellow-500" /> {student.cases_completed}</span>
                            </div>
                            <div className="flex items-center justify-center flex-col border-l border-border">
                              <span className="text-xs text-muted-foreground uppercase">Módulos</span>
                              <span className="font-bold mt-1 text-lg">{student.modules_visited?.length || 0}</span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground text-right">
                            Último acesso: {formatDate(student.updated_at)}
                          </div>
                        </div>
                      );
                    })}
                    {students.length === 0 && (
                      <div className="py-8 text-center text-muted-foreground">Nenhum estudante cadastrado</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function FeatureBar({
  label,
  count,
  total,
  icon,
  color,
}: {
  label: string;
  count: number;
  total: number;
  icon: React.ReactNode;
  color: string;
}) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span>{label}</span>
        </div>
        <span className="font-medium">{count} ({percentage}%)</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-muted/50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}