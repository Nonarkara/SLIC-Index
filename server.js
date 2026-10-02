import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function createApp(root = join(__dirname, "dist")) {
  const app = express();
  app.disable("x-powered-by");
  const headers = readFileSync(join(root, "_headers"), "utf8")
    .split("\n")
    .filter((line) => line.startsWith("  "))
    .filter((line) => !line.trim().startsWith("Cache-Control:"))
    .map((line) => {
      const separator = line.indexOf(":");
      return [
        line.slice(0, separator).trim(),
        line.slice(separator + 1).trim(),
      ];
    });
  app.use((_req, res, next) => {
    for (const [name, value] of headers) res.setHeader(name, value);
    next();
  });

  // Serve static files from the Vite build output
  app.use(express.static(root, { dotfiles: "deny", index: false }));

  // SPA fallback — serve index.html for all non-file routes
  app.get("/{*splat}", (req, res) => {
    if (
      req.path.split("/").some((part) => part.startsWith(".")) ||
      req.path.startsWith("/assets/") ||
      /\.[^/]+$/.test(req.path) ||
      !req.accepts("html")
    ) {
      res.status(404).type("text").send("Not found");
      return;
    }
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(join(root, "index.html"));
  });
  return app;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const PORT = process.env.PORT || 10000;
  createApp().listen(PORT, () => {
    console.log(`SLIC Index server running on port ${PORT}`);
  });
}
