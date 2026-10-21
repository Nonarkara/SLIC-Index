#!/usr/bin/env node
/**
 * The knowledge rack is the site's question box over the methodology. It
 * answers with citations, so the index it serves has to describe the
 * documents it was built from — exactly.
 *
 * The manifest records a sha256 for every source document. That field was
 * decorative until this gate: when a source was edited, the index kept
 * serving passages from the old bytes while its manifest kept claiming the
 * old hash. Four of fifteen documents were in that state, and the published
 * manifest — the file the site hands to the public — carried hashes that
 * matched nothing on disk.
 *
 * What this proves:
 *
 *   1. every document in the manifest exists, and its recorded sha256 is the
 *      sha256 of the bytes on disk;
 *   2. every file in the intake folder is indexed — a source dropped in and
 *      never extracted is a document the site cannot answer from;
 *   3. the built catalog and the published catalog are the same bytes;
 *   4. the manifest's word, character and chunk counts agree with the
 *      extracted text and the chunk stream;
 *   5. the chunk stream is not empty, belongs to no phantom document, and
 *      reconstructs the extracted text it claims to come from.
 *
 * When it fails, the repair is the pipeline itself:
 *
 *   python3 scripts/build_knowledge_rack.py
 *
 * which re-extracts the corpus and rewrites the catalog and the published
 * copy together. Hand-editing the manifest is not the fix: the hash has to
 * describe bytes, not an intention.
 *
 * Usage:
 *   node scripts/check-knowledge-rack.mjs
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RACK = path.join(ROOT, "knowledge-rack");
const INBOX = path.join(RACK, "inbox");
const CATALOG = path.join(RACK, "catalog");
const PUBLISHED = path.join(ROOT, "public", "knowledge-rack", "catalog");

const problems = [];
const fail = (message) => problems.push(message);

const sha256 = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

/** Python's str.split() with no argument: split on any whitespace run, drop empties. */
const pythonSplit = (text) => text.split(/\s+/).filter((s) => s.length > 0);

for (const dir of [RACK, CATALOG, PUBLISHED]) {
  if (!fs.existsSync(dir)) {
    fail(`missing directory: ${path.relative(ROOT, dir)}`);
  }
}
if (problems.length) {
  for (const p of problems) console.error(`✗ ${p}`);
  process.exit(1);
}

const manifest = readJson(path.join(PUBLISHED, "manifest.json"));
const chunks = readJson(path.join(PUBLISHED, "chunks.json"));

// ── 1. the manifest's hash contract ────────────────────────────────────────
for (const doc of manifest) {
  const source = path.join(ROOT, doc.source_path);
  if (!fs.existsSync(source)) {
    fail(`${doc.file_name}: the manifest points at ${doc.source_path}, which is not on disk`);
    continue;
  }
  const actual = sha256(source);
  if (actual !== doc.sha256) {
    fail(
      `${doc.file_name}: manifest says sha256 ${doc.sha256.slice(0, 12)}…, ` +
        `the file on disk is ${actual.slice(0, 12)}… — the index describes bytes that are not there`,
    );
  }
  // The rack keeps a raw copy of each source in library/raw/. It is meant to
  // be byte-identical, which is what lets the privacy scan skip it. If it
  // drifts, the skip is no longer safe, so this is checked here.
  if (doc.raw_copy_path) {
    const rawCopy = path.join(ROOT, doc.raw_copy_path);
    if (fs.existsSync(rawCopy) && sha256(rawCopy) !== actual) {
      fail(
        `${doc.file_name}: the raw copy at ${doc.raw_copy_path} is not the same bytes as the source — ` +
          `the privacy scan skips it, so it must not diverge`,
      );
    }
  }
}

// ── 2. every source in the intake folder is indexed ───────────────────────
const indexedSources = new Set(manifest.map((doc) => doc.source_path));
for (const entry of fs.readdirSync(INBOX, { withFileTypes: true })) {
  if (!entry.isFile() || entry.name.startsWith(".")) continue;
  const rel = path.relative(ROOT, path.join(INBOX, entry.name));
  if (!indexedSources.has(rel)) {
    fail(
      `${entry.name}: dropped into the intake folder but never indexed — the site ` +
        `cannot answer from it. Run: python3 scripts/build_knowledge_rack.py`,
    );
  }
}
for (const doc of manifest) {
  if (!doc.source_path.startsWith("knowledge-rack/inbox/")) {
    fail(`${doc.file_name}: the manifest indexes ${doc.source_path}, which is not in the intake folder`);
  }
}

