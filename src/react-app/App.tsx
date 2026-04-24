import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { SubscriptionProvider } from "@/react-app/contexts/SubscriptionContext";
import { ToastProvider } from "@/react-app/components/ui/microinteractions";
import { ThemeProvider } from "@/react-app/hooks/useTheme";
import { LanguageProvider } from "@/react-app/contexts/LanguageContext";
import { AppAuthProvider, useAppAuth } from "@/react-app/contexts/AuthContext";
import { ErrorBoundary } from "@/react-app/components/ErrorBoundary";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((m) => ({
        default: m.ReactQueryDevtools,
      }))
    )
  : null;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Intercepta OAuth return na raiz ANTES de qualquer render do React
if (
  typeof window !== "undefined" &&
  window.location.pathname === "/" &&
  new URLSearchParams(window.location.search).has("code")
) {
  window.location.replace(`/auth/callback${window.location.search}`);
}

import LoginPage from "@/react-app/pages/Login";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import ProtectedDashboard from "@/react-app/components/ProtectedDashboard";

const HomePage = lazy(() => import("@/react-app/pages/Home"));
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
const PerfilPage = lazy(() => import("@/react-app/pages/dashboard/Perfil"));
const ComitePanelPage = lazy(() => import("@/react-app/pages/dashboard/comite/ComitePanel"));
const ComiteAgentPage = lazy(() => import("@/react-app/pages/dashboard/comite/ComiteAgent"));
const ComiteLibraryPage = lazy(() => import("@/react-app/pages/dashboard/comite/ComiteLibrary"));
const HepOverviewPage = lazy(() => import("@/react-app/pages/dashboard/HepOverview"));

const HepPatientPortalPage = lazy(
  () => import("@/react-app/pages/HepPatientPortal")
);
import PatientGuardPage from "@/react-app/pages/patient/PatientGuard";
import PatientLayoutPage from "@/react-app/pages/patient/PatientLayout";
const PatientDashboardPage = lazy(
  () => import("@/react-app/pages/patient/PatientDashboard")
);
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
const NotFoundPage = lazy(() => import("./pages/NotFound"));

const OWNER_EMAIL = "pabloandradeoficial@gmail.com";

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background transition-colors">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-primary/10 via-emerald-500/10 to-transparent blur-xl" />
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

// Removed AuthGate in favor of per-route AuthGuard

// Redirects authenticated users to /dashboard; shows landing page otherwise.
function RootRedirect() {
  const { user, isPending } = useAppAuth();
  if (isPending) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <HomePage />;
}

function OwnerOnlyRoute({ children }: { children: ReactNode }) {
  const { user, isPending } = useAppAuth();

  if (isPending) {
    return <PageLoader />;
  }

  const normalizedEmail = (user?.email || "").trim().toLowerCase();

  if (normalizedEmail !== OWNER_EMAIL) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppAuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <SubscriptionProvider>
            <ToastProvider>
              <Router>
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Toaster position="top-right" theme="dark" richColors />
                    <Routes>
                      <Route path="/" element={<RootRedirect />} />
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

                      <Route path="/login" element={<LoginPage />} />
                      <Route
                        path="/auth/callback"
                        element={<AuthCallbackPage />}
                      />

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
                        <Route path="exercicios" element={<ExerciciosPage />} />
                        <Route
                          path="admin"
                          element={
                            <OwnerOnlyRoute>
                              <AdminPage />
                            </OwnerOnlyRoute>
                          }
                        />
                        <Route
                          path="admin-estudante"
                          element={
                            <OwnerOnlyRoute>
                              <AdminEstudantePage />
                            </OwnerOnlyRoute>
                          }
                        />
                        <Route path="agenda" element={<AgendaPage />} />
                        <Route path="forum" element={<ForumPage />} />
                        <Route
                          path="financeiro"
                          element={<FinanceiroPage />}
                        />
                        <Route path="indicacao" element={<IndicacaoPage />} />
                        <Route path="perfil" element={<PerfilPage />} />
                        <Route path="hep" element={<HepOverviewPage />} />
                        <Route path="comite" element={<ComitePanelPage />} />
                        <Route path="comite/agente/:agentId" element={<ComiteAgentPage />} />
                        <Route path="biblioteca" element={<ComiteLibraryPage />} />
                      </Route>

                      {/* Public HEP patient portal — no auth required */}
                      <Route
                        path="/hep/:token"
                        element={<HepPatientPortalPage />}
                      />

                      {/* Authenticated patient portal */}
                      <Route
                        path="/patient"
                        element={
                          <PatientGuardPage>
                            <PatientLayoutPage>
                              <PatientDashboardPage />
                            </PatientLayoutPage>
                          </PatientGuardPage>
                        }
                      />

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

                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </ErrorBoundary>
                </Suspense>
              </Router>
            </ToastProvider>
          </SubscriptionProvider>
        </ThemeProvider>
      </LanguageProvider>
      </AppAuthProvider>
      {ReactQueryDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}