import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import { SubscriptionProvider } from "@/react-app/contexts/SubscriptionContext";
import { ToastProvider } from "@/react-app/components/ui/microinteractions";
import { ThemeProvider } from "@/react-app/hooks/useTheme";
import { LanguageProvider } from "@/react-app/contexts/LanguageContext";
import {
  AppAuthProvider,
  useAppAuth,
} from "@/react-app/contexts/AuthContext";

// Light pages - load immediately
import LoginPage from "@/react-app/pages/Login";

// Lazy load landing page for faster initial mobile load
const HomePage = lazy(() => import("@/react-app/pages/Home"));
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import ProtectedDashboard from "@/react-app/components/ProtectedDashboard";

// Lazy load heavy pages
const PainelPage = lazy(() => import("@/react-app/pages/dashboard/Painel"));
const PatientDetailPage = lazy(
  () => import("@/react-app/pages/dashboard/PatientDetail")
);
const CaminhoPage = lazy(() => import("@/react-app/pages/dashboard/Caminho"));
const SuportePage = lazy(() => import("@/react-app/pages/dashboard/Suporte"));
const TestesInteligentesPage = lazy(
  () => import("@/react-app/pages/dashboard/TestesInteligentes")
);
const AlertasPage = lazy(() => import("@/react-app/pages/dashboard/Alertas"));
const PlanoPage = lazy(() => import("@/react-app/pages/dashboard/Plano"));
const ExportacaoPage = lazy(
  () => import("@/react-app/pages/dashboard/Exportacao")
);
const ContatoSuportePage = lazy(
  () => import("@/react-app/pages/dashboard/ContatoSuporte")
);
const NeuroFluxPage = lazy(
  () => import("@/react-app/pages/dashboard/NeuroFlux")
);
const ExerciciosPage = lazy(
  () => import("@/react-app/pages/dashboard/Exercicios")
);
const AdminPage = lazy(() => import("@/react-app/pages/dashboard/Admin"));
const AdminEstudantePage = lazy(
  () => import("@/react-app/pages/dashboard/AdminEstudante")
);
const AgendaPage = lazy(() => import("@/react-app/pages/dashboard/Agenda"));
const ForumPage = lazy(() => import("@/react-app/pages/dashboard/Forum"));
const FinanceiroPage = lazy(
  () => import("@/react-app/pages/dashboard/Financeiro")
);
const IndicacaoPage = lazy(
  () => import("@/react-app/pages/dashboard/Indicacao")
);

// Lazy load secondary pages
const TermosDeUsoPage = lazy(
  () => import("@/react-app/pages/legal/TermosDeUso")
);
const PoliticaPrivacidadePage = lazy(
  () => import("@/react-app/pages/legal/PoliticaPrivacidade")
);
const PoliticaCancelamentoPage = lazy(
  () => import("@/react-app/pages/legal/PoliticaCancelamento")
);
const ComparacaoPage = lazy(() => import("@/react-app/pages/Comparacao"));
const BlogPage = lazy(() => import("@/react-app/pages/Blog"));
const BlogPostPage = lazy(() => import("@/react-app/pages/BlogPost"));
const LandingOrtopediaPage = lazy(
  () => import("@/react-app/pages/LandingOrtopedia")
);
const LandingEsportivaPage = lazy(
  () => import("@/react-app/pages/LandingEsportiva")
);
const LandingNeurologicaPage = lazy(
  () => import("@/react-app/pages/LandingNeurologica")
);
const BibliotecaClinicaPage = lazy(
  () => import("@/react-app/pages/BibliotecaClinicaPage")
);
const StudentHubPage = lazy(() => import("@/react-app/pages/StudentHub"));
const CasoSemanaPage = lazy(() => import("@/react-app/pages/CasoSemana"));

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Carregando...</p>
      </div>
    </div>
  );
}

function RootOAuthCodeRedirect() {
  useEffect(() => {
    const targetUrl = `/auth/callback${window.location.search}`;
    window.location.replace(targetUrl);
  }, []);

  return <PageLoader />;
}

