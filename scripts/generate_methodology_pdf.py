from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
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


OUTPUTS = [
    Path("downloads/slic-methodology-technical-paper-en.pdf"),
    Path("public/downloads/slic-methodology-technical-paper-en.pdf"),
    Path("dist/downloads/slic-methodology-technical-paper-en.pdf"),
    Path("output/pdf/slic-methodology-technical-paper-en.pdf"),
]

PUBLIC_WEIGHTS = [
    ("Growth Pressure", "25%"),
    ("Viability", "22%"),
    ("Capability", "18%"),
    ("Community", "15%"),
    ("Creative", "20%"),
]

PILLAR_METRICS = [
    ("Growth Pressure", "Disposable income (PPP-adjusted residual room)", "4"),
    ("Growth Pressure", "Housing burden", "8"),
    ("Growth Pressure", "Economic growth momentum", "6"),
    ("Growth Pressure", "Household debt burden", "4"),
    ("Growth Pressure", "Working time pressure", "7"),
    ("Growth Pressure", "Suicide / severe mental strain", "7"),
    ("Viability", "Personal safety", "5"),
    ("Viability", "Transit access and commute burden", "5"),
    ("Viability", "Clean air", "4"),
    ("Viability", "Water, sanitation, and utility reliability", "4"),
    ("Viability", "Digital infrastructure", "4"),
    ("Viability", "Climate and sunlight livability", "7"),
    ("Capability", "Healthcare quality", "8"),
    ("Capability", "Education quality", "6"),
    ("Capability", "Equal opportunity and distributional fairness", "4"),
    ("Community", "Hospitality and belonging", "6"),
    ("Community", "Tolerance and pluralism", "4"),
    ("Community", "Cultural and public-life vitality", "7"),
    ("Community", "Birth rate optimism", "2"),
    ("Creative", "Entrepreneurial dynamism", "6"),
    ("Creative", "Innovation and research intensity", "5"),
    ("Creative", "Economic vitality and productive context", "5"),
    ("Creative", "Administrative and investment friction", "4"),
]

PROTOCOL_POINTS = [
    "The public board uses one fixed weighted equation. Exploratory weight changes belong in the workbench, not in the official published score.",
    "Each published city shows one declared SLIC score, five public pillar values, and a visible coverage grade.",
    "City and metro data are preferred. When city data are thin, SLIC falls back in a visible order: subnational official data, national official data, then audited proxies.",
    "Satellite and remote-sensing layers are supporting evidence for air, ecology, and urban-edge context when ground sensors are sparse or spatially uneven.",
    "Ties are allowed. Cities with the same rounded final score can share the same numerical rank.",
    "Low-coverage cities should remain visibly labeled rather than being hidden behind false precision.",
]

SOURCE_POINTS = [
    "World Bank indicators and PPP series",
    "World Health Organization (GHO OData API)",
    "International Labour Organization (ILOSTAT)",
    "WHO/UNICEF Joint Monitoring Programme for water and sanitation",
    "UNESCO Institute for Statistics",
    "OECD housing, health, and education datasets",
    "OpenAQ and Copernicus / CAMS for air-quality context",
    "Measurement Lab for digital performance context",
    "World Intellectual Property Organization for innovation signals",
    "World Meteorological Organization climate normals",
]


def draw_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(colors.HexColor("#666666"))
    canvas.drawString(doc.leftMargin, 12 * mm, "SLIC Methodology Technical Paper (English)")
    canvas.drawRightString(A4[0] - doc.rightMargin, 12 * mm, str(canvas.getPageNumber()))
    canvas.restoreState()


def make_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="TitleCenter",
            parent=styles["Title"],
            alignment=TA_CENTER,
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=28,
            textColor=colors.HexColor("#1d1d1b"),
            spaceAfter=12,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SubtitleCenter",
            parent=styles["BodyText"],
            alignment=TA_CENTER,
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#5a5a55"),
            spaceAfter=18,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionHead",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#2d3f4f"),
            spaceBefore=10,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Small",
            parent=styles["BodyText"],
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#4b4b47"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="Lead",
            parent=styles["BodyText"],
            fontSize=11,
            leading=16,
            textColor=colors.HexColor("#2a2a28"),
            spaceAfter=8,
        )
    )
    return styles


