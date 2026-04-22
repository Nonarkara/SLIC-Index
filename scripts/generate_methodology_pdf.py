"""
SLIC Index V3 — Methodology Technical Paper generator (en / th / zh)

Produces:
  public/downloads/slic-methodology-technical-paper-en.pdf
  public/downloads/slic-methodology-technical-paper-th.pdf
  public/downloads/slic-methodology-technical-paper-zh.pdf

Run from project root:
    python3 scripts/generate_methodology_pdf.py          # all three
    python3 scripts/generate_methodology_pdf.py en       # one only

Technical note: anchor tables, formulas, indicator codes, and the 160-city
tabulation stay in English in all editions (academic convention). Narrative
prose, chapter titles, executive summary, principles, and glossary
definitions are translated.
"""

from __future__ import annotations
import json
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfbase.ttfonts import TTFont
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
from reportlab.graphics.shapes import Drawing, Polygon, Line, String, Rect
import math

# ── Paths ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent.parent
CITY_DATA = ROOT / "src" / "data" / "publishedRankingData.json"
OUT_DIR = ROOT / "public" / "downloads"

# ── Brand palette ─────────────────────────────────────────────────────────────
C_TEXT    = colors.HexColor("#1c1914")
C_ACCENT  = colors.HexColor("#b85c28")
C_MUTED   = colors.HexColor("#6b6459")
C_FAINT   = colors.HexColor("#9a9088")
C_BG_HEAD = colors.HexColor("#f0ebe3")
C_BG_ALT  = colors.HexColor("#faf8f5")
C_RULE    = colors.HexColor("#d8d0c8")
C_WHITE   = colors.white
C_GROWTH  = colors.HexColor("#b85c28")
C_VIAB    = colors.HexColor("#1a6b5a")
C_CAP     = colors.HexColor("#2a5a8c")
C_COMM    = colors.HexColor("#8c4a2a")
C_CREAT   = colors.HexColor("#a0382a")


# ── Font registration ─────────────────────────────────────────────────────────
def register_fonts():
    """Register Thai (Sathu) and Chinese (STSong-Light CID) fonts."""
    thai_path = Path("/System/Library/Fonts/Supplemental/Sathu.ttf")
    if thai_path.exists():
        try:
            pdfmetrics.registerFont(TTFont("Sathu", str(thai_path)))
        except Exception:
            pass
    try:
        pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))
    except Exception:
        pass


def font_for(locale: str, weight: str = "normal") -> str:
    """Return a font name appropriate to the locale. Helvetica variants for en,
    Sathu for th, STSong-Light for zh."""
    if locale == "th":
        return "Sathu"  # Sathu doesn't have a separate bold face in this TTF
    if locale == "zh":
        return "STSong-Light"
    return "Helvetica-Bold" if weight == "bold" else "Helvetica"


# ── Localized copy ────────────────────────────────────────────────────────────
# Keys: compact token names; values: per-locale strings.
# Technical tables, formulas, and indicator tables stay English.

