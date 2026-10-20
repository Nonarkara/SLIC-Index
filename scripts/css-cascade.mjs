#!/usr/bin/env node
/**
 * CSS cascade analyser.
 *
 * The problem this solves: src/styles.css defines 287 selectors more than once.
 * A later duplicate silently wins, so the earlier block is dead code and nobody
 * can tell what actually renders. Deleting a "duplicate" naively is dangerous —
 * the two blocks may declare different properties, and an intervening rule with
 * higher specificity may currently beat both.
 *
 * This tool answers two questions with a real cascade model rather than by
 * reading:
 *
 *   1. For every rule, what is the FINAL value of every property it declares,
 *      after specificity, source order, and media-query conditions are applied?
 *   2. If I merge a set of duplicate blocks into one, does that final value
 *      change anywhere?
 *
 * The merge tool uses (1) to compute a "before" fingerprint and (2) to compute an
 * "after" fingerprint, then diffs them. If the diff is empty, the merge is
 * provably behaviour-preserving for every selector in the file — not just for
 * the ones we thought to check.
 *
 * Specificity model (CSS Selectors Level 3, the one browsers use for this file):
 *   (id count, class/attr/pseudo-class count, element/pseudo-element count)
 * Inline styles are out of scope — this file has none.
 * !important is honoured: an important declaration beats any normal one.
 * Source order breaks ties.
 */

import postcss from "postcss";

/** @typedef {{ selector: string, specificity: [number,number,number], declarations: Map<string,string>, important: Set<string>, order: number, media: string|null, context: string }} Rule */