// ── 3. the built catalog and the published catalog are the same bytes ─────
for (const name of ["manifest.json", "chunks.json", "summary.md"]) {
  const built = path.join(CATALOG, name);
  const published = path.join(PUBLISHED, name);
  if (!fs.existsSync(built)) {
    fail(`the built catalog has no ${name}`);
    continue;
  }
  if (!fs.readFileSync(built).equals(fs.readFileSync(published))) {
    fail(`${name}: the built catalog and the published catalog differ — the site is serving a different index`);
  }
}

// ── 4. the manifest's counts agree with the text and the chunks ──────────
const chunksByDoc = new Map();
for (const chunk of chunks) {
  if (!chunksByDoc.has(chunk.doc_id)) chunksByDoc.set(chunk.doc_id, []);
  chunksByDoc.get(chunk.doc_id).push(chunk);
}

for (const doc of manifest) {
  const textFile = path.join(ROOT, doc.text_path);
  if (!fs.existsSync(textFile)) {
    fail(`${doc.file_name}: the extracted text ${doc.text_path} is missing`);
    continue;
  }
  // The build writes `text + "\n"`.
  const text = fs.readFileSync(textFile, "utf8").replace(/\n$/, "");
  if (text.length !== doc.chars) {
    fail(`${doc.file_name}: the manifest says ${doc.chars} characters, the extracted text has ${text.length}`);
  }
  const words = pythonSplit(text).length;
  if (words !== doc.words) {
    fail(`${doc.file_name}: the manifest says ${doc.words} words, the extracted text has ${words}`);
  }
  const docChunks = chunksByDoc.get(doc.doc_id) ?? [];
  if (docChunks.length !== doc.chunk_count) {
    fail(
      `${doc.file_name}: the manifest says ${doc.chunk_count} chunks, the index has ${docChunks.length} ` +
        `for ${doc.doc_id}`,
    );
  }
}

// ── 5. the chunk stream is sound ──────────────────────────────────────────
if (chunks.length === 0) {
  fail("the published chunk stream is empty — the rack would answer nothing");
}
const manifestIds = new Set(manifest.map((doc) => doc.doc_id));
const seenChunkIds = new Set();
for (const chunk of chunks) {
  if (!manifestIds.has(chunk.doc_id)) {
    fail(`chunk ${chunk.chunk_id} belongs to ${chunk.doc_id}, which is not in the manifest`);
  }
  if (seenChunkIds.has(chunk.chunk_id)) {
    fail(`chunk id ${chunk.chunk_id} appears twice`);
  }
  seenChunkIds.add(chunk.chunk_id);
  if (chunk.chars !== chunk.text.length) {
    fail(`chunk ${chunk.chunk_id} says ${chunk.chars} characters, it has ${chunk.text.length}`);
  }
}

// The chunks are the text, split on blank lines and rejoined. Ignoring
// whitespace, a document's chunks must reconstruct its extracted text —
// otherwise the index is serving text the extraction never produced.
const squash = (s) => s.replace(/\s+/g, "");
for (const doc of manifest) {
  const textFile = path.join(ROOT, doc.text_path);
  if (!fs.existsSync(textFile)) continue;
  const text = fs.readFileSync(textFile, "utf8").replace(/\n$/, "");
  const docChunks = chunksByDoc.get(doc.doc_id) ?? [];
  const rebuilt = docChunks.map((c) => c.text).join("\n\n");
  if (squash(rebuilt) !== squash(text)) {
    fail(
      `${doc.file_name}: the chunks do not reconstruct the extracted text — the index and the ` +
        `extraction disagree. Run: python3 scripts/build_knowledge_rack.py`,
    );
  }
}

if (problems.length) {
  console.error(`\n✗ knowledge rack check failed (${problems.length} problem(s)):`);
  for (const p of problems) console.error(`   ${p}`);
  console.error("\n  The index serves citations, so it has to describe the bytes it was built");
  console.error("  from. Repair it with: python3 scripts/build_knowledge_rack.py");
  process.exit(1);
}

console.log(
  `✓ knowledge rack: ${manifest.length} document(s), ${chunks.length} chunk(s) — every hash, count and chunk matches the corpus.`,
);
