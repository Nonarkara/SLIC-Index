import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SEVERITIES = ["critical", "high", "medium", "low", "unknown"];
const TOP_LIMIT = 20;
const SECRET_LIMIT = 30;

const SECRET_TEXT =
  "Secret finding. The matched value is omitted from this report.";

function emptyCounts() {
  return { critical: 0, high: 0, medium: 0, low: 0, unknown: 0, total: 0 };
}

function readJson(file) {
  const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value)}\n`);
}

function relativize(uri) {
  let value = String(uri || "").replace(/\\/g, "/");
  const workspace = String(process.env.GITHUB_WORKSPACE || "").replace(/\\/g, "/");
  if (workspace && value.startsWith(workspace)) {
    value = value.slice(workspace.length);
  }
  value = value.replace(/^file:\/\//, "");
  value = value.replace(/^\.\//, "").replace(/^\/+/, "");
  return value || "(unknown file)";
}

function scrub(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .replace(
      /\b(?:ghp_|github_pat_|gho_|ghu_|ghs_|sk_live_|sk_test_|AKIA|ASIA|xox[baprs]-|eyJ[A-Za-z0-9_-]{8,})[A-Za-z0-9_\-./+=]*/g,
      "[redacted]",
    )
    .replace(/\b[A-Za-z0-9+/]{40,}={0,2}\b/g, "[redacted]")
    .trim();
}

function cell(value) {
  return scrub(value).replace(/\|/g, "\\|").slice(0, 220);
}

function tagsOf(result, rule) {
  return [...(result?.properties?.tags || []), ...(rule?.properties?.tags || [])].map(
    (tag) => String(tag).toLowerCase(),
  );
}

function namedSeverity(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return "";
  if (text === "error") return "high";
  if (text === "warning" || text === "moderate") return "medium";
  if (text === "note" || text === "info" || text === "information") return "low";
  if (text.includes("critical")) return "critical";
  if (text.includes("high")) return "high";
  if (text.includes("medium")) return "medium";
  if (text.includes("low")) return "low";
  return "";
}

function numericSeverity(value) {
  if (typeof value === "number" || (typeof value === "string" && /^[0-9]+(\.[0-9]+)?$/.test(value.trim()))) {
    const score = Number(value);
    if (!Number.isFinite(score)) return "";
    if (score >= 9) return "critical";
    if (score >= 7) return "high";
    if (score >= 4) return "medium";
    if (score > 0) return "low";
  }
  return "";
}

export function severityOf(result, rule) {
  const candidates = [
    result?.properties?.["security-severity"],
    rule?.properties?.["security-severity"],
    result?.properties?.severity,
    rule?.properties?.severity,
  ];
  for (const candidate of candidates) {
    const numeric = numericSeverity(candidate);
    if (numeric) return numeric;
    const named = namedSeverity(candidate);
    if (named) return named;
  }
  const level = namedSeverity(result?.level || rule?.defaultConfiguration?.level);
  return level || "unknown";
}

export function isSecret(result, rule) {
  const tags = tagsOf(result, rule);
  if (tags.includes("vulnerability") || tags.includes("misconfiguration") || tags.includes("license")) {
    return false;
  }
  if (tags.includes("secret") || tags.includes("secrets")) return true;
  if (String(rule?.name || "").toLowerCase() === "secret") return true;
  const id = `${result?.ruleId || ""} ${rule?.id || ""} ${rule?.name || ""}`.toLowerCase();
  if (/(\.secrets\.|secret|credential|private[-_.]?key|api[-_.]?key|hardcoded[-_.]?(password|token|key))/.test(id)) {
    return true;
  }
  const message = String(result?.message?.text || "");
  return /^Artifact:.*\nType:.*\nSecret .*\nSeverity:.*\nMatch:/s.test(message);
}

function ruleIndex(run) {
  const rules = new Map();
  for (const rule of run?.tool?.driver?.rules || []) {
    if (rule?.id) rules.set(rule.id, rule);
  }
  return rules;
}

function locationOf(result) {
  const location = result?.locations?.[0]?.physicalLocation;
  return {
    file: relativize(location?.artifactLocation?.uri),
    line: location?.region?.startLine || "?",
  };
}

function messageOf(result, rule) {
  return (
    result?.message?.text ||
    rule?.shortDescription?.text ||
    rule?.fullDescription?.text ||
    ""
  );
}

function redactMessage(message) {
  if (!message || typeof message !== "object") return;
  message.text = SECRET_TEXT;
  delete message.markdown;
}

export function redactRule(rule) {
  if (!rule || typeof rule !== "object") return;
  if (rule.fullDescription) rule.fullDescription = { text: SECRET_TEXT };
  if (rule.help) rule.help = { text: SECRET_TEXT };
  if (rule.messageStrings && typeof rule.messageStrings === "object") {
    for (const key of Object.keys(rule.messageStrings)) {
      rule.messageStrings[key] = { text: SECRET_TEXT };
    }
  }
  if (rule.shortDescription?.text) {
    const title = scrub(rule.shortDescription.text);
    rule.shortDescription = { text: title && title.length <= 120 ? title : "Secret" };
  }
}

export function redactResult(result) {
  redactMessage(result.message);
  for (const location of [...(result.locations || []), ...(result.relatedLocations || [])]) {
    redactMessage(location?.message);
    const region = location?.physicalLocation?.region;
    const context = location?.physicalLocation?.contextRegion;
    if (region) delete region.snippet;
    if (context) delete context.snippet;
  }
  if (result.properties && typeof result.properties === "object") {
    for (const key of Object.keys(result.properties)) {
      if (key === "security-severity" || key === "tags" || key === "precision") continue;
      result.properties[key] = "[redacted]";
    }
  }
}

function emptySarif(tool) {
  return {
    version: "2.1.0",
    runs: [
      {
        tool: { driver: { name: tool, rules: [] } },
        results: [],
      },
    ],
  };
}

export function loadSarif(file, tool) {
  if (!file || !fs.existsSync(file) || fs.statSync(file).size === 0) {
    const sarif = emptySarif(tool);
    if (file) writeJson(file, sarif);
    return { sarif, note: "No SARIF file was produced. An empty report was written." };
  }
  try {
    const sarif = readJson(file);
    if (!sarif || sarif.version !== "2.1.0" || !Array.isArray(sarif.runs)) {
      throw new Error("not SARIF 2.1.0");
    }
    return { sarif, note: "" };
  } catch {
    const sarif = emptySarif(tool);
    writeJson(file, sarif);
    return { sarif, note: "SARIF output was unreadable. An empty report replaced it." };
  }
}

export function findingsFromSarif(sarif, tool) {
  const findings = [];
  for (const run of sarif.runs || []) {
    const rules = ruleIndex(run);
    const secretRuleIds = new Set();
    for (const result of run.results || []) {
      const rule = rules.get(result.ruleId) || null;
      const secret = isSecret(result, rule);
      if (secret) {
        redactResult(result);
        if (result.ruleId) secretRuleIds.add(result.ruleId);
      }
      const location = locationOf(result);
      findings.push({
        tool,
        severity: severityOf(result, rule),
        secret,
        rule: String(result.ruleId || rule?.id || "unknown-rule"),
        file: location.file,
        line: location.line,
        message: secret ? "" : scrub(messageOf(result, rule)).slice(0, 300),
      });
    }
    for (const rule of run?.tool?.driver?.rules || []) {
      if (secretRuleIds.has(rule?.id)) redactRule(rule);
    }
  }
  return findings;
}

function countOf(findings) {
  const counts = emptyCounts();
  for (const finding of findings) {
    const severity = SEVERITIES.includes(finding.severity) ? finding.severity : "unknown";
    counts[severity] += 1;
    counts.total += 1;
  }
  return counts;
}

function dedupe(findings) {
  const seen = new Set();
  const unique = [];
  for (const finding of findings) {
    const key = [finding.tool, finding.file, finding.line, finding.rule, finding.secret].join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(finding);
  }
  return unique;
}

function rank(finding) {
  const severity = SEVERITIES.indexOf(finding.severity);
  return severity === -1 ? SEVERITIES.length : severity;
}

export function buildReport(toolFindings, notes) {
  const tools = {};
  const all = [];
  for (const [tool, findings] of Object.entries(toolFindings)) {
    const unique = dedupe(findings);
    tools[tool] = { counts: countOf(unique), findings: unique };
    all.push(...unique);
  }
  all.sort((a, b) => rank(a) - rank(b) || a.file.localeCompare(b.file) || String(a.line).localeCompare(String(b.line), undefined, { numeric: true }));
  const criticalHigh = all.filter((finding) => finding.severity === "critical" || finding.severity === "high");
  const secrets = all.filter((finding) => finding.secret);
  return {
    notes,
    tools,
    totals: countOf(all),
    criticalHigh,
    secrets,
  };
}

function countRow(label, counts) {
  return `| ${label} | ${counts.critical} | ${counts.high} | ${counts.medium} | ${counts.low} | ${counts.unknown} | ${counts.total} |`;
}

export function renderMarkdown(report) {
  const lines = [
    "## Security scan summary",
    "",
    "Report only. Findings do not fail this job. Secret values are not printed.",
    "",
    "| Tool | Critical | High | Medium | Low | Unknown | Total |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];
  for (const [tool, detail] of Object.entries(report.tools)) {
    lines.push(countRow(tool, detail.counts));
  }
  lines.push(countRow("Total", report.totals));
  lines.push("");
  for (const note of report.notes.filter(Boolean)) lines.push(`- ${note}`);
  if (report.notes.filter(Boolean).length) lines.push("");

  lines.push(`### Critical and high findings (${report.criticalHigh.length})`);
  lines.push("");
  if (!report.criticalHigh.length) {
    lines.push("No critical or high findings.");
  } else {
    lines.push("| Severity | Tool | Location | Rule | Detail |");
    lines.push("| --- | --- | --- | --- | --- |");
    for (const finding of report.criticalHigh.slice(0, TOP_LIMIT)) {
      const detail = finding.secret ? "Secret match. Value omitted." : cell(finding.message || "See the rule.");
      lines.push(
        `| ${finding.severity} | ${cell(finding.tool)} | ${cell(`${finding.file}:${finding.line}`)} | ${cell(finding.rule)} | ${detail} |`,
      );
    }
    if (report.criticalHigh.length > TOP_LIMIT) {
      lines.push("");
      lines.push(`Showing ${TOP_LIMIT} of ${report.criticalHigh.length} critical and high findings.`);
    }
  }
  lines.push("");
  lines.push(`### Secrets (${report.secrets.length})`);
  lines.push("");
  if (!report.secrets.length) {
    lines.push("No secret findings.");
  } else {
    lines.push("File, line, and rule only.");
    lines.push("");
    lines.push("| Location | Rule |");
    lines.push("| --- | --- |");
    for (const finding of report.secrets.slice(0, SECRET_LIMIT)) {
      lines.push(`| ${cell(`${finding.file}:${finding.line}`)} | ${cell(finding.rule)} |`);
    }
    if (report.secrets.length > SECRET_LIMIT) {
      lines.push("");
      lines.push(`Showing ${SECRET_LIMIT} of ${report.secrets.length} secret findings.`);
    }
  }
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function capResults(sarif) {
  const maxResults = 4000;
  for (const run of sarif.runs || []) {
    if ((run.results || []).length <= maxResults) continue;
    const rules = ruleIndex(run);
    const ranked = run.results.map((result, index) => ({
      result,
      index,
      rank: SEVERITIES.indexOf(severityOf(result, rules.get(result.ruleId) || null)),
    }));
    ranked.sort((a, b) => (a.rank === -1 ? 99 : a.rank) - (b.rank === -1 ? 99 : b.rank) || a.index - b.index);
    run.results = ranked.slice(0, maxResults).sort((a, b) => a.index - b.index).map((item) => item.result);
  }
}

export function summarize(files) {
  const notes = [];
  const toolFindings = {};
  for (const { file, tool } of files) {
    const loaded = loadSarif(file, tool);
    if (loaded.note) notes.push(`${tool}: ${loaded.note}`);
    toolFindings[tool] = findingsFromSarif(loaded.sarif, tool);
    capResults(loaded.sarif);
    if (file) writeJson(file, loaded.sarif);
  }
  const report = buildReport(toolFindings, notes);
  const markdown = renderMarkdown(report);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
  }
  fs.writeFileSync("security-summary.json", `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(markdown);
  return report;
}

function main() {
  const files = [
    { file: process.argv[2] || "semgrep.sarif", tool: "semgrep" },
    { file: process.argv[3] || "trivy.sarif", tool: "trivy" },
  ];
  try {
    summarize(files);
  } catch (error) {
    const markdown = `## Security scan summary\n\nThe summary step hit an error and continued so the job can stay report-only.\n`;
    if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
    process.stdout.write(markdown);
    process.stderr.write(`${error?.name || "Error"}\n`);
  }
}

const entry = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (import.meta.url === entry) main();
