import { useState, useEffect, useCallback } from "react";

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

export function useTransactions(startDate?: string, endDate?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    total_income: 0,
    total_pending: 0,
    total_paid: 0,
    total_patients: 0,
    monthly_income: 0,
    monthly_pending: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const res = await fetch(`/api/transactions?${params}`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data.transactions || []);
      setSummary(data.summary || summary);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = async (input: TransactionInput) => {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to create transaction");
    await fetchTransactions();
  };

  const updateTransaction = async (id: number, input: TransactionInput) => {
    const res = await fetch(`/api/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to update transaction");
    await fetchTransactions();
  };

  const deleteTransaction = async (id: number) => {
    const res = await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete transaction");
    await fetchTransactions();
  };

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
