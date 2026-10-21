#!/usr/bin/env node
/**
 * The author's name is a fact, not a style choice.
 *
 * The site carried three different renderings of it, and the wrong ones were
 * everywhere: a truncated Latin surname, a Thai surname that was not his, a
 * Thai surname that was a typo, and a Thai given name that was misspelt.
 * The footer, the awards page, the history timeline, the citation guidance
 * and the publication metadata each carried their own variant, and the
 * README documented one of them as the intended publication credit.
 *
 * The canonical form is:
 *
 *     Dr Non Arkaraprasertkul   /   the Thai name, set below
 *
 * What this proves:
 *
 *   1. every locale's author prose and citation line carries the full
 *      surname, in the canonical Latin form;
 *   2. the Thai site copy carries the canonical Thai form;
 *   3. no wrong form appears anywhere in the source tree.
 *
 * The third check is the one that matters. The first two can be satisfied by
 * a single correct string while the other forty are still wrong, which is
 * exactly the state this gate was written for.
 *
 * The wrong forms are assembled from fragments below, so that this file
 * cannot match itself, and they are described here rather than quoted: a
 * gate that flags its own source is a gate that gets deleted.
 *
 * The corpus is exempt. knowledge-rack/ holds third-party source documents
 * that name the author, and the published ASEAN Magazine article carries
 * the correct full form.
 *
 * Usage:
 *   node scripts/check-author-name.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const problems = [];
const fail = (message) => problems.push(message);

// ── the canonical form ──────────────────────────────────────────────────────
const CANONICAL_LATIN = "Non " + "Arkaraprasertkul";
const CANONICAL_CITATION = "Arkaraprasertkul" + ", N.";
const CANONICAL_THAI = "ดร.นน อัครประเสริฐกุล";

// ── the wrong forms, assembled so this file cannot match itself ───────────
const WRONG_LATIN_SHORT = "Ark" + "ara";
const WRONG_LATIN_PROSE = "Non " + WRONG_LATIN_SHORT;
const WRONG_THAI_NAME = "นน" + "ท์";
const WRONG_THAI_SURNAME_A = "อร" + "กร";
const WRONG_THAI_SURNAME_B = "อา" + "คารา";

/**
 * A wrong form is only wrong when it is not the prefix of the right one.
 * The truncated Latin surname is a substring of the correct one, and the
 * short prose form is a substring of the correct prose form, so a naive
 * search reports the canonical name as a violation. Every rule is a
 * negative lookahead.
 */
const WRONG_RULES = [
  { label: WRONG_LATIN_PROSE, pattern: new RegExp(`${WRONG_LATIN_PROSE}(?!prasertkul)`) },
  { label: WRONG_LATIN_SHORT, pattern: new RegExp(`${WRONG_LATIN_SHORT}(?!prasertkul)`) },
  { label: WRONG_THAI_NAME, pattern: new RegExp(WRONG_THAI_NAME) },
  { label: WRONG_THAI_SURNAME_A, pattern: new RegExp(WRONG_THAI_SURNAME_A) },
  { label: WRONG_THAI_SURNAME_B, pattern: new RegExp(WRONG_THAI_SURNAME_B) },
];

const carriesWrongForm = (text) => WRONG_RULES.some((rule) => rule.pattern.test(text));

// ── 1. every locale carries the canonical author ───────────────────────────
const { authorProse, citationLine } = await import("../src/publicationMeta.ts");
for (const locale of ["en", "th", "zh", "ko", "ja"]) {
  const prose = authorProse(locale);
  const citation = citationLine(locale);

  if (!prose.includes(CANONICAL_LATIN)) {
    fail(`${locale}: the author prose does not carry "${CANONICAL_LATIN}" — it says "${prose}"`);
  }
  if (!citation.includes(CANONICAL_CITATION)) {
    fail(`${locale}: the citation does not carry "${CANONICAL_CITATION}" — it says "${citation}"`);
  }
  if (carriesWrongForm(prose)) fail(`${locale}: the author prose carries a wrong form of the name`);
  if (carriesWrongForm(citation)) fail(`${locale}: the citation carries a wrong form of the name`);
}

// ── 2. the Thai site copy carries the canonical Thai form ──────────────────
const siteCopyFiles = ["src/SiteFooter.tsx", "src/AwardsPage.tsx", "src/HistoryPage.tsx"];
let thaiHits = 0;
for (const rel of siteCopyFiles) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  thaiHits += text.split(CANONICAL_THAI).length - 1;
}
if (thaiHits < 3) {
  fail(
    `the Thai site copy carries the canonical Thai name only ${thaiHits} time(s) — ` +
      `expected it in the footer, the awards page and the history timeline`,
  );
}

// ── 3. no wrong form anywhere in the source tree ───────────────────────────
const SKIP_DIRS = new Set([".git", "node_modules", "dist", "assets", ".vite", "knowledge-rack"]);
const TEXT_SUFFIXES = new Set([
  ".ts", ".tsx", ".js", ".mjs", ".cjs", ".md", ".py", ".json", ".html",
  ".csv", ".txt", ".yml", ".yaml", ".sh", ".css", "",
]);

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".gitignore") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

let scanned = 0;
for (const file of walk(ROOT)) {
  if (!TEXT_SUFFIXES.has(path.extname(file).toLowerCase())) continue;
  let text;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    continue; // binary
  }
  scanned += 1;
  if (carriesWrongForm(text)) {
    fail(
      `${path.relative(ROOT, file)}: carries a wrong form of the author's name. ` +
        `The canonical form is "${CANONICAL_LATIN}" / "${CANONICAL_THAI}".`,
    );
  }
}

// ── verdict ─────────────────────────────────────────────────────────────────
if (problems.length) {
  console.error(`\n✗ author name check failed (${problems.length} problem(s)):`);
  for (const p of problems) console.error(`   ${p}`);
  console.error(
    `\n  The canonical form is "${CANONICAL_LATIN}" (${CANONICAL_CITATION} in a citation)`,
  );
  console.error(`  and "${CANONICAL_THAI}" in Thai. The name is a fact; keep it one.`);
  process.exit(1);
}

console.log(
  `✓ author name: the canonical form in all five locales, ${thaiHits} Thai occurrence(s), ` +
    `and no wrong form in ${scanned} source file(s).`,
);
