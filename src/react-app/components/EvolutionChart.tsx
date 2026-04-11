/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import { TrendingDown, TrendingUp, Minus, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import type { Evolution } from "@/react-app/hooks/useEvolutions";
import type { Evaluation } from "@/react-app/hooks/useEvaluations";

interface EvolutionChartProps {
  evolutions: Evolution[];
  evaluations?: Evaluation[];
  patientName?: string;
}

interface ChartDataPoint {
  date: string;
  shortDate: string;
  painLevel: number;
  session: number;
  type: "evaluation" | "evolution";
  label: string;
}

export default function EvolutionChart({ evolutions, evaluations = [] }: EvolutionChartProps) {
  const chartData = useMemo(() => {
    const data: ChartDataPoint[] = [];
    
    // Add initial evaluation pain levels
    evaluations
      .filter(e => e.pain_level !== null)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .forEach((evalItem, idx) => {
        const date = new Date(evalItem.created_at);
        data.push({
          date: evalItem.created_at,
          shortDate: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
          painLevel: evalItem.pain_level!,
          session: 0, // Evaluation is "session 0"
          type: "evaluation",
          label: idx === 0 ? "Avaliação Inicial" : "Reavaliação",
        });
      });
    
    // Add evolution pain levels
    evolutions
      .filter(e => e.pain_level !== null)
      .sort((a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime())
      .forEach((evol, idx) => {
        const date = new Date(evol.session_date);
        data.push({
          date: evol.session_date,
          shortDate: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
          painLevel: evol.pain_level!,
          session: idx + 1,
          type: "evolution",
          label: `Sessão ${idx + 1}`,
        });
      });
    
    // Sort by date
    return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [evolutions, evaluations]);

  const stats = useMemo(() => {
    if (chartData.length < 2) return null;
    
    const first = chartData[0];
    const last = chartData[chartData.length - 1];
    const painChange = last.painLevel - first.painLevel;
    const painChangePercent = first.painLevel > 0 
      ? Math.round((painChange / first.painLevel) * 100) 
      : 0;
    
    // Calculate average pain
    const avgPain = chartData.reduce((sum, d) => sum + d.painLevel, 0) / chartData.length;
    
    // Find min and max
    const minPain = Math.min(...chartData.map(d => d.painLevel));
    const maxPain = Math.max(...chartData.map(d => d.painLevel));
    
    // Calculate trend (using linear regression slope direction)
    let trend: "improving" | "worsening" | "stable" = "stable";
    if (painChange <= -2) trend = "improving";
    else if (painChange >= 2) trend = "worsening";
    else if (painChange < 0) trend = "improving";
    else if (painChange > 0) trend = "worsening";
    
    return {
      initialPain: first.painLevel,
      currentPain: last.painLevel,
      painChange,
      painChangePercent,
      avgPain: Math.round(avgPain * 10) / 10,
      minPain,
      maxPain,
      trend,
      totalSessions: chartData.filter(d => d.type === "evolution").length,
    };
  }, [chartData]);

  // Don't render if not enough data
  if (chartData.length < 2) {
    return null;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartDataPoint;
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3 min-w-[140px]">
          <p className="text-xs text-muted-foreground mb-1">{data.label}</p>
          <p className="text-sm font-medium">{data.shortDate}</p>
          <div className="flex items-center gap-2 mt-2">
            <div 
              className={`w-3 h-3 rounded-full ${
                data.painLevel <= 3 ? "bg-emerald-500" :
                data.painLevel <= 6 ? "bg-amber-500" :
                "bg-red-500"
              }`}
            />
            <span className="font-semibold">EVA: {data.painLevel}/10</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-lg overflow-hidden">
        {/* Header */}
        <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-violet-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">Evolução da Dor</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Trajetória do EVA ao longo das sessões
                </p>
              </div>
            </div>
            
            {/* Trend Badge */}
            {stats && (
              <Badge 
                variant="outline" 
                className={`gap-1.5 ${
                  stats.trend === "improving" 
                    ? "border-emerald-500/50 text-emerald-600 bg-emerald-500/10" 
                    : stats.trend === "worsening"
                    ? "border-red-500/50 text-red-600 bg-red-500/10"
                    : "border-muted-foreground/50 text-muted-foreground bg-muted/50"
                }`}
              >
                {stats.trend === "improving" ? (
                  <TrendingDown className="w-3.5 h-3.5" />
                ) : stats.trend === "worsening" ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <Minus className="w-3.5 h-3.5" />
                )}
                {stats.trend === "improving" ? "Melhorando" : 
                 stats.trend === "worsening" ? "Atenção" : "Estável"}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          {/* Stats Row */}
          {stats && (
            <div className="grid grid-cols-4 gap-3 mb-6">
              <motion.div 
                className="text-center p-3 rounded-xl bg-muted/30"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-2xl font-bold text-primary">{stats.initialPain}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Inicial</p>
              </motion.div>
              
              <motion.div 
                className="text-center p-3 rounded-xl bg-muted/30"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className={`text-2xl font-bold ${
                  stats.currentPain <= 3 ? "text-emerald-500" :
                  stats.currentPain <= 6 ? "text-amber-500" :
                  "text-red-500"
                }`}>
                  {stats.currentPain}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Atual</p>
              </motion.div>
              
              <motion.div 
                className="text-center p-3 rounded-xl bg-muted/30"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                  stats.painChange < 0 ? "text-emerald-500" :
                  stats.painChange > 0 ? "text-red-500" :
                  "text-muted-foreground"
                }`}>
                  {stats.painChange > 0 ? "+" : ""}{stats.painChange}
                  {stats.painChange < 0 && <TrendingDown className="w-4 h-4" />}
                  {stats.painChange > 0 && <TrendingUp className="w-4 h-4" />}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Δ Dor</p>
              </motion.div>
              
              <motion.div 
                className="text-center p-3 rounded-xl bg-muted/30"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-2xl font-bold text-violet-500">{stats.totalSessions}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Sessões</p>
              </motion.div>
            </div>
          )}
          
          {/* Chart */}
          <motion.div 
            className="h-[200px] w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="hsl(var(--border))" 
                  opacity={0.5}
                />
                <XAxis 
                  dataKey="shortDate" 
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  dx={-5}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Reference lines for pain zones */}
                <ReferenceLine y={3} stroke="hsl(var(--emerald-500))" strokeDasharray="3 3" opacity={0.3} />
                <ReferenceLine y={7} stroke="hsl(var(--red-500))" strokeDasharray="3 3" opacity={0.3} />
                
                <Area
                  type="monotone"
                  dataKey="painLevel"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#painGradient)"
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    const isEvaluation = payload.type === "evaluation";
                    return (
                      <circle
                        key={`dot-${payload.date}`}
                        cx={cx}
                        cy={cy}
                        r={isEvaluation ? 6 : 4}
                        fill={isEvaluation ? "hsl(var(--violet-500))" : "hsl(var(--primary))"}
                        stroke="white"
                        strokeWidth={2}
                        className="drop-shadow-sm"
                      />
                    );
                  }}
                  activeDot={{
                    r: 6,
                    fill: "hsl(var(--primary))",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-500 ring-2 ring-white shadow-sm" />
              <span className="text-xs text-muted-foreground">Avaliação</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-white shadow-sm" />
              <span className="text-xs text-muted-foreground">Sessão</span>
            </div>
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border/50">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-0.5 bg-emerald-500/50" style={{ borderTop: "2px dashed" }} />
                <span className="text-xs text-muted-foreground">Dor leve (≤3)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-0.5 bg-red-500/50" style={{ borderTop: "2px dashed" }} />
                <span className="text-xs text-muted-foreground">Dor intensa (≥7)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
