import { Skeleton } from "@/react-app/components/ui/microinteractions";

// ============================================
// DASHBOARD PAINEL SKELETON
// ============================================
export function PainelSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 h-[72px] mb-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl border-t-4 border-muted shadow-sm overflow-hidden min-h-[120px]">
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <Skeleton className="h-[44px] w-[44px] sm:h-[48px] sm:w-[48px] rounded-lg sm:rounded-xl" />
                <Skeleton className="h-8 w-12 sm:h-10 sm:w-16 rounded-md" />
              </div>
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patients List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <Skeleton className="h-10 w-full max-w-md rounded-md" />
            <Skeleton className="h-10 w-[140px] rounded-md hidden sm:block" />
          </div>
          <div className="bg-card rounded-xl border divide-y overflow-hidden shadow-sm">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 sm:p-5 flex items-center justify-between min-h-[88px]">
                <div className="flex gap-4 items-center">
                  <Skeleton className="h-12 w-12 rounded-full hidden sm:block" />
                  <div>
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <Skeleton className="h-8 w-24 rounded-full hidden sm:block" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
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
// AGENDA SKELETON
// ============================================
export function AgendaSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6 w-full animate-in fade-in duration-300">
      <div className="rounded-2xl bg-card border shadow-sm p-6 flex flex-col gap-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-2xl bg-card border p-4">
          <div className="grid grid-cols-7 gap-2 mb-3">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-4" />
            ))}
          </div>
          {[...Array(5)].map((_, row) => (
            <div key={row} className="grid grid-cols-7 gap-2 mb-2">
              {[...Array(7)].map((_, col) => (
                <Skeleton key={col} className="h-9 rounded-lg" />
              ))}
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-card border p-4 space-y-3">
          <Skeleton className="h-5 w-32" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
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
        <Skeleton className="h-8 w-8 mt-2" />
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <Skeleton className="h-[72px] w-[72px] rounded-full" />
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

