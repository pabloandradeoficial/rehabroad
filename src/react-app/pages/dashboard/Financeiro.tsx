import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Plus,
  Filter,
  Calendar,
  CreditCard,
  Banknote,
  Smartphone,
  Check,
  MoreVertical,
  Pencil,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  FileDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/react-app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Textarea } from "@/react-app/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/react-app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/react-app/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/react-app/components/ui/dropdown-menu";
import {
  PageTransition,
  useToast,
} from "@/react-app/components/ui/microinteractions";
import {
  useTransactions,
  Transaction,
  TransactionInput,
} from "@/react-app/hooks/useTransactions";
import { usePatients } from "@/react-app/hooks/usePatients";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAYMENT_METHODS: Record<string, { label: string; icon: React.ReactNode }> = {
  dinheiro: { label: "Dinheiro", icon: <Banknote className="w-4 h-4" /> },
  pix: { label: "PIX", icon: <Smartphone className="w-4 h-4" /> },
  cartao_credito: { label: "Cartão Crédito", icon: <CreditCard className="w-4 h-4" /> },
  cartao_debito: { label: "Cartão Débito", icon: <CreditCard className="w-4 h-4" /> },
  transferencia: { label: "Transferência", icon: <ArrowUpRight className="w-4 h-4" /> },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  paid: { label: "Pago", color: "text-emerald-600", bg: "bg-emerald-100" },
  pending: { label: "Pendente", color: "text-amber-600", bg: "bg-amber-100" },
  cancelled: { label: "Cancelado", color: "text-red-600", bg: "bg-red-100" },
};

const INCOME_CATEGORIES = ["Sessão", "Avaliação", "Retorno", "Pacote", "Outros"];
const EXPENSE_CATEGORIES = [
  "Aluguel",
  "Água/Luz/Internet",
  "Materiais",
  "Equipamentos",
  "Salários",
  "Outros",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts.map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
}

function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

