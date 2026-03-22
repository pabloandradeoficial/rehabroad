import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/react-app/lib/api";

export interface Transaction {
  id: number;
  user_id: string;
  patient_id: number | null;
  patient_name?: string;
  appointment_id: number | null;
  amount: number;
  type: "income" | "expense";
  payment_method: string | null;
  status: "pending" | "paid" | "cancelled";
  description: string | null;
  transaction_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionInput {
  patient_id?: number | null;
  appointment_id?: number | null;
  amount: number;
  type: "income" | "expense";
  payment_method?: string;
  status?: "pending" | "paid" | "cancelled";
  description?: string;
  transaction_date: string;
  notes?: string;
}

export interface FinancialSummary {
  total_income: number;
  total_pending: number;
  total_paid: number;
  total_patients: number;
  monthly_income: number;
  monthly_pending: number;
}

const EMPTY_SUMMARY: FinancialSummary = {
  total_income: 0,
  total_pending: 0,
  total_paid: 0,
  total_patients: 0,
  monthly_income: 0,
  monthly_pending: 0,
};

async function parseErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data?.reason === "string" && data.reason.trim()) {
      return data.reason;
    }

    if (typeof data?.error === "string" && data.error.trim()) {
      return data.error;
    }

    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export function useTransactions(startDate?: string, endDate?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);

      const query = params.toString();
      const url = query ? `/api/transactions?${query}` : "/api/transactions";

      const res = await apiFetch(url, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Erro ao carregar transações")
        );
      }

      const data = await res.json();

      setTransactions(Array.isArray(data?.transactions) ? data.transactions : []);
      setSummary(data?.summary ?? EMPTY_SUMMARY);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
      setSummary(EMPTY_SUMMARY);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    void fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = useCallback(
    async (input: TransactionInput) => {
      const res = await apiFetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Erro ao criar transação")
        );
      }

      await fetchTransactions();
    },
    [fetchTransactions]
  );

  const updateTransaction = useCallback(
    async (id: number, input: TransactionInput) => {
      const res = await apiFetch(`/api/transactions/${id}`, {
        method: "PUT",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Erro ao atualizar transação")
        );
      }

      await fetchTransactions();
    },
    [fetchTransactions]
  );

  const deleteTransaction = useCallback(
    async (id: number) => {
      const res = await apiFetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Erro ao excluir transação")
        );
      }

      await fetchTransactions();
    },
    [fetchTransactions]
  );

  return {
    transactions,
    summary,
    loading,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
}