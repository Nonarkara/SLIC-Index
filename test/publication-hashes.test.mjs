import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, cp, readFile, writeFile, rm, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import publication from "../src/data/publishedRankingData.json" with { type: "json" };
import { digest, publicationHashes, verifyPublicationHashes } from "../scripts/publication-hashes.mjs";

test("canonical hashes reproduce the existing manifest and ignore object key order", () => {
  assert.deepEqual(verifyPublicationHashes(publication), []);
  const reordered = JSON.parse(JSON.stringify(publication));
  reordered.normStats = Object.fromEntries(Object.entries(reordered.normStats).reverse());
  reordered.metricCatalog = Object.fromEntries(Object.entries(reordered.metricCatalog).reverse());
  assert.deepEqual(publicationHashes(reordered), publicationHashes(publication));
  assert.equal(digest({ a: { c: 1, b: 2 } }), digest({ a: { b: 2, c: 1 } }));
  assert.notEqual(digest([1, 2]), digest([2, 1]));
});

test("both CLI gates reject tampering; isolated rescores preserve scores and hashes", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "slic-hash-test-"));
  const run = (script) => spawnSync(process.execPath, [join(root, "scripts", script)], {
    cwd: root, encoding: "utf8", timeout: 30000,
  });
  const gates = ["check-publication-integrity.mjs", "audit-data-integrity.mjs"];
  const dataPath = join(root, "src/data/publishedRankingData.json");
  try {
    for (const dir of ["scripts", "src"]) {
      await cp(new URL(`../${dir}`, import.meta.url), join(root, dir), { recursive: true });
    }
    await mkdir(join(root, "public/downloads"), { recursive: true });
    await cp(new URL("../public/downloads/slic-ranked-cities-v2.csv", import.meta.url), join(root, "public/downloads/slic-ranked-cities-v2.csv"));
    await cp(new URL("../package.json", import.meta.url), join(root, "package.json"));
    const check = (script, status, expected) => {
      const result = run(script);
      const output = result.stdout + result.stderr;
      assert.equal(result.status, status, output);
      if (expected) assert.match(output, new RegExp(expected));
    };
    for (const gate of gates) check(gate, 0);
    const mutations = [
      ["raw input", "inputDataHash", (d) => {
        const metric = Object.values(d.cities[0].metrics).find((m) => typeof m.raw === "number");
        metric.raw += 123;
      }],
      ["exact output", "publicationHash", (d) => {
        const city = d.cities.find((c) => c.rankingStatus === "Ranked" && !c.tierLabel);
        city.slicScoreExact += 0.001;
        city.ampiExact += 0.001;
      }],
      ["normalization", "normStatsHash", (d) => { d.normStats[Object.keys(d.normStats)[0]].p05 += 1; }],
      ["catalog", "metricCatalogHash", (d) => { d.metricCatalog[Object.keys(d.metricCatalog)[0]].label += " tampered"; }],
      ...Object.keys(publicationHashes(publication)).map((key) => [
        `zero ${key}`, key, (d) => { d.publicationManifest[key] = "0".repeat(64); },
      ]),
      ["missing input hash", "inputDataHash", (d) => { delete d.publicationManifest.inputDataHash; }],
    ];
    for (const [name, expected, mutate] of mutations) {
      await t.test(name, async () => {
        const data = structuredClone(publication);
        mutate(data);
        await writeFile(dataPath, JSON.stringify(data));
        for (const gate of gates) check(gate, 1, expected);
      });
    }
    await writeFile(dataPath, JSON.stringify(publication));
    check("rescore-all-cities.mjs", 0);
    const first = JSON.parse(await readFile(dataPath, "utf8"));
    const facts = await readFile(join(root, "src/data/methodologyFacts.json"), "utf8");
    check("rescore-all-cities.mjs", 0);
    const second = JSON.parse(await readFile(dataPath, "utf8"));
    assert.deepEqual(first.cities, publication.cities);
    assert.deepEqual(second.cities, first.cities);
    assert.deepEqual(publicationHashes(first), publicationHashes(publication));
    assert.deepEqual(publicationHashes(second), publicationHashes(first));
    assert.equal(await readFile(join(root, "src/data/methodologyFacts.json"), "utf8"), facts);
    for (const gate of gates) check(gate, 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
