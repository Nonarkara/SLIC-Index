"""
SLIC Index V3 — Methodology Technical Paper generator
Produces: public/downloads/slic-methodology-technical-paper-en.pdf

Run from project root:
    python3 scripts/generate_methodology_pdf.py
"""

from __future__ import annotations
import json
import math
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

# ── Paths ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent.parent
OUTPUT = ROOT / "public" / "downloads" / "slic-methodology-technical-paper-en.pdf"
CITY_DATA = ROOT / "src" / "data" / "publishedRankingData.json"

# ── Brand palette ─────────────────────────────────────────────────────────────
C_TEXT     = colors.HexColor("#1c1914")
C_ACCENT   = colors.HexColor("#b85c28")
C_MUTED    = colors.HexColor("#6b6459")
C_FAINT    = colors.HexColor("#9a9088")
C_BG_HEAD  = colors.HexColor("#f0ebe3")
C_BG_ALT   = colors.HexColor("#faf8f5")
C_RULE     = colors.HexColor("#d8d0c8")
C_WHITE    = colors.white
C_GROWTH   = colors.HexColor("#b85c28")
C_VIAB     = colors.HexColor("#1a6b5a")
C_CAP      = colors.HexColor("#2a5a8c")
C_COMM     = colors.HexColor("#8c4a2a")
C_CREAT    = colors.HexColor("#a0382a")

# Pillar accent colours for chapter headings
PILLAR_COLORS = {
    "Growth":     C_GROWTH,
    "Viability":  C_VIAB,
    "Capability": C_CAP,
    "Community":  C_COMM,
    "Creative":   C_CREAT,
}


# ── Styles ────────────────────────────────────────────────────────────────────
def make_styles() -> dict:
    base = getSampleStyleSheet()
    S = {}

    def add(name, **kw):
        parent = kw.pop("parent", base["BodyText"])
        S[name] = ParagraphStyle(name=name, parent=parent, **kw)

    add("Cover1",
        fontSize=32, leading=38, fontName="Helvetica-Bold",
        textColor=C_TEXT, alignment=TA_LEFT, spaceBefore=0, spaceAfter=6)

    add("Cover2",
        fontSize=14, leading=20, fontName="Helvetica",
        textColor=C_ACCENT, alignment=TA_LEFT, spaceAfter=4)

    add("CoverMeta",
        fontSize=9, leading=13, fontName="Helvetica",
        textColor=C_MUTED, alignment=TA_LEFT, spaceAfter=2)

    add("ChapterNum",
        fontSize=10, leading=13, fontName="Helvetica-Bold",
        textColor=C_ACCENT, spaceBefore=10, spaceAfter=2)

    add("ChapterTitle",
        fontSize=18, leading=24, fontName="Helvetica-Bold",
        textColor=C_TEXT, spaceBefore=0, spaceAfter=8)

    add("SectionHead",
        fontSize=12, leading=16, fontName="Helvetica-Bold",
        textColor=C_TEXT, spaceBefore=12, spaceAfter=6)

    add("Body",
        fontSize=9.5, leading=14, fontName="Helvetica",
        textColor=C_TEXT, spaceAfter=6)

    add("BodySmall",
        fontSize=8.5, leading=12.5, fontName="Helvetica",
        textColor=C_TEXT, spaceAfter=4)

    add("Lead",
        fontSize=11, leading=16, fontName="Helvetica",
        textColor=C_TEXT, spaceAfter=8)

    add("Mono",
        fontSize=8.5, leading=12, fontName="Courier",
        textColor=C_TEXT, spaceAfter=4)

    add("MonoFormula",
        fontSize=9, leading=13.5, fontName="Courier",
        textColor=C_TEXT, spaceBefore=6, spaceAfter=6,
        backColor=colors.HexColor("#f3ede5"),
        borderColor=C_RULE, borderWidth=0.4, borderPadding=(6, 8, 6, 8),
        leftIndent=0)

    add("Caption",
        fontSize=8, leading=11, fontName="Helvetica-Oblique",
        textColor=C_FAINT, spaceAfter=4)

    add("TableHead",
        fontSize=8, leading=11, fontName="Helvetica-Bold",
        textColor=C_TEXT, alignment=TA_LEFT)

    add("TableBody",
        fontSize=8, leading=11, fontName="Helvetica",
        textColor=C_TEXT, alignment=TA_LEFT)

    add("TableBodyR",
        fontSize=8, leading=11, fontName="Helvetica",
        textColor=C_TEXT, alignment=TA_RIGHT)

    add("TableBodyC",
        fontSize=8, leading=11, fontName="Helvetica",
        textColor=C_TEXT, alignment=TA_CENTER)

    add("PillarLabel",
        fontSize=9, leading=12, fontName="Helvetica-Bold",
        textColor=C_ACCENT, spaceBefore=6, spaceAfter=2)

    add("ExecBullet",
        fontSize=9.5, leading=14, fontName="Helvetica",
        textColor=C_TEXT, spaceAfter=3, leftIndent=12, bulletIndent=0)

    return S


# ── Table helpers ─────────────────────────────────────────────────────────────
def hdr_style(bg=None):
    bg = bg or C_BG_HEAD
    return TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), bg),
        ("FONTNAME",   (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",   (0, 0), (-1, -1), 8),
        ("LEADING",    (0, 0), (-1, -1), 11),
        ("GRID",       (0, 0), (-1, -1), 0.3, C_RULE),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN",     (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [C_WHITE, C_BG_ALT]),
    ])


