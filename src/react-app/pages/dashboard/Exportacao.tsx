import { useState, useEffect } from "react";
import { useAppAuth } from "@/react-app/contexts/AuthContext";
import {
  FileText,
  Download,
  User,
  Stethoscope,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Share2,
  Copy,
  MessageCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/react-app/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/react-app/components/ui/dialog";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import PremiumGate from "@/react-app/components/PremiumGate";
import {
  PageTransition,
  Spinner,
  useToast,
} from "@/react-app/components/ui/microinteractions";
import { apiFetch } from "@/react-app/lib/api";

interface Patient {
  id: number;
  name: string;
  birth_date: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
}

interface Evaluation {
  id: number;
  type: string;
  chief_complaint: string | null;
  history: string | null;
  pain_level: number | null;
  pain_location: string | null;
  functional_status: string | null;
  orthopedic_tests: string | null;
  observations: string | null;
  created_at: string;
}

interface Evolution {
  id: number;
  session_date: string;
  pain_level: number | null;
  functional_status: string | null;
  procedures: string | null;
  patient_response: string | null;
  observations: string | null;
  created_at: string;
}

interface ProfessionalProfile {
  crefito: string;
  contact: string;
  location: string;
}

function parseArrayResponse<T>(data: unknown, key?: string): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (
    key &&
    data &&
    typeof data === "object" &&
    Array.isArray((data as Record<string, unknown>)[key])
  ) {
    return (data as Record<string, unknown>)[key] as T[];
  }

  return [];
}

