#!/usr/bin/env node
/**
 * Mutation test for the spider drag gate.
 *
 * A gate that has never been seen to fail is a decoration. Each case below
 * puts a known defect back into the component and asserts that the gate
 * catches it. The defect lives in TypeScript, so the source is patched and
 * the site rebuilt; the gate then drives the rebuilt page in a real browser,
 * so it measures the same thing it measures in production.
 *
 *   node scripts/mutation-spider-gate.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = resolve(import.meta.dirname, "..");
const sourceFile = join(ROOT, "src", "ZeroSumAllocator.tsx");
const original = readFileSync(sourceFile, "utf8");

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
    name: "the old radial drag: the handle slides along its axis and never reaches the finger",
    find: `  const pulledPoint =
    draggingIndex === null || dragAngle === null
      ? null`,
    replace: `  const pulledPoint =
    true
      ? null`,
    expect: /from the pointer during a sideways pull/,
  },
  {
    name: "the old grab: the topmost circle wins, so a neighbouring handle steals the pull",
    find: `      if (nearest === -1 || nearestDistance > GRAB_RADIUS) {
        return;
      }`,
    replace: `      if (nearest === -1 || nearestDistance > GRAB_RADIUS) {
        return;
      }
      const stolen = target.getAttribute("data-index");
      if (stolen !== null) {
        nearest = Number.parseInt(stolen, 10);
      }`,
    expect: /from the pointer during a sideways pull/,
  },
  {
    name: "no spring back: the handle is left wherever the pull ended, off its own axis",
    find: `    const startedAt = performance.now();`,
    replace: `    return;
    const startedAt = performance.now();`,
    expect: /off its pillar.s axis/,
  },
  {
    name: "the spring back costs the number: the value is rewritten on release",
    find: `    const delta = ((target - current + 540) % 360) - 180;`,
    replace: `    const delta = ((target - current + 540) % 360) - 180;
    handleSliderChange(index, Math.max(0, pillars[index].value - 3));`,
    expect: /changed radius on release/,
  },
];

const results = [];

/*
 * A mutation script that is killed half-way through must not leave the
 * source mutated: the next build would carry the defect into the tree. The
 * source is restored on every exit path — normal, thrown, or signalled.
 */
let restored = false;
function restoreSource() {
  if (restored) return;
  restored = true;
  writeFileSync(sourceFile, original);
}
for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(signal, () => {
    restoreSource();
    process.exit(130);
  });
}
process.on("exit", restoreSource);

try {
for (const c of cases) {
  if (!original.includes(c.find)) {
    console.error(`MISSED  ${c.name} — the anchor text is not in the source any more`);
    results.push({ name: c.name, caught: false });
    continue;
  }

  writeFileSync(sourceFile, original.replace(c.find, c.replace));
  build();
  const r = run("check-spider-drag.mjs");
  restoreSource();
  restored = false;
  build();

  /*
   * A gate that crashes is not a gate that caught the defect. The failure
   * has to name the measurement the mutation broke — otherwise the case is
   * a MISS, because what was proven is that the harness is flaky, not
   * that the gate holds.
   */
  const first = (
    r.out.split("\n").find((l) => l.trim().startsWith("FAIL ")) ||
    r.out.split("\n").find((l) => /FAILURE|FAILED/.test(l)) ||
    ""
  ).trim();
  const caught = r.code !== 0 && c.expect.test(r.out);

  results.push({ name: c.name, caught, first });
  console.log(`${caught ? "CAUGHT " : "MISSED "} ${c.name}`);
  if (caught && first) console.log(`        ${first.slice(0, 160)}`);
  if (!caught && r.code !== 0) {
    console.log(`        the gate failed, but not on this defect: ${(first || r.out).slice(0, 140)}`);
  }
}
} finally {
  restoreSource();
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
