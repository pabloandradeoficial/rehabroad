import { cn } from "@/react-app/lib/utils";

// Vibrant color palette for avatars
const AVATAR_COLORS = [
  { bg: "bg-rose-500", text: "text-white" },
  { bg: "bg-pink-500", text: "text-white" },
  { bg: "bg-fuchsia-500", text: "text-white" },
  { bg: "bg-purple-500", text: "text-white" },
  { bg: "bg-violet-500", text: "text-white" },
  { bg: "bg-indigo-500", text: "text-white" },
  { bg: "bg-blue-500", text: "text-white" },
  { bg: "bg-sky-500", text: "text-white" },
  { bg: "bg-cyan-500", text: "text-white" },
  { bg: "bg-teal-500", text: "text-white" },
  { bg: "bg-emerald-500", text: "text-white" },
  { bg: "bg-green-500", text: "text-white" },
  { bg: "bg-lime-600", text: "text-white" },
  { bg: "bg-amber-500", text: "text-white" },
  { bg: "bg-orange-500", text: "text-white" },
  { bg: "bg-red-500", text: "text-white" },
];

// Gradient combinations for premium feel
const AVATAR_GRADIENTS = [
  "from-rose-500 to-pink-600",
  "from-pink-500 to-fuchsia-600",
  "from-fuchsia-500 to-purple-600",
  "from-purple-500 to-violet-600",
  "from-violet-500 to-indigo-600",
  "from-indigo-500 to-blue-600",
  "from-blue-500 to-cyan-600",
  "from-cyan-500 to-teal-600",
  "from-teal-500 to-emerald-600",
  "from-emerald-500 to-green-600",
  "from-amber-500 to-orange-600",
  "from-orange-500 to-red-600",
];

// Hash function to consistently generate a number from a string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Get initials from a name
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

interface PatientAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "solid" | "gradient";
}

export function PatientAvatar({ 
  name, 
  size = "md", 
  className,
  variant = "gradient"
}: PatientAvatarProps) {
  const hash = hashString(name);
  const initials = getInitials(name);
  
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  if (variant === "gradient") {
    const gradientIndex = hash % AVATAR_GRADIENTS.length;
    const gradient = AVATAR_GRADIENTS[gradientIndex];
    
    return (
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-semibold text-white shadow-md",
          "bg-gradient-to-br",
          gradient,
          sizeClasses[size],
          className
        )}
      >
        {initials}
      </div>
    );
  }

  const colorIndex = hash % AVATAR_COLORS.length;
  const color = AVATAR_COLORS[colorIndex];

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold shadow-md",
        color.bg,
        color.text,
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}