function exportPDF(
  transactions: Transaction[],
  summary: ReturnType<typeof useTransactions>["summary"],
  dateRange: { start: string; end: string }
) {
  // Build a printable HTML page and open in a new window for the user to print/save as PDF
  const rows = transactions
    .map((t) => {
      const isIncome = t.type === "income";
      const color = isIncome ? "#059669" : "#dc2626";
      const sign = isIncome ? "+" : "-";
      const status = STATUS_CONFIG[t.status]?.label || t.status;
      return `
        <tr>
          <td>${formatDate(t.transaction_date)}</td>
          <td>${t.description || (isIncome ? "Receita" : "Despesa")}</td>
          <td>${t.category || "-"}</td>
          <td>${t.patient_name || "-"}</td>
          <td>${STATUS_CONFIG[t.status] ? `<span style="color:${STATUS_CONFIG[t.status].color}">${status}</span>` : status}</td>
          <td style="color:${color};font-weight:600;text-align:right">${sign} ${formatCurrency(t.amount)}</td>
        </tr>`;
    })
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <title>Relatório Financeiro</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .subtitle { color: #666; font-size: 13px; margin-bottom: 24px; }
    .cards { display: flex; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
    .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; flex: 1; min-width: 160px; }
    .card-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
    .card-value { font-size: 20px; font-weight: 700; }
    .green { color: #059669; }
    .red { color: #dc2626; }
    .blue { color: #2563eb; }
    .purple { color: #7c3aed; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #f3f4f6; padding: 10px 12px; text-align: left; font-size: 12px; color: #374151; border-bottom: 2px solid #e5e7eb; }
    td { padding: 9px 12px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
    tr:hover td { background: #fafafa; }
    .footer { margin-top: 24px; font-size: 12px; color: #9ca3af; text-align: center; }
    @media print { body { padding: 16px; } .no-print { display: none; } }
  </style>
</head>
<body>
  <h1>Relatório Financeiro</h1>
  <p class="subtitle">Período: ${formatDate(dateRange.start)} a ${formatDate(dateRange.end)} &nbsp;|&nbsp; Gerado em ${new Date().toLocaleDateString("pt-BR")}</p>

  <div class="cards">
    <div class="card">
      <div class="card-label">Receitas do Mês</div>
      <div class="card-value green">${formatCurrency(summary.monthly_income)}</div>
    </div>
    <div class="card">
      <div class="card-label">Despesas do Mês</div>
      <div class="card-value red">${formatCurrency(summary.monthly_expenses)}</div>
    </div>
    <div class="card">
      <div class="card-label">Lucro Líquido</div>
      <div class="card-value ${summary.net_profit >= 0 ? "green" : "red"}">${formatCurrency(summary.net_profit)}</div>
    </div>
    <div class="card">
      <div class="card-label">Pacientes Ativos</div>
      <div class="card-value purple">${summary.total_patients}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Data</th>
        <th>Descrição</th>
        <th>Categoria</th>
        <th>Paciente</th>
        <th>Status</th>
        <th style="text-align:right">Valor</th>
      </tr>
    </thead>
    <tbody>${rows || '<tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:24px">Nenhuma transação no período</td></tr>'}</tbody>
  </table>

  <div class="footer">Rehabroad — Relatório gerado automaticamente</div>
  <script>window.onload = () => window.print();</script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

// ─── Chart tooltip ────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FinanceiroPage() {
  const toast = useToast();
  const { start, end } = getMonthRange();
  const [dateRange, setDateRange] = useState({ start, end });
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const { transactions, summary, chartData, loading, createTransaction, updateTransaction, deleteTransaction } =
    useTransactions(dateRange.start, dateRange.end);
  const { patients } = usePatients();

  const emptyForm: TransactionInput = {
    patient_id: null,
    amount: 0,
    type: "income",
    payment_method: "pix",
    status: "pending",
    description: "",
    transaction_date: new Date().toISOString().split("T")[0],
    notes: "",
    category: null,
  };

  const [form, setForm] = useState<TransactionInput>(emptyForm);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filterStatus !== "all" && t.status !== filterStatus) return false;
      if (filterType !== "all" && t.type !== filterType) return false;
      return true;
    });
  }, [transactions, filterStatus, filterType]);

  const openNewTransaction = () => {
    setEditingTransaction(null);
    setForm({ ...emptyForm, transaction_date: new Date().toISOString().split("T")[0] });
    setDialogOpen(true);
  };

  const openEditTransaction = (t: Transaction) => {
    setEditingTransaction(t);
    setForm({
      patient_id: t.patient_id,
      amount: t.amount,
      type: t.type,
      payment_method: t.payment_method || "pix",
      status: t.status,
      description: t.description || "",
      transaction_date: t.transaction_date,
      notes: t.notes || "",
      category: t.category || null,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.amount || form.amount <= 0) {
      toast.showError("Informe um valor válido");
      return;
    }
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, form);
        toast.showSuccess("Transação atualizada");
      } else {
        await createTransaction(form);
        toast.showSuccess("Transação registrada");
      }
      setDialogOpen(false);
    } catch {
      toast.showError("Erro ao salvar transação");
    }
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;
    try {
      await deleteTransaction(transactionToDelete.id);
      toast.showSuccess("Transação excluída");
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    } catch {
      toast.showError("Erro ao excluir");
    }
  };

  const markAsPaid = async (t: Transaction) => {
    try {
      await updateTransaction(t.id, {
        patient_id: t.patient_id,
        amount: t.amount,
        type: t.type,
        payment_method: t.payment_method || undefined,
        status: "paid",
        description: t.description || undefined,
        transaction_date: t.transaction_date,
        notes: t.notes || undefined,
        category: t.category || undefined,
      });
      toast.showSuccess("Marcado como pago");
    } catch {
      toast.showError("Erro ao atualizar");
    }
  };

  const currentCategories = form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  if (loading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <div className="rounded-2xl bg-card border border-border shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-muted rounded w-40 mb-2" />
            <div className="h-4 bg-muted rounded w-64" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl bg-card border border-border p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-24 mb-3" />
                <div className="h-7 bg-muted rounded w-28" />
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 border-b border-border flex items-center gap-4 last:border-0">
                <div className="h-4 bg-muted rounded w-20" />
                <div className="h-4 bg-muted rounded flex-1" />
                <div className="h-4 bg-muted rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative rounded-2xl bg-card border border-border shadow-sm overflow-hidden p-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="hidden sm:block">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500 flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Financeiro</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Controle de receitas, despesas e lucratividade
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                className="gap-2 h-10"
                onClick={() => exportPDF(filteredTransactions, summary, dateRange)}
              >
                <FileDown className="w-4 h-4" />
                Exportar PDF
              </Button>
              <Button onClick={openNewTransaction} className="gap-2 h-10">
                <Plus className="w-4 h-4" />
                Nova Transação
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Receitas do Mês</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(summary.monthly_income)}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-full">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Despesas do Mês</p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(summary.monthly_expenses)}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
            <Card className={`border-l-4 ${summary.net_profit >= 0 ? "border-l-primary" : "border-l-orange-500"}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Lucro Líquido</p>
                    <p className={`text-2xl font-bold ${summary.net_profit >= 0 ? "text-primary" : "text-orange-600"}`}>
                      {formatCurrency(summary.net_profit)}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${summary.net_profit >= 0 ? "bg-primary/10" : "bg-orange-100"}`}>
                    <DollarSign className={`w-5 h-5 ${summary.net_profit >= 0 ? "text-primary" : "text-orange-600"}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
            <Card className="border-l-4 border-l-violet-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pacientes Ativos</p>
                    <p className="text-2xl font-bold text-violet-600">{summary.total_patients}</p>
                  </div>
                  <div className="p-3 bg-violet-100 rounded-full">
                    <Users className="w-5 h-5 text-violet-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bar Chart — Receitas x Despesas 6 meses */}
        {chartData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Receitas × Despesas — últimos 6 meses</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) =>
                        v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : `R$${v}`
                      }
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Bar dataKey="income" name="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="flex-1 sm:w-36 sm:flex-none min-w-0"
                />
                <span className="text-muted-foreground text-sm shrink-0">até</span>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="flex-1 sm:w-36 sm:flex-none min-w-0"
                />
              </div>
              <div className="flex items-center gap-3">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="flex-1 sm:w-[130px] sm:flex-none">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="income">Receitas</SelectItem>
                    <SelectItem value="expense">Despesas</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="flex-1 sm:w-[130px] sm:flex-none">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardContent className="p-0">
            {filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <Receipt className="w-12 h-12 text-muted-foreground/40 mb-4" />
                <p className="text-base font-semibold text-foreground mb-1">Nenhuma transação encontrada</p>
                <p className="text-sm text-muted-foreground mb-5 max-w-xs">
                  {filterStatus !== "all" || filterType !== "all"
                    ? "Tente remover os filtros para ver todas as transações"
                    : "Registre sua primeira receita ou despesa para acompanhar suas finanças"}
                </p>
                <Button onClick={openNewTransaction} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Nova Transação
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredTransactions.map((t, idx) => (
                  <TransactionRow
                    key={t.id}
                    transaction={t}
                    index={idx}
                    onEdit={() => openEditTransaction(t)}
                    onDelete={() => {
                      setTransactionToDelete(t);
                      setDeleteDialogOpen(true);
                    }}
                    onMarkPaid={() => markAsPaid(t)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* New/Edit Transaction Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? "Editar Transação" : "Nova Transação"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              {/* Tipo */}
              <div>
                <Label>Tipo</Label>
                <div className="flex gap-2 mt-1">
                  <Button
                    type="button"
                    variant={form.type === "income" ? "default" : "outline"}
                    className="flex-1 gap-2"
                    onClick={() => setForm({ ...form, type: "income", category: null })}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    Receita
                  </Button>
                  <Button
                    type="button"
                    variant={form.type === "expense" ? "default" : "outline"}
                    className={`flex-1 gap-2 ${form.type === "expense" ? "bg-red-600 hover:bg-red-700 border-red-600" : ""}`}
                    onClick={() => setForm({ ...form, type: "expense", category: null })}
                  >
                    <ArrowDownRight className="w-4 h-4" />
                    Despesa
                  </Button>
                </div>
              </div>

              {/* Categoria */}
              <div>
                <Label>Categoria</Label>
                <Select
                  value={form.category || "none"}
                  onValueChange={(val) => setForm({ ...form, category: val === "none" ? null : val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem categoria</SelectItem>
                    {currentCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Paciente */}
              <div>
                <Label>Paciente (opcional)</Label>
                <Select
                  value={form.patient_id?.toString() || "none"}
                  onValueChange={(val) =>
                    setForm({ ...form, patient_id: val === "none" ? null : parseInt(val) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem paciente</SelectItem>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Valor */}
              <div>
                <Label>Valor (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.amount || ""}
                  onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0,00"
                />
              </div>

              {/* Data + Pagamento */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data</Label>
                  <Input
                    type="date"
                    value={form.transaction_date}
                    onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Forma de Pagamento</Label>
                  <Select
                    value={form.payment_method || "pix"}
                    onValueChange={(val) => setForm({ ...form, payment_method: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PAYMENT_METHODS).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Status */}
              <div>
                <Label>Status</Label>
                <Select
                  value={form.status || "pending"}
                  onValueChange={(val) =>
                    setForm({ ...form, status: val as "pending" | "paid" | "cancelled" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Descrição */}
              <div>
                <Label>Descrição</Label>
                <Input
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={
                    form.type === "income"
                      ? "Ex: Sessão de Fisioterapia"
                      : "Ex: Aluguel da clínica"
                  }
                />
              </div>

              {/* Observações */}
              <div>
                <Label>Observações</Label>
                <Textarea
                  value={form.notes || ""}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Notas adicionais..."
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={handleSubmit}>
                  {editingTransaction ? "Salvar" : "Registrar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Excluir Transação</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete}>
                Excluir
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}

// ─── Transaction Row ───────────────────────────────────────────────────────────

interface TransactionRowProps {
  transaction: Transaction;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onMarkPaid: () => void;
}

function TransactionRow({ transaction: t, index, onEdit, onDelete, onMarkPaid }: TransactionRowProps) {
  const statusConfig = STATUS_CONFIG[t.status] || STATUS_CONFIG.pending;
  const paymentMethod = PAYMENT_METHODS[t.payment_method || ""] || {
    label: t.payment_method || "-",
    icon: null,
  };
  const isIncome = t.type === "income";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
    >
      <div className={`p-2 rounded-full shrink-0 ${isIncome ? "bg-emerald-100" : "bg-red-100"}`}>
        {isIncome ? (
          <ArrowUpRight className="w-4 h-4 text-emerald-600" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-600" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium truncate">
            {t.description || (isIncome ? "Receita" : "Despesa")}
          </p>
          {t.category && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {t.category}
            </span>
          )}
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.color}`}
          >
            {statusConfig.label}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5 flex-wrap">
          <span>{formatDate(t.transaction_date)}</span>
          {t.patient_name && (
            <>
              <span>•</span>
              <span className="truncate">{t.patient_name}</span>
            </>
          )}
          {paymentMethod.label && paymentMethod.label !== "-" && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                {paymentMethod.icon}
                {paymentMethod.label}
              </span>
            </>
          )}
        </div>
      </div>

      <div
        className={`text-lg font-bold shrink-0 ${
          isIncome ? "text-emerald-600" : "text-red-600"
        }`}
      >
        {isIncome ? "+" : "-"} {formatCurrency(t.amount)}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {t.status === "pending" && (
            <DropdownMenuItem onClick={onMarkPaid}>
              <Check className="w-4 h-4 mr-2" />
              Marcar como Pago
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-red-500">
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
