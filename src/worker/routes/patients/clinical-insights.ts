import type { Hono } from "hono";
import { authMiddleware } from "../../lib/helpers";

// ============================================
// CLINICAL INSIGHTS API
//
// Returns aggregated patterns ONLY across the requesting fisio's own
// patients. Earlier versions queried the entire `evaluations` table
// without a user_id filter, which leaked chief_complaint (free-text,
// often containing PII) and ortho-test choices across tenants —
// violating LGPD and COFFITO confidentiality.
//
// Output shape changed: `topDiagnoses` (raw chief_complaint groupings)
// is replaced by `topLocations` — chief_complaint is a free-text
// COMPLAINT, not a diagnosis, so exposing it as a diagnostic ranking
// was conceptually wrong on top of the privacy issue.
// ============================================

const MIN_SIMILAR_CASES = 3; // Don't surface noise; ratios with N<3 are meaningless.

export function registerClinicalInsightsRoutes(router: Hono<{ Bindings: Env }>) {
  router.get("/clinical-insights", authMiddleware, async (c) => {
    const user = c.get("user");
    const painLocation = c.req.query("pain_location") || "";
    const chiefComplaint = c.req.query("chief_complaint") || "";

    const empty = { similarCases: 0, topLocations: [], topTests: [], scope: "own_patients" as const };

    if (!painLocation && !chiefComplaint) {
      return c.json(empty);
    }

    const locationKeywords = painLocation.toLowerCase().split(/[\s,]+/).filter(Boolean);
    const complaintKeywords = chiefComplaint.toLowerCase().split(/[\s,]+/).filter(Boolean);

    const likeConditions: string[] = [];
    const likeValues: (string | number)[] = [];

    for (const keyword of [...locationKeywords, ...complaintKeywords]) {
      if (keyword.length >= 3) {
        likeConditions.push("(LOWER(e.pain_location) LIKE ? OR LOWER(e.chief_complaint) LIKE ?)");
        likeValues.push(`%${keyword}%`, `%${keyword}%`);
      }
    }

    if (likeConditions.length === 0) {
      return c.json(empty);
    }

    // CRITICAL: every query joins through `patients` and filters on user_id.
    // The keyword conditions are wrapped in parentheses so AND binding stays correct.
    const baseWhere = `e.patient_id IN (SELECT id FROM patients WHERE user_id = ?) AND (${likeConditions.join(" OR ")})`;
    const baseBindings = [user!.id, ...likeValues];

    const countResult = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM evaluations e WHERE ${baseWhere}`
    ).bind(...baseBindings).first<{ count: number }>();
    const similarCases = countResult?.count || 0;

    // Below threshold → return only the count, no breakdowns (avoid noise +
    // statistical garbage like "100% of 1 case had X").
    if (similarCases < MIN_SIMILAR_CASES) {
      return c.json({ ...empty, similarCases });
    }

    // Aggregate by pain_location (more structured than chief_complaint).
    type LocationRow = { pain_location: string; count: number };
    const locationsResult = await c.env.DB.prepare(
      `SELECT e.pain_location, COUNT(*) as count
       FROM evaluations e
       WHERE ${baseWhere}
       AND e.pain_location IS NOT NULL AND e.pain_location != ''
       GROUP BY e.pain_location
       ORDER BY count DESC
       LIMIT 5`
    ).bind(...baseBindings).all<LocationRow>();

    const totalLocations = locationsResult.results?.reduce(
      (sum: number, r: LocationRow) => sum + r.count, 0
    ) || 1;
    const topLocations = (locationsResult.results || []).slice(0, 3).map((r: LocationRow) => ({
      name: r.pain_location,
      count: r.count,
      percentage: Math.round((r.count / totalLocations) * 100),
    }));

    // Ortho tests — these ARE structured (test names from a known library),
    // but we're still scoping to the fisio's own patients.
    const testsResults = await c.env.DB.prepare(
      `SELECT e.orthopedic_tests FROM evaluations e
       WHERE ${baseWhere}
       AND e.orthopedic_tests IS NOT NULL AND e.orthopedic_tests != ''`
    ).bind(...baseBindings).all<{ orthopedic_tests: string }>();

    const testCounts: Record<string, number> = {};
    for (const row of testsResults.results || []) {
      try {
        const tests = JSON.parse(row.orthopedic_tests);
        if (Array.isArray(tests)) {
          for (const test of tests) {
            if (typeof test === "string" && test.trim()) {
              testCounts[test.trim()] = (testCounts[test.trim()] || 0) + 1;
            }
          }
        }
      } catch {
        const tests = row.orthopedic_tests.split(",").map((t: string) => t.trim()).filter(Boolean);
        for (const test of tests) {
          testCounts[test] = (testCounts[test] || 0) + 1;
        }
      }
    }

    const topTests = Object.entries(testCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));

    return c.json({
      similarCases,
      topLocations,
      topTests,
      scope: "own_patients" as const,
    });
  });
}
