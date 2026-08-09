import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { copyFileSync } from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

// GitHub Pages has no rewrite rules, so deep links like /assessment 404 on
// refresh. Pages serves 404.html for unknown paths; making it a copy of the
// SPA shell lets wouter pick the route back up (asset URLs are already
// subpath-absolute thanks to `base`).
function spaFallback(): Plugin {
  return {
    name: "spa-404-fallback",
    apply: "build",
    closeBundle() {
      const out = path.resolve(import.meta.dirname, "dist/public");
      copyFileSync(path.join(out, "index.html"), path.join(out, "404.html"));
    },
  };
}

export default defineConfig({
  // Served from https://dixon8303.github.io/genius-index-booksite/ -- a
  // project repo, not the special <user>.github.io root repo -- so every
  // asset path needs this prefix or it 404s in production.
  base: "/genius-index-booksite/",
  plugins: [react(), tailwindcss(), spaFallback()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
  },
});
