from __future__ import annotations

from pathlib import Path
import shutil

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
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


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
PUBLIC_DIR = ROOT / "public" / "downloads"
OUTPUT_PATH = OUTPUT_DIR / "slic-methodology-technical-paper-en.pdf"
PUBLIC_PATH = PUBLIC_DIR / "slic-methodology-technical-paper-en.pdf"
LOGO_PATH = ROOT / "public" / "Logos" / "SLIC logo.jpg"


def build_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="PaperTitle",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=23,
            leading=27,
            textColor=colors.HexColor("#0f2b60"),
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="PaperSubtitle",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=15,
            textColor=colors.HexColor("#44577c"),
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionHeading",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=15,
            leading=19,
            textColor=colors.HexColor("#0f2b60"),
            spaceBefore=10,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SubHeading",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11.5,
            leading=14,
            textColor=colors.HexColor("#0f2b60"),
            spaceBefore=6,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Body",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=14.5,
            textColor=colors.HexColor("#18253f"),
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Small",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=12,
            textColor=colors.HexColor("#54627a"),
            spaceAfter=5,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CenterSmall",
            parent=styles["BodyText"],
            alignment=TA_CENTER,
            fontName="Helvetica",
            fontSize=8.5,
            leading=12,
            textColor=colors.HexColor("#54627a"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="FormulaLabel",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=11,
            textColor=colors.HexColor("#0f2b60"),
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="FormulaNote",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.7,
            leading=12.5,
            textColor=colors.HexColor("#4e5d78"),
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TableCell",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.6,
            leading=11.5,
            textColor=colors.HexColor("#18253f"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="TableCellBold",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8.6,
            leading=11.5,
            textColor=colors.HexColor("#0f2b60"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="Mono",
            parent=styles["Code"],
            fontName="Courier",
            fontSize=8.8,
            leading=12.5,
            textColor=colors.white,
        )
    )
    return styles


def formula_block(title: str, formula: str, note: str, styles) -> list:
    cell = Table(
        [[Preformatted(formula, styles["Mono"])]],
        colWidths=[170 * mm],
    )
    cell.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#0f3f99")),
                ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#0f3f99")),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return [
        Paragraph(title, styles["FormulaLabel"]),
        cell,
        Spacer(1, 2.5 * mm),
        Paragraph(note, styles["FormulaNote"]),
    ]


