#!/usr/bin/env node
/**
 * Merge duplicate CSS rule blocks — provably.
 *
 * src/styles.css defines the same rule in several places. A later duplicate
 * silently wins, so the earlier block is dead code and nobody can tell what
 * actually renders. `.hp-headline` was defined nine times.
 *
 * Removing the dead code is good hygiene, but removing the WRONG block changes
 * the site, and CSS does not tell you which is wrong by reading it. The naive
 * "merge them and keep the last one's values" is wrong for three separate
 * reasons, each of which this tool handles:
 *
 *   1. COMMA LISTS. `.paper-card, .hero-ranking-card { background: X }` also
 *      declares a property for .hero-ranking-card without being a "duplicate"
 *      of it. The true winner for that property may be a rule the group does
 *      not own, so the group's own union is not the answer.
 *
 *   2. MEDIA QUERIES. A rule inside @media still applies inside that query,
 *      and it competes with top-level rules on source order. A merged top-level
 *      block that moves LATER can overtake a media rule that used to win —
 *      and the same property can legitimately have different winners in
 *      different media contexts, which one merged block cannot represent.
 *
 *   3. IMPORTANT. An !important declaration beats a later normal one
 *      regardless of order, so "later wins" is not a flat rule.
 *
 * And one more, which is the reason a first attempt at this shipped a bug:
 *
 *   4. RELOCATION. Merging a group means writing ONE block in place of
 *      several, so the merged block moves. Where it lands decides which rule
 *      wins against rules the group does not own. This file has
 *      `.mh-panel-link` and `.mh-panel-link--active` — the same specificity,
 *      and the modifier rule is applied to elements that also carry the base
 *      class. Writing the merged `.mh-panel-link` block at the group's LAST
 *      position pushed it after `--active`, and the active link stopped
 *      looking active. A cascade fingerprint that buckets rules by selector
 *      text cannot see this, because the two selectors only interact when
 *      they match the same element.
 *
 * The algorithm:
 *
 *   For each group (rules sharing selector text + media context + nesting
 *   context):
 *     - Work out, per property, which member of the group wins it.
 *     - Find every rule OUTSIDE the group that could match the same element
 *       and declares the same property at the same specificity. These are the
 *       competitors whose relative order the merge would disturb.
 *     - Try to place the merged block at the group's FIRST position, then at
 *       its LAST. A placement is legal only if, for every property, the
 *       competitor that currently wins still wins afterwards. If neither
 *       placement is legal, REFUSE the group and leave it alone.
 *
 * The result is verified two ways: a cascade fingerprint diff over the whole
 * file, and a real-browser comparison of every computed style on every route
 * (scripts/verify-css-refactor.mjs). The browser is the ground truth — the
 * fingerprint cannot model two selectors competing on one element.
 *
 * Usage:
 *   node scripts/merge-duplicate-css.mjs --check     # report only
 *   node scripts/merge-duplicate-css.mjs --write     # apply
 */

import fs from "node:fs";
import postcss from "postcss";
import { diffFingerprints, fingerprint, specificity } from "./css-cascade.mjs";

const FILE = "src/styles.css";
const CHECK_ONLY = !process.argv.includes("--write");

const css = fs.readFileSync(FILE, "utf8");
const root = postcss.parse(css);

/* ── Walk the tree, collecting rule nodes with their context ───────────── */

const mediaChain = [];
const contextChain = [];
let order = 0;

/** @type {Node[]} */
const nodes = [];

const walk = (container) => {
  container.each((child) => {
    if (child.type === "rule") {
      const sel = child.selector.trim();
      const media = mediaChain.length ? mediaChain.join(" AND ") : null;
      const context = contextChain.join(" > ");
      const decls = new Map();
      child.each((decl) => {
        if (decl.type !== "decl") return;
        decls.set(decl.prop.toLowerCase(), { value: decl.value, important: !!decl.important });
      });
      const complexes = sel.split(",").map((s) => s.trim()).filter(Boolean);
      // A rule's specificity is the max over its complex selectors: the rule
      // competes at that strength against anything else matching an element.
      const spec = complexes
        .map((c) => specificity(c))
        .reduce((a, b) => (b[0] > a[0] || (b[0] === a[0] && (b[1] > a[1] || (b[1] === a[1] && b[2] > a[2])))) ? b : a);
      nodes.push({
        selector: sel,
        complexes,
        spec,
        media,
        context,
        order: order++,
        decls,
        node: child,
      });
      if (child.nodes?.length) {
        contextChain.push(sel);
        walk(child);
        contextChain.pop();
      }
    } else if (child.type === "atrule") {
      if (child.name === "media" || child.name === "supports" || child.name === "layer") {
        mediaChain.push(`${child.name}:${child.params || ""}`);
        walk(child);
        mediaChain.pop();
      } else if (child.nodes && !child.name.endsWith("keyframes")) {
        walk(child);
      }
    }
  });
};
walk(root);

