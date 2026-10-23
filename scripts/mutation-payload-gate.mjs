#!/usr/bin/env node
/**
 * Mutation test for the payload gate.
 *
 * A gate that has never been seen to fail is a decoration. Each case below
 * puts a known way of overcharging the reader back into the source and
 * asserts that the gate catches it — and that the failure names the
 * measurement it broke, because a gate that fails for the wrong reason is
 * not proof of anything.
 *
 * These mutations are in the source, not in the built stylesheet, so each one
 * costs a rebuild: the gate measures a real page in a real browser.
 *
 *   node scripts/mutation-payload-gate.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = resolve(import.meta.dirname, "..");
const GATE = "check-payload.mjs";

const thumbsFile = join(ROOT, "src/thumbs.ts");
const appFile = join(ROOT, "src/App.tsx");
const webFontsFile = join(ROOT, "src/webFonts.ts");
const rackFile = join(ROOT, "src/KnowledgeRackPanel.tsx");

const originals = {
  [thumbsFile]: readFileSync(thumbsFile, "utf8"),
  [appFile]: readFileSync(appFile, "utf8"),
  [webFontsFile]: readFileSync(webFontsFile, "utf8"),
  [rackFile]: readFileSync(rackFile, "utf8"),
};

function run() {
  try {
    const out = execFileSync("node", [join(ROOT, "scripts", GATE)], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status ?? 1, out: `${e.stdout || ""}${e.stderr || ""}` };
  }
}

function build() {
  execFileSync("npm", ["run", "build"], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

const cases = [
  {
    name: "the photograph is served at its full size again",
    file: thumbsFile,
    find: "  if (!entry) return src;",
    replace: "  if (entry) return src;",
    expect: /paints .* into \d+px from a \d+px file/,
    why: "the oversampling rule",
  },
  {
    name: "the search modal goes back into the shell, and the dataset with it",
    file: appFile,
    find: 'const QuickSearchModal = lazy(() => import("./QuickSearchModal"));',
    replace: 'import QuickSearchModal from "./QuickSearchModal";',
    expect: /the shell preloads .*published-data/,
    why: "the shell preload rule",
  },
  {
    name: "the reader downloads the Han fonts again",
    file: webFontsFile,
    find: 'const LATIN = [\n  "Jost:ital,wght@0,100..900;1,100..900",',
    replace: 'const LATIN = [\n  "Noto+Sans+SC:wght@400;500;600;700",\n  "Jost:ital,wght@0,100..900;1,100..900",',
    expect: /the default font request carries Noto\+Sans\+SC|the font stylesheet costs/,
    why: "the font script rule",
  },
  {
    name: "the methodology page fetches the whole corpus on arrival again",
    file: rackFile,
    find: "  useEffect(() => {\n    // Nothing is searched on arrival.",
    replace: "  useEffect(() => {\n    runSearch(question);\n    // Nothing is searched on arrival.",
    expect: /\/methodology costs \d+kB on the first load/,
    why: "the route budget rule",
  },
];

const results = [];

/*
 * A mutation script that is killed half-way through must not leave the
 * source mutated: the next build would carry the defect into the tree.
 */
let restored = false;
function restore() {
  if (restored) return;
  restored = true;
  for (const [file, content] of Object.entries(originals)) writeFileSync(file, content);
}
for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(signal, () => {
    restore();
    process.exit(130);
  });
}
process.on("exit", restore);

try {
  for (const c of cases) {
    const original = originals[c.file];
    if (!original.includes(c.find)) {
      console.error(`MISSED  ${c.name} — the anchor text is not in ${c.file} any more`);
      results.push({ name: c.name, caught: false, why: c.why });
      continue;
    }

    writeFileSync(c.file, original.replace(c.find, c.replace));
    build();
    const r = run();
    restore();
    restored = false;
    build();

    const caught = r.code !== 0;
    const names = c.expect.test(r.out);
    const first = (
      r.out.split("\n").find((l) => l.trim().startsWith("BLOCKER")) ||
      r.out.split("\n").find((l) => /PAYLOAD AUDIT FAILED/.test(l)) ||
      ""
    ).trim();

    results.push({ name: c.name, caught, names, why: c.why });
    console.log(`${caught && names ? "CAUGHT " : "MISSED "} ${c.name}`);
    if (caught && names) console.log(`        ${first.slice(0, 170)}`);
    else if (caught) console.log(`        it failed, but not on ${c.why} — the measurement it broke was not named`);
    else console.log(`        the gate passed a defect it should have refused`);
  }
} finally {
  restore();
  build();
}

const missed = results.filter((r) => !r.caught || !r.names);
console.log(`\n${results.length - missed.length}/${results.length} mutations caught`);
if (missed.length) {
  console.log("MISSED:");
  for (const m of missed) console.log(`  ${m.name}${m.caught ? " (failed on the wrong measurement)" : ""}`);
  process.exit(1);
}
console.log("every mutation was caught by the gate that owns it, on the measurement it owns.");
