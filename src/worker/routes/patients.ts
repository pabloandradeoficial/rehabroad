import { Hono } from "hono";
import { registerSuporteRoutes } from "./patients/suporte";
import { registerClinicalSummaryRoutes } from "./patients/clinical-summary";
import { registerEvaluationsRoutes } from "./patients/evaluations";
import { registerClinicalInsightsRoutes } from "./patients/clinical-insights";
import { registerEvolutionsRoutes } from "./patients/evolutions";
import { registerCaminhoRoutes } from "./patients/caminho";
import { registerAlertasRoutes } from "./patients/alertas";
import { registerPatientsCrudRoutes } from "./patients/crud";

export { patientSchema } from "./patients/schema";

export const patientsRouter = new Hono<{ Bindings: Env }>();

registerPatientsCrudRoutes(patientsRouter);
registerEvaluationsRoutes(patientsRouter);
registerClinicalInsightsRoutes(patientsRouter);
registerEvolutionsRoutes(patientsRouter);
registerCaminhoRoutes(patientsRouter);
registerAlertasRoutes(patientsRouter);
registerSuporteRoutes(patientsRouter);
registerClinicalSummaryRoutes(patientsRouter);
