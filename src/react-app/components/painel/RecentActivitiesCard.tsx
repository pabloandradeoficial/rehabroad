import { motion } from "framer-motion";
import { CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import type { RecentActivity } from "@/react-app/hooks/useDashboardStats";

interface RecentActivitiesCardProps {
  activities: RecentActivity[];
}

export function RecentActivitiesCard({ activities }: RecentActivitiesCardProps) {
  return (
    <Card className="lg:col-span-3 border border-border shadow-sm bg-card overflow-hidden">
      <CardHeader className="pb-4 border-b border-border">
        <CardTitle className="text-base font-semibold flex items-center gap-3 text-foreground">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-violet-600" />
          </div>
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhuma atividade recente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 5).map((activity, index) => (
              <motion.div
                key={`${activity.type}-${activity.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted border border-border transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="text-muted-foreground">
                      {activity.description}
                    </span>
                    <span className="font-semibold text-foreground">
                      {" "}
                      — {activity.patientName}
                    </span>
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(activity.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