COPY = {
    "en": {
        "paper_title":      "SLIC Index V3",
        "paper_subtitle":   "Methodology Technical Paper",
        "date":             "April 2026",
        "authors":          "Authors: Non Arkara · Assoc. Prof. Poon Thiengburanathum",
        "published_by":     "Published by SLIC and ReTL (The Reason to Live Company)",
        "partnership":      "In partnership with DEPA Thailand and PMU-A",
        "cover_note":       ("This paper documents the complete scoring methodology for the "
                              "SLIC Index V3: indicator definitions, normalization anchor tables, "
                              "aggregation formula, coverage grades, and the full published "
                              "rankings for 160 cities."),
        "exec_title":       "Executive Summary",
        "exec_intro":       ("The Smart and Liveable Cities Index (SLIC) V3 is a transparent, "
                              "open-source city ranking system measuring quality of life for "
                              "people in the process of building lives — not tourists, not expats "
                              "on hardship pay, not global capital seeking returns. It covers 160 "
                              "published cities across an Asia-Pacific-centred but globally "
                              "inclusive dataset, scored on 35 indicators grouped into five pillars."),
        "five_pillars":     "Five pillars:",
        "pillar_header_rows": [
            ("Pillar", "Weight", "What it measures"),
            ("Growth", "25%", "Economic dynamism, disposable income, startup density, civic freedom"),
            ("Viability", "22%", "Safety, air quality, healthcare, housing affordability, water access"),
            ("Capability", "18%", "Transit, digital infrastructure, education, renewable energy, walkability"),
            ("Community", "15%", "Tolerance, LGBTQ+ rights, gender equality, social trust, income inequality"),
            ("Creative", "20%", "Cultural venues, culinary diversity, arts funding, creative employment"),
        ],
        "absolute_title":   "Absolute scoring philosophy:",
        "absolute_bullets": [
            "All indicators are normalized against fixed absolute benchmarks — adding city #501 never changes any existing score.",
            "Higher normalized scores always mean better urban outcomes; harmful indicators are reverse-scored inside the normalization step.",
            "The Adjusted Mazziotta–Pareto Index (AMPI) aggregation formula penalizes pillar imbalance: a city with one excellent pillar and four poor ones scores lower than a city with five moderate pillars.",
            "Missing data is never imputed. Cities with fewer than the minimum required indicators receive a coverage penalty (−5 or −15 points) and a visible grade flag.",
            "Every source is named. Every score is traceable back to a raw data point, a normalization function, and a published source.",
        ],
        "ch1_title":        "Scoring Framework",
        "sec_1_1":          "1.1 Piecewise Linear Normalization",
        "sec_1_1_body":     ("Each raw metric value is mapped to a 0–100 score using a fixed set "
                              "of absolute anchor points. Between anchor points, scores are "
                              "linearly interpolated. Values beyond the outer anchors are clamped "
                              "to 0 or 100. For lower-is-better indicators the anchor mapping is "
                              "reversed so that lower raw values produce higher normalized scores."),
        "sec_1_2":          "1.2 Pillar Aggregation (AMPI)",
        "sec_1_2_body":     ("Within each pillar, constituent metric scores are aggregated using "
                              "the Adjusted Mazziotta–Pareto Index (AMPI). The AMPI penalizes "
                              "uneven performance: a city with high variance across its metrics "
                              "scores lower than one with similar mean but lower variance. This "
                              "makes it impossible to compensate for a catastrophic metric score "
                              "by excelling elsewhere."),
        "sec_1_3":          "1.3 Overall SLIC Score",
        "sec_1_4":          "1.4 PPP-Adjusted Disposable Income (DI_PPP)",
        "sec_1_4_body":     ("The signature SLIC metric. Measures residual monthly income after "
                              "all essential costs, converted to PPP-adjusted USD so cities in "
                              "different economic contexts are comparable."),
        "pillar_intros": {
            "Growth":     ("The Growth pillar measures whether a city creates the conditions for "
                           "people to build economically productive lives: disposable income "
                           "after costs, startup and innovation density, civic freedom, and broad "
                           "economic momentum."),
            "Viability":  ("The Viability pillar measures whether a city is liveable at the "
                           "ground level: personal safety, air quality, healthcare, housing cost "
                           "burden, water access, climate stability, and demographic vitality."),
            "Capability": ("The Capability pillar measures urban infrastructure quality: transit "
                           "coverage, digital connectivity, digital governance, education "
                           "quality, walkability, cycling infrastructure, and renewable energy share."),
            "Community":  ("The Community pillar measures whether a city is genuinely open: "
                           "LGBTQ+ rights, religious freedom, immigrant integration, income "
                           "inequality, social trust, gender equality, and weekend retention (a "
                           "proxy for residents choosing to stay)."),
            "Creative":   ("The Creative pillar measures lived cultural richness for residents, "
                           "not tourists: cultural venue density, UNESCO heritage access, "
                           "culinary diversity, nightlife, arts funding, creative employment "
                           "share, and international event density."),
        },
        "pillar_subtitles": {
            "Growth":     "Economic dynamism and opportunity (25% weight)",
            "Viability":  "Lived sustainability and safety (22% weight)",
            "Capability": "Infrastructure and systems quality (18% weight)",
            "Community":  "Belonging, tolerance, and social equity (15% weight)",
            "Creative":   "Cultural richness and creative economy (20% weight)",
        },
        "ch7_title":  "Data Sources",
        "ch7_body":   ("SLIC uses a five-tier source hierarchy. Tier 1 (city-official) is "
                       "preferred; the fallback order is Tier 2 (subnational) → Tier 3 "
                       "(national/international) → Tier 4 (audited secondary) → Tier 5 (analyst "
                       "assessment). The source tier for each published metric is visible on the "
                       "city scorecard page."),
        "tier_table_header": ["Tier", "Level", "Examples"],
        "tier_rows": [
            ("1", "City / metro official", "Municipal open data portals, utility feeds, transit GTFS"),
            ("2", "Subnational official", "State, provincial, or regional government data"),
            ("3", "National / international official", "World Bank, WHO, ILO, UNESCO, OECD, WIPO, UN Agencies"),
            ("4", "Audited secondary & experimental", "OpenAQ, Copernicus CAMS, M-Lab NDT, satellite remote sensing"),
            ("5", "Analyst assessment", "SLIC analyst cross-reference and lived-experience review"),
        ],
        "primary_sources": "Primary Source Organisations",
        "ch8_title":  "Coverage Grades",
        "ch8_body":   ("SLIC does not impute missing values. When indicators are unavailable, "
                       "they are excluded from the pillar aggregation and a coverage penalty is "
                       "applied. The coverage grade is published alongside every city score."),
        "cov_table_header": ["Grade", "Condition", "Penalty", "Interpretation"],
        "cov_rows": [
            ("A", "≥ 6 of 7 indicators present (or ≥ 5 of 5–6 indicator pillar)", "None", "Full confidence in pillar score"),
            ("B", "≥ 4 indicators present", "−5 points", "Score is reliable but interpret with moderate caution"),
            ("C", "≤ 3 indicators present", "−15 points, flagged provisional", "Treat as indicative; significant data gaps exist"),
        ],
        "ch8_note":   ("The penalty is applied after the AMPI computation at the pillar level "
                       "and is floored at zero. Overall coverage grade reflects the worst pillar "
                       "grade for that city. Cities are never hidden because of low coverage — "
                       "low coverage is surfaced, not suppressed."),
        "ch9_title":  "Published City Rankings",
        "ch9_body_fmt": ("All {n} published cities, sorted by overall SLIC score. Scores are "
                         "rounded to one decimal place. Ties are allowed — cities with the same "
                         "rounded score share the same rank number. Pillar column headers: "
                         "G = Growth, V = Viability, Cap = Capability, Com = Community, Cr = Creative."),
        "ranks_header": ["#", "City", "Country", "SLIC", "G", "V", "Cap", "Com", "Cr", "Gr."],
        "ch10_title": "Design Principles",
        "principles": [
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
        ],
        "ch11_title": "Notation Glossary",
        "glossary_header": ["Symbol / Term", "Definition"],
        "colophon":   ("SLIC Index V3 · slic.index · April 2026 · Published by SLIC in "
                       "partnership with DEPA Thailand, PMU-A, and ReTL. Methodology questions: "
                       "contact via depa.or.th or the SLIC website."),
        "header_footer": "SLIC Index V3 — Methodology Technical Paper",
        "page_word":   "Page",
    },

    # ── Thai ──────────────────────────────────────────────────────────────────
    "th": {
        "paper_title":      "SLIC Index V3",
        "paper_subtitle":   "เอกสารทางเทคนิคว่าด้วยระเบียบวิธี",
        "date":             "เมษายน 2569",
        "authors":          "ผู้เขียน: นนท์ อรรคระ · รศ. ดร.พูน เทียงบุราณธรรม",
        "published_by":     "จัดพิมพ์โดย SLIC และ ReTL",
        "partnership":      "ในความร่วมมือกับ DEPA ประเทศไทย และ PMU-A",
        "cover_note":       ("เอกสารฉบับนี้บันทึกระเบียบวิธีการให้คะแนนของ SLIC Index V3 ครบถ้วน "
                              "ได้แก่ คำจำกัดความของตัวชี้วัด ตารางจุดยึดในการปรับเทียบคะแนน "
                              "สูตรการรวมคะแนน เกรดความครอบคลุม และตารางอันดับเมืองที่เผยแพร่ "
                              "ทั้งหมด 160 เมือง"),
        "exec_title":       "บทสรุปผู้บริหาร",
        "exec_intro":       ("SLIC Index V3 (ดัชนีเมืองอัจฉริยะและน่าอยู่) เป็นระบบจัดอันดับเมือง"
                              "แบบโอเพนซอร์สที่โปร่งใส วัดคุณภาพชีวิตของคนที่กำลังสร้างชีวิตในเมือง — "
                              "ไม่ใช่นักท่องเที่ยว ไม่ใช่ผู้บริหารต่างชาติที่บริษัทจ่ายค่าเช่าให้ "
                              "และไม่ใช่ทุนโลกที่แสวงหาผลตอบแทน "
                              "ดัชนีครอบคลุมเมืองที่เผยแพร่แล้ว 160 เมือง ในชุดข้อมูลที่เน้น"
                              "เอเชีย-แปซิฟิกแต่ครอบคลุมทั่วโลก ให้คะแนนผ่าน 35 ตัวชี้วัด "
                              "จัดกลุ่มใน 5 เสาหลัก"),
        "five_pillars":     "เสาหลักทั้งห้า:",
        "pillar_header_rows": [
            ("เสาหลัก", "น้ำหนัก", "วัดอะไร"),
            ("Growth (การเติบโต)", "25%", "พลวัตทางเศรษฐกิจ รายได้คงเหลือ ความหนาแน่นของสตาร์ทอัพ เสรีภาพพลเมือง"),
            ("Viability (ความน่าอยู่)", "22%", "ความปลอดภัย คุณภาพอากาศ ระบบสุขภาพ ค่าที่อยู่อาศัย การเข้าถึงน้ำ"),
            ("Capability (ศักยภาพ)", "18%", "ระบบขนส่ง โครงสร้างพื้นฐานดิจิทัล การศึกษา พลังงานสะอาด ความเดินได้"),
            ("Community (ชุมชน)", "15%", "ความอดทน สิทธิ LGBTQ+ ความเท่าเทียมทางเพศ ความไว้วางใจทางสังคม ความเหลื่อมล้ำ"),
            ("Creative (ความสร้างสรรค์)", "20%", "สถานที่ทางวัฒนธรรม ความหลากหลายอาหาร ทุนศิลปะ การจ้างงานสร้างสรรค์"),
        ],
        "absolute_title":   "ปรัชญาการให้คะแนนแบบสัมบูรณ์:",
        "absolute_bullets": [
            "ตัวชี้วัดทั้งหมดถูกปรับเทียบกับเกณฑ์สัมบูรณ์ที่กำหนดตายตัว — การเพิ่มเมืองที่ 501 จะไม่เปลี่ยนคะแนนเมืองใดที่มีอยู่แล้ว",
            "คะแนนที่ปรับเทียบแล้วสูง หมายถึงผลลัพธ์เมืองที่ดีเสมอ ตัวชี้วัดที่เป็นลบจะถูกกลับทิศในขั้นตอนการปรับเทียบ",
            "สูตรรวมคะแนน Adjusted Mazziotta–Pareto Index (AMPI) ลงโทษความไม่สมดุลของเสาหลัก เมืองที่เก่งเสาเดียวแต่แย่สี่เสาจะได้คะแนนน้อยกว่าเมืองที่มี 5 เสาปานกลางเท่ากัน",
            "ไม่เติมข้อมูลที่ขาดหาย เมืองที่มีตัวชี้วัดน้อยกว่าขั้นต่ำจะถูกลดคะแนน (−5 หรือ −15) และติดเกรดความครอบคลุมที่มองเห็นได้",
            "แหล่งข้อมูลทุกตัวมีชื่อกำกับ คะแนนทุกค่าไล่ย้อนกลับไปถึงจุดข้อมูลดิบ ฟังก์ชันปรับเทียบ และแหล่งข้อมูลที่เผยแพร่ได้",
        ],
        "ch1_title":        "กรอบการให้คะแนน",
        "sec_1_1":          "1.1 การปรับเทียบเชิงเส้นแบบช่วง (Piecewise Linear)",
        "sec_1_1_body":     ("ค่าตัวชี้วัดดิบแต่ละค่าถูกแมปเป็นคะแนน 0–100 โดยใช้ชุดจุดยึดสัมบูรณ์ที่"
                              "กำหนดตายตัว ระหว่างจุดยึดคะแนนจะถูกประมาณด้วยเส้นตรง "
                              "ค่าที่อยู่นอกจุดยึดด้านนอกสุดจะถูกตัดที่ 0 หรือ 100 "
                              "ตัวชี้วัดที่ค่าน้อยแปลว่าดี จุดยึดจะถูกกลับทิศ เพื่อให้ค่าน้อย"
                              "เชิงดิบให้คะแนนที่สูงขึ้น"),
        "sec_1_2":          "1.2 การรวมคะแนนระดับเสาหลัก (AMPI)",
        "sec_1_2_body":     ("ภายในแต่ละเสาหลัก คะแนนตัวชี้วัดย่อยถูกรวมด้วย Adjusted "
                              "Mazziotta–Pareto Index (AMPI) AMPI ลงโทษความไม่สม่ำเสมอ "
                              "เมืองที่มีความแปรปรวนสูงระหว่างตัวชี้วัดจะได้คะแนนน้อยกว่า"
                              "เมืองที่มีค่าเฉลี่ยใกล้เคียงกันแต่ความแปรปรวนต่ำกว่า "
                              "นั่นทำให้ไม่สามารถชดเชยตัวชี้วัดที่แย่ด้วยการเด่นในด้านอื่นได้"),
        "sec_1_3":          "1.3 คะแนน SLIC รวม",
        "sec_1_4":          "1.4 รายได้ใช้สอยคงเหลือปรับด้วย PPP (DI_PPP)",
        "sec_1_4_body":     ("ตัวชี้วัดเอกลักษณ์ของ SLIC วัดรายได้เดือนคงเหลือหลังหักค่าใช้จ่าย"
                              "จำเป็นทั้งหมด แปลงเป็นดอลลาร์สหรัฐปรับด้วย PPP เพื่อเทียบเมืองใน"
                              "บริบทเศรษฐกิจต่างกันได้"),
        "pillar_intros": {
            "Growth":     ("เสา Growth วัดว่าเมืองสร้างเงื่อนไขให้ผู้คนสร้างชีวิตที่ผลิตได้"
                           "ทางเศรษฐกิจหรือไม่: รายได้คงเหลือหลังค่าใช้จ่าย ความหนาแน่นของ"
                           "สตาร์ทอัพและนวัตกรรม เสรีภาพพลเมือง และโมเมนตัมเศรษฐกิจกว้าง ๆ"),
            "Viability":  ("เสา Viability วัดว่าเมืองน่าอยู่ในชีวิตประจำวันหรือไม่: ความปลอดภัย"
                           "ส่วนบุคคล คุณภาพอากาศ ระบบสุขภาพ ภาระค่าที่อยู่อาศัย การเข้าถึงน้ำ "
                           "เสถียรภาพทางภูมิอากาศ และพลังประชากร"),
            "Capability": ("เสา Capability วัดคุณภาพโครงสร้างพื้นฐานของเมือง: ความครอบคลุม"
                           "ระบบขนส่ง การเชื่อมต่อดิจิทัล ธรรมาภิบาลดิจิทัล คุณภาพการศึกษา "
                           "ความเดินได้ โครงสร้างพื้นฐานจักรยาน และสัดส่วนพลังงานสะอาด"),
            "Community":  ("เสา Community วัดว่าเมืองเปิดกว้างจริงหรือไม่: สิทธิ LGBTQ+ "
                           "เสรีภาพทางศาสนา การผสานผู้อพยพ ความเหลื่อมล้ำทางรายได้ ความไว้วางใจ"
                           "ทางสังคม ความเท่าเทียมทางเพศ และการอยู่ต่อในวันหยุด"),
            "Creative":   ("เสา Creative วัดความอุดมทางวัฒนธรรมสำหรับผู้อยู่อาศัย ไม่ใช่"
                           "นักท่องเที่ยว: ความหนาแน่นของสถานที่ทางวัฒนธรรม มรดก UNESCO "
                           "ความหลากหลายอาหาร ชีวิตกลางคืน ทุนศิลปะ สัดส่วนการจ้างงานสร้างสรรค์ "
                           "และความหนาแน่นของงานระดับนานาชาติ"),
        },
        "pillar_subtitles": {
            "Growth":     "พลวัตเศรษฐกิจและโอกาส (น้ำหนัก 25%)",
            "Viability":  "ความน่าอยู่และความปลอดภัยในชีวิตจริง (น้ำหนัก 22%)",
            "Capability": "คุณภาพโครงสร้างพื้นฐานและระบบ (น้ำหนัก 18%)",
            "Community":  "ความเป็นส่วนหนึ่ง ความอดทน และความเท่าเทียม (น้ำหนัก 15%)",
            "Creative":   "ความอุดมทางวัฒนธรรมและเศรษฐกิจสร้างสรรค์ (น้ำหนัก 20%)",
        },
        "ch7_title":  "แหล่งข้อมูล",
        "ch7_body":   ("SLIC ใช้ลำดับชั้นแหล่งข้อมูล 5 ระดับ ระดับ 1 (ข้อมูลเมืองอย่างเป็นทางการ) "
                       "เป็นแหล่งที่พึงใช้ก่อน ลำดับรองลงไปคือ ระดับ 2 (ระดับจังหวัด/รัฐ) → "
                       "ระดับ 3 (ระดับชาติ/นานาชาติ) → ระดับ 4 (แหล่งรองที่ผ่านการตรวจสอบ) → "
                       "ระดับ 5 (การประเมินของนักวิเคราะห์) "
                       "ระดับแหล่งข้อมูลของแต่ละตัวชี้วัดแสดงอยู่ในหน้าข้อมูลรายเมือง"),
        "tier_table_header": ["ระดับ", "ประเภท", "ตัวอย่าง"],
        "tier_rows": [
            ("1", "เมือง / มหานคร อย่างเป็นทางการ", "Municipal open data portals, utility feeds, transit GTFS"),
            ("2", "ระดับจังหวัด / รัฐ", "State, provincial, or regional government data"),
            ("3", "ระดับชาติ / นานาชาติ อย่างเป็นทางการ", "World Bank, WHO, ILO, UNESCO, OECD, WIPO, UN Agencies"),
            ("4", "แหล่งรองที่ตรวจสอบได้ & ทดลอง", "OpenAQ, Copernicus CAMS, M-Lab NDT, satellite remote sensing"),
            ("5", "การประเมินของนักวิเคราะห์", "SLIC analyst cross-reference and lived-experience review"),
        ],
        "primary_sources": "องค์กรแหล่งข้อมูลหลัก",
        "ch8_title":  "เกรดความครอบคลุม",
        "ch8_body":   ("SLIC ไม่เติมค่าที่ขาดหาย หากตัวชี้วัดไม่มี ตัวชี้วัดนั้นจะถูกตัดออกจาก"
                       "การรวมคะแนนเสาหลัก และจะถูกลงโทษด้วยคะแนนความครอบคลุม "
                       "เกรดความครอบคลุมถูกเผยแพร่คู่กับคะแนนของทุกเมือง"),
        "cov_table_header": ["เกรด", "เงื่อนไข", "การลดคะแนน", "การตีความ"],
        "cov_rows": [
            ("A", "≥ 6 จาก 7 ตัวชี้วัด (หรือ ≥ 5 จาก 5–6 ในเสาที่มีตัวชี้วัดน้อย)", "ไม่มี", "มั่นใจในคะแนนเสาหลักได้เต็มที่"),
            ("B", "≥ 4 ตัวชี้วัด", "−5 คะแนน", "คะแนนเชื่อถือได้แต่ควรตีความอย่างระวัง"),
            ("C", "≤ 3 ตัวชี้วัด", "−15 คะแนน ติดธง provisional", "ใช้เป็นการบ่งชี้เท่านั้น มีช่องว่างข้อมูลสำคัญ"),
        ],
        "ch8_note":   ("การลดคะแนนใช้หลังจากคำนวณ AMPI ที่ระดับเสาหลัก และไม่ต่ำกว่าศูนย์ "
                       "เกรดความครอบคลุมรวมสะท้อนเกรดเสาที่แย่ที่สุดของเมืองนั้น "
                       "เมืองจะไม่ถูกซ่อนเพราะความครอบคลุมต่ำ — ความครอบคลุมต่ำจะถูกแสดงให้เห็น "
                       "ไม่ใช่ปกปิด"),
        "ch9_title":  "อันดับเมืองที่เผยแพร่",
        "ch9_body_fmt": ("เมืองที่เผยแพร่ทั้งหมด {n} เมือง จัดเรียงตามคะแนน SLIC รวม "
                         "คะแนนปัดเศษหนึ่งตำแหน่ง ให้มีอันดับเท่ากันได้ — เมืองที่ปัดเศษเท่ากัน"
                         "จะใช้อันดับเดียวกัน คอลัมน์เสาหลัก: "
                         "G = Growth, V = Viability, Cap = Capability, Com = Community, Cr = Creative"),
        "ranks_header": ["#", "เมือง", "ประเทศ", "SLIC", "G", "V", "Cap", "Com", "Cr", "เกรด"],
        "ch10_title": "หลักการออกแบบ",
        "principles": [
            ("การให้คะแนนแบบสัมบูรณ์",
             "จุดยึดถูกตรึงที่เกณฑ์ในโลกจริง คะแนนของเมืองไม่เปลี่ยนเมื่อมีเมืองใหม่เข้าดัชนี การเพิ่มเมืองที่ 501 ไม่เปลี่ยนเมือง 1–500"),
            ("โปร่งใสและไล่ย้อนได้",
             "คะแนนที่เผยแพร่ทุกค่าไล่ย้อนกลับไปยังจุดข้อมูลดิบ ฟังก์ชันปรับเทียบ และแหล่งข้อมูลที่มีชื่อ ไฟล์การคำนวณดาวน์โหลดได้สาธารณะ"),
            ("ลงโทษความไม่สมดุล",
             "สูตรรวม AMPI ทำให้เมืองไม่สามารถชดเชยการทำได้แย่มากในเสาหนึ่งด้วยการเด่นในเสาอื่น ความไม่สมดุลสุดโต่งถูกลงโทษเชิงโครงสร้าง"),
            ("ซื่อสัตย์ต่อช่องว่างข้อมูล",
             "ข้อมูลที่ขาดไม่ถูกเติม ช่องว่างถูกแสดงด้วยเกรดความครอบคลุมและการลดคะแนน เมืองที่ความครอบคลุมต่ำถูกแสดง ไม่ปิดบัง"),
            ("ขยายได้โดยไม่ต้องแก้ย้อนหลัง",
             "เพิ่มเมืองใหม่เข้าดัชนีได้โดยไม่ต้องคำนวณคะแนนเก่าใหม่ ระเบียบวิธีไม่ต้องการการปรับย้อนหลังเมื่อจักรวาลเมืองขยาย"),
            ("ต้านการเกมคะแนน",
             "ดัชนีถูกออกแบบเพื่อให้เมืองไม่สามารถเล่นคะแนนได้ง่ายด้วยการปรับเฉพาะตัวแปรที่มองเห็น สูตร DI_PPP การลงโทษ AMPI และการลงโทษความไม่สมดุลล้วนยากที่จะหลอกถ้าไม่ได้ปรับปรุงเมืองจริง ๆ"),
        ],
        "ch11_title": "อภิธานสัญลักษณ์",
        "glossary_header": ["สัญลักษณ์ / คำศัพท์", "นิยาม"],
        "colophon":   ("SLIC Index V3 · slic.index · เมษายน 2569 · จัดพิมพ์โดย SLIC ร่วมกับ "
                       "DEPA ประเทศไทย, PMU-A และ ReTL คำถามเกี่ยวกับระเบียบวิธี: "
                       "ติดต่อผ่าน depa.or.th หรือเว็บไซต์ SLIC"),
        "header_footer": "SLIC Index V3 — เอกสารทางเทคนิคว่าด้วยระเบียบวิธี",
        "page_word":   "หน้า",
    },

    # ── Chinese (Simplified) ──────────────────────────────────────────────────
    "zh": {
        "paper_title":      "SLIC 指数 V3",
        "paper_subtitle":   "方法论技术白皮书",
        "date":             "2026 年 4 月",
        "authors":          "作者：侬·阿卡拉 · 蓬·铁曼布拉纳塔姆 副教授",
        "published_by":     "由 SLIC 与 ReTL（The Reason to Live Company）联合出版",
        "partnership":      "与泰国 DEPA（数字经济促进局）及 PMU-A 合作",
        "cover_note":       ("本文档完整记录了 SLIC 指数 V3 的评分方法论：指标定义、"
                              "归一化锚点表、聚合公式、覆盖度等级，以及 160 座已发布"
                              "城市的完整排名。"),
        "exec_title":       "执行摘要",
        "exec_intro":       ("SLIC 指数（智慧宜居城市指数）V3 是一个透明、开源的城市排名系统，"
                              "衡量那些正在城市中建立生活的人们的生活质量——不是游客，"
                              "不是享受艰苦津贴的外派高管，也不是追逐回报的全球资本。"
                              "指数覆盖 160 座已发布的城市，数据集以亚太地区为中心但"
                              "涵盖全球。基于 35 项指标，分为五大支柱进行评分。"),
        "five_pillars":     "五大支柱：",
        "pillar_header_rows": [
            ("支柱", "权重", "衡量内容"),
            ("Growth（增长）", "25%", "经济活力、可支配收入、创业密度、公民自由"),
            ("Viability（宜居）", "22%", "安全、空气质量、医疗、住房可负担性、水资源"),
            ("Capability（能力）", "18%", "交通、数字基础设施、教育、可再生能源、可步行性"),
            ("Community（社区）", "15%", "包容性、LGBTQ+权利、性别平等、社会信任、收入不平等"),
            ("Creative（创新）", "20%", "文化场所、餐饮多样性、艺术资金、创意就业"),
        ],
        "absolute_title":   "绝对评分哲学：",
        "absolute_bullets": [
            "所有指标均以固定的绝对基准进行归一化——加入第 501 座城市永远不会改变任何现有城市的分数。",
            "归一化分数越高始终代表城市表现越好；有害指标在归一化步骤中进行反向评分。",
            "调整后的马齐奥塔-帕累托指数（AMPI）聚合公式会惩罚支柱失衡：一座仅有一项出色但其他四项较差的城市，得分低于五项均为中等的城市。",
            "缺失数据从不插补。指标数量低于最低要求的城市将获得覆盖度惩罚（−5 或 −15 分）并标注可见等级。",
            "每个数据来源都明确标注。每个分数都可追溯至原始数据点、归一化函数与公开数据源。",
        ],
        "ch1_title":        "评分框架",
        "sec_1_1":          "1.1 分段线性归一化",
        "sec_1_1_body":     ("每个原始指标值通过一组固定的绝对锚点映射为 0–100 的分数。"
                              "锚点之间采用线性插值，超出最外侧锚点的值被截断为 0 或 100。"
                              "对于值越低越好的指标，锚点映射方向反转，使较低的原始值得到"
                              "更高的归一化分数。"),
        "sec_1_2":          "1.2 支柱聚合（AMPI）",
        "sec_1_2_body":     ("在每个支柱内，各指标分数使用调整后的马齐奥塔-帕累托指数（AMPI）"
                              "进行聚合。AMPI 惩罚表现不均：指标间方差较大的城市，得分低于"
                              "均值相近但方差较小的城市。这使得一个指标的灾难性表现无法"
                              "通过其他指标的出色表现加以补偿。"),
        "sec_1_3":          "1.3 SLIC 总分",
        "sec_1_4":          "1.4 PPP 调整后的可支配收入（DI_PPP）",
        "sec_1_4_body":     ("SLIC 的标志性指标。衡量扣除所有必要成本后剩余的月度可支配收入，"
                              "并换算为 PPP 调整后的美元，以便在经济环境差异较大的城市间"
                              "进行比较。"),
        "pillar_intros": {
            "Growth":     ("Growth 支柱衡量城市是否为人们建立具有经济生产力的生活创造了条件："
                           "扣除成本后的可支配收入、创业与创新密度、公民自由，以及宏观经济动能。"),
            "Viability":  ("Viability 支柱衡量城市在日常生活层面是否宜居：人身安全、"
                           "空气质量、医疗、住房成本负担、水资源获取、气候稳定性与人口活力。"),
            "Capability": ("Capability 支柱衡量城市基础设施质量：交通覆盖、数字连接、"
                           "数字治理、教育质量、可步行性、自行车基础设施与可再生能源占比。"),
            "Community":  ("Community 支柱衡量城市是否真正开放：LGBTQ+权利、宗教自由、"
                           "移民融合、收入不平等、社会信任、性别平等，以及周末留驻率"
                           "（居民是否选择留下的代理指标）。"),
            "Creative":   ("Creative 支柱衡量居民（而非游客）所经历的文化丰富度："
                           "文化场所密度、UNESCO 遗产可达性、餐饮多样性、夜生活、"
                           "艺术资金、创意就业占比与国际活动密度。"),
        },
        "pillar_subtitles": {
            "Growth":     "经济活力与机会（权重 25%）",
            "Viability":  "日常宜居与安全（权重 22%）",
            "Capability": "基础设施与系统质量（权重 18%）",
            "Community":  "归属、包容与社会公平（权重 15%）",
            "Creative":   "文化丰富度与创意经济（权重 20%）",
        },
        "ch7_title":  "数据来源",
        "ch7_body":   ("SLIC 采用五层数据源层级。第 1 层（城市官方）优先使用；"
                       "回退顺序为：第 2 层（次国家级）→ 第 3 层（国家/国际级）→ "
                       "第 4 层（经审核的次级/实验来源）→ 第 5 层（分析师评估）。"
                       "每个已发布指标的数据源层级显示在城市评分卡页面上。"),
        "tier_table_header": ["层级", "类别", "示例"],
        "tier_rows": [
            ("1", "城市 / 都会区官方", "Municipal open data portals, utility feeds, transit GTFS"),
            ("2", "次国家级官方", "State, provincial, or regional government data"),
            ("3", "国家 / 国际级官方", "World Bank, WHO, ILO, UNESCO, OECD, WIPO, UN Agencies"),
            ("4", "经审核的次级与实验来源", "OpenAQ, Copernicus CAMS, M-Lab NDT, satellite remote sensing"),
            ("5", "分析师评估", "SLIC analyst cross-reference and lived-experience review"),
        ],
        "primary_sources": "主要数据源机构",
        "ch8_title":  "覆盖度等级",
        "ch8_body":   ("SLIC 不对缺失值进行插补。当指标不可用时，该指标将从支柱聚合中"
                       "排除，并应用覆盖度惩罚。覆盖度等级与每个城市的分数一同发布。"),
        "cov_table_header": ["等级", "条件", "惩罚", "解读"],
        "cov_rows": [
            ("A", "7 项指标中 ≥ 6 项（或 5–6 项指标支柱中 ≥ 5 项）", "无", "对支柱得分完全可信"),
            ("B", "≥ 4 项指标", "−5 分", "得分可靠，但需审慎解读"),
            ("C", "≤ 3 项指标", "−15 分，标为临时值", "仅作参考；存在显著数据缺口"),
        ],
        "ch8_note":   ("惩罚在支柱级 AMPI 计算后施加，并以 0 为下限。"
                       "整体覆盖度等级反映该城市最差的支柱等级。"
                       "城市不会因为覆盖度低而被隐藏——低覆盖度会被显现，而非掩盖。"),
        "ch9_title":  "已发布城市排名",
        "ch9_body_fmt": ("所有 {n} 座已发布城市按 SLIC 总分排序。分数四舍五入到一位小数。"
                         "允许并列——四舍五入后分数相同的城市共享同一排名。"
                         "支柱列标题：G = Growth, V = Viability, Cap = Capability, "
                         "Com = Community, Cr = Creative。"),
        "ranks_header": ["#", "城市", "国家", "SLIC", "G", "V", "Cap", "Com", "Cr", "等级"],
        "ch10_title": "设计原则",
        "principles": [
            ("绝对评分",
             "锚点固定于现实世界的阈值。城市分数不会因新城市加入指数而改变。加入第 501 座城市不会改变第 1–500 座城市的分数。"),
            ("透明可追溯",
             "每个已发布分数都可追溯至原始数据点、归一化函数与具名来源。评分工作簿可公开下载。"),
            ("惩罚失衡",
             "AMPI 聚合公式意味着一座城市无法通过在其他支柱上的出色表现来弥补某一支柱上的灾难性表现。极端失衡将在结构上受到惩罚。"),
            ("坦诚面对数据缺口",
             "缺失数据从不插补。缺口通过可见的覆盖度等级与惩罚加以标示。低覆盖度城市被显示，而非隐藏。"),
            ("可扩展且无需修订",
             "可以将新城市加入指数而无需重新计算现有分数。当城市宇宙扩展时，方法论无需回溯修订。"),
            ("抗套路化",
             "指数的设计使城市难以通过仅优化可见代理指标来操纵分数。DI_PPP 公式、AMPI 惩罚与失衡惩罚都难以在不真正改善城市状况的情况下被操控。"),
        ],
        "ch11_title": "符号术语表",
        "glossary_header": ["符号 / 术语", "定义"],
        "colophon":   ("SLIC 指数 V3 · slic.index · 2026 年 4 月 · "
                       "由 SLIC 与泰国 DEPA、PMU-A、ReTL 联合出版。"
                       "方法论咨询：通过 depa.or.th 或 SLIC 网站联系。"),
        "header_footer": "SLIC 指数 V3 — 方法论技术白皮书",
        "page_word":   "第  页",
    },
}


