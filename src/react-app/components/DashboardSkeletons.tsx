import { Skeleton } from "@/react-app/components/ui/microinteractions";

// ============================================
// DASHBOARD PAINEL SKELETON
// ============================================
export function PainelSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-6 w-12 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patients List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 flex-1 max-w-sm" />
            <Skeleton className="h-10 w-10" />
          </div>
          <div className="bg-card rounded-xl border divide-y">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl border p-5">
            <Skeleton className="h-5 w-32 mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-xl border p-5">
            <Skeleton className="h-5 w-28 mb-4" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PATIENT DETAIL SKELETON
// ============================================
export function PatientDetailSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Skeleton className="h-8 w-8" />
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-lg" />
        ))}
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl border p-5">
            <Skeleton className="h-5 w-40 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// TABLE SKELETON
// ============================================
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      {/* Header */}
      <div className="border-b bg-muted/30 p-4 flex gap-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="border-b last:border-0 p-4 flex gap-4 items-center">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

// ============================================
// CARD LIST SKELETON
// ============================================
export function CardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-card rounded-xl border p-5">
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}

// ============================================
// INLINE SKELETON COMPONENTS
// ============================================
export function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-6 w-12 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export function PatientCardSkeleton() {
  return (
    <div className="p-4 flex items-center gap-4 border-b last:border-0">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-5 w-40 mb-2" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}
