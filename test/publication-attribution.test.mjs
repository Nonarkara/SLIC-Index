import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { slicProfileData } from "../src/slicProfileData.ts";
import { compareTranslations } from "../src/compareRankingsTranslations.ts";

const locales = ["en", "th", "zh", "ko", "ja"];
const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");

// Check claim-bearing fields and concepts, not a snapshot of the prose.
const terms = {
  en: { independent: "independent", two: "two-person", support: "in-kind", credit: "project credits", absent: "have not been supplied", weights: "weights", proxy: "proxies", limit: "does not guarantee", budget: "household budget", edition: "another year or region", unverified: "not established here", affordability: "affordability" },
  th: { independent: "อิสระ", two: "สองคน", support: "ไม่ใช่ตัวเงิน", credit: "โครงการให้เครดิต", absent: "ยังไม่มีเอกสาร", weights: "น้ำหนัก", proxy: "ตัวแทนระดับประเทศ", limit: "ไม่ได้รับประกัน", budget: "งบครัวเรือน", edition: "อีกปีหรือภูมิภาค", unverified: "ยังไม่ได้ยืนยัน", affordability: "ความสามารถในการจ่าย" },
  zh: { independent: "独立", two: "两位", support: "实物支持", credit: "项目将", absent: "尚未收到", weights: "权重", proxy: "代理数据", limit: "并不保证", budget: "家庭预算", edition: "其他年份或地区", unverified: "未核实", affordability: "负担能力" },
  ko: { independent: "독립", two: "두 연구자", support: "현물 지원", credit: "프로젝트는", absent: "아직 제공되지", weights: "가중치", proxy: "대리 지표", limit: "보장하지", budget: "가계 예산", edition: "다른 연도나 지역", unverified: "확인되지", affordability: "부담 능력" },
  ja: { independent: "独立", two: "二人", support: "現物支援", credit: "プロジェクトは", absent: "まだ提供されていません", weights: "ウェイト", proxy: "代理指標", limit: "保証しません", budget: "家計簿", edition: "別の年や地域", unverified: "確認していません", affordability: "負担可能性" },
};

const retiredClaims = {
  en: ["commissioned and governed jointly", "funds the index publication", "ensures the index is anchored in independent academic review", "turns the mandate into"],
  th: ["ถูกมอบหมายและกำกับดูแลร่วมกัน", "สนับสนุนทุนการเผยแพร่ดัชนี", "รากวิชาการที่ผ่านการทบทวนอย่างอิสระ", "เปลี่ยนภารกิจให้กลายเป็น"],
  zh: ["双方共同委托与治理", "资助指数发布", "确保指数锚定于独立学术评审", "把授权变成"],
  ko: ["공동으로 위탁하고 운영", "인덱스 발행을 지원하며", "독립적인 학술 검토를 통해", "공공 위임 사항을"],
  ja: ["共同で委託・運営", "インデックスの発行を資金援助", "独立した学術審査によって", "公共の使命を実際に"],
};

function includes(text, fragment, label) {
  assert.ok(text.includes(fragment), `${label}: missing concept ${fragment}`);
}

function checkAttribution(profile, locale) {
  const t = terms[locale];
  includes(profile.title, t.independent, `${locale} publication identity`);
  includes(profile.title, t.two, `${locale} researcher count`);
  includes(profile.leadsSummary, t.absent, `${locale} agency-record limit`);
  for (const card of profile.leads) {
    includes(card.body, t.support, `${locale} ${card.name} support scope`);
    includes(card.body, t.credit, `${locale} ${card.name} project attribution`);
  }
  for (const concept of [t.weights, t.proxy, t.limit]) {
    includes(profile.techSummary, concept, `${locale} model limitations`);
  }
  const claims = [profile.title, profile.intro, ...profile.summary,
    profile.leadsSummary, ...profile.leads.map((c) => c.body),
    profile.privateSummary, profile.privatePartner.body, profile.publicationSummary].join("\n");
  for (const claim of retiredClaims[locale]) {
    assert.ok(!claims.includes(claim), `${locale}: retired authority claim: ${claim}`);
  }
}

