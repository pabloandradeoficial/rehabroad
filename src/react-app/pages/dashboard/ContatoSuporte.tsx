import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { MessageSquare, Mail, Clock, CheckCircle2, Send, Phone, AlertCircle } from "lucide-react";
import { useAuth } from "@getmocha/users-service/react";


const SUBJECTS = [
  { value: "suporte_tecnico", label: "Suporte Técnico" },
  { value: "duvida_assinatura", label: "Dúvida sobre Assinatura" },
  { value: "problema_pagamento", label: "Problema com Pagamento" },
  { value: "sugestao_melhoria", label: "Sugestão de Melhoria" },
  { value: "outro", label: "Outro" },
];

export default function ContatoSuportePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.google_user_data?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar mensagem");
      }

      setIsSubmitted(true);
      setFormData({
        name: user?.google_user_data?.name || "",
        email: user?.email || "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError("Ocorreu um erro ao enviar sua mensagem. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-7 w-7 text-primary" />
          Contato / Suporte
        </h1>
        <p className="text-muted-foreground mt-1">
          Entre em contato com nossa equipe para dúvidas, sugestões ou suporte técnico
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Enviar Mensagem
              </CardTitle>
              <CardDescription>
                Preencha o formulário abaixo e retornaremos em breve
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Mensagem enviada com sucesso!
                  </h3>
                  <p className="text-muted-foreground max-w-sm">
                    Nossa equipe retornará em breve. Você receberá uma resposta no e-mail informado.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Enviar nova mensagem
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome completo"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto *</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData({ ...formData, subject: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o assunto" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((subject) => (
                          <SelectItem key={subject.value} value={subject.value}>
                            {subject.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      placeholder="Descreva sua dúvida, problema ou sugestão..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar mensagem
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                E-mail de Suporte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a 
                href="mailto:pabloandradeoficial@gmail.com" 
                className="text-primary hover:underline font-medium"
              >
                pabloandradeoficial@gmail.com
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Horário de Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="text-foreground">Segunda a Sexta</p>
              <p className="text-muted-foreground">8h às 18h (horário de Brasília)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Tempo de Resposta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="text-foreground">Até 24 horas úteis</p>
              <p className="text-muted-foreground">
                Para urgências, utilize o assunto "Suporte Técnico"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Legal Notice */}
      <Card className="bg-muted/50 border-muted">
        <CardContent className="py-4">
          <p className="text-xs text-muted-foreground text-center">
            As informações enviadas por meio deste formulário serão utilizadas exclusivamente para fins de 
            atendimento e suporte ao usuário, conforme{" "}
            <a href="/politica-de-privacidade" className="text-primary hover:underline">
              Política de Privacidade
            </a>{" "}
            da plataforma.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
