"""
Generate the SLIC methodology technical paper from the live published dataset.

Outputs:
  public/downloads/slic-methodology-technical-paper-en.pdf
  public/downloads/slic-methodology-technical-paper-th.pdf
  public/downloads/slic-methodology-technical-paper-zh.pdf

The current paper is an English master edition written from the live scoring
logic in:

  - scripts/rescore-all-cities.mjs
  - src/data/publishedRankingData.json

Run:
  python3 scripts/generate_methodology_pdf.py
  python3 scripts/generate_methodology_pdf.py en
"""

from __future__ import annotations

import json
import math
import sys
from dataclasses import dataclass
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).parent.parent
CITY_DATA = ROOT / "src" / "data" / "publishedRankingData.json"
OUT_DIR = ROOT / "public" / "downloads"


PILLAR_ORDER = [
    ("Growth", "pressure", 25),
    ("Viability", "viability", 22),
    ("Capability", "capability", 18),
    ("Community", "community", 15),
    ("Creative", "creative", 20),
]


@dataclass(frozen=True)
class MetricDef:
    key: str
    pillar: str
    label: str
    weight: int
    description: str
    inputs: str
    scored: bool = True


SCORED_METRICS = [
    MetricDef(
        "pressure_disposable_income_ppp",
        "pressure",
        "Tax-adjusted PPP disposable income",
        9,
        "Residual money after essentials, converted once through the PPP private-consumption factor.",
        "gross income, tax rate, rent, utilities, transit, internet, food, PPP factor",
    ),
    MetricDef(
        "pressure_housing_burden",
        "pressure",
        "Housing burden",
        5,
        "Housing cost share of income; higher burden scores worse.",
        "rent, gross income",
    ),
    MetricDef(
        "pressure_household_debt_burden",
        "pressure",
        "Household debt burden",
        4,
        "Debt relative to income, with fallback when city debt evidence is thin.",
        "household debt proxy",
    ),
    MetricDef(
        "pressure_working_time_pressure",
        "pressure",
        "Working time pressure",
        4,
        "Higher work burden scores worse.",
        "weekly hours, overwork share",
    ),
    MetricDef(
        "pressure_suicide_mental_strain",
        "pressure",
        "Suicide and severe mental strain",
        3,
        "Public-health strain proxy; higher severe-strain burden scores worse.",
        "suicide rate or equivalent severe-strain proxy",
    ),
    MetricDef(
        "viability_personal_safety",
        "viability",
        "Personal safety",
        5,
        "Harm and victimization outcomes, not surveillance theatre.",
        "homicide, violent harm, victimization",
    ),
    MetricDef(
        "viability_transit_access_commute",
        "viability",
        "Transit access and commute burden",
        5,
        "Better access and lower burden score better.",
        "GTFS, commute time, reach, late-hour usability",
    ),
    MetricDef(
        "viability_clean_air",
        "viability",
        "Clean air",
        4,
        "Higher pollution exposure scores worse.",
        "PM2.5, exceedance, environmental context",
    ),
    MetricDef(
        "viability_water_sanitation_utility",
        "viability",
        "Water, sanitation, and utility reliability",
        4,
        "Safer access and higher reliability score better.",
        "WASH access, utility reliability",
    ),
    MetricDef(
        "viability_digital_infrastructure",
        "viability",
        "Digital infrastructure",
        4,
        "Broadband quality and affordability.",
        "fixed broadband, affordability, internet performance",
    ),
    MetricDef(
        "capability_healthcare_quality",
        "capability",
        "Healthcare quality",
        8,
        "Effective-care quality and access.",
        "avoidable mortality, care outcomes, capacity",
    ),
    MetricDef(
        "capability_education_quality",
        "capability",
        "Education quality",
        6,
        "Learning quality and skills formation.",
        "PISA, tertiary participation, completion, skills pipeline",
    ),
    MetricDef(
        "capability_equal_opportunity_distributional_fairness",
        "capability",
        "Equal opportunity and distributional fairness",
        4,
        "Composite scored metric: 70% equal-opportunity evidence, 30% reversed Gini context.",
        "equal opportunity raw, Gini context",
    ),
    MetricDef(
        "community_hospitality_belonging",
        "community",
        "Hospitality and belonging",
        5,
        "Do people feel welcome in practice?",
        "migration, testimony audit, multilingual usability",
    ),
    MetricDef(
        "community_tolerance_pluralism",
        "community",
        "Tolerance and pluralism",
        5,
        "Composite scored metric: 40% Equaldex, 30% Freedom House, 30% reversed hate-crime or civil-liberties proxy.",
        "Equaldex, Freedom House, hate crime / liberties proxy",
    ),
    MetricDef(
        "community_cultural_historic_public_life_vitality",
        "community",
        "Cultural, historic, and public-life vitality",
        5,
        "Everyday public-life texture; visitor demand is contextual, not an automatic bonus.",
        "events, public life, historic continuity, public attention",
    ),
    MetricDef(
        "creative_entrepreneurial_dynamism",
        "creative",
        "Entrepreneurial dynamism",
        6,
        "Startup formation and productive entry.",
        "new business density, firm formation",
    ),
    MetricDef(
        "creative_innovation_research_intensity",
        "creative",
        "Innovation and research intensity",
        5,
        "Research depth and knowledge production.",
        "patents, R&D, research institutions",
    ),
    MetricDef(
        "creative_economic_vitality_productive_context",
        "creative",
        "Economic vitality and productive context",
        5,
        "Composite scored metric: 50% investment signal, 30% GDP per capita PPP, 20% GDP growth.",
        "investment signal, GDP per capita PPP, GDP growth",
    ),
    MetricDef(
        "creative_administrative_investment_friction",
        "creative",
        "Administrative and investment friction",
        4,
        "Higher time-cost and licensing burden score worse.",
        "administrative friction, permitting burden",
    ),
]


