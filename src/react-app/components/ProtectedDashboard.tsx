import DashboardLayout from "@/react-app/components/layout/DashboardLayout";
import { AuthGuard } from "@/react-app/components/AuthGuard";

export default function ProtectedDashboard() {
  return (
    <AuthGuard>
      <DashboardLayout />
    </AuthGuard>
  );
}