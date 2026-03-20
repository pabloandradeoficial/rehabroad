import { useState, useEffect, useCallback } from "react";

export interface Patient {
  id: number;
  user_id: string;
  name: string;
  birth_date: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PatientFormData {
  name: string;
  birth_date?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/patients");
      if (!res.ok) throw new Error("Failed to fetch patients");
      const data = await res.json();
      setPatients(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const createPatient = useCallback(async (data: PatientFormData) => {
    const res = await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create patient");
    const newPatient = await res.json();
    setPatients((prev) => [newPatient, ...prev]);
    return newPatient;
  }, []);

  const updatePatient = useCallback(async (id: number, data: PatientFormData) => {
    const res = await fetch(`/api/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update patient");
    const updated = await res.json();
    setPatients((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }, []);

  const deletePatient = useCallback(async (id: number) => {
    const res = await fetch(`/api/patients/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete patient");
    setPatients((prev) => prev.filter((p) => p.id !== id));
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
  };
}

export function usePatient(id: number | string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/patients/${id}`);
      if (!res.ok) throw new Error("Patient not found");
      const data = await res.json();
      setPatient(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchPatient();
  }, [id, fetchPatient]);

  return { patient, loading, error, refetch: fetchPatient };
}
