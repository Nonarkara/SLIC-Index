#!/usr/bin/env node
/**
 * Mutation test for the two layout gates.
 *
 * A gate that has never been seen to fail is a decoration. Each case below
 * puts a known defect back into the BUILT stylesheet and asserts that the
 * gate catches it. The built file is patched directly so the case costs a
 * second instead of a rebuild; the gate serves dist/ to a real browser, so
 * it measures the same thing it measures in production.
 *
 *   node scripts/mutation-layout-gates.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = resolve(import.meta.dirname, "..");
const cssDir = join(ROOT, "dist", "assets");
const cssFile = join(cssDir, readdirSync(cssDir).find((f) => f.endsWith(".css")));
const original = readFileSync(cssFile, "utf8");

function run(gate) {
  try {
    const out = execFileSync("node", [join(ROOT, "scripts", gate)], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status ?? 1, out: `${e.stdout || ""}${e.stderr || ""}` };
  }
}

const cases = [
  {
    name: "footer nav: the old two-column grid, one link per 44px row",
    gate: "check-footer-nav.mjs",
    css: `
.site-footer-nav{display:grid!important;grid-template-columns:1fr 1fr!important;gap:1.25rem 2rem!important}
.site-footer-nav-group{display:flex!important;flex-direction:column!important;gap:.15rem!important}
.site-footer-nav-group a:not(.site-footer-nav-label){display:inline-flex!important;min-height:2.75rem!important;padding:.2rem 0!important;line-height:normal!important}
.site-footer-nav>a:first-child{display:inline-flex!important;min-height:2.75rem!important;padding:.35rem 0!important}
`,
  },
  {
    name: "footer nav: the old three-column multi-column, which left 98px under the first column",
    gate: "check-footer-nav.mjs",
    css: `
.site-footer-nav{display:block!important;columns:3!important;column-gap:2rem!important;grid-template-columns:none!important}
.site-footer-nav-group{display:block!important;margin-bottom:.9rem!important;break-inside:avoid!important}
.site-footer-nav-group a:not(.site-footer-nav-label){display:inline-flex!important;min-height:2.75rem!important;padding:.2rem 0!important;line-height:normal!important}
.site-footer-nav>a:first-child{display:flex!important;margin-bottom:.9rem!important;break-inside:avoid!important}
`,
  },
  {
    name: "footer nav: the desktop row of six columns, which left 167px under Home",
    gate: "check-footer-nav.mjs",
    css: `
.site-footer-nav{display:flex!important;flex-wrap:wrap!important;align-items:start!important;gap:1.25rem 2rem!important;grid-template-columns:none!important}
.site-footer-nav-group{display:flex!important;flex-direction:column!important;gap:.15rem!important;min-width:7.5rem!important}
.site-footer-nav-group a:not(.site-footer-nav-label){display:inline-flex!important;min-height:2.75rem!important;padding:.2rem 0!important;line-height:normal!important}
.site-footer-nav>a:first-child{display:inline-flex!important;min-height:2.75rem!important;padding:.35rem 0!important}
`,
  },
  {
    name: "masthead: the old translucent plate over the hero",
    gate: "check-masthead.mjs",
    css: `.mh{background:rgba(28,25,20,.68)!important}`,
  },
  {
    name: "masthead: the old search plate inside the bar",
    gate: "check-masthead.mjs",
    css: `.mh-search-btn{background:rgba(0,0,0,.32)!important}`,
  },
  {
    name: "masthead: the old boxed keycap",
    gate: "check-masthead.mjs",
    css: `.mh-search-kbd{background:rgba(248,245,240,.12)!important;border:1px solid rgba(248,245,240,.2)!important}`,
  },
  {
    name: "masthead: the native select's own card",
    gate: "check-masthead.mjs",
    css: `.locale-select{background:#fff!important;border:1px solid rgba(40,32,20,.18)!important}`,
  },
  {
    name: "masthead: the old burger border",
    gate: "check-masthead.mjs",
    css: `.mh-burger{border:1px solid rgba(248,245,240,.35)!important}`,
  },
  {
    name: "masthead: the bar inset inside the viewport",
    gate: "check-masthead.mjs",
    css: `.mh{background:transparent!important}.mh-inner{background:rgba(28,25,20,.68)!important;border:1px solid rgba(248,245,240,.12)!important;width:min(1200px,calc(100% - 48px))!important}`,
  },
];

const results = [];
for (const c of cases) {
  writeFileSync(cssFile, `${original}\n/* mutation */${c.css}\n`);
  const r = run(c.gate);
  writeFileSync(cssFile, original);
  const caught = r.code !== 0;
  const first = (r.out.split("\n").find((l) => l.trim().startsWith("  ")) || r.out.split("\n").find((l) => /FAILURE|FAILED/.test(l)) || "").trim();
  results.push({ name: c.name, gate: c.gate, caught, first });
  console.log(`${caught ? "CAUGHT " : "MISSED "} ${c.name}`);
  if (caught && first) console.log(`        ${first.slice(0, 150)}`);
}

writeFileSync(cssFile, original);
const missed = results.filter((r) => !r.caught);
console.log(`\n${results.length - missed.length}/${results.length} mutations caught`);
if (missed.length) {
  console.log("MISSED:");
  for (const m of missed) console.log(`  ${m.name}`);
  process.exit(1);
}
console.log("every mutation was caught by the gate that owns it.");
