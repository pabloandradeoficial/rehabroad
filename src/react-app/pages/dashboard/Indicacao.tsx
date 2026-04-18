import { useState } from "react";
import { MobileHeader } from "@/react-app/components/layout/MobileHeader";
import { Gift, Mail, Link2, Copy, MessageCircle, Check, Users, Share2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { useToast } from "@/react-app/components/ui/microinteractions";

export default function Indicacao() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const toast = useToast();

  const referralLink = "https://rehabroad.com.br?ref=indicacao";
  
  const defaultMessage = `Olá! Indico o RehabRoad para você.

É uma plataforma de apoio clínico para fisioterapeutas com:
✅ Prontuário eletrônico completo
✅ Hipóteses diagnósticas automáticas
✅ NeuroFlux para eletroterapia
✅ Relatórios em PDF profissionais

Teste grátis por 30 dias: ${referralLink}`;

  const handleSendEmail = async () => {
    if (!email || !email.includes("@")) {
      toast.showError("Digite um e-mail válido");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/referral/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setEmailSent(true);
        toast.showSuccess("Convite enviado com sucesso!");
        setEmail("");
        setTimeout(() => setEmailSent(false), 3000);
      } else {
        toast.showError("Erro ao enviar convite. Tente novamente.");
      }
    } catch {
      toast.showError("Erro ao enviar convite.");
    } finally {
      setSending(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setLinkCopied(true);
    toast.showSuccess("Link copiado!");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <div className="md:hidden">
        <MobileHeader />
      </div>
      <>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative rounded-2xl bg-card border border-border shadow-sm overflow-hidden p-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />
          <div className="relative flex items-start gap-4">
            <div className="hidden sm:block">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
                <Gift className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Indicar para Colega</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Ajude outros fisioterapeutas a conhecer o RehabRoad
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Por que indicar?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Ajude colegas a organizar o raciocínio clínico
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Fortaleça a comunidade de fisioterapeutas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Contribua para a evolução da profissão
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share Options */}
        <div className="grid gap-6">
          {/* WhatsApp - Primary */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="w-5 h-5 text-green-500" />
                Compartilhar via WhatsApp
              </CardTitle>
              <CardDescription>
                Envie diretamente para um colega ou grupo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleShareWhatsApp}
                className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <MessageCircle className="w-6 h-6 mr-2" />
                Enviar pelo WhatsApp
              </Button>
            </CardContent>
          </Card>

          {/* Email */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="w-5 h-5 text-blue-500" />
                Enviar Convite por E-mail
              </CardTitle>
              <CardDescription>
                Enviaremos um convite personalizado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail do colega</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colega@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button
                onClick={handleSendEmail}
                disabled={sending || !email}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              >
                {sending ? (
                  "Enviando..."
                ) : emailSent ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Convite Enviado!
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Enviar Convite
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Copy Link */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Link2 className="w-5 h-5 text-primary" />
                Link Compartilhável
              </CardTitle>
              <CardDescription>
                Copie e compartilhe onde preferir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="h-12 bg-muted/50 font-mono text-sm"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="h-12 px-6"
                >
                  {linkCopied ? (
                    <Check className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Preview */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Share2 className="w-5 h-5 text-muted-foreground" />
              Mensagem do Convite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/30 rounded-lg border">
              <p className="text-sm whitespace-pre-line text-muted-foreground">
                Seu colega indicou o <span className="font-semibold text-primary">RehabRoad</span> para você.
                {"\n\n"}
                Teste gratuitamente a plataforma de apoio clínico para fisioterapeutas.
                {"\n\n"}
                ✅ Prontuário eletrônico completo{"\n"}
                ✅ Hipóteses diagnósticas automáticas{"\n"}
                ✅ NeuroFlux para eletroterapia{"\n"}
                ✅ Relatórios em PDF profissionais
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Teaser */}
        <div className="flex items-center justify-center gap-6 py-6 text-center">
          <div>
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">+500</p>
            <p className="text-xs text-muted-foreground">Fisioterapeutas</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div>
            <Share2 className="w-8 h-8 text-violet-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">Gratuito</p>
            <p className="text-xs text-muted-foreground">30 dias de teste</p>
          </div>
        </div>
      </div>
    </>
    </>
  );
}
