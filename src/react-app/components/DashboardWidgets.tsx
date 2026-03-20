import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  Target,
  Award,
  Sparkles
} from 'lucide-react';

// Animated counter that counts up to target value
export function AnimatedCounter({ 
  value, 
  duration = 1500,
  suffix = '',
  prefix = ''
}: { 
  value: number; 
  duration?: number;
  suffix?: string;
  prefix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * easeOutQuart);
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValue.current = end;
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      {prefix}{displayValue.toLocaleString('pt-BR')}{suffix}
    </span>
  );
}

// Time-based greeting
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

// Professional level based on activity
export function getProfessionalLevel(patients: number, evaluations: number, evolutions: number) {
  const score = patients * 10 + evaluations * 5 + evolutions * 3;
  
  if (score >= 500) return { level: 'Expert', icon: '🏆', color: 'text-amber-500', bg: 'bg-gradient-to-br from-amber-400 to-orange-500', next: null, progress: 100 };
  if (score >= 300) return { level: 'Avançado', icon: '⭐', color: 'text-violet-500', bg: 'bg-gradient-to-br from-violet-400 to-purple-500', next: 500, progress: ((score - 300) / 200) * 100 };
  if (score >= 150) return { level: 'Intermediário', icon: '💪', color: 'text-emerald-500', bg: 'bg-gradient-to-br from-emerald-400 to-teal-500', next: 300, progress: ((score - 150) / 150) * 100 };
  if (score >= 50) return { level: 'Ativo', icon: '📚', color: 'text-blue-500', bg: 'bg-gradient-to-br from-blue-400 to-indigo-500', next: 150, progress: ((score - 50) / 100) * 100 };
  return { level: 'Iniciante', icon: '🌱', color: 'text-slate-500', bg: 'bg-gradient-to-br from-slate-400 to-slate-500', next: 50, progress: (score / 50) * 100 };
}

// Productivity Widget
export function ProductivityWidget({ 
  patients, 
  evaluations, 
  evolutions,
  userName
}: { 
  patients: number;
  evaluations: number;
  evolutions: number;
  userName?: string;
}) {
  const level = getProfessionalLevel(patients, evaluations, evolutions);
  const greeting = getGreeting();
  const firstName = userName?.split(' ')[0] || userName?.split('@')[0] || 'Profissional';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-2xl" />
      
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Greeting Section */}
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl ${level.bg} flex items-center justify-center shadow-lg`}>
            <span className="text-2xl">{level.icon}</span>
          </div>
          <div>
            <p className="text-slate-400 text-sm">{greeting},</p>
            <h2 className="text-xl font-bold capitalize">{firstName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium ${level.color}`}>{level.level}</span>
              {level.next && (
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${level.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${level.bg}`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">{Math.round(level.progress)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold">
              <AnimatedCounter value={patients} />
            </p>
            <p className="text-xs text-slate-400">Pacientes</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-bold">
              <AnimatedCounter value={evaluations} />
            </p>
            <p className="text-xs text-slate-400">Avaliações</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-bold">
              <AnimatedCounter value={evolutions} />
            </p>
            <p className="text-xs text-slate-400">Evoluções</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Weekly Goal Widget
export function WeeklyGoalWidget({ 
  current, 
  goal,
  label 
}: { 
  current: number;
  goal: number;
  label: string;
}) {
  const progress = Math.min((current / goal) * 100, 100);
  const isComplete = current >= goal;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-xl p-4 border ${
        isComplete 
          ? 'bg-emerald-50 border-emerald-200' 
          : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isComplete ? 'bg-emerald-500' : 'bg-slate-100'
          }`}>
            {isComplete ? (
              <Award className="w-4 h-4 text-white" />
            ) : (
              <Target className="w-4 h-4 text-slate-600" />
            )}
          </div>
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <span className={`text-sm font-bold ${isComplete ? 'text-emerald-600' : 'text-slate-900'}`}>
          {current}/{goal}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className={`h-full rounded-full ${
            isComplete 
              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
              : 'bg-gradient-to-r from-primary to-emerald-500'
          }`}
        />
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 right-2"
        >
          <Sparkles className="w-4 h-4 text-emerald-500" />
        </motion.div>
      )}
    </motion.div>
  );
}

// Streak indicator
export function StreakIndicator({ days }: { days: number }) {
  if (days === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium shadow-lg shadow-orange-500/30"
    >
      <span>🔥</span>
      <span>{days} dias</span>
    </motion.div>
  );
}

// KPI Card with animated counter
export function AnimatedKPICard({
  value,
  label,
  icon: Icon,
  gradient,
  textColor,
  delay = 0
}: {
  value: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  textColor: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm p-5 cursor-default"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-3xl md:text-4xl font-bold tracking-tight ${textColor}`}>
            <AnimatedCounter value={value} />
          </p>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">{label}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

// Today's summary widget
export function TodaySummary({ 
  appointments = 0,
  evolutions = 0 
}: { 
  appointments?: number;
  evolutions?: number;
}) {
  const today = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-emerald-500/5 border border-primary/10"
    >
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Clock className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900 capitalize">{today}</p>
        <p className="text-xs text-slate-500">
          {appointments > 0 ? `${appointments} consulta${appointments > 1 ? 's' : ''} agendada${appointments > 1 ? 's' : ''}` : 'Sem consultas hoje'}
          {evolutions > 0 && ` • ${evolutions} evolução${evolutions > 1 ? 'ões' : ''}`}
        </p>
      </div>
      {(appointments > 0 || evolutions > 0) && (
        <div className="flex items-center gap-1 text-emerald-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-medium">Ativo</span>
        </div>
      )}
    </motion.div>
  );
}
