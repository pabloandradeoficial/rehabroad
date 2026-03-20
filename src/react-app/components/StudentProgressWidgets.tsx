import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, TrendingUp, Calendar, Camera, X, Trash2, Upload } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";

// Weekly Progress Chart
interface WeeklyProgressProps {
  data: { day: string; xp: number; cases: number }[];
}

export function WeeklyProgressChart({ data }: WeeklyProgressProps) {
  const totalCases = data.reduce((sum, d) => sum + d.cases, 0);
  const activeDays = data.filter(d => d.cases > 0).length;
  const maxCases = Math.max(...data.map(d => d.cases), 1);
  
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const dayNamesMobile = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const today = new Date().getDay();
  
  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-white">Esta Semana</h3>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right">
            <span className="text-lg sm:text-xl font-bold text-white">{totalCases}</span>
            <span className="text-xs text-slate-300 ml-1">casos</span>
          </div>
          <div className="w-px h-5 sm:h-6 bg-slate-600" />
          <div className="text-right">
            <span className="text-lg sm:text-xl font-bold text-teal-400">{activeDays}</span>
            <span className="text-xs text-slate-300 ml-1">dias</span>
          </div>
        </div>
      </div>
      
      {/* Daily progress bars */}
      <div className="space-y-2 sm:space-y-2.5">
        {data.map((day, idx) => {
          const percentage = maxCases > 0 ? (day.cases / maxCases) * 100 : 0;
          const isToday = idx === today;
          
          return (
            <div key={day.day} className="flex items-center gap-2 sm:gap-3">
              {/* Day label - abbreviated on mobile */}
              <span className={`w-6 sm:w-10 text-xs sm:text-sm font-semibold ${isToday ? 'text-teal-400' : 'text-white'}`}>
                <span className="sm:hidden">{dayNamesMobile[idx]}</span>
                <span className="hidden sm:inline">{dayNames[idx]}</span>
              </span>
              
              {/* Progress bar container */}
              <div className="flex-1 h-6 sm:h-7 bg-slate-700/60 rounded-lg overflow-hidden relative">
                {day.cases > 0 ? (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(percentage, 10)}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className={`h-full rounded-lg flex items-center justify-end pr-2 sm:pr-3 ${
                      isToday 
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-400' 
                        : 'bg-gradient-to-r from-teal-600 to-teal-500'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold text-white drop-shadow">
                      {day.cases}
                    </span>
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center pl-2 sm:pl-3">
                    <span className="text-xs text-slate-500">—</span>
                  </div>
                )}
                
                {/* Today indicator */}
                {isToday && day.cases === 0 && (
                  <div className="absolute inset-0 flex items-center pl-2 sm:pl-3">
                    <span className="text-xs text-teal-400 font-medium">hoje</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer message */}
      <div className="mt-3 sm:mt-4">
        {totalCases === 0 ? (
          <p className="text-xs text-slate-300 text-center bg-slate-700/40 py-2 rounded-lg">
            Complete casos para ver seu progresso semanal
          </p>
        ) : activeDays >= 5 ? (
          <p className="text-xs text-emerald-400 text-center bg-emerald-500/10 py-2 rounded-lg font-medium">
            🎯 Excelente consistência esta semana!
          </p>
        ) : activeDays >= 3 ? (
          <p className="text-xs text-teal-400 text-center bg-teal-500/10 py-2 rounded-lg font-medium">
            💪 Bom ritmo! Continue assim
          </p>
        ) : null}
      </div>
    </div>
  );
}

// Streak Calendar (GitHub-style contributions)
interface StreakCalendarProps {
  activityData: { date: string; count: number }[];
  streak: number;
}

export function StreakCalendar({ activityData, streak }: StreakCalendarProps) {
  // Generate last 35 days (5 weeks)
  const days = useMemo(() => {
    const result = [];
    const today = new Date();
    
    for (let i = 34; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const activity = activityData.find(a => a.date === dateStr);
      result.push({
        date: dateStr,
        count: activity?.count || 0,
        isToday: i === 0
      });
    }
    return result;
  }, [activityData]);

  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-slate-600/60';
    if (count <= 2) return 'bg-teal-700';
    if (count <= 5) return 'bg-teal-500';
    if (count <= 10) return 'bg-teal-400';
    return 'bg-emerald-400';
  };

  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-base font-semibold text-white">Histórico de Estudos</h3>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500/30 to-amber-500/30 px-3 py-1.5 rounded-full border border-orange-500/40">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-bold text-orange-300">{streak} dias</span>
          </div>
        )}
      </div>
      
      {/* Explanation */}
      <p className="text-xs text-slate-200 mb-4 bg-slate-700/40 px-3 py-2 rounded-lg">
        📅 Cada quadrado representa 1 dia. <span className="text-teal-400 font-medium">Quanto mais claro, mais atividades completadas.</span>
      </p>
      
      {/* Week day labels */}
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {weekDays.map((day, i) => (
          <div key={i} className="text-xs text-white font-semibold text-center">{day}</div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.01, duration: 0.2 }}
            className={`
              aspect-square rounded ${getIntensity(day.count)}
              ${day.isToday ? 'ring-2 ring-teal-400 ring-offset-2 ring-offset-slate-900' : ''}
              transition-all duration-200 hover:scale-110 cursor-pointer
            `}
            title={`${day.date}: ${day.count} ${day.count === 1 ? 'atividade' : 'atividades'}`}
          />
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/50">
        <span className="text-xs text-slate-200 font-medium">Últimas 5 semanas</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-white font-medium mr-1">Menos</span>
          {[0, 2, 5, 10, 15].map(level => (
            <div 
              key={level} 
              className={`w-3 h-3 rounded ${getIntensity(level)}`}
            />
          ))}
          <span className="text-xs text-white font-medium ml-1">Mais</span>
        </div>
      </div>
    </div>
  );
}

// Animated Stat Card
interface AnimatedStatProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  color: 'teal' | 'violet' | 'amber' | 'rose';
}

export function AnimatedStat({ icon, value, label, suffix = '', color }: AnimatedStatProps) {
  const colorClasses = {
    teal: 'from-teal-500/20 to-teal-500/5 border-teal-500/30 text-teal-400',
    violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/30 text-violet-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
    rose: 'from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-400',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        bg-gradient-to-br ${colorClasses[color]} 
        border rounded-xl p-3 cursor-default
        transition-shadow duration-300 hover:shadow-lg hover:shadow-${color}-500/10
      `}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className={colorClasses[color]}>{icon}</div>
      </div>
      <motion.p 
        className="text-2xl font-bold text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={value}
      >
        {value}{suffix}
      </motion.p>
      <p className="text-xs text-slate-400">{label}</p>
    </motion.div>
  );
}

// Avatar color options
const AVATAR_COLORS = [
  { id: 'teal', gradient: 'from-teal-500 to-emerald-500', ring: 'ring-teal-400' },
  { id: 'violet', gradient: 'from-violet-500 to-purple-500', ring: 'ring-violet-400' },
  { id: 'rose', gradient: 'from-rose-500 to-pink-500', ring: 'ring-rose-400' },
  { id: 'amber', gradient: 'from-amber-500 to-orange-500', ring: 'ring-amber-400' },
  { id: 'blue', gradient: 'from-blue-500 to-indigo-500', ring: 'ring-blue-400' },
  { id: 'cyan', gradient: 'from-cyan-500 to-teal-500', ring: 'ring-cyan-400' },
  { id: 'emerald', gradient: 'from-emerald-500 to-green-500', ring: 'ring-emerald-400' },
  { id: 'fuchsia', gradient: 'from-fuchsia-500 to-pink-500', ring: 'ring-fuchsia-400' },
  { id: 'sky', gradient: 'from-sky-500 to-blue-500', ring: 'ring-sky-400' },
  { id: 'lime', gradient: 'from-lime-500 to-green-500', ring: 'ring-lime-400' },
  { id: 'red', gradient: 'from-red-500 to-rose-500', ring: 'ring-red-400' },
  { id: 'indigo', gradient: 'from-indigo-500 to-violet-500', ring: 'ring-indigo-400' },
];

// Student Avatar with Upload and Color Selection
interface StudentAvatarProps {
  name?: string;
  imageUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  onAvatarChange?: (url: string | null) => void;
  userId?: string;
}

export function StudentAvatar({ name, imageUrl, size = 'md', editable, onAvatarChange, userId }: StudentAvatarProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(() => {
    const saved = localStorage.getItem(`rehabroad_avatar_color_${userId || 'guest'}`);
    return saved || 'teal';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-28 h-28 text-3xl'
  };

  const initials = name 
    ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  // Use selected color or fallback
  const colorOption = AVATAR_COLORS.find(c => c.id === selectedColor) || AVATAR_COLORS[0];
  const gradient = colorOption.gradient;
  
  const handleColorChange = (colorId: string) => {
    setSelectedColor(colorId);
    localStorage.setItem(`rehabroad_avatar_color_${userId || 'guest'}`, colorId);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/student/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        onAvatarChange?.(data.avatarUrl);
        setShowEditModal(false);
        setPreviewUrl(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao enviar foto');
      }
    } catch (err) {
      alert('Erro ao enviar foto');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setUploading(true);
    try {
      const response = await fetch('/api/student/avatar', {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        onAvatarChange?.(null);
        setShowEditModal(false);
        setPreviewUrl(null);
      }
    } catch (err) {
      alert('Erro ao remover foto');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={editable ? { scale: 1.05 } : undefined}
        className={`
          relative ${sizeClasses[size]} rounded-full 
          ${imageUrl ? '' : `bg-gradient-to-br ${gradient}`}
          flex items-center justify-center text-white font-bold
          shadow-lg shadow-black/20
          ${editable ? 'cursor-pointer group' : ''}
        `}
        onClick={editable ? () => setShowEditModal(true) : undefined}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name || 'Avatar'} 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
        
        {editable && (
          <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Personalizar Avatar</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview */}
              <div className="flex justify-center mb-6">
                <div className={`
                  w-28 h-28 rounded-full 
                  ${previewUrl || imageUrl ? '' : `bg-gradient-to-br ${gradient}`}
                  flex items-center justify-center text-white text-3xl font-bold
                  shadow-xl shadow-black/30 border-4 border-slate-700
                  overflow-hidden
                `}>
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : imageUrl ? (
                    <img src={imageUrl} alt={name || 'Avatar'} className="w-full h-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
              </div>

              {/* Color Selection - Only show if no image */}
              {!imageUrl && !previewUrl && (
                <div className="mb-6">
                  <p className="text-sm text-slate-400 mb-3 text-center">Escolha uma cor</p>
                  <div className="grid grid-cols-6 gap-2">
                    {AVATAR_COLORS.map((color) => (
                      <motion.button
                        key={color.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleColorChange(color.id)}
                        className={`
                          w-10 h-10 rounded-full bg-gradient-to-br ${color.gradient}
                          transition-all duration-200 touch-manipulation
                          ${selectedColor === color.id 
                            ? `ring-2 ${color.ring} ring-offset-2 ring-offset-slate-800` 
                            : 'hover:ring-2 hover:ring-slate-500 hover:ring-offset-2 hover:ring-offset-slate-800'
                          }
                        `}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-slate-700" />
                <span className="text-xs text-slate-500">ou</span>
                <div className="flex-1 h-px bg-slate-700" />
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {previewUrl ? (
                  <>
                    <Button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="w-full bg-teal-600 hover:bg-teal-700"
                    >
                      {uploading ? 'Salvando...' : 'Salvar Foto'}
                    </Button>
                    <Button
                      onClick={() => {
                        setPreviewUrl(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Escolher Foto
                    </Button>
                    {imageUrl && (
                      <Button
                        onClick={handleRemove}
                        disabled={uploading}
                        variant="outline"
                        className="w-full border-rose-600/50 text-rose-400 hover:bg-rose-600/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {uploading ? 'Removendo...' : 'Remover Foto'}
                      </Button>
                    )}
                  </>
                )}
              </div>

              <p className="text-xs text-slate-500 text-center mt-4">
                JPG, PNG, WebP ou GIF • Máx. 2MB
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Circular Stat Card - Premium Stats Display with Circular Progress
interface CircularStatCardProps {
  icon: React.ReactNode;
  value: number;
  maxValue?: number;
  label: string;
  suffix?: string;
  color: 'teal' | 'violet' | 'amber' | 'rose' | 'emerald';
}

const colorMap = {
  teal: { ring: '#14b8a6', bg: 'from-teal-500/20 to-teal-500/5', text: 'text-teal-400', glow: 'shadow-teal-500/20' },
  violet: { ring: '#8b5cf6', bg: 'from-violet-500/20 to-violet-500/5', text: 'text-violet-400', glow: 'shadow-violet-500/20' },
  amber: { ring: '#f59e0b', bg: 'from-amber-500/20 to-amber-500/5', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
  rose: { ring: '#f43f5e', bg: 'from-rose-500/20 to-rose-500/5', text: 'text-rose-400', glow: 'shadow-rose-500/20' },
  emerald: { ring: '#10b981', bg: 'from-emerald-500/20 to-emerald-500/5', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
};

export function CircularStatCard({ icon, value, maxValue = 100, label, suffix = '', color }: CircularStatCardProps) {
  const colors = colorMap[color];
  const progress = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;
  
  // Responsive sizes - smaller on mobile
  const mobileSize = 44;
  const desktopSize = 64;
  const mobileStroke = 4;
  const desktopStroke = 5;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`relative bg-gradient-to-br ${colors.bg} backdrop-blur-sm border border-slate-700/50 rounded-xl p-2.5 sm:p-4 overflow-hidden group`}
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${colors.bg} blur-xl`} />
      
      {/* Mobile: vertical layout, Desktop: horizontal */}
      <div className="relative flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3">
        {/* Circular Progress - responsive SVG */}
        <div className="relative flex-shrink-0 w-11 h-11 sm:w-16 sm:h-16">
          {/* Mobile SVG */}
          <svg width={mobileSize} height={mobileSize} className="transform -rotate-90 sm:hidden">
            <circle
              cx={mobileSize / 2}
              cy={mobileSize / 2}
              r={(mobileSize - mobileStroke) / 2}
              fill="none"
              stroke="currentColor"
              strokeWidth={mobileStroke}
              className="text-slate-700/50"
            />
            <motion.circle
              cx={mobileSize / 2}
              cy={mobileSize / 2}
              r={(mobileSize - mobileStroke) / 2}
              fill="none"
              stroke={colors.ring}
              strokeWidth={mobileStroke}
              strokeLinecap="round"
              initial={{ strokeDashoffset: ((mobileSize - mobileStroke) / 2) * 2 * Math.PI }}
              animate={{ strokeDashoffset: ((mobileSize - mobileStroke) / 2) * 2 * Math.PI - (progress / 100) * ((mobileSize - mobileStroke) / 2) * 2 * Math.PI }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              style={{ strokeDasharray: ((mobileSize - mobileStroke) / 2) * 2 * Math.PI }}
            />
          </svg>
          {/* Desktop SVG */}
          <svg width={desktopSize} height={desktopSize} className="transform -rotate-90 hidden sm:block">
            <circle
              cx={desktopSize / 2}
              cy={desktopSize / 2}
              r={(desktopSize - desktopStroke) / 2}
              fill="none"
              stroke="currentColor"
              strokeWidth={desktopStroke}
              className="text-slate-700/50"
            />
            <motion.circle
              cx={desktopSize / 2}
              cy={desktopSize / 2}
              r={(desktopSize - desktopStroke) / 2}
              fill="none"
              stroke={colors.ring}
              strokeWidth={desktopStroke}
              strokeLinecap="round"
              initial={{ strokeDashoffset: ((desktopSize - desktopStroke) / 2) * 2 * Math.PI }}
              animate={{ strokeDashoffset: ((desktopSize - desktopStroke) / 2) * 2 * Math.PI - (progress / 100) * ((desktopSize - desktopStroke) / 2) * 2 * Math.PI }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              style={{ strokeDasharray: ((desktopSize - desktopStroke) / 2) * 2 * Math.PI }}
            />
          </svg>
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${colors.text} [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5`}>
              {icon}
            </div>
          </div>
        </div>
        
        {/* Value and Label - centered on mobile */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex items-baseline justify-center sm:justify-start gap-0.5"
          >
            <span className="text-lg sm:text-2xl font-bold text-white tabular-nums">
              {value.toLocaleString()}
            </span>
            {suffix && <span className={`text-xs sm:text-sm font-medium ${colors.text}`}>{suffix}</span>}
          </motion.div>
          <p className="text-[10px] sm:text-xs text-slate-400 truncate leading-tight">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Circular Progress Ring
interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  showLabel?: boolean;
  label?: string;
  animate?: boolean;
}

export function CircularProgress({ 
  progress, 
  size = 60, 
  strokeWidth = 4,
  color = '#14b8a6',
  showLabel = true,
  label,
  animate = true
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  // Dynamic color based on progress
  const getProgressColor = () => {
    if (color !== '#14b8a6') return color;
    if (progress >= 100) return '#10b981'; // emerald
    if (progress >= 75) return '#14b8a6'; // teal
    if (progress >= 50) return '#f59e0b'; // amber
    return '#6366f1'; // indigo
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {showLabel && (
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={animate ? { opacity: 0, scale: 0.5 } : {}}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <span className="text-sm font-bold text-white">{Math.round(progress)}%</span>
          {label && <span className="text-[10px] text-slate-400">{label}</span>}
        </motion.div>
      )}
    </div>
  );
}

// Success Animation Overlay
interface SuccessAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

export function SuccessAnimation({ show, onComplete }: SuccessAnimationProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => {
        if (onComplete) setTimeout(onComplete, 1500);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative"
      >
        {/* Success circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5 }}
          className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30"
        >
          {/* Animated checkmark */}
          <svg className="w-14 h-14 sm:w-16 sm:h-16 text-white" viewBox="0 0 24 24" fill="none">
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            />
          </svg>
        </motion.div>
        
        {/* Sparkle particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.cos((i * Math.PI) / 4) * 70,
              y: Math.sin((i * Math.PI) / 4) * 70,
            }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute top-1/2 left-1/2 w-2.5 h-2.5 -ml-1.25 -mt-1.25"
          >
            <div className="w-full h-full bg-amber-400 rounded-full" />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// XP Gain Animation Toast
interface XPGainAnimationProps {
  show: boolean;
  amount: number;
  onComplete?: () => void;
}

export function XPGainAnimation({ show, amount, onComplete }: XPGainAnimationProps) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30 }}
        onAnimationComplete={() => {
          if (onComplete) setTimeout(onComplete, 2000);
        }}
        className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 0.3, repeat: 2 }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-xl shadow-amber-500/30 flex items-center gap-2"
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
            className="text-lg sm:text-xl"
          >
            ⚡
          </motion.span>
          <span className="font-bold text-base sm:text-lg">+{amount} XP</span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Streak Animation
interface StreakAnimationProps {
  show: boolean;
  streak: number;
}

export function StreakAnimation({ show, streak }: StreakAnimationProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="fixed top-32 sm:top-36 left-1/2 -translate-x-1/2 z-50"
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.5, repeat: 3 }}
        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-lg shadow-orange-500/30 flex items-center gap-2"
      >
        <span className="text-base sm:text-lg">🔥</span>
        <span className="font-bold text-sm sm:text-base">{streak} dias seguidos!</span>
      </motion.div>
    </motion.div>
  );
}

// Level Up Animation
interface LevelUpAnimationProps {
  show: boolean;
  level: number;
  levelName: string;
  onClose?: () => void;
}

export function LevelUpAnimation({ show, level, levelName, onClose }: LevelUpAnimationProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl max-w-sm w-full"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 0.6, repeat: 2 }}
          className="text-5xl sm:text-6xl mb-4"
        >
          🎉
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl sm:text-2xl font-bold mb-2"
        >
          Nível {level}!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-purple-200 mb-5 sm:mb-6"
        >
          {levelName}
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={onClose}
          className="bg-white text-purple-700 font-semibold px-6 py-2.5 rounded-full hover:bg-purple-50 transition-colors touch-manipulation"
        >
          Continuar
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