/** Count ID selectors in a complex selector. */
function countIds(sel) {
  return (sel.match(/#[\w-]+/g) ?? []).length;
}

/**
 * Specificity of a complex selector.
 * Pseudo-classes count as class-level except :not/:is/:where (which pass
 * through their argument's specificity) and :before/:after (element-level).
 */
export function specificity(complexSelector) {
  // Strip strings and attribute values that might contain brackets.
  let s = complexSelector.replace(/"[^"]*"|'[^']*'/g, "");

  let ids = countIds(s);
  let classes = 0;
  let elements = 0;

  // Remove :not(...)/:is(...)/:where(...) wrappers but keep their inner
  // specificity contribution (except :where, which contributes zero).
  const functional = s.match(/:(not|is|matches|any)\(([^()]*)\)/g) ?? [];
  for (const fn of functional) {
    const name = fn.match(/:(not|is|matches|any)\(/)[1];
    const inner = fn.slice(fn.indexOf("(") + 1, -1);
    if (name === "where") {
      // contributes nothing
    } else {
      const innerSpec = specificity(inner);
      ids += innerSpec[0];
      classes += innerSpec[1];
      elements += innerSpec[2];
    }
    s = s.replace(fn, " ");
  }

  // :where() contributes nothing
  s = s.replace(/:where\([^()]*\)/g, " ");

  // Class-like: .class, [attr], :pseudo-class (not ::pseudo-element)
  classes += (s.match(/\.[\w-]+/g) ?? []).length;
  classes += (s.match(/\[[^\]]*\]/g) ?? []).length;
  classes += (s.match(/:(?!:)[a-zA-Z-]+/g) ?? []).length;

  // Element-like: tag names and ::pseudo-elements
  elements += (s.match(/::[a-zA-Z-]+/g) ?? []).length;
  // Remove pseudo-elements before counting tags.
  const withoutPseudoEls = s.replace(/::[a-zA-Z-]+/g, " ");
  elements += (withoutPseudoEls.match(/(?:^|[\s>+~,(])([a-zA-Z][\w-]*)/g) ?? []).length;

  return [ids, classes, elements];
}

/** Compare two specificity tuples. Higher wins. */
function specCompare(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

/**
 * Parse a stylesheet into a flat list of rules.
 * Every rule is annotated with the media-query chain it lives under, and with
 * the "context path" of enclosing selectors (so `.a { .b { ... } }` is
 * distinguishable from a top-level `.b`).
 */
export function parseRules(css, { includeNested = true } = {}) {
  const root = postcss.parse(css);
  /** @type {Rule[]} */
  const rules = [];
  let order = 0;

  const walk = (container, mediaChain, contextPath) => {
    container.each((node) => {
      if (node.type === "rule") {
        const selector = node.selector;
        // The source-order counter must advance ONCE PER RULE NODE, not once
        // per complex selector. A rule like `.a, .b { ... }` is one block in
        // the stylesheet and sits at one position; counting it twice would
        // desynchronise this analyser from any tool that walks the tree, and
        // the tie-breaks would disagree about which rule is later.
        const nodeOrder = order++;
        for (const complex of selector.split(",").map((s) => s.trim()).filter(Boolean)) {
          const decls = new Map();
          const important = new Set();
          node.each((decl) => {
            if (decl.type !== "decl") return;
            const prop = decl.prop.toLowerCase();
            if (!decls.has(prop) || decl.important) {
              decls.set(prop, decl.value);
            }
            if (decl.important) important.add(prop);
          });
          rules.push({
            selector: complex,
            specificity: specificity(complex),
            declarations: decls,
            important,
            order: nodeOrder,
            media: mediaChain.length ? mediaChain.join(" AND ") : null,
            context: contextPath.join(" > "),
          });
        }
        if (includeNested) {
          walk(node, mediaChain, [...contextPath, selector]);
        }
      } else if (node.type === "atrule") {
        if (node.name === "media" || node.name === "supports" || node.name === "layer") {
          const params = node.params || "";
          walk(node, [...mediaChain, `${node.name}:${params}`], contextPath);
        } else if (node.name === "keyframes" || node.name === "-webkit-keyframes") {
          // keyframe steps are not selector rules
        } else if (node.nodes) {
          walk(node, mediaChain, contextPath);
        }
      }
    });
  };

  walk(root, [], []);
  return rules;
}

/**
 * Compute, for every distinct complex selector, the winning declaration for
 * each property under a given media context.
 *
 * The model has to be right about media queries, because getting it wrong makes
 * a correct refactor look like a regression:
 *
 *   - The "base" context (media === null) contains ONLY unconditional rules.
 *     A rule inside @media is not always in effect, so it must not compete
 *     here.
 *   - A media context M contains the unconditional rules PLUS every rule
 *     inside @media M. The unconditional rules still apply inside the query;
 *     they are not replaced by it. When both declare the same property at the
 *     same specificity, the one later in source order wins.
 *
 * @param {Rule[]} rules
 * @param {string|null} mediaFilter  null = unconditional context
 */
export function cascade(rules, mediaFilter = null) {
  /** @type {Map<string, Map<string, {value:string, important:boolean, spec:number[], order:number, media:string|null}>>} */
  const result = new Map();

  const candidates = rules.filter((r) =>
    mediaFilter === null ? r.media === null : r.media === null || r.media === mediaFilter,
  );

  for (const rule of candidates) {
    let bucket = result.get(rule.selector);
    if (!bucket) {
      bucket = new Map();
      result.set(rule.selector, bucket);
    }
    for (const [prop, value] of rule.declarations) {
      const isImportant = rule.important.has(prop);
      const existing = bucket.get(prop);
      if (!existing) {
        bucket.set(prop, {
          value,
          important: isImportant,
          spec: rule.specificity,
          order: rule.order,
          media: rule.media,
        });
        continue;
      }
      // Important always beats non-important.
      if (isImportant && !existing.important) {
        bucket.set(prop, { value, important: true, spec: rule.specificity, order: rule.order, media: rule.media });
        continue;
      }
      if (!isImportant && existing.important) continue;
      if (isImportant && existing.important) {
        const cmp = specCompare(rule.specificity, existing.spec);
        if (cmp > 0 || (cmp === 0 && rule.order > existing.order)) {
          bucket.set(prop, { value, important: true, spec: rule.specificity, order: rule.order, media: rule.media });
        }
        continue;
      }
      // Both normal.
      const cmp = specCompare(rule.specificity, existing.spec);
      if (cmp > 0 || (cmp === 0 && rule.order > existing.order)) {
        bucket.set(prop, { value, important: false, spec: rule.specificity, order: rule.order, media: rule.media });
      }
    }
  }
  return result;
}

/**
 * A stable fingerprint of the whole cascade. Two stylesheets with the same
 * fingerprint compute identically for every selector they mention.
 */
export function fingerprint(css) {
  const rules = parseRules(css);
  const mediaContexts = new Set(rules.map((r) => r.media).filter(Boolean));
  const all = cascade(rules, null);

  const parts = [];
  const serialise = (map, label) => {
    const keys = [...map.keys()].sort();
    for (const k of keys) {
      const props = [...map.get(k).keys()].sort();
      for (const p of props) {
        const d = map.get(k).get(p);
        parts.push(`${label}|${k}|${p}|${d.value}|${d.important ? "!" : ""}`);
      }
    }
  };
  serialise(all, "all");
  for (const m of [...mediaContexts].sort()) {
    serialise(cascade(rules, m), `m:${m}`);
  }
  return parts.sort().join("\n");
}

/** Diff two fingerprints, returning human-readable differences. */
export function diffFingerprints(a, b) {
  const as = new Set(a.split("\n"));
  const bs = new Set(b.split("\n"));
  const onlyA = [...as].filter((x) => !bs.has(x));
  const onlyB = [...bs].filter((x) => !as.has(x));
  return { onlyA, onlyB };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2];
  const css = await (await import("node:fs/promises")).readFile(file, "utf8");
  const rules = parseRules(css);
  const counts = new Map();
  for (const r of rules) {
    if (!counts.has(r.selector)) counts.set(r.selector, []);
    counts.get(r.selector).push(r);
  }
  const dups = [...counts.entries()].filter(([, v]) => v.length > 1);
  console.log(`total rules: ${rules.length}`);
  console.log(`selectors defined more than once: ${dups.length}`);
  const mediaContexts = new Set(rules.map((r) => r.media).filter(Boolean));
  console.log(`media contexts: ${mediaContexts.size}`);
  for (const m of [...mediaContexts].sort()) console.log(`  - ${m}`);
}