DIAGNOSTIC_METRICS = [
    MetricDef(
        "pressure_economic_growth_momentum",
        "pressure",
        "Economic growth momentum",
        0,
        "Visible diagnostic line; not part of the current aggregate.",
        "GDP growth context",
        scored=False,
    ),
    MetricDef(
        "viability_climate_sunlight_livability",
        "viability",
        "Climate and sunlight livability",
        0,
        "Visible diagnostic line; not part of the current aggregate.",
        "sunshine, temperature comfort, weather exposure",
        scored=False,
    ),
    MetricDef(
        "community_birth_rate_optimism",
        "community",
        "Birth-rate optimism",
        0,
        "Visible diagnostic line; not part of the current aggregate.",
        "total fertility rate or birth-rate proxy",
        scored=False,
    ),
]


METRIC_INDEX = {metric.key: metric for metric in SCORED_METRICS + DIAGNOSTIC_METRICS}
SCORED_COUNT = len(SCORED_METRICS)
DIAGNOSTIC_COUNT = len(DIAGNOSTIC_METRICS)


def load_data():
    return json.loads(CITY_DATA.read_text(encoding="utf-8"))


def styles():
    sample = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "title",
            parent=sample["Title"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=28,
            textColor=colors.HexColor("#1c1914"),
            alignment=TA_CENTER,
            spaceAfter=8,
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            parent=sample["Heading2"],
            fontName="Helvetica",
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#6b6459"),
            alignment=TA_CENTER,
            spaceAfter=18,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=sample["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
            textColor=colors.HexColor("#1c1914"),
            spaceBefore=4,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=sample["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=15,
            textColor=colors.HexColor("#1c1914"),
            spaceBefore=6,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "body",
            parent=sample["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor("#1c1914"),
            spaceAfter=6,
        ),
        "small": ParagraphStyle(
            "small",
            parent=sample["BodyText"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            textColor=colors.HexColor("#6b6459"),
            spaceAfter=4,
        ),
        "mono": ParagraphStyle(
            "mono",
            parent=sample["Code"],
            fontName="Courier",
            fontSize=8,
            leading=10,
            textColor=colors.HexColor("#1c1914"),
            backColor=colors.HexColor("#f6f2ec"),
            borderPadding=6,
            spaceAfter=8,
        ),
        "table": ParagraphStyle(
            "table",
            parent=sample["BodyText"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            textColor=colors.HexColor("#1c1914"),
        ),
        "table_head": ParagraphStyle(
            "table_head",
            parent=sample["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=10,
            textColor=colors.white,
            alignment=TA_LEFT,
        ),
        "table_num": ParagraphStyle(
            "table_num",
            parent=sample["BodyText"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            textColor=colors.HexColor("#1c1914"),
            alignment=TA_RIGHT,
        ),
    }


def paragraph(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(text.replace("\n", "<br/>"), style)


def make_table(rows, col_widths, style_map):
    table = Table(rows, colWidths=col_widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1c1914")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#d8d0c8")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#faf8f5"), colors.white]),
            ]
        )
    )
    return table


def stats(snapshot):
    cities = snapshot["cities"]
    ranked = sorted(
        [city for city in cities if city.get("rankingStatus") == "Ranked"],
        key=lambda city: city["rank"],
    )
    watchlist = [city for city in cities if city.get("rankingStatus") != "Ranked"]

    grade_counts = {"A": 0, "B": 0, "C": 0, "Watchlist": 0}
    for city in cities:
        grade = city.get("coverageGrade") or "Watchlist"
        grade_counts[grade] = grade_counts.get(grade, 0) + 1

    level_counts = {"city": 0, "national": 0, "composite": 0, "derived": 0}
    non_null_metric_lines = 0
    for city in cities:
        for metric in (city.get("metrics") or {}).values():
            if metric.get("score") is None:
                continue
            non_null_metric_lines += 1
            level = metric.get("dataLevel")
            if level in level_counts:
                level_counts[level] += 1

    return {
        "cities": cities,
        "ranked": ranked,
        "watchlist": watchlist,
        "grade_counts": grade_counts,
        "level_counts": level_counts,
        "non_null_metric_lines": non_null_metric_lines,
    }


def level_share(level_counts, total, key):
    if total == 0:
        return 0.0
    return round(level_counts.get(key, 0) * 100 / total, 1)


def worked_example(snapshot, snapshot_stats):
    fact = snapshot.get("methodologyFacts", {}).get("workedExample")
    if fact:
        return fact

    city = next((c for c in snapshot_stats["ranked"] if c["displayName"] == "Kaohsiung"), None)
    if city is None:
        city = snapshot_stats["ranked"][0]

    p = {
        "pressure": city["pressureScore"],
        "viability": city["viabilityScore"],
        "capability": city["capabilityScore"],
        "community": city["communityScore"],
        "creative": city["creativeScore"],
    }

    mu = sum(weight * p[pillar] for _, pillar, weight in PILLAR_ORDER) / 100
    variance = sum(weight * (p[pillar] - mu) ** 2 for _, pillar, weight in PILLAR_ORDER) / 100
    ampi = mu - variance / mu if mu else 0

    safety = city["metrics"]["viability_personal_safety"]
    stat = snapshot["normStats"]["personal_safety_raw"]

    pressure_terms = []
    pressure_den = 0
    for metric in [m for m in SCORED_METRICS if m.pillar == "pressure"]:
        value = city["metrics"].get(metric.key, {}).get("score")
        if value is None:
            continue
        pressure_terms.append(f"{metric.weight}x{value}")
        pressure_den += metric.weight

    return {
        "city": city,
        "mu": mu,
        "variance": variance,
        "ampi": ampi,
        "safety_raw": safety["raw"],
        "safety_p05": stat["p05"],
        "safety_p95": stat["p95"],
        "pressure_formula": " + ".join(pressure_terms),
        "pressure_den": pressure_den,
    }


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#6b6459"))
    canvas.drawString(doc.leftMargin, 10 * mm, "SLIC Index V3 — Methodology Technical Paper (English master edition)")
    canvas.drawRightString(A4[0] - doc.rightMargin, 10 * mm, f"Page {doc.page}")
    canvas.restoreState()


def build_story(snapshot, snapshot_stats):
    s = styles()
    story = []
    updated_at = snapshot.get("updatedAt", "snapshot timestamp unavailable")
    methodology_facts = snapshot.get("methodologyFacts", {})
    example = worked_example(snapshot, snapshot_stats)
    singapore = methodology_facts.get("referenceCities", {}).get("singapore") or next((city for city in snapshot_stats["ranked"] if city.get("displayName") == "Singapore"), None)
    bangkok = methodology_facts.get("referenceCities", {}).get("bangkok") or next((city for city in snapshot_stats["ranked"] if city.get("displayName") == "Bangkok"), None)
    rule_snapshot = methodology_facts.get("ruleSnapshot", {})

    story.append(Spacer(1, 18 * mm))
    story.append(Paragraph("SLIC Index V3", s["title"]))
    story.append(Paragraph("Methodology Technical Paper", s["subtitle"]))
    story.append(Paragraph("English master edition", s["subtitle"]))
    story.append(Paragraph(f"Published snapshot: {updated_at}", s["small"]))
    story.append(Spacer(1, 8 * mm))
    story.append(paragraph(
        "This paper documents the live published SLIC scorer as implemented in "
        "<b>scripts/rescore-all-cities.mjs</b> and written to "
        "<b>src/data/publishedRankingData.json</b>. It replaces earlier draft "
        "descriptions of a 35-indicator anchor model that no longer matches the public dataset.",
        s["body"],
    ))
    story.append(Spacer(1, 4 * mm))

    summary_rows = [
        [paragraph("Snapshot fact", s["table_head"]), paragraph("Value", s["table_head"])],
        [paragraph("Cities in public file", s["table"]), paragraph(str(len(snapshot_stats["cities"])), s["table_num"])],
        [paragraph("Ranked cities", s["table"]), paragraph(str(len(snapshot_stats["ranked"])), s["table_num"])],
        [paragraph("Watchlist cities", s["table"]), paragraph(str(len(snapshot_stats["watchlist"])), s["table_num"])],
        [paragraph("Scored metric lines", s["table"]), paragraph(str(SCORED_COUNT), s["table_num"])],
        [paragraph("Visible non-scoring diagnostics", s["table"]), paragraph(str(DIAGNOSTIC_COUNT), s["table_num"])],
    ]
    story.append(make_table(summary_rows, [95 * mm, 70 * mm], s))
    story.append(PageBreak())

    story.append(Paragraph("1. Published method", s["h1"]))
    story.append(paragraph(
        "SLIC has five public pillars. Within each pillar, observed scored metrics are combined by weighted mean. "
        "Across pillars, the final score uses a weighted AMPI, so cross-pillar imbalance is punished mathematically rather than rhetorically.",
        s["body"],
    ))
    story.append(Preformatted(
        "normalize(x, p05, p95, positive) = 100 * clamp((winsor(x) - p05) / (p95 - p05), 0, 1)\n"
        "normalize(x, p05, p95, negative) = 100 * clamp((p95 - winsor(x)) / (p95 - p05), 0, 1)\n"
        "\n"
        "P_p(c) = sum observed alpha_(p,m) * q_m(c) / sum observed alpha_(p,m)\n"
        "\n"
        "mu(c)  = (25 Pressure + 22 Viability + 18 Capability + 15 Community + 20 Creative) / 100\n"
        "var(c) = (25(Pressure-mu)^2 + 22(Viability-mu)^2 + 18(Capability-mu)^2 +\n"
        "          15(Community-mu)^2 + 20(Creative-mu)^2) / 100\n"
        "AMPI(c) = mu(c) - var(c)/mu(c)\n"
        "SLIC(c) = max(0, AMPI(c) - coverage_penalty(c))",
        s["mono"],
    ))
    story.append(paragraph(
        "The final published score is therefore <b>not</b> a simple weighted average of the displayed pillar scores. "
        "That distinction matters: a city with one catastrophic pillar is supposed to score worse than a city with the same weighted mean but more even performance.",
        s["body"],
    ))

    story.append(Paragraph("2. What is scored", s["h1"]))
    story.append(paragraph(
        f"The current public model scores <b>{SCORED_COUNT}</b> metric lines and keeps "
        f"<b>{DIAGNOSTIC_COUNT}</b> additional metric lines visible as diagnostics only. "
        "Visibility and scoring are intentionally separated.",
        s["body"],
    ))

    for public_name, pillar, weight in PILLAR_ORDER:
        story.append(Paragraph(f"{public_name} ({weight})", s["h2"]))
        rows = [
            [
                paragraph("Metric", s["table_head"]),
                paragraph("Weight", s["table_head"]),
                paragraph("Status", s["table_head"]),
                paragraph("Method note", s["table_head"]),
            ]
        ]
        metrics = [m for m in SCORED_METRICS + DIAGNOSTIC_METRICS if m.pillar == pillar]
        for metric in metrics:
            status = "Scored" if metric.scored else "Diagnostic only"
            rows.append([
                paragraph(metric.label, s["table"]),
                paragraph(str(metric.weight) if metric.weight else "-", s["table_num"]),
                paragraph(status, s["table"]),
                paragraph(metric.description, s["table"]),
            ])
        story.append(make_table(rows, [56 * mm, 14 * mm, 26 * mm, 69 * mm], s))
        story.append(Spacer(1, 2 * mm))

    story.append(PageBreak())

    story.append(Paragraph("3. Composite metrics", s["h1"]))
    story.append(paragraph(
        "Three scored terms are composites. When one component is missing, the composite is reweighted over the observed component weights only; nothing is silently imputed.",
        s["body"],
    ))
    story.append(Preformatted(
        "EqualOpportunityFairness = 0.7 * EqualOpportunity + 0.3 * ReverseGini\n"
        "TolerancePluralism      = 0.4 * Equaldex + 0.3 * FreedomHouse + 0.3 * ReverseHateCrime\n"
        "EconomicVitality        = 0.5 * InvestmentSignal + 0.3 * GDPperCapitaPPP + 0.2 * GDPGrowth",
        s["mono"],
    ))

    story.append(Paragraph("4. Coverage, watchlist logic, and ranking protocol", s["h1"]))
    story.append(Preformatted(
        "cov_direct = 1 if observed else 0\n"
        "cov_composite = observed component weight / total component weight\n"
        "\n"
        "Cov_p(c) = sum alpha_(p,m) * cov_m(c) / sum alpha_(p,m)\n"
        "Cov(c)   = (25 Cov_pressure + 22 Cov_viability + 18 Cov_capability +\n"
        "            15 Cov_community + 20 Cov_creative) / 100",
        s["mono"],
    ))
    coverage_rows = [
        [paragraph("Coverage grade", s["table_head"]), paragraph("Rule", s["table_head"]), paragraph("Penalty", s["table_head"]), paragraph("Rank status", s["table_head"])],
        [paragraph("A", s["table"]), paragraph("Cov >= 0.75", s["table"]), paragraph("0", s["table_num"]), paragraph("Ranked", s["table"])],
        [paragraph("B", s["table"]), paragraph("0.50 <= Cov < 0.75", s["table"]), paragraph("5", s["table_num"]), paragraph("Ranked", s["table"])],
        [paragraph("C", s["table"]), paragraph("0.35 <= Cov < 0.50", s["table"]), paragraph("15", s["table_num"]), paragraph("Ranked", s["table"])],
        [paragraph("Watchlist", s["table"]), paragraph("Cov < 0.35 or manual watchlist override", s["table"]), paragraph("0", s["table_num"]), paragraph("Watchlist", s["table"])],
    ]
    story.append(make_table(coverage_rows, [32 * mm, 84 * mm, 20 * mm, 29 * mm], s))
    story.append(Spacer(1, 3 * mm))
    alpha_country_exclusions = ", ".join(rule_snapshot.get("alphaCountryExclusions", [])) or "none"
    alpha_city_exclusions = ", ".join(rule_snapshot.get("alphaCityExclusions", [])) or "none"
    max_japan_cross_tier = rule_snapshot.get("maxJapanAcrossPublicTiers", 1)
    story.append(paragraph(
        "After score computation, ranked cities receive a pure score rank from the exact unrounded score field: descending SLIC, then deterministic tie-breaks on Community, Pressure, and city label. "
        f"Alpha, Beta, and Gamma are then computed as a separate public overlay. The overlay allows one city per country across all three tiers, except Taiwan may hold {rule_snapshot.get('maxTaiwanAcrossPublicTiers', 2)} public-tier seats and Japan may hold {max_japan_cross_tier} public-tier seats; "
        f"Alpha requires Community >= {rule_snapshot.get('alphaMinCommunity', 40)} and Pressure >= {rule_snapshot.get('alphaMinPressure', 40)}, with Europe capped at {rule_snapshot.get('maxEuropeInAlpha', 2)} Alpha seats, "
        f"Oceania capped at {rule_snapshot.get('maxOceaniaInAlpha', 0)}, South Korea capped at {rule_snapshot.get('maxSouthKoreaInAlpha', 1)}, Japan capped at {rule_snapshot.get('maxJapanInAlpha', 1)}, {alpha_country_exclusions} excluded from Alpha by country, and the editorial city list ({alpha_city_exclusions}) also excluded from Alpha — these cities are barred from Alpha because their median-resident cost-of-living puts them outside SLIC's positive showcase; "
        f"Beta raises the floors to Community >= {rule_snapshot.get('betaMinCommunity', 45)} and Pressure >= {rule_snapshot.get('betaMinPressure', 45)}; Gamma fills from the remaining ranked cities.",
        s["body"],
    ))
    story.append(paragraph(
        "The published JSON snapshot also carries a machine-readable publication manifest, change summary, provenance diagnostics, and a small floor-sensitivity stability analysis so the paper, the dataset, and the audit trail stay aligned.",
        s["body"],
    ))
    if singapore and bangkok:
        story.append(paragraph(
            f"Live example: Singapore is currently pure rank <b>#{singapore['rank']}</b> with SLIC <b>{singapore['slicScore']:.1f}</b>, "
            f"but its Community ({singapore['communityScore']:.1f}) and Pressure ({singapore['pressureScore']:.1f}) place it in <b>{singapore.get('tierLabel') or 'no public tier'}</b>. "
            f"Bangkok is pure rank <b>#{bangkok['rank']}</b> with SLIC <b>{bangkok['slicScore']:.1f}</b>, yet enters <b>{bangkok.get('tierLabel') or 'no public tier'}</b> because "
            f"Community ({bangkok['communityScore']:.1f}) and Pressure ({bangkok['pressureScore']:.1f}) both clear the Alpha floor.",
            s["body"],
        ))

    story.append(Paragraph("5. Worked example from the live dataset", s["h1"]))
    story.append(paragraph(
        f"Example city: <b>{example['displayName'] if 'displayName' in example else example['city']['displayName']}</b>. "
        "This walkthrough uses the published row in the live dataset, not a fictional demonstration.",
        s["body"],
    ))
    story.append(Preformatted(
        f"Negative-direction normalization example (personal safety)\n"
        f"raw = {example['safety']['raw'] if 'safety' in example else example['safety_raw']}\n"
        f"p05 = {example['safety']['p05'] if 'safety' in example else example['safety_p05']}\n"
        f"p95 = {example['safety']['p95'] if 'safety' in example else example['safety_p95']}\n"
        f"score = 100 * ({example['safety']['p95'] if 'safety' in example else example['safety_p95']} - {example['safety']['raw'] if 'safety' in example else example['safety_raw']}) / ({example['safety']['p95'] if 'safety' in example else example['safety_p95']} - {example['safety']['p05'] if 'safety' in example else example['safety_p05']})\n"
        f"score = {example['safety']['scoreRounded'] if 'safety' in example else example['city']['metrics']['viability_personal_safety']['score']}",
        s["mono"],
    ))
    pressure_terms = example.get("pressure", {}).get("terms")
    if pressure_terms:
        pressure_formula = " + ".join(f"{term['weight']}x{term['scoreRounded']:.1f}" for term in pressure_terms)
        pressure_den = example["pressure"]["denominator"]
        pressure_score = example["pressure"]["scoreRounded"]
    else:
        pressure_formula = example["pressure_formula"]
        pressure_den = example["pressure_den"]
        pressure_score = example["city"]["pressureScore"]
    story.append(Preformatted(
        f"Growth weighted mean\n"
        f"Growth = ({pressure_formula}) / {pressure_den}\n"
        f"Growth = {pressure_score}",
        s["mono"],
    ))
    overall = example.get("overall")
    if overall:
        mu = overall["weightedMeanExact"]
        variance = overall["weightedVarianceExact"]
        ampi = overall["ampiExact"]
        coverage = overall["coverageRounded"]
        coverage_grade = overall["coverageGrade"]
        penalty = overall["coveragePenalty"]
        final_score = overall["slicScoreRounded"]
    else:
        mu = example["mu"]
        variance = example["variance"]
        ampi = example["ampi"]
        coverage = example["city"]["overallWeightedCoverage"]
        coverage_grade = example["city"]["coverageGrade"]
        penalty = 0
        final_score = example["city"]["slicScore"]
    story.append(Preformatted(
        f"Cross-pillar AMPI\n"
        f"mu  = {mu:.3f}\n"
        f"var = {variance:.3f}\n"
        f"AMPI = {mu:.3f} - {variance:.3f} / {mu:.3f}\n"
        f"AMPI = {ampi:.3f}\n"
        f"Coverage = {coverage} -> grade {coverage_grade} -> penalty {penalty}\n"
        f"Published SLIC = {final_score}",
        s["mono"],
    ))
    story.append(paragraph(
        "The important methodological point is visible in the arithmetic: the weighted pillar mean for this city is higher than the final score because AMPI makes uneven pillar structure costly.",
        s["body"],
    ))

    story.append(Paragraph("6. Data profile of the current public file", s["h1"]))
    data_rows = [
        [paragraph("Measure", s["table_head"]), paragraph("Value", s["table_head"])],
        [paragraph("City / metro metric share", s["table"]), paragraph(f"{level_share(snapshot_stats['level_counts'], snapshot_stats['non_null_metric_lines'], 'city')}%", s["table_num"])],
        [paragraph("National / international metric share", s["table"]), paragraph(f"{level_share(snapshot_stats['level_counts'], snapshot_stats['non_null_metric_lines'], 'national')}%", s["table_num"])],
        [paragraph("Composite metric share", s["table"]), paragraph(f"{level_share(snapshot_stats['level_counts'], snapshot_stats['non_null_metric_lines'], 'composite')}%", s["table_num"])],
        [paragraph("Derived metric share", s["table"]), paragraph(f"{level_share(snapshot_stats['level_counts'], snapshot_stats['non_null_metric_lines'], 'derived')}%", s["table_num"])],
        [paragraph("Grade A cities", s["table"]), paragraph(str(snapshot_stats["grade_counts"].get("A", 0)), s["table_num"])],
        [paragraph("Grade B cities", s["table"]), paragraph(str(snapshot_stats["grade_counts"].get("B", 0)), s["table_num"])],
        [paragraph("Grade C cities", s["table"]), paragraph(str(snapshot_stats["grade_counts"].get("C", 0)), s["table_num"])],
        [paragraph("Watchlist cities", s["table"]), paragraph(str(len(snapshot_stats["watchlist"])), s["table_num"])],
    ]
    story.append(make_table(data_rows, [95 * mm, 70 * mm], s))
    story.append(paragraph(
        "These shares are computed directly from non-null metric lines in the published JSON. They are included here so the paper does not rely on invented methodology graphics or unsupported source-mix claims.",
        s["body"],
    ))

    story.append(PageBreak())
    story.append(Paragraph("7. Published ranked cities", s["h1"]))
    story.append(paragraph(
        "The table below is the ranked slice of the current published dataset. Watchlist cities are excluded from this list by definition.",
        s["body"],
    ))
    rank_rows = [[
        paragraph("#", s["table_head"]),
        paragraph("City", s["table_head"]),
        paragraph("Country", s["table_head"]),
        paragraph("SLIC", s["table_head"]),
        paragraph("G", s["table_head"]),
        paragraph("V", s["table_head"]),
        paragraph("Cap", s["table_head"]),
        paragraph("Com", s["table_head"]),
        paragraph("Cr", s["table_head"]),
        paragraph("Grade", s["table_head"]),
    ]]
    for city in snapshot_stats["ranked"]:
        rank_rows.append([
            paragraph(str(city["rank"]), s["table"]),
            paragraph(city["displayName"], s["table"]),
            paragraph(city["country"], s["table"]),
            paragraph(f"{city['slicScore']:.1f}", s["table_num"]),
            paragraph(f"{city['pressureScore']:.1f}", s["table_num"]),
            paragraph(f"{city['viabilityScore']:.1f}" if city["viabilityScore"] is not None else "-", s["table_num"]),
            paragraph(f"{city['capabilityScore']:.1f}" if city["capabilityScore"] is not None else "-", s["table_num"]),
            paragraph(f"{city['communityScore']:.1f}" if city["communityScore"] is not None else "-", s["table_num"]),
            paragraph(f"{city['creativeScore']:.1f}" if city["creativeScore"] is not None else "-", s["table_num"]),
            paragraph(city["coverageGrade"], s["table"]),
        ])
    story.append(make_table(rank_rows, [10 * mm, 37 * mm, 30 * mm, 15 * mm, 12 * mm, 12 * mm, 14 * mm, 14 * mm, 12 * mm, 17 * mm], s))

    return story


def build_pdf(locale: str):
    snapshot = load_data()
    snapshot_stats = stats(snapshot)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    output = OUT_DIR / f"slic-methodology-technical-paper-{locale}.pdf"
    doc = SimpleDocTemplate(
        str(output),
        pagesize=A4,
        leftMargin=14 * mm,
        rightMargin=14 * mm,
        topMargin=16 * mm,
        bottomMargin=16 * mm,
        title="SLIC Index V3 — Methodology Technical Paper",
        author="OpenAI Codex",
    )
    doc.build(build_story(snapshot, snapshot_stats), onFirstPage=header_footer, onLaterPages=header_footer)
    print(f"Wrote {output}")


def main():
    targets = sys.argv[1:] or ["en", "th", "zh"]
    for locale in targets:
        build_pdf(locale)


if __name__ == "__main__":
    main()
