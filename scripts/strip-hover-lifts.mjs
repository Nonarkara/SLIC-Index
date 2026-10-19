#!/usr/bin/env node
// Surgical strip of fake-depth transforms inside :hover blocks.
//
// Rule: drop lines matching `transform: translateY|scale|translate3d|translate|matrix(`
// from inside CSS :hover { ... } rule bodies.
//
// Carve-outs (KEEP these — photo zoom is a real cursor affordance, not fake depth):
//   - .idea-card:hover .idea-card-photo img
//   - .v3-city-card--photo:hover .v3-city-card-img
//
// The script walks styles.css character-by-character, tracks comment vs non-comment
// state, brace-matches to find :hover rule bodies, then strips lines inside.
//
// Idempotent — re-running yields zero diffs after the first run.

import fs from 'node:fs';
import path from 'node:path';

const FILE = 'src/styles.css';
const src = fs.readFileSync(FILE, 'utf8');
const original = src;

const CARVE_OUT_SELECTORS = [
  '.idea-card:hover .idea-card-photo img',
  '.v3-city-card--photo:hover .v3-city-card-img',
];

const LIFT_RE = /^\s*transform\s*:\s*(translateY|scale|translate3d|translate|matrix)\s*\([^)]*\)\s*;?\s*$/m;

// Find all `:hover` blocks.
const blocks = [];
{
  let i = 0;
  while (i < src.length) {
    const idx = src.indexOf(':hover', i);
    if (idx < 0) break;
    let start = idx;
    while (start > 0) {
      const c = src[start - 1];
      if (c === '{' || c === '}' || c === ';') break;
      start--;
    }
    let openBrace = src.indexOf('{', idx);
    if (openBrace < 0) break;
    if (isInComment(src, start, openBrace)) {
      i = idx + 6;
      continue;
    }
    const selector = src.slice(start, openBrace).trim();
    let depth = 0;
    let j = openBrace;
    for (; j < src.length; j++) {
      if (isInComment(src, j, j + 1)) continue;
      const c = src[j];
      if (c === '{') depth++;
      else if (c === '}') {
        depth--;
        if (depth === 0) { j++; break; }
      }
    }
    const body = src.slice(openBrace + 1, j - 1);
    blocks.push({ start, openBrace, closeBrace: j, selector, body });
    i = j;
  }
}

function isInComment(s, from, to) {
  let i = 0;
  while (i < s.length) {
    const openIdx = s.indexOf('/*', i);
    if (openIdx < 0 || openIdx >= to) return false;
    const closeIdx = s.indexOf('*/', openIdx + 2);
    if (closeIdx < 0) return false;
    if (closeIdx + 2 >= from && openIdx < to) return true;
    i = closeIdx + 2;
  }
  return false;
}

// Identify lift blocks (excluding carve-outs)
const liftBlocks = blocks.filter(b => {
  if (!LIFT_RE.test(b.body)) return false;
  return !CARVE_OUT_SELECTORS.some(c => b.selector.includes(c));
});

console.log(`Found ${blocks.length} :hover blocks; ${liftBlocks.length} are fake-depth lift blocks to strip.`);
console.log(`${blocks.filter(b => LIFT_RE.test(b.body)).length - liftBlocks.length} carve-out(s) preserved.`);

// Build edit plan: for each block, compute the new body (with lift lines removed).
// Then sort edits by start position descending and splice each one back into original.
const plan = liftBlocks.map(t => {
  const lines = t.body.split('\n');
  const kept = [];
  const removed = [];
  for (const line of lines) {
    if (LIFT_RE.test(line)) removed.push(line.trim());
    else kept.push(line);
  }
  return {
    selector: t.selector,
    openBrace: t.openBrace,
    closeBrace: t.closeBrace,
    newBody: kept.join('\n'),
    removed,
  };
});

// Apply in reverse order so earlier offsets stay stable.
plan.sort((a, b) => b.openBrace - a.openBrace);
let total = src;
for (const edit of plan) {
  total = total.slice(0, edit.openBrace + 1)
         + edit.newBody
         + total.slice(edit.closeBrace - 1);
}

if (total === original) {
  console.log('No changes (already stripped).');
  process.exit(0);
}

fs.writeFileSync(FILE, total);

console.log('\nStripped:');
for (const e of plan) {
  console.log(`  ${e.selector.replace(/\s+/g, ' ').slice(0, 80)}`);
  for (const r of e.removed) console.log(`    - ${r}`);
}

console.log(`\nWrote ${path.resolve(FILE)} (${total.length} bytes, was ${original.length})`);

// Verify by re-parsing the written file
const verify = fs.readFileSync(FILE, 'utf8');
let lifted = 0;
{
  let i = 0;
  while (i < verify.length) {
    const idx = verify.indexOf(':hover', i);
    if (idx < 0) break;
    let start = idx;
    while (start > 0) {
      const c = verify[start - 1];
      if (c === '{' || c === '}' || c === ';') break;
      start--;
    }
    let openBrace = verify.indexOf('{', idx);
    if (openBrace < 0) break;
    const selector = verify.slice(start, openBrace).trim();
    let depth = 0;
    let j = openBrace;
    for (; j < verify.length; j++) {
      if (isInComment(verify, j, j + 1)) continue;
      const c = verify[j];
      if (c === '{') depth++;
      else if (c === '}') {
        depth--;
        if (depth === 0) { j++; break; }
      }
    }
    const body = verify.slice(openBrace + 1, j - 1);
    if (LIFT_RE.test(body) && !CARVE_OUT_SELECTORS.some(c => selector.includes(c))) {
      lifted++;
    }
    i = j;
  }
}
console.log(`\nVerification: ${lifted} :hover blocks still have lift transforms (target: 0, excluding ${CARVE_OUT_SELECTORS.length} carve-outs).`);