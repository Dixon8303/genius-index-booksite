import path from "node:path";
import { defineConfig } from "vitest/config";

// The engine under test is DOM-free by construction, so plain node suffices.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
    },
  },
  test: {
    environment: "node",
    include: ["client/src/**/*.test.ts"],
  },
});