def anchor_table(S, rows, pillar_color=None):
    """Five-column anchor table: Raw value → Score"""
    bg = pillar_color or C_BG_HEAD
    header = [
        Paragraph("Raw value", S["TableHead"]),
        Paragraph("Score", S["TableHead"]),
    ]
    body = [
        [Paragraph(str(r[0]), S["TableBodyR"]), Paragraph(str(r[1]), S["TableBodyC"])]
        for r in rows
    ]
    t = Table([header] + body, colWidths=[60 * mm, 30 * mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), bg),
        ("FONTNAME",   (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",   (0, 0), (-1, -1), 8),
        ("LEADING",    (0, 0), (-1, -1), 11),
        ("GRID",       (0, 0), (-1, -1), 0.3, C_RULE),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("ALIGN",      (0, 0), (-1, -1), "LEFT"),
        ("ALIGN",      (1, 0), (1, -1), "CENTER"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [C_WHITE, C_BG_ALT]),
    ]))
    return t


def indicator_block(S, code, name, unit, direction, source, anchor_rows, pillar_color, note=None):
    """Render one indicator: header + anchor table, kept together."""
    dir_label = "↑ Higher is better" if direction == "higher" else "↓ Lower is better"
    items = [
        Paragraph(f"<b>{code} — {name}</b>", S["SectionHead"]),
        Paragraph(
            f"Unit: {unit} &nbsp;·&nbsp; Direction: {dir_label} &nbsp;·&nbsp; Source: {source}",
            S["Caption"]
        ),
    ]
    if note:
        items.append(Paragraph(note, S["BodySmall"]))
    items.append(anchor_table(S, anchor_rows, pillar_color))
    items.append(Spacer(1, 4 * mm))
    return KeepTogether(items)


# ── Header / Footer ───────────────────────────────────────────────────────────
def draw_header_footer(canvas, doc):
    canvas.saveState()
    page_w, page_h = A4
    y_foot = 10 * mm
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(C_FAINT)
    canvas.drawString(doc.leftMargin, y_foot, "SLIC Index V3 — Methodology Technical Paper")
    if canvas.getPageNumber() > 1:
        canvas.drawRightString(page_w - doc.rightMargin, y_foot, f"Page {canvas.getPageNumber()}")
    # top rule
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.3)
    canvas.line(doc.leftMargin, page_h - 12 * mm, page_w - doc.rightMargin, page_h - 12 * mm)
    canvas.restoreState()


# ── City data ─────────────────────────────────────────────────────────────────
def _fmt(v):
    return f"{v:.1f}" if v is not None else "—"


def load_cities():
    with open(CITY_DATA) as f:
        data = json.load(f)
    cities = [c for c in data["cities"] if c.get("rankingStatus") == "Ranked"]
    cities.sort(key=lambda c: c["rank"])
    return cities


