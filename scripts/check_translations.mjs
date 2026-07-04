import fs from "node:fs";
import path from "node:path";

const SRC_DIR = "src";
const SOURCE_FILES = fs
  .readdirSync(SRC_DIR)
  .filter((file) => file.endsWith(".ts") || file.endsWith(".tsx"));

const ALLOWED_DUPLICATE_T_LITERALS = new Set([
  "ALPHA",
  "BETA",
  "GAMMA",
  "CEA Creative Excellence Awards",
  "CEA Creative Technology Award",
  "CEA Creative Advocacy Award",
  "DEmark — System Service & Digital Platform",
  "MasterCard GDCI 2019",
  "Red Dot Award · Brands & Communication Design",
  "Red Dot Brands & Communication — Editorial Design",
  "SLIC 2026",
  "TFR 2023",
]);

const exactTermChecks = [
  {
    pattern: /capability:\s*"ケイパビリティ"/,
    message: "Japanese Capability pillar should use 能力, not ケイパビリティ.",
  },
  {
    pattern: /creative:\s*"クリエイティブ"/,
    message: "Japanese Creative pillar should use 創造性, not クリエイティブ.",
  },
  {
    pattern: /ja:\s*(?:"[^"]*宜居性[^"]*"|`[^`]*宜居性[^`]*`)/,
    message: "Japanese copy should not use the Chinese term 宜居性.",
  },
  {
    pattern: /生活可能性/,
    message: "Japanese Viability/livability copy should use 生活持続性, not 生活可能性.",
  },
  {
    pattern: /ko:\s*(?:"[^"]*합리적인 가격[^"]*"|`[^`]*합리적인 가격[^`]*`)/,
    message: "Korean affordable copy should avoid 합리적인 가격 when the intended meaning is affordability.",
  },
];

const issues = [];

function lineNumber(content, index) {
  return content.slice(0, index).split("\n").length;
}

function checkDuplicatedCoreTranslations(file, content) {
  const patterns = [
    /t\(\s*locale\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"/g,
    /t\(\s*locale\s*,\s*`([^`]+)`\s*,\s*`([^`]+)`\s*,\s*`([^`]+)`/g,
  ];

  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      const [, en, th, zh] = match;
      if (ALLOWED_DUPLICATE_T_LITERALS.has(en)) {
        continue;
      }

      if (en === th || en === zh) {
        issues.push(
          `${file}:${lineNumber(content, match.index ?? 0)} duplicated core translation in t(): "${en}"`,
        );
      }
    }
  }
}

function checkNativeRegisterTerms(file, content) {
  for (const check of exactTermChecks) {
    const match = check.pattern.exec(content);
    if (match) {
      issues.push(`${file}:${lineNumber(content, match.index)} ${check.message}`);
    }
  }
}

for (const file of SOURCE_FILES) {
  const content = fs.readFileSync(path.join(SRC_DIR, file), "utf8");
  checkDuplicatedCoreTranslations(file, content);
  checkNativeRegisterTerms(file, content);
}

if (issues.length > 0) {
  console.error("Translation checks failed:");
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log("Translation checks passed.");
