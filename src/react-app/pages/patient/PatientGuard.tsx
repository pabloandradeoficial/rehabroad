import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useAppAuth } from "@/react-app/contexts/AuthContext";
import { apiFetch } from "@/react-app/lib/api";

interface Props {
  children: React.ReactNode;
}

export default function PatientGuard({ children }: Props) {
  const { user, isPending } = useAppAuth();
  const [checking, setChecking] = useState(true);
  const [isPatient, setIsPatient] = useState(false);

  useEffect(() => {
    if (isPending || !user) return;

    apiFetch("/api/patient-portal/me")
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as { isPatient?: boolean };
        setIsPatient(d.isPatient === true);
      })
      .catch(() => {
        // not a patient
      })
      .finally(() => setChecking(false));
  }, [user, isPending]);

  if (isPending || (user && checking)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isPatient) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
