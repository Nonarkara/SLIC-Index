import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  // GitHub Pages deploys under /SLIC-Index/; Vercel and local dev serve from root.
  base: process.env.GITHUB_ACTIONS ? "/SLIC-Index/" : "/",
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
