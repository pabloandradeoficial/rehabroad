import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, MousePointerClick,
  Eye, Users, BarChart2, Target, ArrowUp, ArrowDown,
  Zap, AlertTriangle, CheckCircle2, XCircle,
} from "lucide-react";

// ─── Raw data from Meta Graph API ───────────────────────────────────────────

interface Campaign {
  campaign_id: string;
  campaign_name: string;
  short_name: string;
  period: string;
  objective: "LINK_CLICKS" | "MESSAGES";
  audience: "fisioterapeuta" | "estudante" | "geral";
  impressions: number;
  reach: number;
  clicks: number;
  spend: number;
  cpc: number;
  ctr: number;
  cpm: number;
  frequency: number;
  link_clicks: number;
  landing_page_views?: number;
  video_views?: number;
  messaging_connections?: number;
  recommendation: "escalar" | "otimizar" | "pausar";
}

const CAMPAIGNS: Campaign[] = [
  {
    campaign_id: "6921472918961",
    campaign_name: "[17/02/2026] Promovendo rehabroad.com.br",
    short_name: "Promovendo rehabroad.com.br",
    period: "Fev/26",
    objective: "LINK_CLICKS",
    audience: "geral",
    impressions: 8436, reach: 7281, clicks: 1122, spend: 54.13,
    cpc: 0.048244, ctr: 13.300142, cpm: 6.416548, frequency: 1.158632,
    link_clicks: 795, landing_page_views: 682, video_views: 675, messaging_connections: 0,
    recommendation: "escalar",
  },
  {
    campaign_id: "6928030171761",
    campaign_name: "Instagram Post (mar/26 B)",
    short_name: "Instagram Post B",
    period: "Mar/26",
    objective: "LINK_CLICKS",
    audience: "geral",
    impressions: 8687, reach: 7477, clicks: 648, spend: 103.87,
    cpc: 0.160293, ctr: 7.459422, cpm: 11.956947, frequency: 1.16183,
    link_clicks: 642, landing_page_views: 501, video_views: 0, messaging_connections: 0,
    recommendation: "escalar",
  },
  {
    campaign_id: "6921461434961",
    campaign_name: "Desenvolvi o RehabRoad para...",
    short_name: "Desenvolvi o RehabRoad",
    period: "Fev/26",
    objective: "LINK_CLICKS",
    audience: "fisioterapeuta",
    impressions: 6397, reach: 5361, clicks: 415, spend: 45.10,
    cpc: 0.108675, ctr: 6.487416, cpm: 7.05018, frequency: 1.193248,
    link_clicks: 283, landing_page_views: 97, video_views: 633, messaging_connections: 0,
    recommendation: "escalar",
  },
  {
    campaign_id: "6933235338961",
    campaign_name: "Post do Instagram (mar/26 C)",
    short_name: "Post Instagram C",
    period: "Mar/26",
    objective: "LINK_CLICKS",
    audience: "geral",
    impressions: 20953, reach: 10776, clicks: 742, spend: 134.61,
    cpc: 0.181415, ctr: 3.541259, cpm: 6.424378, frequency: 1.944414,
    link_clicks: 467, landing_page_views: 385, video_views: 5019, messaging_connections: 10,
    recommendation: "escalar",
  },
  {
    campaign_id: "6641085257561",
    campaign_name: "A dor tá amando né?",
    short_name: "A dor tá amando",
    period: "Jan/25",
    objective: "MESSAGES",
    audience: "fisioterapeuta",
    impressions: 8228, reach: 6093, clicks: 217, spend: 110.98,
    cpc: 0.511429, ctr: 2.637336, cpm: 13.488089, frequency: 1.350402,
    link_clicks: 116, landing_page_views: 0, video_views: 1920, messaging_connections: 38,
    recommendation: "otimizar",
  },
  {
    campaign_id: "6925595257961",
    campaign_name: "Post do Instagram (jan/26)",
    short_name: "Post Instagram jan/26",
    period: "Jan/26",
    objective: "MESSAGES",
    audience: "fisioterapeuta",
    impressions: 6462, reach: 3094, clicks: 162, spend: 103.95,
    cpc: 0.641667, ctr: 2.506964, cpm: 16.086351, frequency: 2.088559,
    link_clicks: 50, landing_page_views: 0, video_views: 1141, messaging_connections: 60,
    recommendation: "otimizar",
  },
  {
    campaign_id: "6637539601761",
    campaign_name: "Dor na coluna? Você não...",
    short_name: "Dor na coluna",
    period: "Jan/25",
    objective: "LINK_CLICKS",
    audience: "fisioterapeuta",
    impressions: 47501, reach: 41818, clicks: 1120, spend: 367.94,
    cpc: 0.328518, ctr: 2.357845, cpm: 7.745942, frequency: 1.135898,
    link_clicks: 1065, landing_page_views: 0, video_views: 10324, messaging_connections: 0,
    recommendation: "otimizar",
  },
  {
    campaign_id: "6638682515161",
    campaign_name: "Descubra o Poder da...",
    short_name: "Descubra o Poder",
    period: "Jan/25",
    objective: "LINK_CLICKS",
    audience: "fisioterapeuta",
    impressions: 12564, reach: 8060, clicks: 249, spend: 93.00,
    cpc: 0.373494, ctr: 1.981853, cpm: 7.402101, frequency: 1.558809,
    link_clicks: 192, landing_page_views: 0, video_views: 2425, messaging_connections: 0,
    recommendation: "otimizar",
  },
  {
    campaign_id: "6927341942961",
    campaign_name: "Sabia disso? Faz o teste e...",
    short_name: "Sabia disso?",
    period: "Fev/26",
    objective: "MESSAGES",
    audience: "fisioterapeuta",
    impressions: 15582, reach: 9979, clicks: 253, spend: 129.93,
    cpc: 0.513557, ctr: 1.623668, cpm: 8.338467, frequency: 1.561479,
    link_clicks: 242, landing_page_views: 0, video_views: 3349, messaging_connections: 6,
    recommendation: "otimizar",
  },
  {
    campaign_id: "6612543908561",
    campaign_name: "Chegamos ao final...",
    short_name: "Chegamos ao final",
    period: "Set/24",
    objective: "LINK_CLICKS",
    audience: "fisioterapeuta",
    impressions: 29266, reach: 13353, clicks: 464, spend: 256.69,
    cpc: 0.553211, ctr: 1.585458, cpm: 8.770929, frequency: 2.191717,
    link_clicks: 456, landing_page_views: 0, video_views: 6359, messaging_connections: 17,
    recommendation: "otimizar",
  },
  {
    campaign_id: "6568211728561",
    campaign_name: "CONVERSAR",
    short_name: "CONVERSAR",
    period: "Mar/24",
    objective: "LINK_CLICKS",
    audience: "fisioterapeuta",
    impressions: 22939, reach: 13735, clicks: 281, spend: 150.00,
    cpc: 0.533808, ctr: 1.224988, cpm: 6.539082, frequency: 1.670113,
    link_clicks: 282, landing_page_views: 0, video_views: 5555, messaging_connections: 16,
    recommendation: "pausar",
  },
  {
    campaign_id: "6927971079961",
    campaign_name: "Instagram Post (mar/26 A)",
    short_name: "Instagram Post A",
    period: "Mar/26",
    objective: "LINK_CLICKS",
    audience: "estudante",
    impressions: 2982, reach: 2765, clicks: 33, spend: 19.87,
    cpc: 0.602121, ctr: 1.10664, cpm: 6.663313, frequency: 1.078481,
    link_clicks: 30, landing_page_views: 17, video_views: 156, messaging_connections: 0,
    recommendation: "pausar",
  },
  {
    campaign_id: "6611151088961",
    campaign_name: "Hoje o texto é um...",
    short_name: "Hoje o texto",
    period: "Set/24",
    objective: "LINK_CLICKS",
    audience: "fisioterapeuta",
    impressions: 32670, reach: 15200, clicks: 341, spend: 239.00,
    cpc: 0.70088, ctr: 1.043771, cpm: 7.31558, frequency: 2.149342,
    link_clicks: 338, landing_page_views: 0, video_views: 5102, messaging_connections: 21,
    recommendation: "pausar",
  },
  {
    campaign_id: "6930318014161",
    campaign_name: "Você já percebeu que na faculdade...",
    short_name: "Na faculdade...",
    period: "Mar/26",
    objective: "LINK_CLICKS",
    audience: "estudante",
    impressions: 53661, reach: 22747, clicks: 424, spend: 191.76,
    cpc: 0.452264, ctr: 0.790146, cpm: 3.573545, frequency: 2.359036,
    link_clicks: 363, landing_page_views: 290, video_views: 26, messaging_connections: 0,
    recommendation: "pausar",
  },
  {
    campaign_id: "6639326121961",
    campaign_name: "CALOMBINHO?",
    short_name: "CALOMBINHO",
    period: "Jan/25",
    objective: "MESSAGES",
    audience: "fisioterapeuta",
    impressions: 7684, reach: 2689, clicks: 67, spend: 110.57,
    cpc: 1.650299, ctr: 0.871942, cpm: 14.389641, frequency: 2.857568,
    link_clicks: 26, landing_page_views: 0, video_views: 927, messaging_connections: 16,
    recommendation: "pausar",
  },
];

