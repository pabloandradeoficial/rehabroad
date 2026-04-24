import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist", "e2e", ".wrangler"],
    coverage: {
      provider: "v8",
      include: ["src/worker/**/*.ts"],
      exclude: ["src/worker/**/*.d.ts", "src/worker/**/*.test.ts"],
      reporter: ["text", "html"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