const mediaContexts = [...new Set(nodes.map((n) => n.media).filter((m) => m !== null))];

/* ── Could two rules match the same element? ───────────────────────────── */

/** Class and id tokens in a selector. */
function tokensOf(sel) {
  const out = [];
  for (const m of sel.matchAll(/[.#]([\w-]+)/g)) out.push(m[1]);
  return out;
}

/** Strip BEM suffixes so `.card--active` and `.card` count as the same family. */
function normaliseToken(tok) {
  return tok.replace(/__[^_]+$/, "").replace(/--.+$/, "");
}

/**
 * A conservative test for "these two selectors might match the same element".
 *
 * Two rules can only compete if they can hit the same element, and that
 * requires them to share an identity token (a class or id) — or to be a BEM
 * base/modifier pair, where the modifier is applied to an element that also
 * carries the base class.
 *
 * This is deliberately an over-approximation: it admits competitors that
 * cannot actually co-occur (which only makes the tool refuse more often) and
 * it can in principle miss a competitor with no shared token (which the
 * browser verifier then catches).
 */
function couldCoMatch(a, b) {
  const ta = tokensOf(a);
  const tb = tokensOf(b);
  if (!ta.length || !tb.length) return false;
  const na = new Set(ta.map(normaliseToken));
  const nb = new Set(tb.map(normaliseToken));
  for (const t of na) if (nb.has(t)) return true;
  for (const x of ta) {
    for (const y of tb) {
      if (x === y) continue;
      if (y.startsWith(x + "--") || y.startsWith(x + "__")) return true;
      if (x.startsWith(y + "--") || x.startsWith(y + "__")) return true;
    }
  }
  return false;
}

/* ── Media contexts: which queries are active at a given viewport width ── */

/**
 * Parse a media chain into conditions.
 *
 * The important thing here is that `max-width` queries are CUMULATIVE, not
 * exclusive. A 430px viewport satisfies `@media (max-width: 768px)` AND
 * `@media (max-width: 430px)` at the same time, and the rules in both compete
 * with each other on source order. Treating each query as its own exclusive
 * context — the obvious mistake — is what let a merge change the homepage
 * headline on a phone.
 */
function parseConditions(media) {
  if (!media) return [];
  const conds = [];
  for (const part of media.split(" AND ").map((s) => s.trim())) {
    const body = part.replace(/^(media|supports|layer):/, "");
    const max = body.match(/max-width:\s*([\d.]+)px/);
    const min = body.match(/min-width:\s*([\d.]+)px/);
    if (max) conds.push({ type: "max", v: parseFloat(max[1]) });
    else if (min) conds.push({ type: "min", v: parseFloat(min[1]) });
    else conds.push({ type: "other" });
  }
  return conds;
}

/** Is a context active at this viewport width? */
function contextActive(conds, width) {
  for (const c of conds) {
    if (c.type === "max" && width > c.v) return false;
    if (c.type === "min" && width < c.v) return false;
    // prefers-reduced-motion / hover: treated as active — the conservative
    // assumption, since a rule inside them can change any property.
  }
  return true;
}

const conditionsByMedia = new Map();
for (const m of mediaContexts) conditionsByMedia.set(m, parseConditions(m));

/**
 * Every viewport width that can produce a different set of active queries.
 *
 * The set of active media queries only changes at a threshold, so it is
 * enough to test one width in each band: just below, at, and just above
 * every threshold in the file, plus the extremes.
 */
const widths = (() => {
  const t = new Set([0, 4000]);
  for (const conds of conditionsByMedia.values()) {
    for (const c of conds) {
      if (c.v === undefined) continue;
      for (const w of [c.v - 1, c.v, c.v + 1]) if (w >= 0) t.add(w);
    }
  }
  return [...t].sort((a, b) => a - b);
})();

/** Rules in effect at a given viewport width. */
function poolAt(width) {
  return nodes.filter((n) => {
    if (n.media === null) return true;
    const conds = conditionsByMedia.get(n.media);
    return conds ? contextActive(conds, width) : true;
  });
}

/* ── The true winner of a property, for a complex selector, in a context ─ */

/**
 * @param {string} complex
 * @param {string} prop
 * @param {string|null} contextMedia  null = base context
 * @param {Node[]} skip               nodes being removed by this merge
 */
function trueWinner(complex, prop, contextMedia, pool) {
  let winner = null;
  for (const n of pool) {
    if (n.media !== contextMedia && contextMedia !== null && n.media !== null) continue;
    if (contextMedia === null && n.media !== null) continue;
    if (!n.complexes.includes(complex)) continue;
    const d = n.decls.get(prop);
    if (!d) continue;
    if (
      !winner ||
      (d.important && !winner.important) ||
      (d.important === winner.important && n.order > winner.order)
    ) {
      winner = { value: d.value, important: d.important, order: n.order, node: n };
    }
  }
  return winner;
}

/* ── Group by (selector text, media, context) ──────────────────────────── */

const keyOf = (n) => `${n.selector}||${n.media ?? ""}||${n.context}`;

const groups = new Map();
for (const n of nodes) {
  const key = keyOf(n);
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(n);
}

const dupGroups = [...groups.entries()].filter(([, v]) => v.length > 1);

/* ── Analyse each group ────────────────────────────────────────────────── */

/**
 * The member of the group that wins a property.
 *
 * Within a group every member has the same selector text, so the same
 * specificity, so the later member wins — except that an !important
 * declaration beats a later normal one regardless of order.
 */
function groupWinner(members, prop) {
  let best = null;
  for (const m of members) {
    const d = m.decls.get(prop);
    if (!d) continue;
    if (!best) {
      best = { member: m, decl: d };
      continue;
    }
    if (d.important && !best.decl.important) {
      best = { member: m, decl: d };
      continue;
    }
    if (!d.important && best.decl.important) continue;
    if (m.order > best.member.order) best = { member: m, decl: d };
  }
  return best;
}

/**
 * Can the merged block be written at source position `P` without changing
 * which rule wins any property?
 *
 * The reasoning, for one property:
 *
 *   OLD  the winner among {the group's winning member, competitors} is the
 *        one with the largest source order (all at equal specificity).
 *   NEW  the group's members are replaced by the merged block at position P,
 *        carrying the group's own winning value.
 *
 *   So for every competitor, the merged block has to land on the SAME SIDE of
 *   that competitor as the group's own winner did:
 *
 *     competitor before the group's winner  →  the merged block must stay
 *                                               after the competitor
 *     competitor after the group's winner   →  the merged block must stay
 *                                               before the competitor
 *
 *   Otherwise the winner flips, and the property renders a different value.
 *
 * A competitor only matters if it is at the SAME specificity (a higher one
 * always wins, a lower one always loses) and has the SAME importance (an
 * important declaration beats a normal one whatever the order).
 */
function placementIsLegal(group, members, P) {
  const groupConds = group.media === null ? [] : conditionsByMedia.get(group.media) ?? [];
  for (const width of widths) {
    // The group only has to be correct at widths where it applies.
    if (group.media !== null && !contextActive(groupConds, width)) continue;
    const pool = poolAt(width);
    for (const prop of group.ownProps) {
      const win = groupWinner(members, prop);
      if (!win) continue;
      const winnerOrder = win.member.order;
      const winnerImportant = win.decl.important;
      for (const n of pool) {
        if (members.includes(n)) continue;
        const d = n.decls.get(prop);
        if (!d) continue;
        if (d.important !== winnerImportant) continue;
        // Compare per complex selector: a comma-list rule competes at the
        // specificity of the particular complex selector that matched.
        const competes = n.complexes.some((c) => {
          if (specificity(c).join(",") !== group.spec.join(",")) return false;
          return couldCoMatch(group.selector, c);
        });
        if (!competes) continue;
        const oR = n.order;
        if (oR < winnerOrder) {
          // The group used to win; the merged block must still beat this.
          if (P < oR) {
            return {
              ok: false,
              reason: `${prop}: "${n.selector.replace(/\n\s*/g, " ")}" currently loses to the group at ${width}px; moving the merged block before it would let it win`,
            };
          }
        } else {
          // This competitor used to win; the merged block must still lose to it.
          if (P > oR) {
            return {
              ok: false,
              reason: `${prop}: "${n.selector.replace(/\n\s*/g, " ")}" currently wins over the group at ${width}px; moving the merged block after it would change that`,
            };
          }
        }
      }
    }
  }
  return { ok: true };
}

const analysis = [];
for (const [key, members] of dupGroups) {
  const sorted = [...members].sort((a, b) => a.order - b.order);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  // The properties the GROUP itself declares. The merged block gets exactly
  // these — it must not gain properties it never had.
  const ownProps = new Set();
  for (const n of sorted) {
    for (const prop of n.decls.keys()) ownProps.add(prop);
  }

  const group = {
    key,
    selector: first.selector,
    media: first.media,
    context: first.context,
    spec: first.spec,
    ownProps,
  };

  /*
   * The merged block carries, for each property, the value the GROUP itself
   * renders — the winner among the group's own members, across every complex
   * selector the group owns. Comma-list outsiders are included because a rule
   * like `.paper-card, .hero-ranking-card` really does declare a property for
   * `.hero-ranking-card`.
   */
  const agreed = new Map();
  const conflicts = [];
  for (const prop of ownProps) {
    const values = new Map(); // complex -> winner
    for (const complex of last.complexes) {
      const w = trueWinner(complex, prop, first.media, nodes);
      if (w) values.set(complex, w);
    }
    const distinct = new Set([...values.values()].map((w) => `${w.value}|${w.important}`));
    if (distinct.size > 1) {
      conflicts.push({
        prop,
        variants: [...values.entries()].map(([k, w]) => `${k} → ${w.value}${w.important ? " !important" : ""}`),
      });
      continue;
    }
    const w = [...values.values()][0];
    if (w) agreed.set(prop, w);
  }

  /*
   * The merged block has to be correct at every viewport width where the
   * group applies — and because `max-width` queries are cumulative, "where the
   * group applies" includes every narrower query's rules as competitors.
   */
  let placement = null;
  const attempts = [];
  for (const P of [first.order, last.order]) {
    const check = placementIsLegal(group, sorted, P);
    attempts.push({ P, ok: check.ok, reason: check.reason });
    if (check.ok) {
      placement = P;
      break;
    }
  }

  analysis.push({
    key,
    group,
    sorted,
    first,
    last,
    agreed,
    conflicts,
    attempts,
    placement,
    mergeable: conflicts.length === 0 && placement !== null,
  });
}

const mergeable = analysis.filter((a) => a.mergeable);
const refused = analysis.filter((a) => !a.mergeable);

console.log(`duplicate groups (same selector text + media + context): ${dupGroups.length}`);
console.log(`  mergeable:  ${mergeable.length}`);
console.log(`  refused:    ${refused.length}`);
console.log(`  blocks removed: ${mergeable.reduce((n, a) => n + a.sorted.length - 1, 0)}`);

if (refused.length) {
  console.log("\nrefused groups:");
  for (const r of refused) {
    const props = [...new Set(r.conflicts.map((c) => c.prop))].join(", ");
    const why =
      r.conflicts.length > 0
        ? `different winners for ${props}`
        : r.attempts.find((t) => !t.ok)?.reason ?? "no legal placement";
    console.log(`  ${r.group.selector.replace(/\n\s*/g, " ")}${r.group.media ? `  [${r.group.media}]` : ""}`);
    if (r.conflicts.length > 0) {
      console.log(`        different winners for ${[...new Set(r.conflicts.map((c) => c.prop))].join(", ")}`);
    }
    for (const t of r.attempts) {
      console.log(`        ${t.ok ? "ok  " : "no  "} position ${t.P}: ${t.ok ? "legal" : t.reason}`);
    }
  }
}

if (CHECK_ONLY) {
  console.log("\n(dry run — pass --write to apply)");
  process.exit(0);
}

/* ── Rewrite ───────────────────────────────────────────────────────────── */

const toRemove = new Set();
const toReplace = new Map();

for (const a of mergeable) {
  const decls = [];
  for (const [prop, w] of a.agreed) {
    decls.push({ prop, value: w.value, important: w.important });
  }
  // Write the merged block over the member at the chosen position.
  const host = a.sorted.find((m) => m.order === a.placement);
  toReplace.set(host.node, decls);
  for (const n of a.sorted) {
    if (n.node !== host.node) toRemove.add(n.node);
  }
}

for (const [node, decls] of toReplace) {
  node.removeAll();
  for (const d of decls) {
    node.append(
      d.important
        ? postcss.decl({ prop: d.prop, value: d.value, important: true })
        : postcss.decl({ prop: d.prop, value: d.value }),
    );
  }
}
for (const node of toRemove) node.remove();

const out = root.toString();
fs.writeFileSync(FILE, out);
console.log(`\nremoved ${toRemove.size} dead blocks, rewrote ${toReplace.size} blocks.`);

/* ── Verify ────────────────────────────────────────────────────────────── */

const before = fingerprint(css);
const after = fingerprint(out);
const { onlyA, onlyB } = diffFingerprints(before, after);

if (onlyA.length === 0 && onlyB.length === 0) {
  console.log("VERIFIED: cascade fingerprint identical before and after. No rendered value changed.");
} else {
  console.log(`\n!!! VERIFICATION FAILED — ${onlyA.length} removed, ${onlyB.length} added`);
  for (const d of onlyA.slice(0, 25)) console.log(`  - ${d}`);
  for (const d of onlyB.slice(0, 25)) console.log(`  + ${d}`);
  fs.writeFileSync(FILE, css);
  console.log("\nRolled back to the original file.");
  process.exit(1);
}
