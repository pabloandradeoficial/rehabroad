import type { Hono } from "hono";
import { authMiddleware } from "../../lib/helpers";

// ============================================
// CLINICAL INSIGHTS API (Anonymized aggregate data)
// ============================================

export function registerClinicalInsightsRoutes(router: Hono<{ Bindings: Env }>) {
  router.get("/clinical-insights", authMiddleware, async (c) => {
    const painLocation = c.req.query("pain_location") || "";
    const chiefComplaint = c.req.query("chief_complaint") || "";

    if (!painLocation && !chiefComplaint) {
      return c.json({ similarCases: 0, topDiagnoses: [], topTests: [] });
    }

    const locationKeywords = painLocation.toLowerCase().split(/[\s,]+/).filter(Boolean);
    const complaintKeywords = chiefComplaint.toLowerCase().split(/[\s,]+/).filter(Boolean);

    const likeConditions: string[] = [];
    const likeValues: string[] = [];

    for (const keyword of [...locationKeywords, ...complaintKeywords]) {
      if (keyword.length >= 3) {
        likeConditions.push("(LOWER(pain_location) LIKE ? OR LOWER(chief_complaint) LIKE ?)");
        likeValues.push(`%${keyword}%`, `%${keyword}%`);
      }
    }

    if (likeConditions.length === 0) {
      return c.json({ similarCases: 0, topDiagnoses: [], topTests: [] });
    }

    const countQuery = `SELECT COUNT(*) as count FROM evaluations WHERE ${likeConditions.join(" OR ")}`;
    const countResult = await c.env.DB.prepare(countQuery).bind(...likeValues).first<{ count: number }>();
    const similarCases = countResult?.count || 0;

    const diagnosisQuery = `
      SELECT chief_complaint, COUNT(*) as count
      FROM evaluations
      WHERE chief_complaint IS NOT NULL AND chief_complaint != '' AND (${likeConditions.join(" OR ")})
      GROUP BY chief_complaint
      ORDER BY count DESC
      LIMIT 5
    `;
    const diagnosisResults = await c.env.DB.prepare(diagnosisQuery).bind(...likeValues).all<{ chief_complaint: string; count: number }>();

    type DiagnosisRow = { chief_complaint: string; count: number };
    const totalDiagnoses = diagnosisResults.results?.reduce((sum: number, d: DiagnosisRow) => sum + d.count, 0) || 1;
    const topDiagnoses = (diagnosisResults.results || []).slice(0, 3).map((d: DiagnosisRow) => ({
      name: d.chief_complaint,
      count: d.count,
      percentage: Math.round((d.count / totalDiagnoses) * 100)
    }));

    const testsQuery = `
      SELECT orthopedic_tests FROM evaluations
      WHERE orthopedic_tests IS NOT NULL AND orthopedic_tests != '' AND (${likeConditions.join(" OR ")})
    `;
    const testsResults = await c.env.DB.prepare(testsQuery).bind(...likeValues).all<{ orthopedic_tests: string }>();

    const testCounts: Record<string, number> = {};
    for (const row of testsResults.results || []) {
      try {
        const tests = JSON.parse(row.orthopedic_tests);
        if (Array.isArray(tests)) {
          for (const test of tests) {
            if (typeof test === 'string' && test.trim()) {
              testCounts[test.trim()] = (testCounts[test.trim()] || 0) + 1;
            }
          }
        }
      } catch {
        const tests = row.orthopedic_tests.split(',').map((t: string) => t.trim()).filter(Boolean);
        for (const test of tests) {
          testCounts[test] = (testCounts[test] || 0) + 1;
        }
      }
    }

    const topTests = Object.entries(testCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));

    return c.json({ similarCases, topDiagnoses, topTests });
  });
}