# ── Story assembly ────────────────────────────────────────────────────────────
def build_story(S):
    story = []
    cities = load_cities()

    # ── COVER ──────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 28 * mm))
    story.append(Paragraph("SLIC Index V3", S["Cover1"]))
    story.append(Paragraph("Methodology Technical Paper", S["Cover2"]))
    story.append(Spacer(1, 6 * mm))
    story.append(HRFlowable(width="100%", thickness=1, color=C_ACCENT, spaceAfter=6 * mm))
    story.append(Paragraph("April 2026", S["CoverMeta"]))
    story.append(Paragraph("Authors: Non Arkara · Assoc. Prof. Poon Thiengburanathum", S["CoverMeta"]))
    story.append(Paragraph("Published by SLIC and ReTL (The Reason to Live Company)", S["CoverMeta"]))
    story.append(Paragraph("In partnership with DEPA Thailand and PMU-A", S["CoverMeta"]))
    story.append(Spacer(1, 12 * mm))
    story.append(Paragraph(
        "This paper documents the complete scoring methodology for the SLIC Index V3: "
        "indicator definitions, normalization anchor tables, aggregation formula, "
        "coverage grades, and the full published rankings for 157 cities.",
        S["Body"]
    ))
    story.append(PageBreak())

    # ── EXECUTIVE SUMMARY ─────────────────────────────────────────────────────
    story.append(Paragraph("Executive Summary", S["ChapterTitle"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=4 * mm))
    story.append(Paragraph(
        "The Smart and Liveable Cities Index (SLIC) V3 is a transparent, open-source city "
        "ranking system measuring quality of life for people in the process of building lives — "
        "not tourists, not expats on hardship pay, not global capital seeking returns. "
        "It covers 157 published cities across all inhabited regions, scored on 35 indicators "
        "grouped into five pillars.", S["Lead"]
    ))
    story.append(Paragraph("<b>Five pillars:</b>", S["SectionHead"]))
    pillar_rows = [
        ("Growth", "25%", "Economic dynamism, disposable income, startup density, civic freedom"),
        ("Viability", "22%", "Safety, air quality, healthcare, housing affordability, water access"),
        ("Capability", "18%", "Transit, digital infrastructure, education, renewable energy, walkability"),
        ("Community", "15%", "Tolerance, LGBTQ+ rights, gender equality, social trust, income inequality"),
        ("Creative", "20%", "Cultural venues, culinary diversity, arts funding, creative employment"),
    ]
    pillar_hdr = [Paragraph(h, S["TableHead"]) for h in ["Pillar", "Weight", "What it measures"]]
    pillar_body = [[Paragraph(r[0], S["TableBody"]), Paragraph(r[1], S["TableBodyC"]), Paragraph(r[2], S["TableBody"])] for r in pillar_rows]
    t = Table([pillar_hdr] + pillar_body, colWidths=[38 * mm, 18 * mm, 110 * mm], repeatRows=1)
    t.setStyle(hdr_style())
    story.append(t)
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph("<b>Absolute scoring philosophy:</b>", S["SectionHead"]))
    for point in [
        "All indicators are normalized against fixed absolute benchmarks — adding city #501 never changes any existing score.",
        "Higher normalized scores always mean better urban outcomes; harmful indicators are reverse-scored inside the normalization step.",
        "The Adjusted Mazziotta–Pareto Index (AMPI) aggregation formula penalizes pillar imbalance: a city with one excellent pillar and four poor ones scores lower than a city with five moderate pillars.",
        "Missing data is never imputed. Cities with fewer than the minimum required indicators receive a coverage penalty (−5 or −15 points) and a visible grade flag.",
        "Every source is named. Every score is traceable back to a raw data point, a normalization function, and a published source.",
    ]:
        story.append(ListFlowable([ListItem(Paragraph(point, S["Body"]))],
                                  bulletType="bullet", leftIndent=14))
    story.append(PageBreak())

    # ── CHAPTER 1: SCORING FRAMEWORK ─────────────────────────────────────────
    story.append(Paragraph("1.", S["ChapterNum"]))
    story.append(Paragraph("Scoring Framework", S["ChapterTitle"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=4 * mm))

    story.append(Paragraph("1.1 Piecewise Linear Normalization", S["SectionHead"]))
    story.append(Paragraph(
        "Each raw metric value is mapped to a 0–100 score using a fixed set of absolute anchor points. "
        "Between anchor points, scores are linearly interpolated. Values beyond the outer anchors are "
        "clamped to 0 or 100. For lower-is-better indicators the anchor mapping is reversed so that "
        "lower raw values produce higher normalized scores.", S["Body"]
    ))
    story.append(Preformatted(
        "s_m(c) = piecewise_linear(x_m(c), [(t_0, 0), (t_1, 25), (t_2, 50), (t_3, 75), (t_4, 100)])\n"
        "\n"
        "Where:\n"
        "  x_m(c)   = raw metric value for city c on metric m\n"
        "  t_0..t_4 = fixed absolute anchor thresholds (see indicator chapters)\n"
        "  s_m(c)   = normalized metric score, clamped to [0, 100]",
        S["MonoFormula"]
    ))

    story.append(Paragraph("1.2 Pillar Aggregation (AMPI)", S["SectionHead"]))
    story.append(Paragraph(
        "Within each pillar, constituent metric scores are aggregated using the Adjusted "
        "Mazziotta–Pareto Index (AMPI). The AMPI penalizes uneven performance: a city with "
        "high variance across its metrics scores lower than one with similar mean but lower variance. "
        "This makes it impossible to compensate for a catastrophic metric score by excelling elsewhere.", S["Body"]
    ))
    story.append(Preformatted(
        "μ    = (1/n) × Σ s_m(c)                 [arithmetic mean of metric scores]\n"
        "σ    = √((1/n) × Σ (s_m(c) − μ)²)       [population standard deviation]\n"
        "cv   = σ / μ                              [coefficient of variation]\n"
        "\n"
        "AMPI = μ − (σ × cv)  =  μ − σ²/μ\n"
        "\n"
        "pillar_score = max(0, AMPI − coverage_penalty)",
        S["MonoFormula"]
    ))

    story.append(Paragraph("1.3 Overall SLIC Score", S["SectionHead"]))
    story.append(Preformatted(
        "SLIC(c) = AMPI applied across five pillar scores\n"
        "\n"
        "μ_p  = (G×0.25 + V×0.22 + Cap×0.18 + Com×0.15 + Cr×0.20) / 1.00\n"
        "     = weighted mean of five pillar scores\n"
        "\n"
        "Then AMPI(μ_p, σ_p) is applied once more to penalise\n"
        "cities with extreme pillar imbalance.",
        S["MonoFormula"]
    ))

    story.append(Paragraph("1.4 PPP-Adjusted Disposable Income (DI_PPP)", S["SectionHead"]))
    story.append(Paragraph(
        "The signature SLIC metric. Measures residual monthly income after all essential costs, "
        "converted to PPP-adjusted USD so cities in different economic contexts are comparable.", S["Body"]
    ))
    story.append(Preformatted(
        "DI_PPP(c) = [\n"
        "    GrossIncome(c) × (1 − TaxRate(country(c)))\n"
        "    − Rent(c)\n"
        "    − Utilities(c)\n"
        "    − Transit(c)\n"
        "    − Internet(c)\n"
        "    − Food(c)\n"
        "  ] ÷ PPP_PrivateConsumptionFactor(country(c))",
        S["MonoFormula"]
    ))
    story.append(PageBreak())

    # ── CHAPTER 2: PILLAR 1 — GROWTH ─────────────────────────────────────────
    _pillar_chapter(story, S, num="2", title="Pillar 1: Growth", subtitle="Economic dynamism and opportunity (25% weight)",
                    color=C_GROWTH, description=(
        "The Growth pillar measures whether a city creates the conditions for people to "
        "build economically productive lives: disposable income after costs, startup and "
        "innovation density, civic freedom, and broad economic momentum."
    ), indicators=[
        ("G1", "Real GDP Growth (5-year avg)", "% per annum", "higher", "IMF World Economic Outlook; OECD Regional Statistics",
         [("≤ 0", "0"), ("1.0", "25"), ("2.5", "50"), ("4.0", "75"), ("≥ 6.0", "100")], None),
        ("G2", "Startup Density", "per 100,000 population", "higher", "Crunchbase; Dealroom",
         [("≤ 5", "0"), ("20", "25"), ("50", "50"), ("100", "75"), ("≥ 200", "100")], None),
        ("G3", "VC Investment Intensity", "USD per capita, 3-year avg", "higher", "Crunchbase; PitchBook",
         [("≤ 5", "0"), ("50", "25"), ("200", "50"), ("500", "75"), ("≥ 1,500", "100")], None),
        ("G4", "Ease of Doing Business", "0–100 index", "higher", "World Bank B-READY Index",
         [("0", "0"), ("25", "25"), ("50", "50"), ("75", "75"), ("100", "100")], "Direct passthrough; no transformation required."),
        ("G5", "Civic Freedom", "0–100 composite", "higher", "Freedom House (0.6 weight) + V-Dem Liberal Democracy Index (0.4 weight)",
         [("0", "0"), ("25", "25"), ("50", "50"), ("75", "75"), ("100", "100")],
         "Composite: 0.6 × FH_rescaled(0–100) + 0.4 × V-Dem_rescaled(0–100). Direct passthrough after composite."),
        ("G6", "Patent Applications", "per 100,000 population, 3-year avg", "higher", "World Intellectual Property Organization (WIPO)",
         [("≤ 2", "0"), ("15", "25"), ("40", "50"), ("80", "75"), ("≥ 150", "100")], None),
        ("G7", "High-Skill Employment", "% ISCO categories 1–3", "higher", "International Labour Organization (ILO); LinkedIn Workforce Insights",
         [("≤ 10", "0"), ("20", "25"), ("30", "50"), ("40", "75"), ("≥ 55", "100")], None),
    ])

    # ── CHAPTER 3: PILLAR 2 — VIABILITY ──────────────────────────────────────
    _pillar_chapter(story, S, num="3", title="Pillar 2: Viability", subtitle="Lived sustainability and safety (22% weight)",
                    color=C_VIAB, description=(
        "The Viability pillar measures whether a city is liveable at the ground level: "
        "personal safety, air quality, healthcare, housing cost burden, water access, "
        "climate stability, and demographic vitality."
    ), indicators=[
        ("V1", "Homicide Rate", "per 100,000 population", "lower", "UNODC International Homicide Statistics",
         [("≥ 50", "0"), ("20", "25"), ("5", "50"), ("1.0", "75"), ("≤ 0.3", "100")], "Lower is better; anchor order is reversed."),
        ("V2", "Air Quality (PM2.5)", "μg/m³ annual mean", "lower", "WHO Global Air Quality Database; IQAir World Air Quality Report",
         [("≥ 80", "0"), ("50", "25"), ("25", "50"), ("10", "75"), ("≤ 5", "100")], "Lower is better; reversed anchors."),
        ("V3", "Healthcare Access & Quality", "HAQ Index 0–100", "higher", "IHME / Lancet Healthcare Access and Quality Index",
         [("0", "0"), ("25", "25"), ("50", "50"), ("75", "75"), ("100", "100")], "Direct passthrough."),
        ("V4", "PPP-Adjusted Disposable Income", "USD/month residual", "higher", "Derived: Numbeo cost data + World Bank PPP factors",
         [("≤ 0", "0"), ("200", "15"), ("500", "35"), ("1,000", "55"), ("2,000", "75"), ("≥ 4,000", "100")],
         "Non-linear anchors reflect diminishing returns above USD 2,000/month."),
        ("V5", "Housing Burden", "% of gross income", "lower", "Numbeo housing cost surveys; OECD Affordable Housing Database",
         [("≥ 70", "0"), ("50", "25"), ("30", "50"), ("20", "75"), ("≤ 10", "100")], "Lower burden = higher score."),
        ("V6", "Water & Sanitation", "% population with safely managed access", "higher", "WHO/UNICEF Joint Monitoring Programme",
         [("≤ 50", "0"), ("70", "25"), ("85", "50"), ("95", "75"), ("≥ 99", "100")], None),
        ("V7", "Peace & Stability", "Global Peace Index (inverted)", "higher", "Institute for Economics and Peace (IEP)",
         [("GPI ≥ 3.5 → 0", "0"), ("GPI 3.0 → 17", "~17"), ("GPI 2.0 → 50", "50"), ("GPI 1.5 → 83", "~83"), ("GPI ≤ 1.2 → 100", "100")],
         "Formula: score = max(0, min(100, (4 − GPI) / 3 × 100))."),
        ("V8", "Birth Rate", "per 1,000 population", "higher", "UN Population Division; national statistics offices",
         [("≤ 4", "0"), ("7", "25"), ("10", "50"), ("14", "75"), ("≥ 20", "100")],
         "Interpreted as demographic optimism signal, not population policy judgment."),
    ])

    # ── CHAPTER 4: PILLAR 3 — CAPABILITY ─────────────────────────────────────
    _pillar_chapter(story, S, num="4", title="Pillar 3: Capability", subtitle="Infrastructure and systems quality (18% weight)",
                    color=C_CAP, description=(
        "The Capability pillar measures urban infrastructure quality: transit coverage, "
        "digital connectivity, digital governance, education quality, walkability, "
        "cycling infrastructure, and renewable energy share."
    ), indicators=[
        ("C1", "Transit Coverage", "% population within 500m of stop", "higher", "GTFS feeds; ITDP Transit-Oriented Development Database",
         [("≤ 5", "0"), ("20", "25"), ("40", "50"), ("65", "75"), ("≥ 85", "100")], None),
        ("C2", "Internet Speed", "Mbps median fixed broadband", "higher", "Ookla Speedtest Global Index; M-Lab NDT",
         [("≤ 5", "0"), ("25", "25"), ("75", "50"), ("150", "75"), ("≥ 300", "100")], None),
        ("C3", "Digital Government", "UN E-Government Development Index × 100", "higher", "UN Department of Economic and Social Affairs",
         [("0", "0"), ("25", "25"), ("50", "50"), ("75", "75"), ("100", "100")], "Direct passthrough."),
        ("C4", "Education Quality", "PISA average score", "higher", "OECD PISA; UNESCO Institute for Statistics (tertiary fallback)",
         [("≤ 350", "0"), ("400", "25"), ("450", "50"), ("500", "75"), ("≥ 550", "100")],
         "Tertiary enrollment fallback anchors: ≤5%=0, 15%=25, 25%=50, 40%=75, ≥55%=100."),
        ("C5", "Walkability", "Walk Score 0–100", "higher", "Walk Score; OpenStreetMap pedestrian network analysis",
         [("0", "0"), ("25", "25"), ("50", "50"), ("75", "75"), ("100", "100")], "Direct passthrough."),
        ("C6", "Cycling Infrastructure", "km of protected lanes per 100,000 pop", "higher", "OpenStreetMap CyclOSM layer; Copenhagenize Index",
         [("≤ 1", "0"), ("5", "25"), ("15", "50"), ("30", "75"), ("≥ 50", "100")], None),
        ("C7", "Renewable Energy Share", "% of electricity from renewables", "higher", "CDP Cities; IRENA; national grid operators",
         [("≤ 2", "0"), ("15", "25"), ("35", "50"), ("60", "75"), ("≥ 90", "100")], None),
    ])

    # ── CHAPTER 5: PILLAR 4 — COMMUNITY ──────────────────────────────────────
    _pillar_chapter(story, S, num="5", title="Pillar 4: Community", subtitle="Belonging, tolerance, and social equity (15% weight)",
                    color=C_COMM, description=(
        "The Community pillar measures whether a city is genuinely open: LGBTQ+ rights, "
        "religious freedom, immigrant integration, income inequality, social trust, "
        "gender equality, and weekend retention (a proxy for residents choosing to stay)."
    ), indicators=[
        ("O1", "LGBTQ+ Rights", "Composite 0–100", "higher", "ILGA World; Equaldex",
         [("0", "0"), ("25", "25"), ("50", "50"), ("75", "75"), ("100", "100")],
         "Composite: same-sex marriage (25pts) + anti-discrimination law (25pts) + gender recognition (15pts) + no criminalization (20pts) + social acceptance survey (15pts)."),
        ("O2", "Religious Freedom", "Pew GRI inverted", "higher", "Pew Research Center Global Restrictions Index",
         [("GRI ≥ 9 → 0", "0"), ("GRI 7 → 22", "~22"), ("GRI 5 → 44", "~44"), ("GRI 2 → 78", "~78"), ("GRI ≤ 0.5 → 95", "~95")],
         "Formula: score = max(0, min(100, (10 − GRI) / 10 × 100))."),
        ("O3", "Immigrant Integration", "Employment gap (percentage points)", "lower", "OECD International Migration Outlook; national labour force surveys",
         [("≥ 30 pp", "0"), ("20 pp", "25"), ("10 pp", "50"), ("5 pp", "75"), ("≤ 1 pp", "100")], "Lower employment gap = higher score."),
        ("O4", "Income Inequality (Gini)", "Gini coefficient 0–1", "lower", "World Bank PovcalNet; OECD Income Distribution Database",
         [("≥ 0.60", "0"), ("0.45", "25"), ("0.35", "50"), ("0.28", "75"), ("≤ 0.22", "100")], "Lower Gini = higher score."),
        ("O5", "Social Trust", "% saying most people can be trusted", "higher", "World Values Survey; Gallup World Poll",
         [("≤ 5%", "0"), ("15%", "25"), ("30%", "50"), ("50%", "75"), ("≥ 70%", "100")], None),
        ("O6", "Gender Equality", "UNDP GII inverted", "higher", "UNDP Human Development Reports — Gender Inequality Index",
         [("GII 1.0 → 0", "0"), ("GII 0.75 → 25", "25"), ("GII 0.5 → 50", "50"), ("GII 0.25 → 75", "75"), ("GII 0.0 → 100", "100")],
         "Formula: score = (1 − GII) × 100."),
        ("O7", "Weekend Retention", "Weekend / weekday mobility ratio", "higher", "Mobile analytics platforms; city-level aggregated movement data",
         [("≤ 0.70", "0"), ("0.80", "25"), ("0.90", "50"), ("1.00", "75"), ("≥ 1.10", "100")], "Ratio above 1.0 indicates residents actively choose to stay or return on weekends."),
    ])

    # ── CHAPTER 6: PILLAR 5 — CREATIVE ───────────────────────────────────────
    _pillar_chapter(story, S, num="6", title="Pillar 5: Creative", subtitle="Cultural richness and creative economy (20% weight)",
                    color=C_CREAT, description=(
        "The Creative pillar measures lived cultural richness for residents, not tourists: "
        "cultural venue density, UNESCO heritage access, culinary diversity, nightlife, "
        "arts funding, creative employment share, and international event density."
    ), indicators=[
        ("R1", "Cultural Venues", "per 100,000 population", "higher", "OpenStreetMap; Google Places API",
         [("≤ 2", "0"), ("8", "25"), ("20", "50"), ("40", "75"), ("≥ 70", "100")], None),
        ("R2", "UNESCO World Heritage Sites", "sites within 50km radius", "higher", "UNESCO World Heritage List + GIS distance analysis",
         [("0", "0"), ("1", "25"), ("3", "50"), ("6", "75"), ("≥ 10", "100")], None),
        ("R3", "Culinary Diversity", "cuisine types per 100,000 population", "higher", "Google Places; Yelp; Foursquare",
         [("≤ 1", "0"), ("3", "25"), ("8", "50"), ("15", "75"), ("≥ 25", "100")], None),
        ("R4", "Nightlife Density", "bars and clubs per 100,000 population", "higher", "OpenStreetMap; Google Places",
         [("≤ 3", "0"), ("10", "25"), ("25", "50"), ("50", "75"), ("≥ 80", "100")], None),
        ("R5", "Arts Funding", "USD PPP per capita public arts expenditure", "higher", "Eurostat Culture Statistics; national ministries of culture",
         [("≤ 5", "0"), ("30", "25"), ("80", "50"), ("150", "75"), ("≥ 300", "100")], None),
        ("R6", "Creative Employment", "% of workforce in creative industries", "higher", "UNCTAD Creative Economy Report; national labour force surveys",
         [("≤ 1%", "0"), ("3%", "25"), ("6%", "50"), ("10%", "75"), ("≥ 15%", "100")], None),
        ("R7", "International Events", "per million population per year", "higher", "ICCA International Congress and Convention Association; Eventbrite",
         [("≤ 2", "0"), ("10", "25"), ("25", "50"), ("50", "75"), ("≥ 100", "100")], None),
    ])

    # ── CHAPTER 7: DATA SOURCES ───────────────────────────────────────────────
    story.append(Paragraph("7.", S["ChapterNum"]))
    story.append(Paragraph("Data Sources", S["ChapterTitle"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=4 * mm))
    story.append(Paragraph(
        "SLIC uses a five-tier source hierarchy. Tier 1 (city-official) is preferred; "
        "the fallback order is Tier 2 (subnational) → Tier 3 (national/international) → "
        "Tier 4 (audited secondary) → Tier 5 (analyst assessment). "
        "The source tier for each published metric is visible on the city scorecard page.", S["Body"]
    ))

    tier_hdr = [Paragraph(h, S["TableHead"]) for h in ["Tier", "Level", "Examples"]]
    tier_rows = [
        ("1", "City / metro official", "Municipal open data portals, utility feeds, transit GTFS"),
        ("2", "Subnational official", "State, provincial, or regional government data"),
        ("3", "National / international official", "World Bank, WHO, ILO, UNESCO, OECD, WIPO, UN Agencies"),
        ("4", "Audited secondary & experimental", "OpenAQ, Copernicus CAMS, M-Lab NDT, satellite remote sensing"),
        ("5", "Analyst assessment", "SLIC analyst cross-reference and lived-experience review"),
    ]
    tier_body = [[Paragraph(r[0], S["TableBodyC"]), Paragraph(r[1], S["TableBody"]), Paragraph(r[2], S["TableBody"])] for r in tier_rows]
    t = Table([tier_hdr] + tier_body, colWidths=[12 * mm, 50 * mm, 104 * mm], repeatRows=1)
    t.setStyle(hdr_style())
    story.append(t)
    story.append(Spacer(1, 6 * mm))

    story.append(Paragraph("Primary Source Organisations", S["SectionHead"]))
    sources = [
        "World Bank — WDI, B-READY, PovcalNet, PPP conversion factors",
        "World Health Organization — GHO OData API, HAQ Index, JMP water/sanitation",
        "International Labour Organization — ILOSTAT (employment, hours, wages)",
        "OECD — PISA, Health Statistics, Affordable Housing, Income Distribution",
        "UN Population Division — birth rates, demographic projections",
        "UNESCO Institute for Statistics — education enrollment, cultural indicators",
        "UNODC — International Homicide Statistics",
        "UNDP — Human Development Reports, Gender Inequality Index",
        "IEP — Global Peace Index",
        "Freedom House — Freedom in the World annual scores",
        "V-Dem Institute — Liberal Democracy Index",
        "Pew Research Center — Global Restrictions on Religion Index",
        "WIPO — Patent Application Statistics",
        "IMF — World Economic Outlook GDP data",
        "IRENA — Renewable capacity and generation statistics",
        "IQAir / WHO — PM2.5 ambient air quality annual averages",
        "ILGA World + Equaldex — LGBTQ+ legal environment composite",
        "World Values Survey + Gallup — social trust indicators",
        "ICCA — International Congress and Convention Association statistics",
        "Numbeo — Cost of living, housing, and consumer price surveys",
        "Crunchbase / PitchBook / Dealroom — startup and VC investment data",
        "Ookla + M-Lab — broadband speed measurements",
        "OpenStreetMap / CyclOSM — cycling and pedestrian infrastructure",
        "Walk Score — walkability index",
        "OpenAQ / Copernicus CAMS — supplementary air quality monitoring",
    ]
    story.append(ListFlowable(
        [ListItem(Paragraph(s, S["BodySmall"])) for s in sources],
        bulletType="bullet", leftIndent=14, spaceAfter=1
    ))
    story.append(PageBreak())

    # ── CHAPTER 8: COVERAGE GRADES ────────────────────────────────────────────
    story.append(Paragraph("8.", S["ChapterNum"]))
    story.append(Paragraph("Coverage Grades", S["ChapterTitle"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=4 * mm))
    story.append(Paragraph(
        "SLIC does not impute missing values. When indicators are unavailable, "
        "they are excluded from the pillar aggregation and a coverage penalty is applied. "
        "The coverage grade is published alongside every city score.", S["Body"]
    ))

    cov_hdr = [Paragraph(h, S["TableHead"]) for h in ["Grade", "Condition", "Penalty", "Interpretation"]]
    cov_rows = [
        ("A", "≥ 6 of 7 indicators present (or ≥ 5 of 5–6 indicator pillar)", "None", "Full confidence in pillar score"),
        ("B", "≥ 4 indicators present", "−5 points", "Score is reliable but interpret with moderate caution"),
        ("C", "≤ 3 indicators present", "−15 points, flagged provisional", "Treat as indicative; significant data gaps exist"),
    ]
    cov_body = [[Paragraph(r[0], S["TableBodyC"]), Paragraph(r[1], S["TableBody"]), Paragraph(r[2], S["TableBodyC"]), Paragraph(r[3], S["TableBody"])] for r in cov_rows]
    t = Table([cov_hdr] + cov_body, colWidths=[14 * mm, 56 * mm, 28 * mm, 68 * mm], repeatRows=1)
    t.setStyle(hdr_style())
    story.append(t)
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph(
        "The penalty is applied after the AMPI computation at the pillar level and is floored at zero. "
        "Overall coverage grade reflects the worst pillar grade for that city. "
        "Cities are never hidden because of low coverage — low coverage is surfaced, not suppressed.", S["Body"]
    ))
    story.append(PageBreak())

    # ── CHAPTER 9: CITY RANKINGS ──────────────────────────────────────────────
    story.append(Paragraph("9.", S["ChapterNum"]))
    story.append(Paragraph("Published City Rankings", S["ChapterTitle"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=4 * mm))
    story.append(Paragraph(
        f"All {len(cities)} published cities, sorted by overall SLIC score. "
        "Scores are rounded to one decimal place. Ties are allowed — cities with the same "
        "rounded score share the same rank number. "
        "Pillar column headers: G = Growth, V = Viability, Cap = Capability, Com = Community, Cr = Creative.",
        S["Body"]
    ))

    ranks_hdr = [Paragraph(h, S["TableHead"]) for h in
                 ["#", "City", "Country", "SLIC", "G", "V", "Cap", "Com", "Cr", "Gr."]]
    ranks_rows = []
    for c in cities:
        ranks_rows.append([
            Paragraph(str(c["rank"]), S["TableBodyC"]),
            Paragraph(c["displayName"], S["TableBody"]),
            Paragraph(c["country"], S["TableBody"]),
            Paragraph(_fmt(c['slicScore']), S["TableBodyR"]),
            Paragraph(_fmt(c['pressureScore']), S["TableBodyR"]),
            Paragraph(_fmt(c['viabilityScore']), S["TableBodyR"]),
            Paragraph(_fmt(c['capabilityScore']), S["TableBodyR"]),
            Paragraph(_fmt(c['communityScore']), S["TableBodyR"]),
            Paragraph(_fmt(c['creativeScore']), S["TableBodyR"]),
            Paragraph(c.get("coverageGrade", ""), S["TableBodyC"]),
        ])
    ranks_col_w = [10 * mm, 38 * mm, 30 * mm, 14 * mm, 12 * mm, 12 * mm, 12 * mm, 12 * mm, 12 * mm, 10 * mm]
    t = Table([ranks_hdr] + ranks_rows, colWidths=ranks_col_w, repeatRows=1)
    rank_style = TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), C_BG_HEAD),
        ("FONTNAME",   (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",   (0, 0), (-1, -1), 7.5),
        ("LEADING",    (0, 0), (-1, -1), 10),
        ("GRID",       (0, 0), (-1, -1), 0.25, C_RULE),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
        ("LEFTPADDING", (0, 0), (-1, -1), 3),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3),
        ("VALIGN",     (0, 0), (-1, -1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [C_WHITE, C_BG_ALT]),
    ])
    t.setStyle(rank_style)
    story.append(t)
    story.append(PageBreak())

    # ── CHAPTER 10: DESIGN PRINCIPLES ─────────────────────────────────────────
    story.append(Paragraph("10.", S["ChapterNum"]))
    story.append(Paragraph("Design Principles", S["ChapterTitle"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=4 * mm))

    principles = [
        ("Absolute scoring",
         "Anchors are fixed at real-world thresholds. A city's score does not change because a new city joined the index. Adding city #501 cannot change cities #1–500."),
        ("Transparent and traceable",
         "Every published score traces back to a raw data point, a normalization function, and a named source. The scoring workbook is publicly downloadable."),
        ("Penalises imbalance",
         "The AMPI aggregation formula means a city cannot compensate for catastrophic performance in one pillar by excelling in another. Extreme imbalance is structurally penalised."),
        ("Honest about data gaps",
         "Missing data is never imputed. Gaps are flagged with visible coverage grades and penalties. A low-coverage city is shown, not hidden."),
        ("Scalable without revision",
         "New cities can be added to the index without recalculating existing scores. The methodology does not require retrospective revision when the city universe grows."),
        ("Anti-pattern resistant",
         "The index is designed so that cities cannot easily game their scores by optimising for visible proxy metrics. The DI_PPP formula, AMPI penalty, and imbalance penalties are all difficult to manipulate without genuinely improving urban conditions."),
    ]
    for title, body in principles:
        story.append(KeepTogether([
            Paragraph(title, S["SectionHead"]),
            Paragraph(body, S["Body"]),
            Spacer(1, 2 * mm),
        ]))

    story.append(PageBreak())

    # ── CHAPTER 11: GLOSSARY ──────────────────────────────────────────────────
    story.append(Paragraph("11.", S["ChapterNum"]))
    story.append(Paragraph("Notation Glossary", S["ChapterTitle"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=4 * mm))

    glossary = [
        ("c", "City or functional urban area being evaluated"),
        ("m", "Metric index (individual indicator within a pillar)"),
        ("p", "Pillar index (one of the five thematic pillars)"),
        ("x_m(c)", "Raw observed metric value for city c on metric m"),
        ("s_m(c)", "Normalized metric score for city c on metric m, range [0, 100]"),
        ("μ", "Arithmetic mean of normalized scores within a pillar or across pillars"),
        ("σ", "Population standard deviation of scores within a pillar or across pillars"),
        ("cv", "Coefficient of variation: σ / μ"),
        ("AMPI", "Adjusted Mazziotta–Pareto Index: μ − σ²/μ"),
        ("t_k", "Fixed absolute anchor threshold at score k (k ∈ {0, 25, 50, 75, 100})"),
        ("DI_PPP(c)", "PPP-adjusted monthly disposable income after essential costs for city c"),
        ("α_(p,m)", "Metric weight of indicator m inside pillar p"),
        ("γ_m", "Coverage weight for metric m (used in coverage ratio computation)"),
        ("w_p", "Public pillar weight (Growth 0.25, Viability 0.22, Capability 0.18, Community 0.15, Creative 0.20)"),
        ("HAQ", "Healthcare Access and Quality Index (IHME/Lancet)"),
        ("GPI", "Global Peace Index (Institute for Economics and Peace)"),
        ("GII", "Gender Inequality Index (UNDP)"),
        ("GRI", "Government Restrictions Index (Pew Research Center)"),
        ("EGDI", "E-Government Development Index (United Nations)"),
        ("PPP", "Purchasing Power Parity — conversion factor equalising purchasing power across currencies"),
    ]
    gloss_hdr = [Paragraph(h, S["TableHead"]) for h in ["Symbol / Term", "Definition"]]
    gloss_body = [[Paragraph(g[0], S["Mono"]), Paragraph(g[1], S["TableBody"])] for g in glossary]
    t = Table([gloss_hdr] + gloss_body, colWidths=[38 * mm, 128 * mm], repeatRows=1)
    t.setStyle(hdr_style())
    story.append(t)
    story.append(Spacer(1, 8 * mm))

    story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=4 * mm))
    story.append(Paragraph(
        "SLIC Index V3 · slic.index · April 2026 · "
        "Published by SLIC in partnership with DEPA Thailand, PMU-A, and ReTL. "
        "Methodology questions: contact via depa.or.th or the SLIC website.",
        S["Caption"]
    ))

    return story


def _pillar_chapter(story, S, num, title, subtitle, color, description, indicators):
    story.append(Paragraph(f"{num}.", S["ChapterNum"]))
    t = Paragraph(title, ParagraphStyle(
        "PillarChapter", parent=S["ChapterTitle"], textColor=color
    ))
    story.append(t)
    story.append(Paragraph(subtitle, S["Cover2"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=color, spaceAfter=4 * mm))
    story.append(Paragraph(description, S["Body"]))
    story.append(Spacer(1, 3 * mm))

    for (code, name, unit, direction, source, anchors, note) in indicators:
        story.append(indicator_block(S, code, name, unit, direction, source, anchors, color, note))

    story.append(PageBreak())


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    S = make_styles()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title="SLIC Index V3 — Methodology Technical Paper",
        author="Non Arkara; Associate Professor Poon Thiengburanathum",
        subject="Smart and Liveable Cities Index V3 — Complete Methodology",
        creator="SLIC / ReTL",
    )
    story = build_story(S)
    doc.build(story, onFirstPage=draw_header_footer, onLaterPages=draw_header_footer)
    size_kb = OUTPUT.stat().st_size // 1024
    print(f"✓ {OUTPUT}  ({size_kb} KB)")


if __name__ == "__main__":
    main()
