import { useState } from "react";
import {
  Gift,
  Mail,
  Link2,
  Copy,
  MessageCircle,
  Check,
  Users,
  Share2,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { useAppAuth } from "@/react-app/contexts/AuthContext";

interface Props {
  onBack: () => void;
}

export default function StudentReferral({ onBack }: Props) {
  const { user, isPending, loginWithGoogle } = useAppAuth();

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const referralLink = "https://rehabroad.com.br/estudante?ref=indicacao";

  const defaultMessage = `Ei! Achei uma plataforma incrível pra estudar fisioterapia 🎓

O RehabRoad Estudante tem:
✅ Treino diário com casos clínicos
✅ Mapa da Dor interativo
✅ Testes ortopédicos explicados
✅ Biblioteca de conteúdos
✅ Comunidade de estudantes

É gratuito! Acessa: ${referralLink}`;

  const handleSendEmail = async () => {
    setEmailError(null);
    setEmailSent(false);

    if (!email || !email.includes("@")) {
      setEmailError("Digite um e-mail válido.");
      return;
    }

    if (!user) {
      try {
        localStorage.setItem("loginMode", "student");
        await loginWithGoogle();
      } catch (error) {
        setEmailError("Não foi possível iniciar o login agora.");
      }
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/referral/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, type: "student" }),
      });

      if (res.ok) {
        setEmailSent(true);
        setEmail("");
        window.setTimeout(() => setEmailSent(false), 3000);
        return;
      }

      if (res.status === 401 || res.status === 403) {
        setEmailError("Faça login para enviar convites por e-mail.");
        return;
      }

      setEmailError("Não foi possível enviar o convite agora.");
    } catch (error) {
      setEmailError("Não foi possível enviar o convite agora.");
    } finally {
      setSending(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header - Mobile optimized */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBack}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all touch-manipulation flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900">Indicar Amigo</h1>
            <p className="text-xs sm:text-sm text-slate-500">Compartilhe com colegas</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Hero Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white overflow-hidden">
          <CardContent className="p-4 sm:p-6 relative">
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2">Estude com seus amigos!</h2>
              <p className="text-teal-100 text-xs sm:text-sm">
                Convide colegas de turma para estudar juntos no RehabRoad.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Por que indicar?</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    Formem grupos de estudo na comunidade
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    Comparem pontuações no ranking
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    Discutam casos clínicos juntos
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp - Primary */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base text-slate-900">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              WhatsApp
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs sm:text-sm">
              Envie para o grupo da turma
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <Button
              onClick={handleShareWhatsApp}
              className="w-full h-11 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 touch-manipulation"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Enviar pelo WhatsApp
            </Button>
          </CardContent>
        </Card>

        {/* Email */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
              <Mail className="w-5 h-5 text-blue-500" />
              E-mail
            </CardTitle>
            <CardDescription className="text-slate-500">
              Envie um convite por e-mail
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!user && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Faça login como estudante para enviar convites por e-mail.
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">E-mail do amigo</Label>
              <Input
                id="email"
                type="email"
                placeholder="amigo@universidade.edu.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-white border-slate-200"
                disabled={isPending || sending}
              />
            </div>

            <Button
              onClick={handleSendEmail}
              disabled={sending || !email || isPending}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? (
                "Carregando..."
              ) : sending ? (
                "Enviando..."
              ) : emailSent ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Convite Enviado!
                </>
              ) : !user ? (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Entrar para Enviar
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Enviar Convite
                </>
              )}
            </Button>

            {emailError ? (
              <p className="text-sm text-red-500">{emailError}</p>
            ) : null}
          </CardContent>
        </Card>

        {/* Copy Link */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
              <Link2 className="w-5 h-5 text-teal-500" />
              Copiar Link
            </CardTitle>
            <CardDescription className="text-slate-500">
              Compartilhe onde quiser
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="h-11 bg-slate-50 border-slate-200 font-mono text-sm text-slate-600"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="h-11 px-5 border-slate-200"
              >
                {linkCopied ? (
                  <Check className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-600" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 py-6 text-center">
          <div>
            <Users className="w-7 h-7 text-teal-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-slate-900">+200</p>
            <p className="text-xs text-slate-500">Estudantes</p>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div>
            <Share2 className="w-7 h-7 text-violet-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-slate-900">100%</p>
            <p className="text-xs text-slate-500">Gratuito</p>
          </div>
        </div>
      </div>
    </div>
  );
}