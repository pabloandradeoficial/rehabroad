import { type Page } from "@playwright/test";

const TEST_SECRET = process.env.TEST_SECRET ?? "rehabroad-e2e-secret-local";

/**
 * Injects the E2E bypass cookie into the browser context.
 * The worker's authMiddleware recognises this cookie when TEST_SECRET is set
 * (only in development — never in production).
 */
export async function loginAsTestUser(page: Page) {
  await page.context().addCookies([
    {
      name: "rehabroad-test-bypass",
      value: TEST_SECRET,
      domain: "localhost",
      path: "/",
    },
  ]);
}
