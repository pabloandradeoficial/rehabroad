import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Clock,
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
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card, CardContent } from "@/react-app/components/ui/card";
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
import { PageTransition, Spinner, useToast } from "@/react-app/components/ui/microinteractions";
import { useTransactions, Transaction, TransactionInput } from "@/react-app/hooks/useTransactions";
import { usePatients } from "@/react-app/hooks/usePatients";

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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
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

export default function FinanceiroPage() {
  const toast = useToast();
  const { start, end } = getMonthRange();
  const [dateRange, setDateRange] = useState({ start, end });
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const { transactions, summary, loading, createTransaction, updateTransaction, deleteTransaction } =
    useTransactions(dateRange.start, dateRange.end);
  const { patients } = usePatients();

  const [form, setForm] = useState<TransactionInput>({
    patient_id: null,
    amount: 0,
    type: "income",
    payment_method: "pix",
    status: "pending",
    description: "Sessão de Fisioterapia",
    transaction_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const filteredTransactions = useMemo(() => {
    if (filterStatus === "all") return transactions;
    return transactions.filter((t) => t.status === filterStatus);
  }, [transactions, filterStatus]);

  const openNewTransaction = () => {
    setEditingTransaction(null);
    setForm({
      patient_id: null,
      amount: 0,
      type: "income",
      payment_method: "pix",
      status: "pending",
      description: "Sessão de Fisioterapia",
      transaction_date: new Date().toISOString().split("T")[0],
      notes: "",
    });
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
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (form.amount <= 0) {
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
        ...t,
        status: "paid",
        payment_method: t.payment_method || undefined,
        description: t.description || undefined,
        notes: t.notes || undefined,
      });
      toast.showSuccess("Marcado como pago");
    } catch {
      toast.showError("Erro ao atualizar");
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
            <p className="text-muted-foreground text-sm">Controle de receitas e pagamentos</p>
          </div>
          <Button onClick={openNewTransaction} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Transação
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Receita do Mês</p>
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pendente</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {formatCurrency(summary.monthly_pending)}
                    </p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Recebido</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(summary.total_paid)}
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-l-4 border-l-violet-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pacientes</p>
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

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4 md:space-y-0 md:flex md:flex-wrap md:items-center md:gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="flex-1 min-w-0"
                  />
                </div>
                <span className="text-muted-foreground text-center">até</span>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="flex-1 min-w-0"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[140px]">
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
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardContent className="p-0">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma transação encontrada</p>
                <Button variant="outline" className="mt-4" onClick={openNewTransaction}>
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar transação
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? "Editar Transação" : "Nova Transação"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Tipo</Label>
                <div className="flex gap-2 mt-1">
                  <Button
                    type="button"
                    variant={form.type === "income" ? "default" : "outline"}
                    className="flex-1 gap-2"
                    onClick={() => setForm({ ...form, type: "income" })}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    Receita
                  </Button>
                  <Button
                    type="button"
                    variant={form.type === "expense" ? "default" : "outline"}
                    className="flex-1 gap-2"
                    onClick={() => setForm({ ...form, type: "expense" })}
                  >
                    <ArrowDownRight className="w-4 h-4" />
                    Despesa
                  </Button>
                </div>
              </div>

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

              <div>
                <Label>Valor (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.amount || ""}
                  onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0,00"
                />
              </div>

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

              <div>
                <Label>Status</Label>
                <Select
                  value={form.status || "pending"}
                  onValueChange={(val) => setForm({ ...form, status: val as "pending" | "paid" | "cancelled" })}
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

              <div>
                <Label>Descrição</Label>
                <Input
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Ex: Sessão de Fisioterapia"
                />
              </div>

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
          <DialogContent className="max-w-sm">
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

// Transaction Row Component
interface TransactionRowProps {
  transaction: Transaction;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onMarkPaid: () => void;
}

function TransactionRow({ transaction: t, index, onEdit, onDelete, onMarkPaid }: TransactionRowProps) {
  const statusConfig = STATUS_CONFIG[t.status] || STATUS_CONFIG.pending;
  const paymentMethod = PAYMENT_METHODS[t.payment_method || ""] || { label: t.payment_method || "-", icon: null };
  const isIncome = t.type === "income";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
    >
      <div className={`p-2 rounded-full ${isIncome ? "bg-emerald-100" : "bg-red-100"}`}>
        {isIncome ? (
          <ArrowUpRight className="w-4 h-4 text-emerald-600" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-600" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">
            {t.description || (isIncome ? "Receita" : "Despesa")}
          </p>
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{formatDate(t.transaction_date)}</span>
          {t.patient_name && (
            <>
              <span>•</span>
              <span className="truncate">{t.patient_name}</span>
            </>
          )}
          {paymentMethod.icon && (
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

      <div className={`text-lg font-bold ${isIncome ? "text-emerald-600" : "text-red-600"}`}>
        {isIncome ? "+" : "-"} {formatCurrency(t.amount)}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
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