def bullet_list(items: list[str], styles):
    return ListFlowable(
        [ListItem(Paragraph(item, styles["Body"])) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=14,
    )


def build_table(rows: list[list[str]], col_widths, styles):
    formatted = [
        [Paragraph(cell, styles["TableCellBold"] if idx == 0 else styles["TableCell"]) for idx, cell in enumerate(row)]
        for row in rows
    ]
    table = Table(formatted, colWidths=col_widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#ebf2ff")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#0f2b60")),
                ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#bfd0ed")),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#d7e1f3")),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return table


def decorate_page(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#d2dff4"))
    canvas.line(doc.leftMargin, A4[1] - 20 * mm, A4[0] - doc.rightMargin, A4[1] - 20 * mm)
    canvas.setFont("Helvetica-Bold", 8.5)
    canvas.setFillColor(colors.HexColor("#0f2b60"))
    canvas.drawString(doc.leftMargin, A4[1] - 16 * mm, "SMART AND LIVEABLE CITIES INDEX")
    canvas.setFont("Helvetica", 8.5)
    canvas.setFillColor(colors.HexColor("#55657f"))
    canvas.drawRightString(A4[0] - doc.rightMargin, 12 * mm, f"Page {canvas.getPageNumber()}")
    canvas.drawString(doc.leftMargin, 12 * mm, "SLIC technical methodology paper")
    canvas.restoreState()


def build_story(styles):
    story = []

    if LOGO_PATH.exists():
      story.append(Image(str(LOGO_PATH), width=22 * mm, height=22 * mm))
      story.append(Spacer(1, 4 * mm))

    story.append(Paragraph("SLIC Technical Methodology Paper", styles["PaperTitle"]))
    story.append(
        Paragraph(
            "A technical note for replication, critique, and public audit. This paper explains the public SLIC score, the five visible pillars, the worksheet logic, and the supporting remote-sensing layer used when ground observations are too thin to describe the full urban frame.",
            styles["PaperSubtitle"],
        )
    )
    story.append(
        Paragraph(
            "Prepared by Non Arkara and Associate Professor Poon Thiengburanathum as a SLIC product in collaboration with the Ministry of Digital Economy and Society, the Digital Economy Promotion Agency, Smart City Thailand Office, and Axiom AI. No city, sponsor, vendor, or government paid for inclusion, weighting, or placement in the model.",
            styles["Small"],
        )
    )
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph("1. Public score doctrine", styles["SectionHeading"]))
    story.append(
        Paragraph(
            "SLIC ranks cities where people can live well, belong, and become more. The index is designed to avoid three common errors: mistaking GDP for livability, mistaking surveillance or gadgetry for safety, and mistaking prestige for daily viability. The published ranking therefore keeps pressure, safety, capability, community, and business vitality explicit in one declared formula.",
            styles["Body"],
        )
    )
    story.extend(
        formula_block(
            "Official public formula",
            "SLIC(c) = 0.22 Pressure(c) + 0.23 SafetyViability(c) + 0.15 HumanCapability(c)\n"
            "          + 0.15 CommunityTolerance(c) + 0.25 BusinessGrowth(c)",
            "The public board uses one fixed weighted model. Business and growth remain visible so a city cannot win by comfort alone.",
            styles,
        )
    )

    story.append(Paragraph("2. Pillar decomposition", styles["SectionHeading"]))
    story.append(
        Paragraph(
            "Each public pillar aggregates internal metrics with declared weights. These are not hidden analyst overrides; they are the technical decomposition of the public score.",
            styles["Body"],
        )
    )
    story.extend(
        formula_block(
            "Pressure, affordability, and room to live",
            "Pressure(c) = 0.36 DI_ppp + 0.20 HousingBurden + 0.16 HouseholdDebt\n"
            "              + 0.16 WorkingTimePressure + 0.12 MentalStrain",
            "This pillar punishes false prosperity by looking at what remains after tax and essential costs, not at salary headlines alone.",
            styles,
        )
    )
    story.extend(
        formula_block(
            "Safety, ecology, and daily viability",
            "SafetyViability(c) = 0.28 SafetyOutcomes + 0.22 TransitAccess + 0.18 CleanAir\n"
            "                   + 0.16 WaterUtility + 0.16 DigitalInfrastructure",
            "Safety is based on harm and daily confidence, not on camera counts or smart-city theatre.",
            styles,
        )
    )
    story.extend(
        formula_block(
            "Human capability",
            "HumanCapability(c) = 0.40 HealthcareQuality + 0.33 EducationQuality + 0.27 EqualOpportunity",
            "Good healthcare and good education are scored by quality and access, not by institution counts alone.",
            styles,
        )
    )
    story.extend(
        formula_block(
            "Community, tolerance, and belonging",
            "CommunityTolerance(c) = 0.34 HospitalityBelonging + 0.33 TolerancePluralism\n"
            "                      + 0.33 PublicLifeVitality",
            "Tolerance is read through low-friction coexistence, equal market access, and everyday freedom rather than symbolic branding.",
            styles,
        )
    )
    story.extend(
        formula_block(
            "Business, growth, and competitive vitality",
            "BusinessGrowth(c) = 0.30 OpeningEase + 0.25 GovernmentStability + 0.20 TaxCompetitiveness\n"
            "                  + 0.15 IncentiveReadiness + 0.10 ProductiveMomentum",
            "This is the anti-complacency pillar. Cities should create conditions for ambition, not only for passive comfort.",
            styles,
        )
    )

    story.append(PageBreak())
    story.append(Paragraph("3. Core equations and symbol logic", styles["SectionHeading"]))
    story.extend(
        formula_block(
            "Tax-adjusted PPP disposable room",
            "DI_ppp(c) = ((GrossIncome(c) x (1 - TaxRate(country(c)))) - Rent(c) - Utilities(c)\n"
            "            - Transit(c) - Internet(c) - Food(c)) / PPP_private_consumption(country(c))",
            "This converts residual money after essentials into comparable purchasing-power space.",
            styles,
        )
    )
    story.extend(
        formula_block(
            "Winsorized metric normalization",
            "s_m(c) = 100 x clamp((winsor(x_m(c)) - P5_m) / (P95_m - P5_m), 0, 1)",
            "Positive metrics scale directly. Harmful metrics reverse the numerator so higher scores always mean better city outcomes.",
            styles,
        )
    )
    story.extend(
        formula_block(
            "Weighted coverage test",
            "Coverage(c) = Sum observed gamma_m / Sum required gamma_m",
            "Coverage is weighted by metric importance rather than raw field count. Cities with thin critical data cannot hide behind many minor fields.",
            styles,
        )
    )
    story.extend(
        formula_block(
            "Macro context term",
            "MacroContext(c) = capped(GDP_PPP + GDP_Growth + Gini + Tax + PPP)",
            "GDP per capita, growth, inequality, and tax context matter, but they are capped and disciplined so macro strength does not dominate the ranking.",
            styles,
        )
    )

    story.append(Paragraph("Symbol glossary", styles["SubHeading"]))
    glossary_rows = [
        ["Symbol", "Definition", "Operational meaning"],
        ["c", "City or functional urban area", "The scored urban unit"],
        ["m", "Metric index", "A raw signal such as rent burden, PM2.5, or opening ease"],
        ["p", "Pillar index", "One of the five public pillar bundles"],
        ["x_m(c)", "Raw metric value", "Observed value before normalization"],
        ["s_m(c)", "Normalized metric score", "0-100 score after winsorization and direction adjustment"],
        ["alpha_(p,m)", "Metric weight inside a pillar", "How strongly metric m contributes to pillar p"],
        ["gamma_m", "Coverage weight", "Importance weight used in missing-data coverage tests"],
        ["w_p", "Public pillar weight", "Declared public weight in the final score"],
        ["DI_ppp(c)", "PPP disposable room", "Post-tax money left after essentials in comparable terms"],
    ]
    story.append(build_table(glossary_rows, [28 * mm, 42 * mm, 102 * mm], styles))

    story.append(Spacer(1, 5 * mm))
    story.append(Paragraph("4. Data reliance and source discipline", styles["SectionHeading"]))
    story.append(
        Paragraph(
            "The public model leans hardest on city and metro official data, then on national and international official baselines. Remote sensing, open technical proxies, and social listening are used as controlled supporting evidence. They widen spatial coverage, stress-test weak official layers, and help qualify how mapped conditions are actually lived.",
            styles["Body"],
        )
    )
    reliance_rows = [
        ["Data family", "Dependence intensity", "Role in SLIC"],
        ["City and metro official data", "94", "Primary layer for city scoring wherever available"],
        ["National and international official data", "82", "Macro, health, labour, education, and PPP baseline"],
        ["Remote sensing and satellite context", "58", "Aerosol drift, vegetation, land stress, and wider ecological frame"],
        ["Open technical proxies", "52", "Broadband performance, open air layers, and audited technical context"],
        ["Social listening and testimony", "41", "Contextual layer for hospitality, pressure, and lived experience"],
    ]
    story.append(build_table(reliance_rows, [60 * mm, 35 * mm, 77 * mm], styles))

    story.append(Paragraph("5. Remote-sensing methodology", styles["SectionHeading"]))
    story.append(
        Paragraph(
            "Satellite layers enter the method when city sensor nets are too sparse, too local, or too uneven to describe the full urban airshed or ecological edge. SLIC uses them to quantify aerosol load, atmospheric composition, vegetation cover, land cover, moisture context, and regional pollution transport. Analysts then qualify those signals against geography, topography, coastline, wind patterns, urban form, and official city evidence. Satellite data widen the frame; they do not replace judgement.",
            styles["Body"],
        )
    )
    story.append(Paragraph("Remote-sensing workflow", styles["SubHeading"]))
    story.append(
        bullet_list(
            [
                "Official city and environmental records remain the first layer when trustworthy ground observations exist.",
                "Copernicus, JAXA, and open Landsat-derived layers widen the frame for aerosol transport, vegetation, land stress, and ecological buffering.",
                "Social listening and city testimony help test whether mapped conditions are actually felt in the lived city.",
                "Final city judgement reads all layers together instead of pretending any single layer is complete.",
            ],
            styles,
        )
    )

    story.append(Paragraph("6. Ranking protocol and gates", styles["SectionHeading"]))
    protocol_rows = [
        ["Rule", "Technical meaning"],
        ["Functional urban areas", "Cities are scored as real labour-market and service sheds where possible, not as city-hall boundaries."],
        ["Fixed official weights", "The published board uses one formula. User weighting may exist later as an exploratory tool only."],
        ["Coverage gates", "Cities rank only if weighted coverage clears the floor and no pillar is critically empty."],
        ["Outcome-based safety", "Camera counts do not score. Lower harm and stronger daily confidence do."],
        ["Effect-based tolerance", "SLIC does not score religions or identities directly; it scores low-friction coexistence and equal participation."],
        ["Contextual visitor demand", "Travel demand counts only when it survives crowding, safety, ecology, and resident-room checks."],
    ]
    story.append(build_table(protocol_rows, [48 * mm, 124 * mm], styles))

    story.append(PageBreak())
    story.append(Paragraph("7. Worked example", styles["SectionHeading"]))
    story.append(
        Paragraph(
            "The following Bangkok-like example is illustrative. It shows the arithmetic path from raw inputs to a final score, but it is not a final audited workbook row.",
            styles["Body"],
        )
    )
    example_rows = [
        ["Input", "Illustrative value", "Note"],
        ["Gross income", "$33,500", "Representative city-level earnings input"],
        ["Effective tax rate", "18%", "User-supplied country context"],
        ["Essential costs", "$15,900", "Rent, utilities, internet, transit, and food"],
        ["PPP private consumption factor", "0.72", "World Bank PPP conversion layer"],
        ["Pillar bundle", "Pressure 71 / Safety 84 / Capability 80 / Community 86 / Business 76", "Values after internal metric aggregation"],
    ]
    story.append(build_table(example_rows, [40 * mm, 62 * mm, 70 * mm], styles))
    story.extend(
        formula_block(
            "Example final score",
            "SLIC = 0.22x71 + 0.23x84 + 0.15x80 + 0.15x86 + 0.25x76 = 78.84",
            "The point of the example is balance: visible deductions for pressure or ecology can coexist with visible strengths in community and city energy.",
            styles,
        )
    )

    story.append(Paragraph("8. Source ladder", styles["SectionHeading"]))
    source_rows = [
        ["Tier", "Source family", "Examples"],
        ["Tier 1", "City and metro official data", "Open-data portals, transit feeds, utility regulators, hospital releases, city statistical offices"],
        ["Tier 2", "State, province, and subnational official data", "Regional statistical agencies, metropolitan observatories, subnational administrative releases"],
        ["Tier 3", "National and international official datasets", "World Bank, WHO, ILO, UNESCO UIS, OECD, WIPO, WHO/UNICEF JMP"],
        ["Tier 4", "Audited secondary and experimental layers", "OpenAQ, Copernicus CAMS, Sentinel context, JAXA products, Landsat-derived vegetation layers, M-Lab, social listening"],
    ]
    story.append(build_table(source_rows, [20 * mm, 48 * mm, 122 * mm], styles))

    story.append(Paragraph("9. References", styles["SectionHeading"]))
    references = [
        "[1] Internal benchmarking memo: Smart and Livable City Index Methodology Benchmarking.",
        "[2] World Bank Data Help Desk. About the Indicators API Documentation. https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation",
        "[3] World Health Organization. GHO OData API. https://www.who.int/data/gho/info/gho-odata-api",
        "[4] International Labour Organization. ILOSTAT SDMX User Guide. https://www.ilo.org/resource/other/ilostat-sdmx-user-guide",
        "[5] WHO/UNICEF Joint Monitoring Programme. https://washdata.org/data",
        "[6] UNESCO Institute for Statistics. UIS Data Browser. https://databrowser.uis.unesco.org/",
        "[7] OECD Affordable Housing Database. https://www.oecd.org/en/data/datasets/oecd-affordable-housing-database.html",
        "[8] OECD Health Statistics. https://www.oecd.org/health/health-data.htm",
        "[9] OECD PISA Dashboard. https://www.oecd.org/en/data/dashboards/pisa-education-and-skills.html",
        "[10] World Bank Entrepreneurship Database Methodology. https://www.worldbank.org/en/programs/entrepreneurship/methodology",
        "[11] OpenAQ REST API. https://api.openaq.org/",
        "[12] OECD Definition of Cities and Functional Urban Areas. https://www.oecd.org/en/data/datasets/oecd-definition-of-cities-and-functional-urban-areas.html",
        "[13] M-Lab. What is Measurement Lab? https://www.measurementlab.net/about/",
        "[14] World Bank Gender Data Portal. https://genderdata.worldbank.org/",
        "[15] World Bank Human Capital Data Portal. https://humancapital.worldbank.org/en/about",
        "[16] WIPO Intellectual Property Statistics. https://www.wipo.int/web/ip-statistics",
        "[17] Copernicus Atmosphere Monitoring Service. https://atmosphere.copernicus.eu/",
        "[18] Copernicus Data Space. Sentinel-5P mission documentation. https://documentation.dataspace.copernicus.eu/Data/SentinelMissions/Sentinel5P.html",
        "[19] Copernicus Data Space. Sentinel-2 collection overview. https://dataspace.copernicus.eu/explore-data/data-collections/sentinel-data/sentinel-2",
        "[20] Copernicus Data Space. Global NDVI 300 m documentation. https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/clms/bio-geophysical-parameters/vegetation/vegetation-indices/ndvi_global_300m_10daily_v3.html",
        "[21] JAXA Earth observation data portal overview. https://earth.jaxa.jp/en/eo-knowledge/data-portal/index.html",
        "[22] JAXA G-Portal. https://earth.jaxa.jp/gpr/",
        "[23] JAXA vegetation products. https://earth.jaxa.jp/en/data/products/vegetation/index.html",
        "[24] JAXA ALOS forest/non-forest map. https://earth.jaxa.jp/en/data/2555/index.html",
        "[25] USGS Landsat NDVI documentation. https://www.usgs.gov/landsat-missions/landsat-normalized-difference-vegetation-index",
        "[26] Arkaraprasertkul, N. 2024. Less Is More: Thailand’s Citizen-Centric Approach to Smart, Livable Cities. Smart City Magazine: Special Edition, Smart City Expo Miami 2024 (1) – Future-Ready Communities. Smart Cities Americas. https://www.smartcitymiami.com/",
        "[27] Arkaraprasertkul, N. 2023. Effective Soft Power: How Media can Help Cities Harness Smart Technology for Societal Change. Thai Media Fund Journal 2(2): 1-30.",
        "[28] Arkaraprasertkul, N. and Rabitaille, R. P., eds. 2022. Smart City Primer. C-asean and US Embassy Bangkok: Bangkok.",
        "[29] Arkaraprasertkul, N. 2021. Harnessing Digital Connectivity for Sustainable Cities in ASEAN. The ASEAN Magazine. https://theaseanmagazine.asean.org/article/non-arkaraprasertkul-phd/",
        "[30] Arkaraprasertkul, N., Nimmanphatcharin, N., et al. 2020. Smart City Initiatives in Thailand: Key Concepts and Methods. Hitachi Review 70: 106-110.",
        "[31] Arkaraprasertkul, N. 2019. Bangkok’s Urban Presence: Toward the Future of Smart Urbanity (Exhibition Entry). 2019 Seoul Biennale of Architecture and Urbanism: Collective City. Guidebook. Seoul Metropolitan Government, p. 137.",
        "[32] Arkaraprasertkul, N. 2018. Gentrification and Its Contentment: An Anthropological Perspective on Housing, Heritage and Urban Social Change in Shanghai. Urban Studies 55(7): 1561-1578. DOI: 10.1177/0042098016684313",
        "[33] Arkaraprasertkul, N. and Williams, M. 2017. Mobility in a Global City: Making Sense of Shanghai’s Growing Automobile-Dominated Transport Culture. Urban Studies 54(10): 2232-2248. DOI: 10.1177/0042098016637568.",
    ]
    for reference in references:
        story.append(Paragraph(reference, styles["Small"]))

    return story


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    styles = build_styles()
    doc = SimpleDocTemplate(
        str(OUTPUT_PATH),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=28 * mm,
        bottomMargin=18 * mm,
        title="SLIC Technical Methodology Paper",
        author="Non Arkara; Associate Professor Poon Thiengburanathum",
    )
    story = build_story(styles)
    doc.build(story, onFirstPage=decorate_page, onLaterPages=decorate_page)
    shutil.copyfile(OUTPUT_PATH, PUBLIC_PATH)
    print(f"Wrote {OUTPUT_PATH}")
    print(f"Copied {PUBLIC_PATH}")


if __name__ == "__main__":
    main()