# ── Styles ────────────────────────────────────────────────────────────────────
def make_styles(locale: str) -> dict:
    """Build a style set keyed by name. Uses locale-specific fonts."""
    main_font = font_for(locale)
    bold_font = font_for(locale, "bold")

    base = getSampleStyleSheet()
    S = {}

    def add(name, **kw):
        parent = kw.pop("parent", base["BodyText"])
        S[name] = ParagraphStyle(name=name, parent=parent, **kw)

    add("Cover1",
        fontSize=32, leading=38, fontName=bold_font,
        textColor=C_TEXT, alignment=TA_LEFT, spaceBefore=0, spaceAfter=6)
    add("Cover2",
        fontSize=14, leading=20, fontName=main_font,
        textColor=C_ACCENT, alignment=TA_LEFT, spaceAfter=4)
    add("CoverMeta",
        fontSize=9, leading=13, fontName=main_font,
        textColor=C_MUTED, alignment=TA_LEFT, spaceAfter=2)
    add("ChapterNum",
        fontSize=10, leading=13, fontName=bold_font,
        textColor=C_ACCENT, spaceBefore=10, spaceAfter=2)
    add("ChapterTitle",
        fontSize=18, leading=24, fontName=bold_font,
        textColor=C_TEXT, spaceBefore=0, spaceAfter=8)
    add("SectionHead",
        fontSize=12, leading=16, fontName=bold_font,
        textColor=C_TEXT, spaceBefore=12, spaceAfter=6)
    add("Body",
        fontSize=9.5, leading=14, fontName=main_font,
        textColor=C_TEXT, spaceAfter=6)
    add("BodySmall",
        fontSize=8.5, leading=12.5, fontName=main_font,
        textColor=C_TEXT, spaceAfter=4)
    add("Lead",
        fontSize=11, leading=16, fontName=main_font,
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
        fontSize=8, leading=11, fontName=main_font,
        textColor=C_FAINT, spaceAfter=4)
    add("TableHead",
        fontSize=8, leading=11, fontName=bold_font,
        textColor=C_TEXT, alignment=TA_LEFT)
    add("TableBody",
        fontSize=8, leading=11, fontName=main_font,
        textColor=C_TEXT, alignment=TA_LEFT)
    add("TableBodyR",
        fontSize=8, leading=11, fontName=main_font,
        textColor=C_TEXT, alignment=TA_RIGHT)
    add("TableBodyC",
        fontSize=8, leading=11, fontName=main_font,
        textColor=C_TEXT, alignment=TA_CENTER)
    # Latin-only styles for the fully English anchor tables / indicator names
    add("TableHeadLatin",
        fontSize=8, leading=11, fontName="Helvetica-Bold",
        textColor=C_TEXT, alignment=TA_LEFT)
    add("TableBodyLatin",
        fontSize=8, leading=11, fontName="Helvetica",
        textColor=C_TEXT, alignment=TA_LEFT)
    add("TableBodyLatinR",
        fontSize=8, leading=11, fontName="Helvetica",
        textColor=C_TEXT, alignment=TA_RIGHT)
    add("TableBodyLatinC",
        fontSize=8, leading=11, fontName="Helvetica",
        textColor=C_TEXT, alignment=TA_CENTER)
    add("BodyLatin",
        fontSize=9, leading=13, fontName="Helvetica",
        textColor=C_TEXT, spaceAfter=4)
    add("CaptionLatin",
        fontSize=8, leading=11, fontName="Helvetica-Oblique",
        textColor=C_FAINT, spaceAfter=4)

    return S


