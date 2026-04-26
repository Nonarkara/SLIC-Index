import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import publication from "../src/data/publishedRankingData.json" with { type: "json" };
import { PUBLIC_TIER_RULES } from "../src/publicTierPolicy.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const FILES = [
  "src/methodologyData.ts",
  "src/MethodologyPage.tsx",
  "src/HomePage.tsx",
  "docs/v3-absolute-scoring-specification.md",
  "docs/v3-absolute-scoring-formula.md",
  "scripts/generate_methodology_pdf.py",
];

const fileText = Object.fromEntries(
  await Promise.all(
    FILES.map(async (file) => [file, await readFile(path.join(ROOT, file), "utf8")]),
  ),
);

const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function countOccurrences(text, needle) {
  if (!needle) return 0;
  return text.split(needle).length - 1;
}

function quotedNumber(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const methodologyText = fileText["src/methodologyData.ts"];
const methodologyPageText = fileText["src/MethodologyPage.tsx"];
const homePageText = fileText["src/HomePage.tsx"];
const specText = fileText["docs/v3-absolute-scoring-specification.md"];
const formulaText = fileText["docs/v3-absolute-scoring-formula.md"];
const pdfText = fileText["scripts/generate_methodology_pdf.py"];

const bannedChecks = [
  {
    files: ["src/methodologyData.ts", "docs/v3-absolute-scoring-formula.md", "docs/v3-absolute-scoring-specification.md"],
    pattern: /0\.25\s*Pressure\s*\+\s*0\.22\s*Viability/i,
    message: "Stale weighted-sum overall formula is still present.",
  },
  {
    files: ["src/methodologyData.ts", "docs/v3-absolute-scoring-formula.md", "docs/v3-absolute-scoring-specification.md"],
    pattern: /Viability\(c\)\s*=\s*0\.\d+/i,
    message: "Stale weighted-sum Viability formula is still present.",
  },
  {
    files: ["src/methodologyData.ts", "docs/v3-absolute-scoring-formula.md", "docs/v3-absolute-scoring-specification.md"],
    pattern: /Community\(c\)\s*=\s*0\.\d+/i,
    message: "Stale weighted-sum Community formula is still present.",
  },
  {
    files: ["src/methodologyData.ts", "docs/v3-absolute-scoring-formula.md", "docs/v3-absolute-scoring-specification.md"],
    pattern: /Creative\(c\)\s*=\s*0\.\d+/i,
    message: "Stale weighted-sum Creative formula is still present.",
  },
  {
    files: ["src/HomePage.tsx", "src/methodologyData.ts", "scripts/generate_methodology_pdf.py"],
    pattern: /active armed conflict/i,
    message: "Rule copy still uses the older armed-conflict phrasing instead of the live exclusion rule.",
  },
  {
    files: FILES,
    pattern: /154 ranked cities|See all 154 cities|160 verified cities/i,
    message: "A stale hand-written snapshot count is still present in source copy.",
  },
  {
    files: ["docs/v3-absolute-scoring-formula.md", "docs/v3-absolute-scoring-specification.md", "src/methodologyData.ts"],
    pattern: /Japan max 0|Oceania max 1|East Asia capped at one city from Japan and one from Korea/i,
    message: "An older tier-cap rule is still present in methodology copy.",
  },
];

for (const check of bannedChecks) {
  for (const file of check.files) {
    assert(!check.pattern.test(fileText[file]), `${check.message} [${file}]`);
  }
}

const requiredLiteralCounts = [
  ["officialSlicFormula", 3],
  ["officialAmpiFormula", 3],
  ["growthPillarFormula", 3],
  ["toleranceCompositeFormula", 3],
  ["economicVitalityFormula", 3],
  ["PUBLIC_TIER_RULES.maxEuropeInAlpha", 3],
  ["PUBLIC_TIER_RULES.maxTaiwanAcrossPublicTiers", 3],
  ["PUBLIC_TIER_RULES.maxOceaniaInAlpha", 3],
  ["PUBLIC_TIER_RULES.maxSouthKoreaInAlpha", 3],
  ["PUBLIC_TIER_RULES.maxJapanInAlpha", 3],
  ["alphaExclusionList", 3],
];

for (const [needle, minimum] of requiredLiteralCounts) {
  assert(
    countOccurrences(methodologyText, needle) >= minimum,
    `Expected at least ${minimum} occurrences of ${needle} in src/methodologyData.ts.`,
  );
}

assert(
  methodologyText.includes("const englishTierProtocolRule") &&
  methodologyText.includes("const thaiTierProtocolRule") &&
  methodologyText.includes("const chineseTierProtocolRule"),
  "src/methodologyData.ts must define English, Thai, and Chinese tier protocol blocks.",
);

assert(
  methodologyPageText.includes("generatedObservedShares"),
  "src/MethodologyPage.tsx should read generated observed data-level shares from published diagnostics.",
);

assert(
  homePageText.includes("PUBLIC_TIER_RULES"),
  "src/HomePage.tsx should derive public-tier copy from the live rule object.",
);

assert(
  specText.includes("`slicScoreExact`") &&
  specText.includes(`except Taiwan may appear \`${PUBLIC_TIER_RULES.maxTaiwanAcrossPublicTiers}\` times`) &&
  specText.includes(`Japan may appear \`${PUBLIC_TIER_RULES.maxJapanAcrossPublicTiers ?? 1}\` times`) &&
  specText.includes(`Alpha caps Europe at \`${PUBLIC_TIER_RULES.maxEuropeInAlpha}\` slots`) &&
  specText.includes(`Oceania at \`${PUBLIC_TIER_RULES.maxOceaniaInAlpha}\` slot`) &&
  specText.includes(`South Korea at \`${PUBLIC_TIER_RULES.maxSouthKoreaInAlpha}\` slot`) &&
  specText.includes(`Japan at \`${PUBLIC_TIER_RULES.maxJapanInAlpha}\` slots`) &&
  specText.includes("excludes Israel"),
  "Specification markdown does not match the current public tier rule set.",
);

assert(
  formulaText.includes(`except Taiwan may appear ${PUBLIC_TIER_RULES.maxTaiwanAcrossPublicTiers} times`) &&
  formulaText.includes(`Japan may appear ${PUBLIC_TIER_RULES.maxJapanAcrossPublicTiers ?? 1} times`) &&
  formulaText.includes(`Europe max ${PUBLIC_TIER_RULES.maxEuropeInAlpha}`) &&
  formulaText.includes(`Oceania max ${PUBLIC_TIER_RULES.maxOceaniaInAlpha}`) &&
  formulaText.includes(`South Korea max ${PUBLIC_TIER_RULES.maxSouthKoreaInAlpha}`) &&
  formulaText.includes(`Japan max ${PUBLIC_TIER_RULES.maxJapanInAlpha}`) &&
  formulaText.includes("Israel excluded"),
  "Formula markdown does not match the current public tier rule set.",
);

assert(
  pdfText.includes("methodologyFacts") &&
  pdfText.includes("rule_snapshot") &&
  pdfText.includes("maxTaiwanAcrossPublicTiers") &&
  pdfText.includes("maxJapanAcrossPublicTiers") &&
  pdfText.includes("alphaCityExclusions") &&
  pdfText.includes("alphaCountryExclusions") &&
  pdfText.includes("excluded from Alpha"),
  "PDF generator is not sourcing tier/methodology facts from the live publication payload.",
);

const ruleSnapshot = publication.methodologyFacts?.ruleSnapshot ?? {};
assert(
  ruleSnapshot.alphaMinCommunity === PUBLIC_TIER_RULES.alphaMinCommunity &&
  ruleSnapshot.alphaMinPressure === PUBLIC_TIER_RULES.alphaMinPressure &&
  ruleSnapshot.betaMinCommunity === PUBLIC_TIER_RULES.betaMinCommunity &&
  ruleSnapshot.betaMinPressure === PUBLIC_TIER_RULES.betaMinPressure &&
  ruleSnapshot.maxEuropeInAlpha === PUBLIC_TIER_RULES.maxEuropeInAlpha &&
  ruleSnapshot.maxOceaniaInAlpha === PUBLIC_TIER_RULES.maxOceaniaInAlpha &&
  ruleSnapshot.maxTaiwanAcrossPublicTiers === PUBLIC_TIER_RULES.maxTaiwanAcrossPublicTiers &&
  (ruleSnapshot.maxJapanAcrossPublicTiers ?? 1) === (PUBLIC_TIER_RULES.maxJapanAcrossPublicTiers ?? 1) &&
  ruleSnapshot.maxSouthKoreaInAlpha === PUBLIC_TIER_RULES.maxSouthKoreaInAlpha &&
  ruleSnapshot.maxJapanInAlpha === PUBLIC_TIER_RULES.maxJapanInAlpha &&
  JSON.stringify(ruleSnapshot.alphaCountryExclusions ?? []) === JSON.stringify(PUBLIC_TIER_RULES.alphaCountryExclusions ?? []) &&
  JSON.stringify(ruleSnapshot.alphaCityExclusions ?? []) === JSON.stringify(PUBLIC_TIER_RULES.alphaCityExclusions ?? []),
  "publication.methodologyFacts.ruleSnapshot is out of sync with PUBLIC_TIER_RULES.",
);

const exclusionLiteral = (PUBLIC_TIER_RULES.alphaCountryExclusions ?? []).join(", ");
const exclusionRegex = new RegExp(quotedNumber(exclusionLiteral));
const homeReferencesExclusions =
  exclusionRegex.test(homePageText) || homePageText.includes("PUBLIC_TIER_RULES.alphaCountryExclusions");
assert(
  homeReferencesExclusions,
  "Current Alpha exclusion list is not consistently reflected across methodology sources.",
);
const homeReferencesCityExclusions =
  homePageText.includes("PUBLIC_TIER_RULES.alphaCityExclusions") ||
  (PUBLIC_TIER_RULES.alphaCityExclusions ?? []).every((city) => homePageText.includes(city));
assert(
  homeReferencesCityExclusions,
  "Alpha city-exclusion list (Tokyo) is not surfaced on the homepage.",
);

assert(
  publication.methodologyFacts?.rankedCityCount === publication.cities.filter((city) => city.rankingStatus === "Ranked").length,
  "methodologyFacts.rankedCityCount is out of sync with the published city rows.",
);

assert(
  publication.methodologyFacts?.watchlistCityCount === publication.cities.filter((city) => city.rankingStatus !== "Ranked").length,
  "methodologyFacts.watchlistCityCount is out of sync with the published city rows.",
);

assert(
  publication.diagnostics?.provenance?.observedDataLevelShares != null,
  "Published diagnostics are missing observedDataLevelShares.",
);

if (errors.length > 0) {
  console.error("Methodology drift check failed:");
  for (const message of errors) {
    console.error(`- ${message}`);
  }
  process.exit(1);
}

console.log("Methodology drift check passed.");
