#!/usr/bin/env node
/**
 * Falsification for the number gate.
 *
 * A gate that has never been seen red is a comment. This mutates the real
 * sources — not a copy, not a mock — and proves check:numbers catches each
 * class of drift it claims to cover. Every mutation is reverted byte for
 * byte afterwards, and the tree is checked clean at the end.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GATE = path.join(REPO, "scripts/check-numbers.mjs");

const run = () => {
  try {
    execFileSync(process.execPath, [GATE], { cwd: REPO, stdio: "pipe" });
    return { passed: true, output: "" };
  } catch (err) {
    return { passed: false, output: `${err.stdout ?? ""}${err.stderr ?? ""}` };
  }
};

const read = (rel) => fs.readFileSync(path.join(REPO, rel), "utf8");
const write = (rel, content) => fs.writeFileSync(path.join(REPO, rel), content, "utf8");

const MUTATIONS = [
  {
    name: "a locale page drifts off the bundle's metric weight",
    file: "src/methodologyData.ts",
    from: '{ name: "ภาระหนี้ครัวเรือน", weight: 2,',
    to: '{ name: "ภาระหนี้ครัวเรือน", weight: 4,',
  },
  {
    name: "a locale page lists a metric the bundle does not score",
    file: "src/methodologyDataKo.ts",
    from: '        { name: "디지털 인프라", weight: 4,',
    to: '        { name: "기후 및 일조 만족도", weight: 4,',
  },
  {
    name: "a published city score no longer matches its own pillar scores",
    file: "src/data/publishedRankingData.json",
    from: '"slicScore": 53.7',
    to: '"slicScore": 63.7',
  },
  {
    name: "the published board's city count is misstated",
    file: "src/data/methodologyFacts.json",
    from: '"cityCount": 163',
    to: '"cityCount": 165',
  },
  {
    name: "the copy states a metric count the bundle does not justify",
    file: "src/HomePage.tsx",
    from: '"Five declared pillars. Twenty-two scored metric lines plus three visible diagnostics,',
    to: '"Five declared pillars. Twenty scored metric lines plus three visible diagnostics,',
  },
];

const results = [];
let allCaught = true;

for (const mutation of MUTATIONS) {
  const original = read(mutation.file);
  if (!original.includes(mutation.from)) {
    results.push({ name: mutation.name, caught: false, note: "mutation anchor not found — the source has moved" });
    allCaught = false;
    continue;
  }
  write(mutation.file, original.replace(mutation.from, mutation.to));
  const outcome = run();
  write(mutation.file, original);
  const caught = !outcome.passed;
  if (!caught) allCaught = false;
  results.push({
    name: mutation.name,
    caught,
    note: caught ? outcome.output.split("\n").filter((l) => l.includes("["))[0]?.trim() : "gate still passed",
  });
}

// The tree must be exactly as we found it.
const dirty = execFileSync("git", ["status", "--porcelain", "src/data"], { cwd: REPO, encoding: "utf8" }).trim();
if (dirty) {
  console.error("✗ the mutation run left the data files dirty:\n" + dirty);
  process.exit(1);
}

console.log("");
for (const r of results) {
  console.log(`${r.caught ? "✓ caught" : "✗ MISSED"}  ${r.name}`);
  if (r.note) console.log(`            ${r.note}`);
}
console.log("");
if (!allCaught) {
  console.error("✗ check:numbers is not falsifiable — at least one mutation passed it");
  process.exit(1);
}
console.log(`check:numbers is falsifiable — ${results.length}/${results.length} mutations caught.`);