# ── Table helpers ─────────────────────────────────────────────────────────────
def hdr_style(bg=None):
    bg = bg or C_BG_HEAD
    return TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), bg),
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
    """Five-column anchor table: Raw value → Score. Always Latin (numeric)."""
    bg = pillar_color or C_BG_HEAD
    header = [
        Paragraph("Raw value", S["TableHeadLatin"]),
        Paragraph("Score", S["TableHeadLatin"]),
    ]
    body = [
        [Paragraph(str(r[0]), S["TableBodyLatinR"]), Paragraph(str(r[1]), S["TableBodyLatinC"])]
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
    """Indicator header + anchor table, always rendered in English (Latin font)."""
    dir_label = "↑ Higher is better" if direction == "higher" else "↓ Lower is better"
    items = [
        Paragraph(f"<b>{code} — {name}</b>",
                  ParagraphStyle("IndHead", fontSize=12, leading=16,
                                  fontName="Helvetica-Bold", textColor=C_TEXT,
                                  spaceBefore=12, spaceAfter=6)),
        Paragraph(
            f"Unit: {unit} &nbsp;·&nbsp; Direction: {dir_label} &nbsp;·&nbsp; Source: {source}",
            S["CaptionLatin"]
        ),
    ]
    if note:
        items.append(Paragraph(note, S["BodyLatin"]))
    items.append(anchor_table(S, anchor_rows, pillar_color))
    items.append(Spacer(1, 4 * mm))
    return KeepTogether(items)


# ── Header / Footer ───────────────────────────────────────────────────────────
def make_footer_fn(locale: str):
    page_word = COPY[locale]["page_word"]
    footer_text = COPY[locale]["header_footer"]
    footer_font = font_for(locale)

    def draw(canvas, doc):
        canvas.saveState()
        page_w, page_h = A4
        y_foot = 10 * mm
        canvas.setFont(footer_font, 7.5)
        canvas.setFillColor(C_FAINT)
        canvas.drawString(doc.leftMargin, y_foot, footer_text)
        if canvas.getPageNumber() > 1:
            canvas.setFont("Helvetica", 7.5)
            canvas.drawRightString(page_w - doc.rightMargin, y_foot,
                                    f"{page_word} {canvas.getPageNumber()}"
                                    if locale != "zh" else f"{canvas.getPageNumber()} / {page_word}")
        canvas.setStrokeColor(C_RULE)
        canvas.setLineWidth(0.3)
        canvas.line(doc.leftMargin, page_h - 12 * mm, page_w - doc.rightMargin, page_h - 12 * mm)
        canvas.restoreState()

    return draw


# ── City data ─────────────────────────────────────────────────────────────────
def load_cities():
    with open(CITY_DATA) as f:
        data = json.load(f)
    cities = [c for c in data["cities"] if c.get("rankingStatus") == "Ranked"]
    cities.sort(key=lambda c: c["rank"])
    return cities


def _fmt(v):
    return f"{v:.1f}" if v is not None else "—"


# ── Diagram: pentagon radar (cover) ───────────────────────────────────────────
RADAR_CAPTIONS = {
    "en": "Five pillars. Fifty-point symmetry. Absolute anchors.",
    "th": "ห้าเสาหลัก สมมาตรห้าสิบจุด จุดยึดสัมบูรณ์",
    "zh": "五大支柱。五十点对称。绝对锚点。",
}
RADAR_LABELS = {
    "en": ["Growth", "Viability", "Capability", "Community", "Creative"],
    "th": ["Growth", "Viability", "Capability", "Community", "Creative"],
    "zh": ["Growth", "Viability", "Capability", "Community", "Creative"],
}


def draw_pentagon_radar(locale: str, width_pt: float = 340) -> Drawing:
    """A 5-spoke pentagon radar armature — no filled score polygon."""
    d = Drawing(width_pt, width_pt * 0.78)
    cx, cy = width_pt / 2, width_pt * 0.42
    r = width_pt * 0.28
    n = 5
    angles = [math.pi / 2 + 2 * math.pi * i / n for i in range(n)]

    # Grid rings at 25 / 50 / 75 / 100
    for frac in (0.25, 0.50, 0.75, 1.0):
        pts = []
        for a in angles:
            pts.extend([cx + r * frac * math.cos(a), cy + r * frac * math.sin(a)])
        poly = Polygon(points=pts)
        poly.strokeColor = C_RULE
        poly.strokeWidth = 0.4 if frac < 1.0 else 0.8
        poly.fillColor = None
        d.add(poly)

    # Spokes
    for a in angles:
        line = Line(cx, cy, cx + r * math.cos(a), cy + r * math.sin(a))
        line.strokeColor = C_RULE
        line.strokeWidth = 0.4
        d.add(line)

    # Vertex dots (amber)
    for a in angles:
        from reportlab.graphics.shapes import Circle
        dot = Circle(cx + r * math.cos(a), cy + r * math.sin(a), 2.5)
        dot.fillColor = C_ACCENT
        dot.strokeColor = None
        d.add(dot)

    # Labels
    label_r = r + 18
    for a, label in zip(angles, RADAR_LABELS[locale]):
        lx = cx + label_r * math.cos(a)
        ly = cy + label_r * math.sin(a)
        s = String(lx, ly - 3, label)
        s.fontName = "Helvetica-Bold"
        s.fontSize = 8.5
        s.fillColor = C_TEXT
        if math.cos(a) > 0.3:
            s.textAnchor = "start"
        elif math.cos(a) < -0.3:
            s.textAnchor = "end"
        else:
            s.textAnchor = "middle"
        d.add(s)

    return d


# ── Diagram: coverage grade distribution (Chapter 8) ─────────────────────────
def draw_coverage_histogram(locale: str, cities: list, width_pt: float = 440) -> Drawing:
    """Horizontal bar chart showing count of cities per coverage grade."""
    counts = {"A": 0, "B": 0, "C": 0, "D": 0, "F": 0}
    for c in cities:
        g = c.get("coverageGrade", "")
        if g in counts:
            counts[g] += 1
    # Drop empty grades
    active = [(g, n) for g, n in counts.items() if n > 0]
    total = sum(n for _, n in active) or 1

    row_h = 26
    h = row_h * len(active) + 30
    d = Drawing(width_pt, h)

    # Palette per grade
    grade_colors = {
        "A": colors.HexColor("#1a6b5a"),
        "B": colors.HexColor("#b85c28"),
        "C": colors.HexColor("#a0382a"),
        "D": colors.HexColor("#8c4a2a"),
        "F": colors.HexColor("#5a3a3a"),
    }

    # Bar origin
    label_w = 100
    bar_x = label_w + 10
    max_bar_w = width_pt - bar_x - 90
    max_n = max(n for _, n in active) or 1

    # Title (dynamic city count)
    n_total = sum(counts.values())
    title = String(0, h - 14, {
        "en": f"Coverage grade distribution across {n_total} cities",
        "th": f"การกระจายเกรดความครอบคลุมในเมือง {n_total} แห่ง",
        "zh": f"{n_total} 座城市的覆盖度等级分布",
    }[locale])
    title.fontName = "Helvetica-Bold"
    title.fontSize = 9
    title.fillColor = C_TEXT
    d.add(title)

    for i, (grade, n) in enumerate(active):
        y = h - 30 - i * row_h
        bar_w = (n / max_n) * max_bar_w

        # Grade label
        gl = String(0, y + 3, f"Grade {grade}")
        gl.fontName = "Helvetica-Bold"
        gl.fontSize = 10
        gl.fillColor = grade_colors.get(grade, C_TEXT)
        d.add(gl)

        # Bar
        r = Rect(bar_x, y, bar_w, 14)
        r.fillColor = grade_colors.get(grade, C_TEXT)
        r.strokeColor = None
        d.add(r)

        # Count + percentage (with proper singular/plural for English)
        pct = n / total * 100
        unit = {
            "en": "city" if n == 1 else "cities",
            "th": "เมือง",
            "zh": "座",
        }[locale]
        s = String(bar_x + bar_w + 8, y + 3, f"{n} {unit}  ({pct:.1f}%)")
        s.fontName = "Helvetica"
        s.fontSize = 9
        s.fillColor = C_TEXT
        d.add(s)

    return d


# ── Pillar definitions (English technical content, reused across locales) ─────
PILLARS = [
    ("Growth", "2", C_GROWTH, [
        ("G1", "Real GDP Growth (5-year avg)", "% per annum", "higher", "IMF World Economic Outlook; OECD Regional Statistics",
         [("≤ 0", "0"), ("1.0", "25"), ("2.5", "50"), ("4.0", "75"), ("≥ 6.0", "100")], None),
        ("G2", "Startup Density", "per 100,000 population", "higher", "Crunchbase; Dealroom",
         [("≤ 5", "0"), ("20", "25"), ("50", "50"), ("100", "75"), ("≥ 200", "100")], None),
        ("G3", "VC Investment Intensity", "USD per capita, 3-year avg", "higher", "Crunchbase; PitchBook",
         [("≤ 5", "0"), ("50", "25"), ("200", "50"), ("500", "75"), ("≥ 1,500", "100")], None),
        ("G4", "Ease of Doing Business", "0–100 index", "higher", "World Bank B-READY Index",
         [("0", "0"), ("25", "25"), ("50", "50"), ("75", "75"), ("100", "100")], "Direct passthrough; no transformation required."),
        ("G5", "Civic Freedom", "0–100 composite", "higher", "Freedom House (0.6) + V-Dem Liberal Democracy Index (0.4)",
         [("0", "0"), ("25", "25"), ("50", "50"), ("75", "75"), ("100", "100")],
         "Composite: 0.6 × FH_rescaled(0–100) + 0.4 × V-Dem_rescaled(0–100). Direct passthrough after composite."),
        ("G6", "Patent Applications", "per 100,000 population, 3-year avg", "higher", "World Intellectual Property Organization (WIPO)",
         [("≤ 2", "0"), ("15", "25"), ("40", "50"), ("80", "75"), ("≥ 150", "100")], None),
        ("G7", "High-Skill Employment", "% ISCO categories 1–3", "higher", "International Labour Organization (ILO); LinkedIn Workforce Insights",
         [("≤ 10", "0"), ("20", "25"), ("30", "50"), ("40", "75"), ("≥ 55", "100")], None),
    ]),
    ("Viability", "3", C_VIAB, [
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
    ]),
    ("Capability", "4", C_CAP, [
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
    ]),
    ("Community", "5", C_COMM, [
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
    ]),
    ("Creative", "6", C_CREAT, [
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
    ]),
]

SOURCES = [
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

GLOSSARY = [
    ("c",            {"en": "City or functional urban area being evaluated",
                       "th": "เมืองหรือพื้นที่เมืองเชิงหน้าที่ที่กำลังประเมิน",
                       "zh": "正在评估的城市或功能城市区域"}),
    ("m",            {"en": "Metric index (individual indicator within a pillar)",
                       "th": "ดัชนีตัวชี้วัด (ตัวชี้วัดเดี่ยวภายในเสาหลัก)",
                       "zh": "指标索引（支柱内的单个指标）"}),
    ("p",            {"en": "Pillar index (one of the five thematic pillars)",
                       "th": "ดัชนีเสาหลัก (หนึ่งในห้าเสาหลัก)",
                       "zh": "支柱索引（五大主题支柱之一）"}),
    ("x_m(c)",       {"en": "Raw observed metric value for city c on metric m",
                       "th": "ค่าตัวชี้วัดดิบของเมือง c ในตัวชี้วัด m",
                       "zh": "城市 c 在指标 m 上的原始观测值"}),
    ("s_m(c)",       {"en": "Normalized metric score for city c on metric m, range [0, 100]",
                       "th": "คะแนนตัวชี้วัดที่ปรับเทียบแล้วของเมือง c ในตัวชี้วัด m ช่วง [0, 100]",
                       "zh": "城市 c 在指标 m 上归一化后的分数，范围 [0, 100]"}),
    ("μ",            {"en": "Arithmetic mean of normalized scores within a pillar or across pillars",
                       "th": "ค่าเฉลี่ยเลขคณิตของคะแนนที่ปรับเทียบแล้วในเสาหลักหรือข้ามเสา",
                       "zh": "支柱内或跨支柱归一化分数的算术平均值"}),
    ("σ",            {"en": "Population standard deviation of scores within a pillar or across pillars",
                       "th": "ส่วนเบี่ยงเบนมาตรฐานประชากรของคะแนนในเสาหลักหรือข้ามเสา",
                       "zh": "支柱内或跨支柱分数的总体标准差"}),
    ("cv",           {"en": "Coefficient of variation: σ / μ",
                       "th": "สัมประสิทธิ์การแปรผัน: σ / μ",
                       "zh": "变异系数：σ / μ"}),
    ("AMPI",         {"en": "Adjusted Mazziotta–Pareto Index: μ − σ²/μ",
                       "th": "ดัชนี Mazziotta–Pareto ที่ปรับแล้ว: μ − σ²/μ",
                       "zh": "调整后的马齐奥塔-帕累托指数：μ − σ²/μ"}),
    ("p05_m, p95_m", {"en": "5th and 95th percentile bounds for metric m, frozen at first publication",
                       "th": "ขอบเขตเปอร์เซ็นไทล์ที่ 5 และ 95 ของตัวชี้วัด m ที่ตรึงไว้เมื่อเผยแพร่ครั้งแรก",
                       "zh": "指标 m 的 5 与 95 分位边界，于首次发布时冻结"}),
    ("DI_PPP(c)",    {"en": "PPP-adjusted monthly disposable income after essential costs for city c",
                       "th": "รายได้คงเหลือรายเดือนของเมือง c ปรับด้วย PPP หลังหักค่าใช้จ่ายจำเป็น",
                       "zh": "城市 c 扣除必要成本后经 PPP 调整的月度可支配收入"}),
    ("α_(p,m)",      {"en": "Metric weight of indicator m inside pillar p",
                       "th": "น้ำหนักตัวชี้วัด m ภายในเสาหลัก p",
                       "zh": "支柱 p 内指标 m 的权重"}),
    ("γ_m",          {"en": "Coverage weight for metric m (used in coverage ratio computation)",
                       "th": "น้ำหนักความครอบคลุมของตัวชี้วัด m (ใช้ในการคำนวณอัตราส่วนความครอบคลุม)",
                       "zh": "指标 m 的覆盖度权重（用于覆盖率计算）"}),
    ("w_p",          {"en": "Public pillar weight (Growth 0.25, Viability 0.22, Capability 0.18, Community 0.15, Creative 0.20)",
                       "th": "น้ำหนักเสาหลักสาธารณะ (Growth 0.25, Viability 0.22, Capability 0.18, Community 0.15, Creative 0.20)",
                       "zh": "公开支柱权重（Growth 0.25, Viability 0.22, Capability 0.18, Community 0.15, Creative 0.20）"}),
    ("HAQ",          {"en": "Healthcare Access and Quality Index (IHME/Lancet)",
                       "th": "ดัชนีการเข้าถึงและคุณภาพระบบสุขภาพ (IHME/Lancet)",
                       "zh": "医疗可及性与质量指数（IHME/Lancet）"}),
    ("GPI",          {"en": "Global Peace Index (Institute for Economics and Peace)",
                       "th": "ดัชนีสันติภาพโลก (Institute for Economics and Peace)",
                       "zh": "全球和平指数（经济与和平研究所）"}),
    ("GII",          {"en": "Gender Inequality Index (UNDP)",
                       "th": "ดัชนีความเหลื่อมล้ำทางเพศ (UNDP)",
                       "zh": "性别不平等指数（UNDP）"}),
    ("GRI",          {"en": "Government Restrictions Index (Pew Research Center)",
                       "th": "ดัชนีข้อจำกัดของรัฐบาล (Pew Research Center)",
                       "zh": "政府限制指数（皮尤研究中心）"}),
    ("EGDI",         {"en": "E-Government Development Index (United Nations)",
                       "th": "ดัชนีการพัฒนารัฐบาลอิเล็กทรอนิกส์ (United Nations)",
                       "zh": "电子政务发展指数（联合国）"}),
    ("PPP",          {"en": "Purchasing Power Parity — conversion factor equalising purchasing power across currencies",
                       "th": "ความเท่าเทียมกันของอำนาจซื้อ — ตัวคูณแปลงค่าที่ทำให้อำนาจซื้อเท่ากันข้ามสกุลเงิน",
                       "zh": "购买力平价——在不同货币间等化购买力的转换因子"}),
]


# ── Story assembly ────────────────────────────────────────────────────────────
def build_story(S, locale: str):
    C = COPY[locale]
    story = []
    cities = load_cities()

    # ── COVER ──────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 28 * mm))
    story.append(Paragraph(C["paper_title"], S["Cover1"]))
    story.append(Paragraph(C["paper_subtitle"], S["Cover2"]))
    story.append(Spacer(1, 6 * mm))
    story.append(HRFlowable(width="100%", thickness=1, color=C_ACCENT, spaceAfter=6 * mm))
    story.append(Paragraph(C["date"], S["CoverMeta"]))
    story.append(Paragraph(C["authors"], S["CoverMeta"]))
    story.append(Paragraph(C["published_by"], S["CoverMeta"]))
    story.append(Paragraph(C["partnership"], S["CoverMeta"]))
    story.append(Spacer(1, 12 * mm))
    story.append(Paragraph(C["cover_note"], S["Body"]))

    # Pentagon radar armature on cover
    story.append(Spacer(1, 8 * mm))
    story.append(draw_pentagon_radar(locale))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(RADAR_CAPTIONS[locale], S["Caption"]))

    story.append(PageBreak())

    # ── EXECUTIVE SUMMARY ─────────────────────────────────────────────────────
    story.append(Paragraph(C["exec_title"], S["ChapterTitle"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=4 * mm))
    story.append(Paragraph(C["exec_intro"], S["Lead"]))
    story.append(Paragraph(f"<b>{C['five_pillars']}</b>", S["SectionHead"]))

    phdr = [Paragraph(h, S["TableHead"]) for h in C["pillar_header_rows"][0]]
    pbody = [[Paragraph(r[0], S["TableBody"]), Paragraph(r[1], S["TableBodyC"]), Paragraph(r[2], S["TableBody"])]
             for r in C["pillar_header_rows"][1:]]
    t = Table([phdr] + pbody, colWidths=[46 * mm, 18 * mm, 102 * mm], repeatRows=1)
    t.setStyle(hdr_style())
    story.append(t)
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph(f"<b>{C['absolute_title']}</b>", S["SectionHead"]))
    for point in C["absolute_bullets"]:
        story.append(ListFlowable([ListItem(Paragraph(point, S["Body"]))],
                                  bulletType="bullet", leftIndent=14))
    story.append(PageBreak())

    # ── CHAPTER 1: SCORING FRAMEWORK ─────────────────────────────────────────
    story.append(Paragraph("1.", S["ChapterNum"]))
    story.append(Paragraph(C["ch1_title"], S["ChapterTitle"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=4 * mm))

    story.append(Paragraph(C["sec_1_1"], S["SectionHead"]))
    story.append(Paragraph(C["sec_1_1_body"], S["Body"]))
    story.append(Preformatted(
        "s_m(c) = 100 × (winsor(x_m(c), p05_m, p95_m) − p05_m) / (p95_m − p05_m)\n"
        "\n"
        "Where:\n"
        "  x_m(c)    = raw metric value for city c on metric m\n"
        "  p05_m     = 5th percentile across the reference set, frozen at first publication\n"
        "  p95_m     = 95th percentile, likewise frozen\n"
        "  winsor()  = clamps to [p05, p95] before normalising\n"
        "  s_m(c)    = normalized metric score, clamped to [0, 100]\n"
        "\n"
        "For lower-is-better indicators (homicide, housing burden, hours worked,\n"
        "etc.), the numerator is inverted so that lower raw values map to higher\n"
        "normalized scores. Anchors are frozen — adding city #501 never\n"
        "retroactively changes cities #1–500.",
        S["MonoFormula"]
    ))

    story.append(Paragraph(C["sec_1_2"], S["SectionHead"]))
    story.append(Paragraph(C["sec_1_2_body"], S["Body"]))
    story.append(Preformatted(
        "pillar_score = Σ(s_m × α_(p,m)) / Σ α_(p,m)     [weighted mean]\n"
        "\n"
        "Where:\n"
        "  α_(p,m) = published metric weight within pillar p (see Chapter 7)\n"
        "  s_m     = normalized metric scores for that city, non-null only\n"
        "\n"
        "Pillar weights are designed so that Σ α_(p,m) within each pillar equals\n"
        "the pillar's public weight: Pressure 25, Viability 22, Capability 18,\n"
        "Community 15, Creative 20 (sum = 100).",
        S["MonoFormula"]
    ))

    story.append(Paragraph(C["sec_1_3"], S["SectionHead"]))
    story.append(Preformatted(
        "Overall SLIC score is aggregated across the five pillar scores using\n"
        "the Adjusted Mazziotta–Pareto Index (AMPI):\n"
        "\n"
        "  μ_p   = weighted mean of pillar scores (weights w_p = 25/22/18/15/20)\n"
        "  σ²_p  = Σ(w_p × (pillar_p − μ_p)²) / Σ w_p         [weighted variance]\n"
        "  AMPI  = μ_p − σ²_p / μ_p\n"
        "\n"
        "SLIC(c) = max(0, AMPI(c) − coverage_penalty(c))\n"
        "\n"
        "AMPI penalises pillar imbalance. A city with four strong pillars and\n"
        "one catastrophic pillar scores lower than a city with five moderate\n"
        "pillars — even if their weighted means are identical. This is the\n"
        "single distinctive claim SLIC makes versus other indices: you cannot\n"
        "compensate for a broken pillar with excellence in another. AMPI is\n"
        "applied at the pillar combination level (n=5, stable variance) rather\n"
        "than within pillars (where missing metrics would make variance\n"
        "unreliable).",
        S["MonoFormula"]
    ))

    story.append(Paragraph(C["sec_1_4"], S["SectionHead"]))
    story.append(Paragraph(C["sec_1_4_body"], S["Body"]))
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

    # ── PILLAR CHAPTERS (2–6) ────────────────────────────────────────────────
    for pname, pnum, pcolor, indicators in PILLARS:
        story.append(Paragraph(f"{pnum}.", S["ChapterNum"]))
        t = Paragraph(
            f"{C['ch1_title'].split(' ')[0] if False else ''}{pname}",
            ParagraphStyle("PillarChap", parent=S["ChapterTitle"], textColor=pcolor)
        )
        # Pillar chapter title = "Pillar N: Growth" (technical indicator-group name always in English)
        pillar_num = {"Growth": 1, "Viability": 2, "Capability": 3, "Community": 4, "Creative": 5}[pname]
        story.append(Paragraph(
            f"Pillar {pillar_num}: {pname}",
            ParagraphStyle("PillarChap2", parent=S["ChapterTitle"], textColor=pcolor)
        ))
        story.append(Paragraph(C["pillar_subtitles"][pname], S["Cover2"]))
        story.append(HRFlowable(width="100%", thickness=0.5, color=pcolor, spaceAfter=4 * mm))
        story.append(Paragraph(C["pillar_intros"][pname], S["Body"]))
        story.append(Spacer(1, 3 * mm))

        for (code, name, unit, direction, source, anchors, note) in indicators:
            story.append(indicator_block(S, code, name, unit, direction, source, anchors, pcolor, note))

        story.append(PageBreak())

    # ── CHAPTER 7: DATA SOURCES ───────────────────────────────────────────────
    story.append(Paragraph("7.", S["ChapterNum"]))
    story.append(Paragraph(C["ch7_title"], S["ChapterTitle"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=4 * mm))
    story.append(Paragraph(C["ch7_body"], S["Body"]))

    tier_hdr = [Paragraph(h, S["TableHead"]) for h in C["tier_table_header"]]
    tier_body = [[Paragraph(r[0], S["TableBodyC"]),
                  Paragraph(r[1], S["TableBody"]),
                  Paragraph(r[2], S["TableBodyLatin"])]
                 for r in C["tier_rows"]]
    t = Table([tier_hdr] + tier_body, colWidths=[14 * mm, 50 * mm, 102 * mm], repeatRows=1)
    t.setStyle(hdr_style())
    story.append(t)
    story.append(Spacer(1, 6 * mm))

    story.append(Paragraph(C["primary_sources"], S["SectionHead"]))
    story.append(ListFlowable(
        [ListItem(Paragraph(s, S["BodyLatin"])) for s in SOURCES],
        bulletType="bullet", leftIndent=14, spaceAfter=1
    ))
    story.append(PageBreak())

    # ── CHAPTER 8: COVERAGE GRADES ────────────────────────────────────────────
    story.append(Paragraph("8.", S["ChapterNum"]))
    story.append(Paragraph(C["ch8_title"], S["ChapterTitle"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=4 * mm))
    story.append(Paragraph(C["ch8_body"], S["Body"]))

    cov_hdr = [Paragraph(h, S["TableHead"]) for h in C["cov_table_header"]]
    cov_body = [[Paragraph(r[0], S["TableBodyC"]),
                 Paragraph(r[1], S["TableBody"]),
                 Paragraph(r[2], S["TableBodyC"]),
                 Paragraph(r[3], S["TableBody"])]
                for r in C["cov_rows"]]
    t = Table([cov_hdr] + cov_body, colWidths=[14 * mm, 56 * mm, 28 * mm, 68 * mm], repeatRows=1)
    t.setStyle(hdr_style())
    story.append(t)
    story.append(Spacer(1, 6 * mm))

    # Coverage grade distribution across the actual 157 cities
    story.append(draw_coverage_histogram(locale, cities))
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph(C["ch8_note"], S["Body"]))
    story.append(PageBreak())

    # ── CHAPTER 9: CITY RANKINGS ──────────────────────────────────────────────
    story.append(Paragraph("9.", S["ChapterNum"]))
    story.append(Paragraph(C["ch9_title"], S["ChapterTitle"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=4 * mm))
    story.append(Paragraph(C["ch9_body_fmt"].format(n=len(cities)), S["Body"]))

    ranks_hdr = [Paragraph(h, S["TableHead"]) for h in C["ranks_header"]]
    ranks_rows = []
    for c in cities:
        ranks_rows.append([
            Paragraph(str(c["rank"]), S["TableBodyLatinC"]),
            Paragraph(c["displayName"], S["TableBodyLatin"]),
            Paragraph(c["country"], S["TableBodyLatin"]),
            Paragraph(_fmt(c['slicScore']), S["TableBodyLatinR"]),
            Paragraph(_fmt(c['pressureScore']), S["TableBodyLatinR"]),
            Paragraph(_fmt(c['viabilityScore']), S["TableBodyLatinR"]),
            Paragraph(_fmt(c['capabilityScore']), S["TableBodyLatinR"]),
            Paragraph(_fmt(c['communityScore']), S["TableBodyLatinR"]),
            Paragraph(_fmt(c['creativeScore']), S["TableBodyLatinR"]),
            Paragraph(c.get("coverageGrade", ""), S["TableBodyLatinC"]),
        ])
    ranks_col_w = [10 * mm, 38 * mm, 30 * mm, 14 * mm, 12 * mm, 12 * mm, 12 * mm, 12 * mm, 12 * mm, 10 * mm]
    t = Table([ranks_hdr] + ranks_rows, colWidths=ranks_col_w, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), C_BG_HEAD),
        ("FONTSIZE",   (0, 0), (-1, -1), 7.5),
        ("LEADING",    (0, 0), (-1, -1), 10),
        ("GRID",       (0, 0), (-1, -1), 0.25, C_RULE),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
        ("LEFTPADDING", (0, 0), (-1, -1), 3),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3),
        ("VALIGN",     (0, 0), (-1, -1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [C_WHITE, C_BG_ALT]),
    ]))
    story.append(t)
    story.append(PageBreak())

    # ── CHAPTER 10: DESIGN PRINCIPLES ─────────────────────────────────────────
    story.append(Paragraph("10.", S["ChapterNum"]))
    story.append(Paragraph(C["ch10_title"], S["ChapterTitle"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=4 * mm))

    for title, body in C["principles"]:
        story.append(KeepTogether([
            Paragraph(title, S["SectionHead"]),
            Paragraph(body, S["Body"]),
            Spacer(1, 2 * mm),
        ]))

    story.append(PageBreak())

    # ── CHAPTER 11: GLOSSARY ──────────────────────────────────────────────────
    story.append(Paragraph("11.", S["ChapterNum"]))
    story.append(Paragraph(C["ch11_title"], S["ChapterTitle"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=4 * mm))

    gloss_hdr = [Paragraph(h, S["TableHead"]) for h in C["glossary_header"]]
    gloss_body = [[Paragraph(sym, S["Mono"]),
                   Paragraph(defs[locale], S["TableBody"])]
                  for sym, defs in GLOSSARY]
    t = Table([gloss_hdr] + gloss_body, colWidths=[38 * mm, 128 * mm], repeatRows=1)
    t.setStyle(hdr_style())
    story.append(t)
    story.append(Spacer(1, 8 * mm))

    story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=4 * mm))
    story.append(Paragraph(C["colophon"], S["Caption"]))

    return story


# ── Main ──────────────────────────────────────────────────────────────────────
def generate(locale: str):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    output = OUT_DIR / f"slic-methodology-technical-paper-{locale}.pdf"
    S = make_styles(locale)
    doc = SimpleDocTemplate(
        str(output),
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title=f"{COPY[locale]['paper_title']} — {COPY[locale]['paper_subtitle']}",
        author="Non Arkara; Associate Professor Poon Thiengburanathum",
        subject="Smart and Liveable Cities Index V3 — Complete Methodology",
        creator="SLIC / ReTL",
    )
    story = build_story(S, locale)
    doc.build(story, onFirstPage=make_footer_fn(locale), onLaterPages=make_footer_fn(locale))
    size_kb = output.stat().st_size // 1024
    print(f"✓ [{locale}] {output.name}  ({size_kb} KB)")


def main():
    register_fonts()
    targets = sys.argv[1:] if len(sys.argv) > 1 else ["en", "th", "zh"]
    for loc in targets:
        if loc not in COPY:
            print(f"✗ Unknown locale: {loc}")
            continue
        generate(loc)


if __name__ == "__main__":
    main()
