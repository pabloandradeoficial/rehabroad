import { test, expect } from "@playwright/test";
import { loginAsTestUser } from "./helpers/auth";

test.beforeEach(async ({ page }) => {
  await loginAsTestUser(page);
});

// ─────────────────────────────────────────────
// Financeiro
// ─────────────────────────────────────────────
test.describe("Financeiro", () => {
  test("criar transação de receita", async ({ page }) => {
    await page.goto("/dashboard/financeiro");
    await expect(page.getByRole("heading", { name: /financeiro/i })).toBeVisible();

    // Open dialog
    await page.getByRole("button", { name: /nova transação/i }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // Fill Valor
    await page.getByPlaceholder("0,00").fill("1500");

    // Fill Descrição (placeholder differs by type; default is "income")
    await page.getByPlaceholder(/sessão de fisioterapia|aluguel/i).fill("Sessão E2E test");

    // Submit
    await page.getByRole("button", { name: /registrar/i }).click();

    // Expect the new entry to appear in the list
    await expect(page.getByText("Sessão E2E test")).toBeVisible({ timeout: 8000 });
  });
});

// ─────────────────────────────────────────────
// Fórum
// ─────────────────────────────────────────────
test.describe("Fórum", () => {
  test("criar post e editar via card", async ({ page }) => {
    await page.goto("/dashboard/forum");

    const titulo = `Post E2E ${Date.now()}`;

    // Open new post dialog
    await page.getByRole("button", { name: /nova discussão/i }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // Fill title
    await page.getByPlaceholder(/dúvida sobre protocolo/i).fill(titulo);

    // Fill content
    await page.getByPlaceholder(/descreva sua dúvida/i).fill("Conteúdo do post de teste E2E para validação.");

    // Publish
    await page.getByRole("button", { name: /publicar/i }).click();

    // Post should appear in list
    await expect(page.getByText(titulo)).toBeVisible({ timeout: 8000 });

    // Hover the post card and click edit button (title="Editar post")
    const postCard = page.locator(".group").filter({ hasText: titulo }).first();
    await postCard.hover();
    await postCard.getByTitle("Editar post").click();

    // Edit dialog opens with pre-filled title
    await expect(page.getByRole("dialog")).toBeVisible();
    const titleInput = page.getByPlaceholder(/dúvida sobre protocolo/i);
    await titleInput.clear();
    await titleInput.fill(titulo + " editado");

    await page.getByRole("button", { name: /salvar alterações/i }).click();

    await expect(page.getByText(titulo + " editado")).toBeVisible({ timeout: 8000 });
  });

  test("deletar post via detalhe", async ({ page }) => {
    await page.goto("/dashboard/forum");

    const titulo = `Post Delete E2E ${Date.now()}`;

    // Create the post
    await page.getByRole("button", { name: /nova discussão/i }).first().click();
    await page.getByPlaceholder(/dúvida sobre protocolo/i).fill(titulo);
    await page.getByPlaceholder(/descreva sua dúvida/i).fill("Post para deletar em E2E.");
    await page.getByRole("button", { name: /publicar/i }).click();
    await expect(page.getByText(titulo)).toBeVisible({ timeout: 8000 });

    // Open post detail
    await page.getByText(titulo).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // Accept the confirm() dialog and click delete
    page.on("dialog", (dialog) => dialog.accept());
    await page.getByTitle("Excluir post").click();

    // Dialog should close and post should be gone from the list
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 8000 });
    await expect(page.locator(".group h3").filter({ hasText: titulo })).not.toBeVisible({ timeout: 5000 });
  });
});

// ─────────────────────────────────────────────
// Agenda
// ─────────────────────────────────────────────
test.describe("Agenda", () => {
  test("página carrega sem erro", async ({ page }) => {
    await page.goto("/dashboard/agenda");
    await expect(page.getByRole("heading", { name: /agenda/i })).toBeVisible();
    await expect(page.locator("text=500")).not.toBeVisible();
    await expect(page.locator("text=Error")).not.toBeVisible();
  });
});

// ─────────────────────────────────────────────
// Prontuário (dashboard)
// ─────────────────────────────────────────────
test.describe("Prontuário", () => {
  test("dashboard principal carrega sem erro", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator("text=500")).not.toBeVisible();
    await expect(page.locator("text=Error")).not.toBeVisible();
  });
});

// ─────────────────────────────────────────────
// NeuroFlux
// ─────────────────────────────────────────────
test.describe("NeuroFlux", () => {
  test("página carrega e exibe o formulário", async ({ page }) => {
    await page.goto("/dashboard/neuroflux");
    await expect(page.locator("text=500")).not.toBeVisible();
    await expect(page.locator("text=Error")).not.toBeVisible();
    await expect(page.getByRole("heading", { name: "NeuroFlux" })).toBeVisible();
  });
});
