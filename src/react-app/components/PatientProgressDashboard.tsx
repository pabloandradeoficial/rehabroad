import { TrendingDown, TrendingUp, Minus, Award, AlertTriangle, Star, Zap, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { usePatientProgress } from "@/react-app/hooks/usePatientProgress";
import { Spinner } from "@/react-app/components/ui/microinteractions";

interface Props {
  patientId: string;
}

function MetricCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className={`rounded-xl p-4 border ${color}`}>
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

const milestoneIcon = {
  start: <Zap className="w-3.5 h-3.5 text-blue-500" />,
  improvement: <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />,
  goal: <Star className="w-3.5 h-3.5 text-yellow-500" />,
  warning: <AlertTriangle className="w-3.5 h-3.5 text-red-500" />,
};

const milestoneColor = {
  start: "bg-blue-50 border-blue-200 text-blue-700",
  improvement: "bg-emerald-50 border-emerald-200 text-emerald-700",
  goal: "bg-yellow-50 border-yellow-200 text-yellow-700",
  warning: "bg-red-50 border-red-200 text-red-700",
};

export default function PatientProgressDashboard({ patientId }: Props) {
  const { progress, loading, error } = usePatientProgress(patientId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
        Erro ao carregar dados de progresso.
      </div>
    );
  }

  if (!progress || progress.summary.totalSessions === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <Activity className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-muted-foreground text-sm">
          Nenhuma sessão registrada ainda. <br />
          Adicione evoluções para visualizar o progresso.
        </p>
      </div>
    );
  }

  const { summary, painTimeline, functionalTimeline, milestones } = progress;

  const painChangeLabel = () => {
    if (summary.painChange === null) return "—";
    if (summary.painChange > 0) return `-${summary.painChange} pts`;
    if (summary.painChange < 0) return `+${Math.abs(summary.painChange)} pts`;
    return "estável";
  };

  const painTrendIcon =
    summary.painChange === null ? <Minus className="w-4 h-4" /> :
    summary.painChange > 0 ? <TrendingDown className="w-4 h-4 text-emerald-500" /> :
    summary.painChange < 0 ? <TrendingUp className="w-4 h-4 text-red-500" /> :
    <Minus className="w-4 h-4 text-slate-400" />;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Sessões"
          value={summary.totalSessions}
          sub="realizadas"
          color="border-slate-200 bg-slate-50"
        />
        <MetricCard
          label="Dor atual"
          value={summary.currentPain !== null ? `${summary.currentPain}/10` : "—"}
          sub={summary.avgPain !== null ? `média ${summary.avgPain}/10` : undefined}
          color={
            summary.currentPain === null ? "border-slate-200 bg-slate-50" :
            summary.currentPain <= 3 ? "border-emerald-200 bg-emerald-50" :
            summary.currentPain >= 7 ? "border-red-200 bg-red-50" :
            "border-yellow-200 bg-yellow-50"
          }
        />
        <MetricCard
          label="Variação de dor"
          value={painChangeLabel()}
          sub={summary.initialPain !== null ? `inicial ${summary.initialPain}/10` : undefined}
          color={
            summary.painChange === null ? "border-slate-200 bg-slate-50" :
            summary.painChange > 0 ? "border-emerald-200 bg-emerald-50" :
            summary.painChange < 0 ? "border-red-200 bg-red-50" :
            "border-slate-200 bg-slate-50"
          }
        />
        <MetricCard
          label="Resposta positiva"
          value={summary.positiveRate !== null ? `${summary.positiveRate}%` : "—"}
          sub="das sessões"
          color={
            summary.positiveRate === null ? "border-slate-200 bg-slate-50" :
            summary.positiveRate >= 60 ? "border-emerald-200 bg-emerald-50" :
            summary.positiveRate <= 30 ? "border-red-200 bg-red-50" :
            "border-yellow-200 bg-yellow-50"
          }
        />
      </div>

      {/* Pain Timeline */}
      {painTimeline.length >= 2 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            {painTrendIcon}
            <h3 className="font-semibold text-sm">Evolução da Dor</h3>
            <span className="text-xs text-muted-foreground ml-auto">escala 0–10</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={painTimeline} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="session"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `S${v}`}
              />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} ticks={[0, 2, 4, 6, 8, 10]} />
              <Tooltip
                formatter={(val: number) => [`${val}/10`, "Dor"]}
                labelFormatter={(l) => `Sessão ${l}`}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <ReferenceLine y={7} stroke="#f87171" strokeDasharray="4 2" label={{ value: "Alta", fontSize: 10, fill: "#f87171" }} />
              <ReferenceLine y={3} stroke="#34d399" strokeDasharray="4 2" label={{ value: "Baixa", fontSize: 10, fill: "#34d399" }} />
              <Line
                type="monotone"
                dataKey="pain"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Functional Timeline */}
      {functionalTimeline.length >= 2 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-blue-500" />
            <h3 className="font-semibold text-sm">Resposta ao Tratamento</h3>
            <span className="text-xs text-muted-foreground ml-auto">por sessão</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={functionalTimeline} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="session" tick={{ fontSize: 11 }} tickFormatter={(v) => `S${v}`} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} ticks={[0, 5, 8, 10]} />
              <Tooltip
                formatter={(val: number) => [
                  val >= 7 ? "Positiva" : val >= 4 ? "Neutra" : "Negativa",
                  "Resposta",
                ]}
                labelFormatter={(l) => `Sessão ${l}`}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar
                dataKey="score"
                radius={[4, 4, 0, 0]}
                fill="#6366f1"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Milestones */}
      {milestones.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-sm mb-3">Marcos do Tratamento</h3>
          <div className="space-y-2">
            {milestones.map((m, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-xs font-medium ${milestoneColor[m.type]}`}
              >
                {milestoneIcon[m.type]}
                <span className="flex-1">{m.label}</span>
                <span className="opacity-60 font-normal">
                  {new Date(m.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