function ExportacaoContent() {
  const { user } = useAppAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [profile, setProfile] = useState<ProfessionalProfile>({
    crefito: "",
    contact: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [generatedFileName, setGeneratedFileName] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const toast = useToast();

  useEffect(() => {
    void fetchPatients();
    void loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await apiFetch("/api/profile");
      if (!res.ok) return;
      const data = await res.json() as { crefito?: string; phone?: string; city?: string; state?: string };
      setProfile({
        crefito: data.crefito || "",
        contact: data.phone || "",
        location: data.city && data.state ? `${data.city}, ${data.state}` : data.city || data.state || "",
      });
    } catch {
      // silently fall back to empty profile
    }
  };

  const saveProfile = async () => {
    try {
      const [cityPart, statePart] = profile.location.split(",").map((s) => s.trim());
      await apiFetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crefito: profile.crefito || null,
          phone: profile.contact || null,
          city: cityPart || null,
          state: statePart || null,
        }),
      });
      setProfileSaved(true);
      toast.showSuccess("Perfil profissional salvo!");
      setTimeout(() => setProfileSaved(false), 2000);
    } catch {
      toast.showError("Erro ao salvar perfil.");
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await apiFetch("/api/patients", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Erro ao carregar pacientes");
      }

      const data: unknown = await res.json();
      const parsedPatients = parseArrayResponse<Patient>(data, "patients");
      setPatients(parsedPatients);
    } catch {
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientData = async (patientId: number) => {
    const [evalRes, evolRes] = await Promise.all([
      apiFetch(`/api/patients/${patientId}/evaluations`, {
        method: "GET",
        cache: "no-store",
      }),
      apiFetch(`/api/patients/${patientId}/evolutions`, {
        method: "GET",
        cache: "no-store",
      }),
    ]);

    const evaluationsData: unknown = evalRes.ok ? await evalRes.json() : [];
    const evolutionsData: unknown = evolRes.ok ? await evolRes.json() : [];

    const evaluations = parseArrayResponse<Evaluation>(evaluationsData, "evaluations");
    const evolutions = parseArrayResponse<Evolution>(evolutionsData, "evolutions");

    return { evaluations, evolutions };
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Não informado";
    try {
      return new Date(dateStr).toLocaleDateString("pt-BR");
    } catch {
      return dateStr;
    }
  };

  const generatePDF = async () => {
    if (!selectedPatientId) return;

    setGenerating(true);
    setSuccess(false);

    try {
      const patient = patients.find((p) => p.id === Number(selectedPatientId));
      if (!patient) {
        toast.showError("Paciente não encontrado.");
        return;
      }

      const { evaluations, evolutions } = await fetchPatientData(patient.id);

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPos = 20;

      const addNewPageIfNeeded = (requiredSpace: number = 30) => {
        if (yPos + requiredSpace > pageHeight - 40) {
          doc.addPage();
          yPos = 25;
        }
      };

      const addFooter = async () => {
        const pageCount = doc.getNumberOfPages();

        let qrDataUrl = "";
        try {
          qrDataUrl = await QRCode.toDataURL(
            "https://rehabroad.com.br?ref=pdf",
            {
              width: 80,
              margin: 0,
              color: { dark: "#2563eb", light: "#ffffff" },
            }
          );
        } catch {
          // QR code generation failed — continue without QR
        }

        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);

          doc.setDrawColor(200, 200, 200);
          doc.line(margin, pageHeight - 28, pageWidth - margin, pageHeight - 28);

          if (i === pageCount && qrDataUrl) {
            doc.addImage(qrDataUrl, "PNG", margin, pageHeight - 26, 18, 18);
          }

          const textStartX = i === pageCount && qrDataUrl ? margin + 22 : margin;
          doc.setFillColor(37, 99, 235);
          doc.roundedRect(textStartX, pageHeight - 25, 48, 14, 2, 2, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");
          doc.text("REHABROAD", textStartX + 24, pageHeight - 19, {
            align: "center",
          });
          doc.setFontSize(6);
          doc.setFont("helvetica", "normal");
          doc.text("Software de apoio clínico", textStartX + 24, pageHeight - 14, {
            align: "center",
          });

          doc.setTextColor(80, 80, 80);
          doc.setFontSize(7);
          doc.setFont("helvetica", "normal");
          doc.text("Relatório gerado com RehabRoad", pageWidth / 2 + 10, pageHeight - 19, {
            align: "center",
          });
          doc.setFontSize(6);
          doc.setTextColor(37, 99, 235);
          doc.setFont("helvetica", "bold");
          doc.text("www.rehabroad.com.br", pageWidth / 2 + 10, pageHeight - 14, {
            align: "center",
          });

          doc.setTextColor(150, 150, 150);
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.text(`${i}/${pageCount}`, pageWidth - margin, pageHeight - 16, {
            align: "right",
          });
        }
      };

      const addSection = (title: string) => {
        addNewPageIfNeeded(30);
        yPos += 6;
        doc.setFillColor(37, 99, 235);
        doc.rect(margin, yPos, contentWidth, 9, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(title, margin + 4, yPos + 6.5);
        doc.setTextColor(0, 0, 0);
        yPos += 16;
      };

      const addField = (label: string, value: string | null | undefined) => {
        addNewPageIfNeeded(14);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(80, 80, 80);
        doc.text(`${label}:`, margin, yPos);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        const textValue = value || "Não informado";
        const lines = doc.splitTextToSize(textValue, contentWidth - 55);
        doc.text(lines, margin + 55, yPos);
        yPos += Math.max(7, lines.length * 5) + 2;
      };

      const addMultilineField = (label: string, value: string | null | undefined) => {
        addNewPageIfNeeded(22);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(80, 80, 80);
        doc.text(`${label}:`, margin, yPos);
        yPos += 6;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        const textValue = value || "Não informado";
        const lines = doc.splitTextToSize(textValue, contentWidth);
        lines.forEach((line: string) => {
          addNewPageIfNeeded(7);
          doc.text(line, margin, yPos);
          yPos += 5;
        });
        yPos += 4;
      };

      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 45, "F");

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, 8, 28, 28, 3, 3, "F");
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("RR", margin + 14, 26, { align: "center" });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("RELATÓRIO CLÍNICO", margin + 35, 18);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Prontuário Fisioterapêutico", margin + 35, 26);
      doc.setFontSize(9);
      doc.text(
        `Emitido em: ${new Date().toLocaleDateString("pt-BR")}`,
        margin + 35,
        34
      );

      yPos = 55;

      const authName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Fisioterapeuta";
      addSection("DADOS DO PROFISSIONAL RESPONSÁVEL");
      addField("Fisioterapeuta", authName);
      addField("CREFITO", profile.crefito || "Não informado");
      if (profile.contact) addField("Contato", profile.contact);
      if (profile.location) addField("Cidade/Estado", profile.location);

      addSection("IDENTIFICAÇÃO DO PACIENTE");
      addField("Nome Completo", patient.name);
      addField("Data de Nascimento", formatDate(patient.birth_date));
      if (patient.phone) addField("Telefone", patient.phone);
      if (patient.email) addField("E-mail", patient.email);
      if (patient.notes) addMultilineField("Observações Gerais", patient.notes);

      const initialEval = evaluations.find((e) => e.type === "initial");
      if (initialEval) {
        addSection("AVALIAÇÃO INICIAL");
        addField("Data da Avaliação", formatDate(initialEval.created_at));
        addMultilineField("Queixa Principal", initialEval.chief_complaint);
        addMultilineField("Histórico Clínico", initialEval.history);
        if (initialEval.pain_level !== null) {
          addField("Nível de Dor (EVA)", `${initialEval.pain_level}/10`);
        }
        addMultilineField("Localização da Dor", initialEval.pain_location);
        addMultilineField("Status Funcional", initialEval.functional_status);
        addMultilineField("Testes Ortopédicos", initialEval.orthopedic_tests);
        addMultilineField("Observações Clínicas", initialEval.observations);
      }

      const followupEvals = evaluations.filter((e) => e.type === "followup");
      if (followupEvals.length > 0) {
        addSection("REAVALIAÇÕES");
        followupEvals.forEach((evaluation, index) => {
          addNewPageIfNeeded(50);
          doc.setFillColor(243, 244, 246);
          doc.rect(margin, yPos, contentWidth, 8, "F");
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(60, 60, 60);
          doc.text(
            `Reavaliação ${index + 1} - ${formatDate(evaluation.created_at)}`,
            margin + 4,
            yPos + 5.5
          );
          doc.setTextColor(0, 0, 0);
          yPos += 14;

          if (evaluation.chief_complaint) {
            addMultilineField("Queixa Atual", evaluation.chief_complaint);
          }
          if (evaluation.pain_level !== null) {
            addField("Nível de Dor (EVA)", `${evaluation.pain_level}/10`);
          }
          if (evaluation.functional_status) {
            addMultilineField("Status Funcional", evaluation.functional_status);
          }
          if (evaluation.orthopedic_tests) {
            addMultilineField("Testes Ortopédicos", evaluation.orthopedic_tests);
          }
          if (evaluation.observations) {
            addMultilineField("Observações", evaluation.observations);
          }
          yPos += 4;
        });
      }

      if (evolutions.length > 0) {
        addSection("REGISTROS DE EVOLUÇÃO");

        evolutions.forEach((evolution, index) => {
          addNewPageIfNeeded(50);
          doc.setFillColor(243, 244, 246);
          doc.rect(margin, yPos, contentWidth, 8, "F");
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(60, 60, 60);
          doc.text(
            `Sessão ${index + 1} - ${formatDate(evolution.session_date)}`,
            margin + 4,
            yPos + 5.5
          );
          doc.setTextColor(0, 0, 0);
          yPos += 14;

          if (evolution.pain_level !== null) {
            addField("Nível de Dor (EVA)", `${evolution.pain_level}/10`);
          }
          addMultilineField("Status Funcional", evolution.functional_status);
          addMultilineField("Procedimentos Realizados", evolution.procedures);

          if (evolution.patient_response) {
            const responseLabel =
              evolution.patient_response === "positive"
                ? "Positiva"
                : evolution.patient_response === "negative"
                  ? "Negativa"
                  : "Neutra";

            addField("Resposta do Paciente", responseLabel);
          }

          if (evolution.observations) {
            addMultilineField("Observações", evolution.observations);
          }
          yPos += 4;
        });
      }

      addNewPageIfNeeded(50);
      yPos += 15;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, margin + 80, yPos);
      yPos += 5;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(user?.user_metadata?.name || user?.email?.split("@")[0] || "Fisioterapeuta Responsável", margin, yPos);
      yPos += 5;
      if (profile.crefito) {
        doc.text(profile.crefito, margin, yPos);
        yPos += 5;
      }

      addNewPageIfNeeded(35);
      yPos += 15;
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(120, 120, 120);

      const disclaimer =
        "Este relatório foi gerado para fins de acompanhamento clínico. A responsabilidade técnica pelas informações registradas é do profissional responsável. Este documento não substitui a avaliação presencial nem o julgamento clínico do fisioterapeuta. Gerado conforme normas do COFFITO.";

      const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);
      disclaimerLines.forEach((line: string) => {
        doc.text(line, pageWidth / 2, yPos, { align: "center" });
        yPos += 4;
      });

      await addFooter();

      const fileName = `relatorio_${patient.name
        .replace(/\s+/g, "_")
        .toLowerCase()}_${new Date().toISOString().split("T")[0]}.pdf`;

      doc.save(fileName);
      setGeneratedFileName(fileName);

      try {
        await apiFetch("/api/onboarding/report-exported", {
          method: "POST",
          body: JSON.stringify({ patientId: patient.id }),
        });
      } catch {
        // non-critical — export tracking failure should not block the user
      }

      setSuccess(true);
      setShowShareDialog(true);
      toast.showSuccess("Relatório PDF gerado com sucesso!");
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      toast.showError("Erro ao gerar relatório. Tente novamente.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const selectedPatient = patients.find((p) => p.id === Number(selectedPatientId));

  const handleShareWhatsApp = () => {
    const message =
      "Olá! Segue o relatório clínico gerado pelo RehabRoad. Acesse: https://rehabroad.com.br";
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://rehabroad.com.br");
    toast.showSuccess("Link copiado!");
  };

  return (
    <PageTransition>
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              Relatório gerado com sucesso!
            </DialogTitle>
            <DialogDescription>{generatedFileName}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-3">
              <Button
                onClick={() => setShowShareDialog(false)}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              >
                <Download className="w-5 h-5 mr-2" />
                PDF Baixado com Sucesso
              </Button>

              <Button
                onClick={handleShareWhatsApp}
                variant="outline"
                className="w-full h-12 border-green-500 text-green-600 hover:bg-green-50"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Compartilhar com Paciente
              </Button>

              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="w-full h-12"
              >
                <Copy className="w-5 h-5 mr-2" />
                Copiar Link do RehabRoad
              </Button>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Share2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Ajude a divulgar o RehabRoad
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Relatórios gerados com RehabRoad ajudam outros profissionais a
                    conhecer a plataforma. O QR code no rodapé direciona para o site.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="relative rounded-2xl bg-card border border-border shadow-sm overflow-hidden p-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500" />
          <div className="relative flex items-start gap-4">
            <div className="hidden sm:block">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500 flex items-center justify-center shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Exportação de Relatórios</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Geração de documentos clínicos profissionais em PDF
              </p>
            </div>
          </div>
        </div>

        {success && (
          <Card className="border-emerald-500/50 bg-emerald-500/10">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <div>
                <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                  Relatório gerado com sucesso!
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-500">
                  O download do documento foi iniciado automaticamente.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {patients.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum paciente cadastrado
              </h3>
              <p className="text-muted-foreground">
                Cadastre pacientes no Prontuário para gerar relatórios.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  Informações do Profissional
                </CardTitle>
                <CardDescription>
                  Seus dados serão incluídos automaticamente nos relatórios exportados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="professionalCrefito">CREFITO</Label>
                    <Input
                      id="professionalCrefito"
                      value={profile.crefito}
                      onChange={(e) =>
                        setProfile({ ...profile, crefito: e.target.value })
                      }
                      placeholder="Ex: CREFITO-3/12345-F"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="professionalContact">Contato</Label>
                    <Input
                      id="professionalContact"
                      value={profile.contact}
                      onChange={(e) =>
                        setProfile({ ...profile, contact: e.target.value })
                      }
                      placeholder="Telefone ou e-mail"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="professionalLocation">Cidade/Estado</Label>
                    <Input
                      id="professionalLocation"
                      value={profile.location}
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                      placeholder="Ex: São Paulo, SP"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    Campos opcionais. Os dados ficam salvos localmente.
                  </p>
                  <Button variant="outline" size="sm" onClick={saveProfile}>
                    {profileSaved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                        Salvo
                      </>
                    ) : (
                      "Salvar Dados"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-primary" />
                  Selecionar Paciente
                </CardTitle>
                <CardDescription>
                  Escolha o paciente para gerar o relatório clínico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="patientSelect">Paciente</Label>
                  <Select
                    value={selectedPatientId}
                    onValueChange={setSelectedPatientId}
                  >
                    <SelectTrigger id="patientSelect" className="w-full">
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedPatient && (
                  <div className="mt-6 p-5 bg-muted/50 rounded-xl">
                    <h4 className="font-medium text-foreground mb-3">
                      Paciente Selecionado
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-muted-foreground">Nome:</span>{" "}
                        {selectedPatient.name}
                      </p>
                      <p>
                        <span className="text-muted-foreground">
                          Data de Nascimento:
                        </span>{" "}
                        {formatDate(selectedPatient.birth_date)}
                      </p>
                      {selectedPatient.phone && (
                        <p>
                          <span className="text-muted-foreground">Telefone:</span>{" "}
                          {selectedPatient.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  Conteúdo do Relatório
                </CardTitle>
                <CardDescription>
                  Seções incluídas no documento PDF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>Cabeçalho com logo RehabRoad e data de emissão</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>
                      Dados do profissional responsável (nome, CREFITO)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>Identificação completa do paciente</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>
                      Avaliação inicial (queixa, histórico, testes ortopédicos)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>Registros de evolução cronológicos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>Área de assinatura e rodapé profissional</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    O relatório inclui aviso de responsabilidade técnica conforme
                    normas do COFFITO.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={generatePDF}
              disabled={!selectedPatientId || generating}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25"
            >
              {generating ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Gerando Relatório...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Gerar Relatório em PDF
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground px-4">
              Este relatório é gerado com base nos dados registrados no prontuário
              eletrônico. A responsabilidade técnica pelas informações é do
              profissional responsável.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export default function ExportacaoPage() {
  return (
    <PremiumGate moduleName="Exportação">
      <ExportacaoContent />
    </PremiumGate>
  );
}