test("all five locales identify independent researchers and bounded agency support", () => {
  assert.deepEqual(Object.keys(slicProfileData), locales);
  for (const locale of locales) {
    const p = slicProfileData[locale];
    checkAttribution(p, locale);
    assert.deepEqual(p.leads.map((c) => c.name), ["DEPA", "PMU-A"]);
    assert.deepEqual(p.techPartners.map((c) => c.name), ["Axiom", "ReTL"]);
    assert.equal(p.privatePartner.name, "SLIC");
    for (const card of [...p.leads, p.privatePartner, ...p.techPartners]) {
      assert.ok(card.logoSrc, `${locale} ${card.name} mark retained`);
      assert.ok(card.body.length > 40, `${locale} ${card.name} content retained`);
    }
    includes(p.intro, "DEPA", `${locale} agency credit`);
    includes(p.intro, "PMU-A", `${locale} agency credit`);
    includes(p.intro, locale === "th" ? "ดร.นน อัครประเสริฐกุล" : "Non Arkaraprasertkul", `${locale} author`);
    includes(p.intro, "Poon Thiengburanathum", `${locale} coauthor`);
  }
});

test("attribution checks reject reintroduced authority claims in every locale", () => {
  for (const locale of locales) {
    for (const claim of retiredClaims[locale]) {
      const mutated = structuredClone(slicProfileData[locale]);
      mutated.leads[0].body += ` ${claim}`;
      assert.throws(() => checkAttribution(mutated, locale), /retired authority claim/);
    }
  }
});

const retiredPriceClaims = {
  en: "high prices = high score",
  th: "ราคาสูง = คะแนนสูง",
  zh: "高房价 = 高评分",
  ko: "높은 가격 = 높은 점수",
  ja: "価格が高い＝スコアが高い",
};

function checkResonance(profile, locale) {
  const t = terms[locale];
  includes(profile.methodology.actualMeasure[locale], "2025", `${locale} edition`);
  includes(profile.methodology.actualMeasure[locale], t.affordability, `${locale} housing measure`);
  includes(profile.methodology.actualMeasure[locale], t.budget, `${locale} scope of comparison`);
  includes(profile.methodology.actualMeasure[locale], t.unverified, `${locale} weight uncertainty`);
  includes(profile.critique.body[locale], "2025", `${locale} critique edition`);
  includes(profile.critique.body[locale], t.edition, `${locale} current-page caveat`);
  const text = JSON.stringify(profile);
  assert.ok(!text.includes(retiredPriceClaims[locale]), `${locale}: retired price mechanism`);
  // Numbeo is a housing input, not an attributed academic verdict in this critique.
  assert.ok(!profile.critique.body[locale].includes("Numbeo"), `${locale}: unrelated Numbeo verdict`);
}

test("Resonance critique distinguishes the 2025 edition, affordability and unverified weights", () => {
  for (const locale of locales) checkResonance(compareTranslations.resonance, locale);
});

test("comparison checks reject the retired price mechanism and pasted Numbeo verdict", () => {
  for (const locale of locales) {
    const price = structuredClone(compareTranslations.resonance);
    price.methodology.dataInputs[locale].push(retiredPriceClaims[locale]);
    assert.throws(() => checkResonance(price, locale), /retired price mechanism/);
    const quote = structuredClone(compareTranslations.resonance);
    quote.critique.body[locale] += " Numbeo";
    assert.throws(() => checkResonance(quote, locale), /unrelated Numbeo verdict/);
  }
});

test("README avoids a transparency-first claim and discloses five locales with fallbacks", () => {
  assert.doesNotMatch(readme, /SLIC is the first city ranking/i);
  const localeStatement = readme.split("\n").find((line) => line.startsWith("The site offers"));
  assert.ok(localeStatement, "README needs a locale availability statement");
  for (const language of ["English", "Thai", "Chinese", "Korean", "Japanese"]) {
    includes(localeStatement, language, "README locales");
  }
  includes(localeStatement, "five", "README locale count");
  includes(localeStatement, "fall back to English", "README long-form limitation");
  assert.doesNotMatch(readme, /Every piece of core copy/);
});
