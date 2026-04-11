/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, TrendingDown, Activity, Users, Zap, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import type { DashboardChartData } from "@/react-app/hooks/useDashboardCharts";

interface DashboardChartsProps {
  data: DashboardChartData;
  loading?: boolean;
}

export function DashboardCharts({ data, loading }: DashboardChartsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-0 shadow-md animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 bg-muted rounded w-32" />
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-muted/50 rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const hasData = data.weeklyActivity.some(w => w.evolutions > 0 || w.evaluations > 0);
  const hasPainData = data.painTrend.length > 0;
  const hasStatusData = data.statusDistribution.green + data.statusDistribution.yellow + data.statusDistribution.red > 0;
  const hasGrowthData = data.monthlyGrowth.some(m => m.patients > 0 || m.evolutions > 0);

  // Calculate trend indicators
  const recentEvolutions = data.weeklyActivity.slice(-2);
  const evolutionTrend = recentEvolutions.length >= 2 
    ? recentEvolutions[1].evolutions - recentEvolutions[0].evolutions 
    : 0;

  const painTrendData = data.painTrend.slice(-2);
  const painChange = painTrendData.length >= 2
    ? painTrendData[1].avgPain - painTrendData[0].avgPain
    : 0;

  // Pie chart data
  const statusData = [
    { name: "Evolução Adequada", value: data.statusDistribution.green, color: "#10b981" },
    { name: "Atenção", value: data.statusDistribution.yellow, color: "#f59e0b" },
    { name: "Alerta", value: data.statusDistribution.red, color: "#ef4444" }
  ].filter(d => d.value > 0);

  const CustomTooltip = ({ active, payload, label }: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium text-foreground mb-1">{label}</p>
          {payload.map((entry: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/20">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Métricas Visuais</h2>
          <p className="text-xs text-muted-foreground">Acompanhe a evolução da sua prática</p>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Atividade Semanal
                </CardTitle>
                {evolutionTrend !== 0 && (
                  <div className={`flex items-center gap-1 text-xs ${evolutionTrend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {evolutionTrend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {evolutionTrend > 0 ? '+' : ''}{evolutionTrend}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {hasData ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="week" 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="evolutions" 
                      name="Evoluções" 
                      fill="#10b981" 
                      radius={[4, 4, 0, 0]}
                      animationDuration={1000}
                    />
                    <Bar 
                      dataKey="evaluations" 
                      name="Avaliações" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                      animationDuration={1200}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  Registre evoluções para ver o gráfico
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pain Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Tendência de Dor (EVA)
                </CardTitle>
                {painChange !== 0 && (
                  <div className={`flex items-center gap-1 text-xs ${painChange < 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {painChange < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                    {painChange < 0 ? '' : '+'}{painChange.toFixed(1)}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {hasPainData ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={data.painTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      domain={[0, 10]}
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="avgPain" 
                      name="Média EVA"
                      stroke="#ef4444" 
                      fill="url(#painGradient)"
                      strokeWidth={2}
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  Registre níveis de dor para ver a tendência
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Status dos Pacientes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {hasStatusData ? (
                <div className="flex items-center">
                  <ResponsiveContainer width="60%" height={180}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                        animationDuration={1000}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2">
                    {statusData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-muted-foreground flex-1">{item.name}</span>
                        <span className="text-sm font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">
                  Adicione pacientes para ver a distribuição
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Crescimento Mensal
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {hasGrowthData ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={data.monthlyGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="patientsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="evolGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="patients" 
                      name="Novos Pacientes"
                      stroke="hsl(var(--primary))" 
                      fill="url(#patientsGradient)"
                      strokeWidth={2}
                      animationDuration={1200}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="evolutions" 
                      name="Evoluções"
                      stroke="#10b981" 
                      fill="url(#evolGradient)"
                      strokeWidth={2}
                      animationDuration={1400}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  Dados mensais aparecerão conforme você usar o sistema
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
