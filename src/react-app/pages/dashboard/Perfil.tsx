import { useState, useEffect, useRef } from "react";
import { Camera, Save, User, Stethoscope, MapPin, Phone, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Spinner, useToast } from "@/react-app/components/ui/microinteractions";
import { MobileHeader } from "@/react-app/components/layout/MobileHeader";
import { useAppAuth } from "@/react-app/contexts/AuthContext";
import { apiFetch } from "@/react-app/lib/api";

interface ProfileData {
  specialty: string;
  crefito: string;
  city: string;
  state: string;
  phone: string;
  avatar_url: string | null;
  bio: string;
  google_avatar_url: string | null;
}

const EMPTY_PROFILE: ProfileData = {
  specialty: "",
  crefito: "",
  city: "",
  state: "",
  phone: "",
  avatar_url: null,
  bio: "",
  google_avatar_url: null,
};

export default function Perfil() {
  const { user } = useAppAuth();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Fisioterapeuta";
  const userEmail = user?.email || "";

  // Effective avatar: custom upload takes priority over Google photo
  const effectiveAvatar = profile.avatar_url || profile.google_avatar_url;
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    void fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiFetch("/api/profile");
      if (!res.ok) throw new Error("Falha ao carregar perfil");
      const data = await res.json() as ProfileData & { google_avatar_url: string | null };
      setProfile({
        specialty: data.specialty || "",
        crefito: data.crefito || "",
        city: data.city || "",
        state: data.state || "",
        phone: data.phone || "",
        avatar_url: data.avatar_url || null,
        bio: data.bio || "",
        google_avatar_url: data.google_avatar_url || null,
      });
    } catch {
      // silently use empty profile on first load
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialty: profile.specialty || null,
          crefito: profile.crefito || null,
          city: profile.city || null,
          state: profile.state || null,
          phone: profile.phone || null,
          avatar_url: profile.avatar_url || null,
          bio: profile.bio || null,
        }),
      });
      if (!res.ok) throw new Error("Falha ao salvar");
      setSaved(true);
      toast.showSuccess("Perfil salvo com sucesso!");
      setTimeout(() => setSaved(false), 2500);
    } catch {
      toast.showError("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarFile = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.showError("Use uma imagem JPEG, PNG ou WebP.");
      return;
    }
    if (file.size > 500_000) {
      toast.showError("Imagem muito grande. Máximo 500 KB.");
      return;
    }

    setUploadingAvatar(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await apiFetch("/api/profile/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
      });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error || "Falha no upload");
      }
      const data = await res.json() as { avatar_url: string };
      setProfile((prev) => ({ ...prev, avatar_url: data.avatar_url }));
      toast.showSuccess("Foto atualizada!");
    } catch (e: unknown) {
      toast.showError(e instanceof Error ? e.message : "Erro no upload da foto.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Strip data URL prefix (e.g. "data:image/jpeg;base64,")
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
      reader.readAsDataURL(file);
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="md:hidden">
        <MobileHeader />
      </div>
      <>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Page header */}
        <div className="relative rounded-2xl bg-card border border-border shadow-sm overflow-hidden p-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400" />
          <div className="relative flex items-start gap-4">
            <div className="hidden sm:block">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <User className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Meu Perfil</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Suas informações profissionais aparecem nos laudos PDF exportados
              </p>
            </div>
          </div>
        </div>

        {/* Avatar + identity (read-only from Google) */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4 text-primary" />
              Identidade
            </CardTitle>
            <CardDescription>
              Nome e e-mail vêm do Google e não são editáveis aqui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center ring-2 ring-border">
                  {effectiveAvatar ? (
                    <img
                      src={effectiveAvatar}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">{userInitials}</span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center shadow-md transition-colors disabled:opacity-60"
                  title="Trocar foto"
                >
                  {uploadingAvatar ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-3.5 h-3.5" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleAvatarFile(file);
                    e.target.value = "";
                  }}
                />
              </div>

              {/* Name + email (read-only) */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Nome (Google)</Label>
                  <div className="h-9 px-3 rounded-md bg-muted/60 border border-border flex items-center text-sm text-foreground/70 select-none">
                    {userName}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">E-mail (Google)</Label>
                  <div className="h-9 px-3 rounded-md bg-muted/60 border border-border flex items-center text-sm text-foreground/70 select-none truncate">
                    {userEmail}
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Foto: máximo 500 KB · JPEG, PNG ou WebP. A foto aparece no dashboard e no app.
            </p>
          </CardContent>
        </Card>

        {/* Professional data */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Stethoscope className="w-4 h-4 text-primary" />
              Dados Profissionais
            </CardTitle>
            <CardDescription>
              Aparecem nos laudos PDF exportados pelo sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Input
                  id="specialty"
                  value={profile.specialty}
                  onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                  placeholder="Ex: Fisioterapia Ortopédica"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crefito">CREFITO</Label>
                <Input
                  id="crefito"
                  value={profile.crefito}
                  onChange={(e) => setProfile({ ...profile, crefito: e.target.value })}
                  placeholder="Ex: CREFITO-3/12345-F"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone / WhatsApp</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="(11) 91234-5678"
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="w-4 h-4 text-primary" />
              Localização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  placeholder="São Paulo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  placeholder="SP"
                  maxLength={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4 text-primary" />
              Apresentação
            </CardTitle>
            <CardDescription>
              Breve descrição profissional para o rodapé dos laudos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Fisioterapeuta especialista em reabilitação esportiva com 8 anos de experiência..."
              rows={3}
              maxLength={300}
            />
            <p className="mt-1.5 text-xs text-muted-foreground text-right">
              {profile.bio.length}/300
            </p>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex justify-end pb-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="gap-2 min-w-[140px] bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-90 text-white border-0 shadow-md"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : saved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Salvo!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar perfil
              </>
            )}
          </Button>
        </div>
      </div>
    </>
    </>
  );
}
