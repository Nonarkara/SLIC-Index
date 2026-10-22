#!/usr/bin/env node
/**
 * Mutation test for the spatial gate.
 *
 * A gate that has never been seen to fail is a decoration. Each case below
 * puts a known defect back into the source and asserts that the gate
 * catches it. The defects live in the stylesheet and the markup, so the
 * source is patched and the site rebuilt; the gate then drives the
 * rebuilt page in a real browser, so it measures the same thing it
 * measures in production.
 *
 *   node scripts/mutation-spatial-gate.mjs
 *
 * Every case names the measurement it breaks. A gate that crashes is not
 * a gate that caught the defect, and a gate that fails for some other
 * reason is not a proof either — the failure has to name the finding.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = resolve(import.meta.dirname, "..");
const cssFile = join(ROOT, "src", "styles.css");
const tsxFile = join(ROOT, "src", "RankingsPage.tsx");
const originalCss = readFileSync(cssFile, "utf8");
const originalTsx = readFileSync(tsxFile, "utf8");

function run(args) {
  try {
    const out = execFileSync("node", [join(ROOT, "scripts", "audit-spatial.mjs"), ...args], {
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
    name: "the preset list back to three columns, so the fourth preset sits alone",
    file: cssFile,
    find: `@container (min-width: 279px) {
  .sbs-preset-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}`,
    replace: `@container (min-width: 279px) {
  .sbs-preset-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}`,
    args: ["--route", "/side-by-side", "--width", "560", "--check", "scripts/spatial-baseline.json"],
    expect: /stray:span\.sbs-preset-list/,
  },
  {
    name: "the coda removed, so the fourth critique sits alone in a three-column grid",
    file: cssFile,
    find: `.coda-grid-3 > :last-child:nth-child(3n + 1) {
  grid-column: 1 / -1;
}`,
    replace: `.coda-grid-3 > :last-child:nth-child(3n + 1) {
  grid-column: auto;
}`,
    args: ["--route", "/thailand", "--width", "1400", "--check", "scripts/spatial-baseline.json"],
    expect: /stray:div\.critique-grid/,
  },
  {
    name: "the reset button back in the preset row, where it was a seventh chip",
    file: tsxFile,
    find: `                ))}
              </div>
              {activePreset && (`,
    replace: `                ))}
                <button type="button" className="rankings-preset-btn rankings-preset-btn--reset" onClick={handleReset}>
                  {ui.resetLabel}
                </button>
              </div>
              {activePreset && (`,
    args: ["--route", "/rankings", "--width", "900", "--check", "scripts/spatial-baseline.json"],
    expect: /stray:div\.rankings-preset-row/,
  },
  {
    name: "the partner cards back to three columns, so the fourth card sits alone",
    file: cssFile,
    find: `  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.profile-program-card-wide,`,
    replace: `  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.profile-program-card-wide,`,
    args: ["--route", "/about-slic", "--width", "1400", "--check", "scripts/spatial-baseline.json"],
    expect: /stray:div\.profile-card-grid/,
  },
  {
    name: "the mode switch stops growing its buttons, so the last one strands with a hole beside it",
    file: cssFile,
    find: `.mode-switch > * {
  flex: 1 1 auto;
}`,
    replace: `.mode-switch > * {
  flex: 0 0 auto;
}`,
    /*
     * 900px is measured, not guessed: with the buttons at their natural
     * width the switch breaks 7+1 at 860px and wider, and the lone button
     * leaves 89% of the row empty.
     */
    args: ["--route", "/thailand", "--width", "900", "--check", "scripts/spatial-baseline.json"],
    expect: /wrap:div\.mode-switch/,
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
  writeFileSync(cssFile, originalCss);
  writeFileSync(tsxFile, originalTsx);
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
    const original = c.file === cssFile ? originalCss : originalTsx;
    if (!original.includes(c.find)) {
      console.error(`MISSED  ${c.name} — the anchor text is not in the source any more`);
      results.push({ name: c.name, caught: false });
      continue;
    }

    writeFileSync(c.file, original.replace(c.find, c.replace));
    build();
    const r = run(c.args);
    restoreSource();
    restored = false;
    build();

    /*
     * A gate that crashes is not a gate that caught the defect. The failure
     * has to name the measurement the mutation broke — otherwise the case is
     * a MISS, because what was proven is that the harness is flaky, not
     * that the gate holds.
     *
     * The line to show is the violation itself — the audit prints them
     * indented by three spaces under the failure header, and the header
     * alone says nothing about which measurement broke.
     */
    const first = (
      r.out.split("\n").find((l) => /^ {3}\S/.test(l)) ||
      r.out.split("\n").find((l) => /FAILURE|FAILED|✗/.test(l)) ||
      ""
    ).trim();
    const caught = r.code !== 0 && c.expect.test(r.out);

    results.push({ name: c.name, caught, first });
    console.log(`${caught ? "CAUGHT " : "MISSED "} ${c.name}`);
    if (caught && first) console.log(`        ${first.slice(0, 160)}`);
    if (!caught && r.code !== 0) {
      console.log(`        the gate failed, but not on this defect: ${(first || r.out).slice(0, 140)}`);
    }
    if (!caught && r.code === 0) {
      console.log(`        the gate passed a broken layout`);
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
