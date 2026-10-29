#!/usr/bin/env node
/**
 * Falsification for the register-coverage gate.
 *
 * A gate that has never been seen red is a comment. This mutates the real
 * sources — not a copy, not a mock — and proves that
 * check-register-coverage catches each class of drift it claims to cover.
 * Every mutation is reverted byte for byte afterwards, and the tree is
 * checked clean at the end.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GATE = path.join(REPO, "scripts/check-register-coverage.mjs");

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

const PUBLICATION = "src/data/publishedRankingData.json";
const COUNTRY_REGISTER = "data/verified_sources/country_context.csv";

/** Replace the first occurrence of `needle` in `haystack`. */
const swap = (haystack, needle, replacement) => {
  const index = haystack.indexOf(needle);
  if (index === -1) throw new Error(`anchor not found: ${needle.slice(0, 80)}`);
  return haystack.slice(0, index) + replacement + haystack.slice(index + needle.length);
};

const MUTATIONS = [
  {
    name: "a published value drifts away from the register row that backs it",
    file: PUBLICATION,
    mutate(text) {
      return swap(text, '"raw": 21.4', '"raw": 99.9');
    },
  },
  {
    name: "a register row is emptied, leaving its published input unbacked",
    file: COUNTRY_REGISTER,
    mutate(text) {
      const lines = text.split("\r\n");
      const index = lines.findIndex((line) => line.startsWith("Czechia,gini_coefficient,"));
      if (index === -1) throw new Error("no Czechia gini row to empty");
      const cells = lines[index].split(",");
      cells[5] = "";
      lines[index] = cells.join(",");
      return lines.join("\r\n");
    },
  },
  {
    name: "a published input is deleted from the register entirely",
    file: COUNTRY_REGISTER,
    mutate(text) {
      const lines = text.split("\r\n");
      const kept = lines.filter((line) => !line.startsWith("Japan,inclusion_freedom_house_country_raw,"));
      if (kept.length === lines.length) throw new Error("no Japan Freedom House row to delete");
      return kept.join("\r\n");
    },
  },
];

let failures = 0;
const originals = new Map();
for (const mutation of MUTATIONS) {
  originals.set(mutation.file, read(mutation.file));
}

try {
  for (const mutation of MUTATIONS) {
    const original = originals.get(mutation.file);
    write(mutation.file, mutation.mutate(original));
    const result = run();
    write(mutation.file, original);
    if (result.passed) {
      console.error(`FAIL mutation not caught: ${mutation.name}`);
      failures += 1;
    } else {
      const firstLine = result.output.split("\n").find((line) => line.trim().startsWith("FAIL")) ?? result.output.split("\n")[0];
      console.log(`PASS caught: ${mutation.name}`);
      console.log(`     ${firstLine.trim()}`);
    }
  }
} finally {
  for (const [file, content] of originals) write(file, content);
}

if (failures > 0) {
  console.error(`FAIL register-coverage gate: ${failures} mutation(s) slipped through`);
  process.exit(1);
}
console.log("PASS register-coverage gate: every mutation was caught and the sources are restored");