def build_table(rows, col_widths, header_bg="#dde6ee"):
    table = Table(rows, colWidths=col_widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(header_bg)),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#1d1d1b")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("LEADING", (0, 0), (-1, -1), 12),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#c7d0d8")),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def build_story():
    styles = make_styles()
    story = []

    story.append(Spacer(1, 18 * mm))
    story.append(Paragraph("SLIC Methodology Technical Paper", styles["TitleCenter"]))
    story.append(Paragraph("English edition aligned with the live public board", styles["TitleCenter"]))
    story.append(
        Paragraph(
            "Updated April 18, 2026. This compact paper is intended to keep the downloadable methodology artifact aligned with the live V3 public board.",
            styles["SubtitleCenter"],
        )
    )
    story.append(
        Paragraph(
            "SLIC is a public ranking instrument for smart and livable cities. The live board publishes one declared score per city, traces that score through five public pillars, and exposes the internal metric structure clearly enough for outside readers to audit the model.",
            styles["Lead"],
        )
    )
    story.append(
        Paragraph(
            "This PDF focuses on the parts of the method that must remain stable across the site, exports, and published board: the final score equation, the disposable-income treatment, the normalization logic, the pillar weights, and the coverage logic.",
            styles["Lead"],
        )
    )

    story.append(Paragraph("1. Public Score Mechanics", styles["SectionHead"]))
    story.append(
        Paragraph(
            "The official published board uses one fixed weighted model. The five public pillars are aggregated once and only once in the final score.",
            styles["BodyText"],
        )
    )
    story.append(
        Preformatted(
            "SLIC(c) = 0.25*Pressure(c) + 0.22*Viability(c) + 0.18*Capability(c) + 0.15*Community(c) + 0.20*Creative(c)\n\n"
            "DI_ppp(c) = ((GrossIncome(c)*(1 - TaxRate(country(c)))) - Rent(c) - Utilities(c) - Transit(c) - Internet(c) - Food(c)) / PPPPrivateConsumptionFactor(country(c))\n\n"
            "s_m(c) = 100 * clamp((winsor(x_m(c)) - P5_m) / (P95_m - P5_m), 0, 1)\n\n"
            "Coverage(c) = Sum observed gamma_m / Sum required gamma_m",
            ParagraphStyle(
                "FormulaBlock",
                parent=styles["Code"],
                fontName="Courier",
                fontSize=9,
                leading=13,
                backColor=colors.HexColor("#f3f5f7"),
                borderColor=colors.HexColor("#d7dde3"),
                borderWidth=0.5,
                borderPadding=8,
                spaceAfter=10,
            ),
        )
    )
    story.append(
        Paragraph(
            "Harmful indicators are reverse-scored inside the normalization step so that higher normalized values always indicate better urban outcomes. PPP conversion for disposable room is explicit and applied once inside the metric itself.",
            styles["BodyText"],
        )
    )

    story.append(Paragraph("2. Public Pillar Weights", styles["SectionHead"]))
    story.append(
        build_table(
            [["Pillar", "Share of official score"], *PUBLIC_WEIGHTS],
            [90 * mm, 55 * mm],
        )
    )

    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("3. Internal Metric Weights", styles["SectionHead"]))
    story.append(
        Paragraph(
            "The live public board currently uses the following metric weights inside each pillar. These values match the published ranking data export.",
            styles["BodyText"],
        )
    )
    story.append(
        build_table(
            [["Pillar", "Metric", "Weight"], *PILLAR_METRICS],
            [40 * mm, 100 * mm, 20 * mm],
        )
    )

    story.append(PageBreak())
    story.append(Paragraph("4. Ranking Protocol and Publication Rules", styles["SectionHead"]))
    story.append(
        ListFlowable(
            [ListItem(Paragraph(point, styles["BodyText"])) for point in PROTOCOL_POINTS],
            bulletType="bullet",
            leftIndent=14,
            bulletFontName="Helvetica",
        )
    )

    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("5. Interpretation Notes", styles["SectionHead"]))
    interpretation = [
        "The published board is the baseline public board. The interactive workbench may rerank the broader indexed field, but it does not overwrite the published official score.",
        "Coverage grades matter. A city with a visible low-coverage label should be interpreted more cautiously than a city with dense, verified city-level evidence.",
        "Satellite evidence, open proxies, and analyst review can widen spatial coverage, but they should remain visible rather than being passed off as direct city-official measurements.",
    ]
    story.append(
        ListFlowable(
            [ListItem(Paragraph(point, styles["BodyText"])) for point in interpretation],
            bulletType="bullet",
            leftIndent=14,
            bulletFontName="Helvetica",
        )
    )

    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("6. Selected Official and Public Sources", styles["SectionHead"]))
    story.append(
        ListFlowable(
            [ListItem(Paragraph(point, styles["BodyText"])) for point in SOURCE_POINTS],
            bulletType="1",
            leftIndent=16,
        )
    )

    story.append(Spacer(1, 8 * mm))
    story.append(Paragraph("7. Alignment Note", styles["SectionHead"]))
    story.append(
        Paragraph(
            "This PDF is deliberately compact. The website methodology page remains the fuller annotated reference, but this downloadable paper is intended to stay synchronized with the live formulas, weights, and export structure so readers do not encounter contradictory public documentation.",
            styles["BodyText"],
        )
    )

    return story


def generate(output_path: Path):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title="SLIC Methodology Technical Paper (English)",
        author="Non Arkara; Associate Professor Poon Thiengburanathum",
    )
    doc.build(build_story(), onFirstPage=draw_footer, onLaterPages=draw_footer)


def main():
    for output in OUTPUTS:
        generate(output)
        print(f"wrote {output}")


if __name__ == "__main__":
    main()
