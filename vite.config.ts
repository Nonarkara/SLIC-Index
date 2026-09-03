import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  // Custom domain slic.nonarkara.org serves from root — base is always "/".
  // The /SLIC-Index/ subdirectory URL still works because gh-pages sets the CNAME.
  base: "/",
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 4176,
    strictPort: true,
  },
  build: {
    // The published-ranking bundle is intentionally split as static data.
    // It currently gzips below 140 kB, so the default raw-size warning is noise.
    chunkSizeWarningLimit: 1900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Small shared modules that must NOT be swallowed into the big data chunks.
          // Without these, rollup hoisted publicTierPolicy.js (17 kB) into
          // methodology-data (264 kB) and rankingPublication.ts (2 kB) into
          // rankings-data (128 kB), so the homepage — which imports four symbols
          // from the first and one from the second — pulled ~120 kB gzip of
          // editorial data it never reads.
          if (id.includes("src/publicTierPolicy") || id.includes("src/publicationMath")) return "tier-policy";
          if (id.includes("src/rankingPublication")) return "published-data";
          // Large editorial/data modules that don't need to ship on first paint
          if (id.includes("src/rankingsData.ts")) return "rankings-data";
          if (id.includes("src/methodologyData.ts")) return "methodology-data";
          if (id.includes("src/compareRankingsData.ts")) return "compare-data";
          if (id.includes("publishedRankingData.json")) return "published-data";
          if (id.includes("src/siteCopy.ts")) return "site-copy";
          if (id.includes("src/ideasData.ts")) return "ideas-data";
          if (id.includes("src/thailandData") || id.includes("src/thailandDeckData")) return "thailand-data";
          if (id.includes("node_modules/react") || id.includes("node_modules/scheduler")) return "react-vendor";
          if (id.includes("node_modules/@supabase")) return "supabase";
        },
      },
    },
  },
});
