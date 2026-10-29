#!/usr/bin/env node
/**
 * Mutation test for the figures gate and the clearance gate.
 *
 * Both gates read the built page in a real browser, so the defects have to
 * be put back into the built stylesheet and the components and the site
 * rebuilt — the same way the masthead and footer mutations work, only with a
 * rebuild in the middle because these gates read markup as well as style.
 *
 *   node scripts/mutation-figures-gates.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = resolve(import.meta.dirname, "..");
const cssFile = join(ROOT, "src", "styles.css");
const plateFile = join(ROOT, "src", "MetricPlate.tsx");
const scorecardFile = join(ROOT, "src", "ScoreTraceEquation.tsx");

const originals = {
  [cssFile]: readFileSync(cssFile, "utf8"),
  [plateFile]: readFileSync(plateFile, "utf8"),
  [scorecardFile]: readFileSync(scorecardFile, "utf8"),
};

function run(gate) {
  try {
    const out = execFileSync("node", [join(ROOT, "scripts", gate)], {
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
    name: "the console becomes a stack of rows again",
    expect: /opening console is display:|console is not one row|cells do not share a line/,
    gate: "check-figures.mjs",
    file: cssFile,
    find: `.hp-opening-console {
  display: grid;
  grid-template-columns: repeat(6, auto);`,
    replace: `.hp-opening-console {
  display: flex;
  flex-direction: column;
  grid-template-columns: repeat(6, auto);`,
  },
  {
    name: "the console cells paint a box of their own",
    expect: /console cell paints its own/,
    gate: "check-figures.mjs",
    file: cssFile,
    find: `.hp-console-cell {
  display: inline-flex;`,
    replace: `.hp-console-cell {
  display: inline-flex;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);`,
  },
  {
    name: "the band lies: the marker is drawn in the middle instead of where the formula puts it",
    expect: /draws its marker at/,
    gate: "check-figures.mjs",
    file: plateFile,
    find: "style={{ left: `${(fraction * 100).toFixed(2)}%`, background: color }}",
    replace: 'style={{ left: "50%", background: color }}',
  },
  {
    name: "the plate prints a score that is not the published score",
    expect: /prints the score .*published score/,
    gate: "check-figures.mjs",
    file: plateFile,
    find: '{score === null ? "—" : score.toFixed(1)}',
    replace: '{score === null ? "—" : (score + 5).toFixed(1)}',
  },
  {
    name: "the trace stops adding up: the weights are printed wrong",
    expect: /rendered pillar or weight differs|trace's terms add up/,
    gate: "check-figures.mjs",
    file: scorecardFile,
    find: "{(p.weight / 100).toFixed(2)}",
    replace: "{(p.weight / 120).toFixed(2)}",
  },
  {
    name: "the plate name breaks inside a word again",
    expect: /breaks inside a word/,
    gate: "check-figures.mjs",
    file: cssFile,
    find: `  min-width: min-content;
  overflow-wrap: break-word;`,
    replace: `  min-width: 0;
  overflow-wrap: anywhere;`,
  },
  {
    name: "the city page crowds the band again: 5.5rem under a 72px band",
    expect: /\/city\/th-bangkok @\d+: the first line sits/,
    gate: "check-clearance.mjs",
    file: cssFile,
    find: "  padding: 7rem 0 2rem;",
    replace: "  padding: 5.5rem 0 2rem;",
  },
  {
    name: "the map page crowds the band again: 6rem under a 72px band",
    expect: /\/map @\d+: the first line sits/,
    gate: "check-clearance.mjs",
    file: cssFile,
    find: `.map-page {
  /* The band is a fixed 72px; at 6rem the first line sat 24px under it. */
  padding-top: 7rem;
}`,
    replace: `.map-page {
  padding-top: 6rem;
}`,
  },
];

const results = [];

/*
 * A mutation script that is killed half-way through must not leave the
 * source mutated: the next build would carry the defect into the tree. The
 * source is restored on every exit path — normal, thrown, or signalled.
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
    results.push({ name: c.name, caught: false });
    continue;
  }

  writeFileSync(c.file, original.replace(c.find, c.replace));
  build();
  const r = run(c.gate);
  restore();
  restored = false;
  build();

  const caught = r.code !== 0 && c.expect.test(r.out) && !/the gate could not run:|could not measure/.test(r.out);
  const first = (
    r.out.split("\n").find((l) => l.trim().startsWith("FAIL ")) ||
    r.out.split("\n").find((l) => /FAILURE|FAILED/.test(l)) ||
    ""
  ).trim();

  results.push({ name: c.name, caught, first });
  console.log(`${caught ? "CAUGHT " : "MISSED "} ${c.name}`);
  if (caught && first) console.log(`        ${first.slice(0, 160)}`);
}
} finally {
  restore();
  build();
}

const missed = results.filter((r) => !r.caught);
console.log(`\n${results.length - missed.length}/${results.length} mutations caught`);
if (missed.length) {
  console.log("MISSED:");
  for (const m of missed) console.log(`  ${m.name}`);
  process.exit(1);
}
console.log("every mutation was caught by the gate that owns it.");