const PERIOD_ORDER: Record<string, number> = {
  "Mar/24": 0, "Set/24": 1, "Jan/25": 2, "Fev/26": 3, "Jan/26": 4, "Mar/26": 5,
};

const AUDIENCE_LABELS: Record<string, string> = {
  fisioterapeuta: "Fisioterapeuta",
  estudante: "Estudante",
  geral: "Geral",
};

// ─── Colour system ───────────────────────────────────────────────────────────
const PRIMARY = "#0bbf9f";
const SECONDARY = "#06d6a0";
const WARN = "#f59e0b";
const DANGER = "#ef4444";
// const MUTED = "#475569"; // reserved for future use

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  icon: Icon, label, value, sub, trend, color = PRIMARY,
}: {
  icon: React.ElementType; label: string; value: string; sub?: string;
  trend?: "up" | "down" | "neutral"; color?: string;
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-start gap-3">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-white text-xl font-bold leading-none">{value}</p>
        {sub && (
          <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
            {trend === "up" && <ArrowUp size={10} className="text-emerald-400" />}
            {trend === "down" && <ArrowDown size={10} className="text-red-400" />}
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

const recommendationConfig = {
  escalar: { label: "Escalar", icon: CheckCircle2, color: "#10b981", bg: "#10b98115" },
  otimizar: { label: "Otimizar", icon: AlertTriangle, color: WARN, bg: `${WARN}15` },
  pausar: { label: "Pausar", icon: XCircle, color: DANGER, bg: `${DANGER}15` },
};

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function MetaAds() {
  const [audienceFilter, setAudienceFilter] = useState<string>("todos");
  const [periodFilter, setPeriodFilter] = useState<string>("todos");
  const [chartMetric, setChartMetric] = useState<"ctr" | "cpc" | "spend" | "impressions">("ctr");

  const periods = useMemo(
    () => ["todos", ...Array.from(new Set(CAMPAIGNS.map((c) => c.period))).sort((a, b) => (PERIOD_ORDER[a] ?? 99) - (PERIOD_ORDER[b] ?? 99))],
    []
  );

  const filtered = useMemo(() => {
    return CAMPAIGNS.filter((c) => {
      if (audienceFilter !== "todos" && c.audience !== audienceFilter) return false;
      if (periodFilter !== "todos" && c.period !== periodFilter) return false;
      return true;
    });
  }, [audienceFilter, periodFilter]);

  const totals = useMemo(() => {
    const spend = filtered.reduce((s, c) => s + c.spend, 0);
    const impressions = filtered.reduce((s, c) => s + c.impressions, 0);
    const reach = filtered.reduce((s, c) => s + c.reach, 0);
    const clicks = filtered.reduce((s, c) => s + c.clicks, 0);
    const avgCtr = filtered.length ? filtered.reduce((s, c) => s + c.ctr, 0) / filtered.length : 0;
    const avgCpc = clicks > 0 ? spend / clicks : 0;
    const avgCpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
    const avgFreq = filtered.length ? filtered.reduce((s, c) => s + c.frequency, 0) / filtered.length : 0;
    return { spend, impressions, reach, clicks, avgCtr, avgCpc, avgCpm, avgFreq };
  }, [filtered]);

  const sortedByCtr = useMemo(
    () => [...filtered].sort((a, b) => b.ctr - a.ctr),
    [filtered]
  );
  const sortedByCpc = useMemo(
    () => [...filtered].sort((a, b) => a.cpc - b.cpc),
    [filtered]
  );

  const chartData = useMemo(
    () =>
      [...filtered]
        .sort((a, b) => (PERIOD_ORDER[a.period] ?? 99) - (PERIOD_ORDER[b.period] ?? 99))
        .map((c) => ({
          name: c.short_name.length > 18 ? c.short_name.slice(0, 16) + "…" : c.short_name,
          ctr: parseFloat(c.ctr.toFixed(2)),
          cpc: parseFloat(c.cpc.toFixed(2)),
          spend: parseFloat(c.spend.toFixed(0)),
          impressions: Math.round(c.impressions / 1000),
          recommendation: c.recommendation,
        })),
    [filtered]
  );

  const barColor = (rec: string) =>
    rec === "escalar" ? PRIMARY : rec === "otimizar" ? WARN : DANGER;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-medium uppercase tracking-widest">
                Meta Ads Analytics
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">Dashboard de Campanhas</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Conta: <span className="text-slate-300">act_333806686692736</span> · R$ BRL ·
              15 campanhas com dados · Período máximo disponível
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 text-xs">Público:</span>
            {["todos", "fisioterapeuta", "estudante", "geral"].map((a) => (
              <button
                key={a}
                onClick={() => setAudienceFilter(a)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  audienceFilter === a
                    ? "text-slate-950"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                style={audienceFilter === a ? { backgroundColor: PRIMARY } : undefined}
              >
                {a === "todos" ? "Todos" : AUDIENCE_LABELS[a]}
              </button>
            ))}
          </div>
        </div>

        {/* Period Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 text-xs">Período:</span>
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriodFilter(p)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                periodFilter === p
                  ? "text-slate-950"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
              style={periodFilter === p ? { backgroundColor: PRIMARY } : undefined}
            >
              {p === "todos" ? "Todos os períodos" : p}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={DollarSign} label="Total Investido" value={`R$ ${totals.spend.toFixed(2).replace(".", ",")}`} sub="Período selecionado" color={PRIMARY} />
          <StatCard icon={Eye} label="Impressões" value={totals.impressions.toLocaleString("pt-BR")} sub="Exibições totais" color={SECONDARY} />
          <StatCard icon={Users} label="Alcance" value={totals.reach.toLocaleString("pt-BR")} sub="Pessoas únicas" color="#818cf8" />
          <StatCard icon={MousePointerClick} label="Total de Cliques" value={totals.clicks.toLocaleString("pt-BR")} sub="Todos os tipos" color="#f472b6" />
          <StatCard icon={TrendingUp} label="CTR Médio" value={`${totals.avgCtr.toFixed(2)}%`} sub="Benchmark: 0,9–2,5%" trend="up" color={PRIMARY} />
          <StatCard icon={Target} label="CPC Médio" value={`R$ ${totals.avgCpc.toFixed(2)}`} sub="Custo por clique" color={SECONDARY} />
          <StatCard icon={BarChart2} label="CPM Médio" value={`R$ ${totals.avgCpm.toFixed(2)}`} sub="Custo por mil impressões" color={WARN} />
          <StatCard icon={Zap} label="Freq. Média" value={totals.avgFreq.toFixed(2) + "x"} sub="Ideal: abaixo de 1,8x" trend={totals.avgFreq > 2 ? "down" : "up"} color={totals.avgFreq > 2 ? DANGER : PRIMARY} />
        </div>

        {/* Chart Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-lg font-semibold text-white">Comparativo por Campanha</h2>
            <div className="flex gap-2 flex-wrap">
              {(["ctr", "cpc", "spend", "impressions"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setChartMetric(m)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    chartMetric === m ? "text-slate-950" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                  style={chartMetric === m ? { backgroundColor: PRIMARY } : undefined}
                >
                  {m === "ctr" ? "CTR (%)" : m === "cpc" ? "CPC (R$)" : m === "spend" ? "Investido (R$)" : "Impressões (k)"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                angle={-40}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                labelStyle={{ color: "#f1f5f9", fontSize: 12 }}
                itemStyle={{ color: PRIMARY }}
                formatter={(v: unknown) => {
                  const n = Number(v) || 0;
                  return chartMetric === "ctr" ? `${n}%` :
                    chartMetric === "cpc" ? `R$ ${n}` :
                    chartMetric === "spend" ? `R$ ${n}` :
                    `${n}k`;
                }}
              />
              <Bar dataKey={chartMetric} radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={barColor(entry.recommendation)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: PRIMARY }} /> Escalar
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: WARN }} /> Otimizar
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: DANGER }} /> Pausar
            </span>
          </div>
        </div>

        {/* Best/Worst Rankings */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Best by CTR */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} style={{ color: PRIMARY }} />
              <h3 className="text-sm font-semibold text-white">Top 5 — Melhor CTR</h3>
            </div>
            <div className="space-y-3">
              {sortedByCtr.slice(0, 5).map((c, i) => (
                <div key={c.campaign_id} className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: i === 0 ? PRIMARY : "#1e293b", color: i === 0 ? "#000" : "#94a3b8" }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-xs font-medium truncate">{c.short_name}</p>
                    <div className="flex gap-3 mt-0.5">
                      <span className="text-xs font-bold" style={{ color: PRIMARY }}>CTR {c.ctr.toFixed(2)}%</span>
                      <span className="text-xs text-slate-400">CPC R${c.cpc.toFixed(2)}</span>
                      <span className="text-xs text-slate-500">{c.period}</span>
                    </div>
                  </div>
                  <div
                    className="px-2 py-0.5 rounded-md text-xs font-medium flex-shrink-0"
                    style={{ backgroundColor: recommendationConfig[c.recommendation].bg, color: recommendationConfig[c.recommendation].color }}
                  >
                    {recommendationConfig[c.recommendation].label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best by CPC */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign size={16} style={{ color: SECONDARY }} />
              <h3 className="text-sm font-semibold text-white">Top 5 — Menor CPC (mais eficiente)</h3>
            </div>
            <div className="space-y-3">
              {sortedByCpc.slice(0, 5).map((c, i) => (
                <div key={c.campaign_id} className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: i === 0 ? SECONDARY : "#1e293b", color: i === 0 ? "#000" : "#94a3b8" }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-xs font-medium truncate">{c.short_name}</p>
                    <div className="flex gap-3 mt-0.5">
                      <span className="text-xs font-bold" style={{ color: SECONDARY }}>CPC R${c.cpc.toFixed(2)}</span>
                      <span className="text-xs text-slate-400">CTR {c.ctr.toFixed(2)}%</span>
                      <span className="text-xs text-slate-500">{c.period}</span>
                    </div>
                  </div>
                  <div
                    className="px-2 py-0.5 rounded-md text-xs font-medium flex-shrink-0"
                    style={{ backgroundColor: recommendationConfig[c.recommendation].bg, color: recommendationConfig[c.recommendation].color }}
                  >
                    {recommendationConfig[c.recommendation].label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Worst by CTR */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={16} style={{ color: DANGER }} />
              <h3 className="text-sm font-semibold text-white">Piores CTR — Oportunidade de Melhoria</h3>
            </div>
            <div className="space-y-3">
              {[...sortedByCtr].reverse().slice(0, 5).map((c, i) => (
                <div key={c.campaign_id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-xs font-medium truncate">{c.short_name}</p>
                    <div className="flex gap-3 mt-0.5">
                      <span className="text-xs font-bold text-red-400">CTR {c.ctr.toFixed(2)}%</span>
                      <span className="text-xs text-slate-400">CPC R${c.cpc.toFixed(2)}</span>
                      <span className="text-xs text-slate-500">{c.period}</span>
                    </div>
                  </div>
                  <div
                    className="px-2 py-0.5 rounded-md text-xs font-medium flex-shrink-0"
                    style={{ backgroundColor: recommendationConfig[c.recommendation].bg, color: recommendationConfig[c.recommendation].color }}
                  >
                    {recommendationConfig[c.recommendation].label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Worst by CPC */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} style={{ color: WARN }} />
              <h3 className="text-sm font-semibold text-white">Piores CPC — Mais Caros</h3>
            </div>
            <div className="space-y-3">
              {[...sortedByCpc].reverse().slice(0, 5).map((c, i) => (
                <div key={c.campaign_id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-xs font-medium truncate">{c.short_name}</p>
                    <div className="flex gap-3 mt-0.5">
                      <span className="text-xs font-bold text-amber-400">CPC R${c.cpc.toFixed(2)}</span>
                      <span className="text-xs text-slate-400">CTR {c.ctr.toFixed(2)}%</span>
                      <span className="text-xs text-slate-500">{c.period}</span>
                    </div>
                  </div>
                  <div
                    className="px-2 py-0.5 rounded-md text-xs font-medium flex-shrink-0"
                    style={{ backgroundColor: recommendationConfig[c.recommendation].bg, color: recommendationConfig[c.recommendation].color }}
                  >
                    {recommendationConfig[c.recommendation].label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Todas as Campanhas</h2>
            <span className="text-slate-400 text-sm">{filtered.length} campanhas</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/50">
                  {["Campanha", "Período", "Público", "Invest.", "Impressões", "Alcance", "CTR", "CPC", "CPM", "Freq.", "Recom."].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-slate-400 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const rc = recommendationConfig[c.recommendation];
                  return (
                    <tr key={c.campaign_id} className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${i % 2 === 0 ? "" : "bg-slate-900/20"}`}>
                      <td className="px-4 py-3 max-w-[200px]">
                        <p className="text-slate-200 text-xs font-medium truncate" title={c.campaign_name}>{c.short_name}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{c.period}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{AUDIENCE_LABELS[c.audience]}</td>
                      <td className="px-4 py-3 text-slate-200 text-xs font-medium whitespace-nowrap">R$ {c.spend.toFixed(0)}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{c.impressions.toLocaleString("pt-BR")}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{c.reach.toLocaleString("pt-BR")}</td>
                      <td className="px-4 py-3 text-xs font-bold whitespace-nowrap" style={{ color: c.ctr >= 3 ? PRIMARY : c.ctr >= 1.5 ? WARN : DANGER }}>
                        {c.ctr.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-xs font-medium whitespace-nowrap" style={{ color: c.cpc <= 0.30 ? PRIMARY : c.cpc <= 0.70 ? WARN : DANGER }}>
                        R$ {c.cpc.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">R$ {c.cpm.toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: c.frequency > 2 ? DANGER : WARN }}>
                        {c.frequency.toFixed(2)}x
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: rc.bg, color: rc.color }}>
                          {rc.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap size={18} style={{ color: PRIMARY }} />
            Recomendações Estratégicas
          </h2>

          {/* Scale */}
          <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <h3 className="text-emerald-400 font-semibold text-sm">ESCALAR — Alto ROI confirmado</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
              <div>
                <p className="font-medium text-white mb-1">[17/02/26] Promovendo rehabroad.com.br</p>
                <p className="text-xs text-slate-400">CTR 13,30% · CPC R$0,05 · 682 landing page views por R$54. Melhor campanha da conta inteira. Relançar com budget 5–10x maior e audiência lookalike.</p>
              </div>
              <div>
                <p className="font-medium text-white mb-1">Instagram Post (mar/26 B) + Post C</p>
                <p className="text-xs text-slate-400">CTR 7,46% e 3,54% respectivamente. CPC R$0,16 e R$0,18. Criar variações de criativos (A/B) e aumentar orçamento diário.</p>
              </div>
              <div>
                <p className="font-medium text-white mb-1">Desenvolvi o RehabRoad para...</p>
                <p className="text-xs text-slate-400">CTR 6,49% com apenas R$45 investidos. Subexplorado. Testar com R$200–300 antes de escalar definitivamente.</p>
              </div>
            </div>
          </div>

          {/* Optimize */}
          <div className="bg-amber-950/30 border border-amber-700/40 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-amber-400" />
              <h3 className="text-amber-400 font-semibold text-sm">OTIMIZAR — Ajustes para melhorar performance</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
              <div>
                <p className="font-medium text-white mb-1">Dor na coluna? + Descubra o Poder</p>
                <p className="text-xs text-slate-400">Maior alcance da conta (41.818 pessoas). Reinstalar pixel Meta e reativar com objetivo CONVERSIONS para rastrear assinaturas.</p>
              </div>
              <div>
                <p className="font-medium text-white mb-1">A dor tá amando (R$2,92/DM) + Post jan/26 (R$1,73/DM)</p>
                <p className="text-xs text-slate-400">Melhor custo por lead no DM da conta. Usar Advantage+ audience e reinvestir. Configurar autoresponder no DM.</p>
              </div>
            </div>
          </div>

          {/* Pause */}
          <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <XCircle size={16} className="text-red-400" />
              <h3 className="text-red-400 font-semibold text-sm">PAUSAR — Não repetir estes criativos</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
              <div>
                <p className="font-medium text-white mb-1">CALOMBINHO — CPC R$1,65 (pior da conta)</p>
                <p className="text-xs text-slate-400">CPM R$14,39, frequência 2,86x. Audiência saturada e criativo fraco. Não repetir segmentação nem copy.</p>
              </div>
              <div>
                <p className="font-medium text-white mb-1">Você já percebeu na faculdade — CTR 0,79%</p>
                <p className="text-xs text-slate-400">R$191,76 com o pior CTR da conta. Maior volume de impressões mas baixíssimo engajamento. Reformular headline e segmentação para estudantes.</p>
              </div>
              <div>
                <p className="font-medium text-white mb-1">Hoje o texto é um — CTR 1,04%, freq. 2,15x</p>
                <p className="text-xs text-slate-400">R$239 com alta saturação de audiência. Pausar e substituir por variação de criativo com copy mais direta.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart2 size={18} style={{ color: PRIMARY }} />
            Insights Estratégicos
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {[
              {
                title: "Conteúdo sobre o REHABROAD converte melhor",
                body: "Campanhas que falam do produto (CTR 6–13%) superam em 5x as campanhas de pain point (CTR 1–2%). Priorizar Product-Aware audience.",
                color: PRIMARY,
              },
              {
                title: "Falta de pixel é o maior gap",
                body: "Nenhuma campanha retornou purchase_roas. Instalar o pixel Meta no rehabroad.com.br com eventos Lead e Subscribe é prioridade máxima.",
                color: DANGER,
              },
              {
                title: "2026 é a melhor fase histórica",
                body: "CTR médio 5,39% e CPC médio R$0,24 em 2026 vs CTR 1,31% e CPC R$0,63 em 2024. Momento ideal para aumentar investimento.",
                color: SECONDARY,
              },
              {
                title: "Frequência acima de 2x = queda de performance",
                body: "CALOMBINHO (2,86x), Hoje o texto (2,15x) e Chegamos ao final (2,19x) têm frequência alta correlacionada com CTR baixo. Limitar a 1,5x.",
                color: WARN,
              },
            ].map((insight) => (
              <div key={insight.title} className="flex gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: insight.color }} />
                <div>
                  <p className="text-white text-sm font-medium mb-1">{insight.title}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{insight.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs pb-4">
          Dados via Meta Graph API v21.0 · Período máximo · Gerado em 29/03/2026 · REHABROAD Analytics
        </p>
      </div>
    </div>
  );
}