function OAuthReturnBridge() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isPending } = useAppAuth();

  useEffect(() => {
    const hasSupabaseHash =
      window.location.hash.includes("access_token=") ||
      window.location.hash.includes("refresh_token=");

    // Compatibilidade se o Supabase ainda voltar com hash na raiz
    if (!isPending && user && hasSupabaseHash && location.pathname === "/") {
      const loginMode = localStorage.getItem("loginMode");
      navigate(loginMode === "student" ? "/estudante" : "/dashboard", {
        replace: true,
      });
    }
  }, [user, isPending, location.pathname, navigate]);

  return null;
}

export default function App() {
  const isRootOAuthCodeReturn =
    typeof window !== "undefined" &&
    window.location.pathname === "/" &&
    new URLSearchParams(window.location.search).has("code");

  if (isRootOAuthCodeReturn) {
    return <RootOAuthCodeRedirect />;
  }

  return (
    <AppAuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <ToastProvider>
                <Router>
                  <OAuthReturnBridge />

                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Public */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/comparacao" element={<ComparacaoPage />} />
                      <Route
                        path="/fisioterapia-ortopedica"
                        element={<LandingOrtopediaPage />}
                      />
                      <Route
                        path="/fisioterapia-esportiva"
                        element={<LandingEsportivaPage />}
                      />
                      <Route
                        path="/fisioterapia-neurologica"
                        element={<LandingNeurologicaPage />}
                      />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/blog/:slug" element={<BlogPostPage />} />
                      <Route
                        path="/biblioteca"
                        element={<BibliotecaClinicaPage />}
                      />
                      <Route
                        path="/biblioteca/:slug"
                        element={<BibliotecaClinicaPage />}
                      />
                      <Route path="/estudante" element={<StudentHubPage />} />
                      <Route
                        path="/caso-da-semana"
                        element={<CasoSemanaPage />}
                      />

                      {/* Auth */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route
                        path="/auth/callback"
                        element={<AuthCallbackPage />}
                      />

                      {/* Dashboard - Área Interna */}
                      <Route path="/dashboard" element={<ProtectedDashboard />}>
                        <Route index element={<PainelPage />} />
                        <Route
                          path="paciente/:id"
                          element={<PatientDetailPage />}
                        />
                        <Route path="caminho" element={<CaminhoPage />} />
                        <Route path="suporte" element={<SuportePage />} />
                        <Route
                          path="testes"
                          element={<TestesInteligentesPage />}
                        />
                        <Route path="alertas" element={<AlertasPage />} />
                        <Route path="plano" element={<PlanoPage />} />
                        <Route
                          path="exportacao"
                          element={<ExportacaoPage />}
                        />
                        <Route
                          path="contato"
                          element={<ContatoSuportePage />}
                        />
                        <Route path="neuroflux" element={<NeuroFluxPage />} />
                        <Route
                          path="exercicios"
                          element={<ExerciciosPage />}
                        />
                        <Route path="admin" element={<AdminPage />} />
                        <Route
                          path="admin-estudante"
                          element={<AdminEstudantePage />}
                        />
                        <Route path="agenda" element={<AgendaPage />} />
                        <Route path="forum" element={<ForumPage />} />
                        <Route
                          path="financeiro"
                          element={<FinanceiroPage />}
                        />
                        <Route path="indicacao" element={<IndicacaoPage />} />
                      </Route>

                      {/* Páginas Legais */}
                      <Route
                        path="/termos-de-uso"
                        element={<TermosDeUsoPage />}
                      />
                      <Route
                        path="/politica-de-privacidade"
                        element={<PoliticaPrivacidadePage />}
                      />
                      <Route
                        path="/politica-de-cancelamento"
                        element={<PoliticaCancelamentoPage />}
                      />

                      {/* Fallback */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </Router>
              </ToastProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AppAuthProvider>
  );
}