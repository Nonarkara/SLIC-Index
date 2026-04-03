"""
Generate all 77 Thai province data for SLIC Thailand page.

Sources:
- GPP per capita: NESDC National Accounts (2023-2024)
- Income: NSO Household Socio-Economic Survey (2023)
- PM2.5: PCD Air Quality Annual Report (2024)
- Hospital beds: MOPH Health Resources (2023)
- Crime rate: Royal Thai Police Statistics (2023)
- Green coverage: Royal Forest Department (2023)
- Population: DOPA Registration Statistics (2024)

All values are approximations based on publicly available Thai government data.
"""

from __future__ import annotations
import json
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "src" / "thailandData.ts"

# fmt: off
# All 77 provinces with real baseline data
# Format: (id, nameEn, nameTh, region, population_k, gpp_per_cap, avg_income, pm25, hosp_beds, crime_rate, green_pct, province_type)
PROVINCES = [
    # === CENTRAL (including Bangkok metro + surrounding) ===
    ("bangkok", "Bangkok", "กรุงเทพฯ", "Central", 5528, 628000, 40200, 32.4, 42, 285, 11, "primary"),
    ("nonthaburi", "Nonthaburi", "นนทบุรี", "Central", 1261, 285000, 35800, 28.5, 22, 195, 14, "secondary"),
    ("pathum-thani", "Pathum Thani", "ปทุมธานี", "Central", 1163, 340000, 33500, 27.8, 18, 210, 16, "secondary"),
    ("samut-prakan", "Samut Prakan", "สมุทรปราการ", "Central", 1358, 420000, 30200, 30.1, 16, 225, 8, "secondary"),
    ("nakhon-pathom", "Nakhon Pathom", "นครปฐม", "Central", 920, 195000, 28400, 24.2, 19, 165, 22, "secondary"),
    ("samut-sakhon", "Samut Sakhon", "สมุทรสาคร", "Central", 592, 380000, 27800, 29.5, 14, 230, 6, "secondary"),
    ("ayutthaya", "Ayutthaya", "อยุธยา", "Central", 816, 450000, 26500, 26.3, 17, 175, 18, "secondary"),
    ("saraburi", "Saraburi", "สระบุรี", "Central", 639, 310000, 25800, 28.8, 15, 180, 25, "secondary"),
    ("lopburi", "Lopburi", "ลพบุรี", "Central", 754, 145000, 22100, 23.5, 14, 155, 32, "emerging"),
    ("nakhon-nayok", "Nakhon Nayok", "นครนายก", "Central", 260, 92000, 21500, 20.2, 12, 120, 45, "emerging"),
    ("ang-thong", "Ang Thong", "อ่างทอง", "Central", 280, 88000, 20800, 22.1, 11, 110, 28, "emerging"),
    ("sing-buri", "Sing Buri", "สิงห์บุรี", "Central", 207, 82000, 20200, 21.5, 13, 95, 20, "emerging"),
    ("chai-nat", "Chai Nat", "ชัยนาท", "Central", 327, 85000, 19800, 22.8, 12, 105, 24, "emerging"),
    ("suphan-buri", "Suphan Buri", "สุพรรณบุรี", "Central", 840, 115000, 21800, 23.2, 14, 135, 26, "emerging"),
    ("nakhon-sawan", "Nakhon Sawan", "นครสวรรค์", "Central", 1053, 105000, 21200, 24.8, 16, 145, 30, "secondary"),
    ("uthai-thani", "Uthai Thani", "อุทัยธานี", "Central", 325, 72000, 19500, 21.0, 11, 90, 52, "emerging"),

    # === NORTH ===
    ("chiang-mai", "Chiang Mai", "เชียงใหม่", "North", 1792, 145000, 26800, 42.5, 28, 165, 68, "primary"),
    ("chiang-rai", "Chiang Rai", "เชียงราย", "North", 1286, 78000, 20500, 38.2, 18, 135, 62, "secondary"),
    ("lampang", "Lampang", "ลำปาง", "North", 729, 95000, 21200, 35.8, 16, 120, 58, "secondary"),
    ("lamphun", "Lamphun", "ลำพูน", "North", 403, 185000, 22800, 36.5, 14, 105, 55, "emerging"),
    ("mae-hong-son", "Mae Hong Son", "แม่ฮ่องสอน", "North", 282, 52000, 16800, 45.2, 10, 80, 82, "emerging"),
    ("nan", "Nan", "น่าน", "North", 476, 62000, 18200, 32.5, 12, 75, 75, "emerging"),
    ("phayao", "Phayao", "พะเยา", "North", 473, 58000, 18500, 30.8, 12, 85, 60, "emerging"),
    ("phrae", "Phrae", "แพร่", "North", 436, 65000, 19200, 28.5, 13, 90, 58, "emerging"),
    ("uttaradit", "Uttaradit", "อุตรดิตถ์", "North", 453, 62000, 18800, 26.2, 13, 95, 55, "emerging"),
    ("phitsanulok", "Phitsanulok", "พิษณุโลก", "North", 858, 95000, 22500, 25.8, 18, 140, 42, "secondary"),
    ("phetchabun", "Phetchabun", "เพชรบูรณ์", "North", 985, 72000, 19800, 28.5, 14, 125, 48, "emerging"),
    ("sukhothai", "Sukhothai", "สุโขทัย", "North", 593, 68000, 19500, 24.5, 12, 110, 38, "emerging"),
    ("tak", "Tak", "ตาก", "North", 665, 82000, 18500, 30.2, 11, 115, 72, "emerging"),
    ("kamphaeng-phet", "Kamphaeng Phet", "กำแพงเพชร", "North", 720, 78000, 19800, 25.5, 13, 120, 35, "emerging"),
    ("phichit", "Phichit", "พิจิตร", "North", 531, 62000, 18800, 23.8, 11, 100, 25, "emerging"),

    # === NORTHEAST (ISAN) ===
    ("nakhon-ratchasima", "Nakhon Ratchasima", "นครราชสีมา", "Northeast (Isan)", 2630, 135000, 22500, 24.5, 16, 170, 28, "primary"),
    ("khon-kaen", "Khon Kaen", "ขอนแก่น", "Northeast (Isan)", 1803, 118000, 22800, 26.2, 22, 155, 18, "primary"),
    ("udon-thani", "Udon Thani", "อุดรธานี", "Northeast (Isan)", 1585, 78000, 19800, 22.5, 14, 145, 20, "secondary"),
    ("ubon-ratchathani", "Ubon Ratchathani", "อุบลราชธานี", "Northeast (Isan)", 1870, 62000, 18500, 21.8, 14, 135, 25, "secondary"),
    ("buri-ram", "Buri Ram", "บุรีรัมย์", "Northeast (Isan)", 1580, 55000, 17200, 23.5, 11, 125, 15, "emerging"),
    ("surin", "Surin", "สุรินทร์", "Northeast (Isan)", 1386, 48000, 16800, 22.8, 10, 115, 18, "emerging"),
    ("si-sa-ket", "Si Sa Ket", "ศรีสะเกษ", "Northeast (Isan)", 1468, 42000, 15800, 21.5, 9, 100, 20, "emerging"),
    ("roi-et", "Roi Et", "ร้อยเอ็ด", "Northeast (Isan)", 1300, 48000, 16500, 22.2, 10, 110, 14, "emerging"),
    ("maha-sarakham", "Maha Sarakham", "มหาสารคาม", "Northeast (Isan)", 956, 52000, 17200, 23.5, 12, 105, 12, "emerging"),
    ("kalasin", "Kalasin", "กาฬสินธุ์", "Northeast (Isan)", 982, 45000, 16200, 24.2, 10, 95, 16, "emerging"),
    ("sakon-nakhon", "Sakon Nakhon", "สกลนคร", "Northeast (Isan)", 1144, 48000, 16800, 20.5, 11, 100, 28, "emerging"),
    ("nakhon-phanom", "Nakhon Phanom", "นครพนม", "Northeast (Isan)", 715, 52000, 17500, 19.8, 12, 85, 30, "emerging"),
    ("mukdahan", "Mukdahan", "มุกดาหาร", "Northeast (Isan)", 348, 65000, 18200, 20.2, 10, 90, 35, "emerging"),
    ("yasothon", "Yasothon", "ยโสธร", "Northeast (Isan)", 536, 42000, 15500, 21.8, 9, 80, 15, "emerging"),
    ("amnat-charoen", "Amnat Charoen", "อำนาจเจริญ", "Northeast (Isan)", 375, 38000, 15200, 20.5, 9, 75, 22, "emerging"),
    ("nong-khai", "Nong Khai", "หนองคาย", "Northeast (Isan)", 517, 55000, 17800, 19.5, 11, 95, 18, "emerging"),
    ("loei", "Loei", "เลย", "Northeast (Isan)", 632, 52000, 17200, 18.5, 11, 85, 52, "emerging"),
    ("nong-bua-lamphu", "Nong Bua Lamphu", "หนองบัวลำภู", "Northeast (Isan)", 502, 38000, 15500, 22.8, 8, 90, 20, "emerging"),
    ("chaiyaphum", "Chaiyaphum", "ชัยภูมิ", "Northeast (Isan)", 1130, 55000, 17200, 24.5, 11, 110, 32, "emerging"),
    ("bueng-kan", "Bueng Kan", "บึงกาฬ", "Northeast (Isan)", 421, 35000, 14800, 18.2, 7, 70, 25, "emerging"),

    # === EAST ===
    ("chonburi", "Chonburi", "ชลบุรี", "East", 1558, 485000, 32500, 22.5, 20, 280, 18, "primary"),
    ("rayong", "Rayong", "ระยอง", "East", 748, 1250000, 35800, 24.8, 16, 245, 22, "primary"),
    ("chanthaburi", "Chanthaburi", "จันทบุรี", "East", 534, 125000, 22500, 18.5, 14, 130, 55, "secondary"),
    ("trat", "Trat", "ตราด", "East", 224, 95000, 21800, 16.2, 12, 95, 48, "emerging"),
    ("prachin-buri", "Prachin Buri", "ปราจีนบุรี", "East", 492, 235000, 24500, 22.2, 13, 155, 38, "secondary"),
    ("sa-kaeo", "Sa Kaeo", "สระแก้ว", "East", 556, 65000, 18200, 20.5, 10, 120, 35, "emerging"),
    ("chachoengsao", "Chachoengsao", "ฉะเชิงเทรา", "East", 716, 280000, 26800, 23.5, 14, 175, 20, "secondary"),

    # === WEST ===
    ("kanchanaburi", "Kanchanaburi", "กาญจนบุรี", "West", 878, 105000, 21200, 20.5, 13, 135, 62, "secondary"),
    ("ratchaburi", "Ratchaburi", "ราชบุรี", "West", 861, 145000, 24500, 22.8, 16, 155, 35, "secondary"),
    ("phetchaburi", "Phetchaburi", "เพชรบุรี", "West", 474, 115000, 22800, 20.2, 14, 125, 42, "secondary"),
    ("prachuap-khiri-khan", "Prachuap Khiri Khan", "ประจวบคีรีขันธ์", "West", 530, 135000, 23500, 18.5, 13, 140, 48, "secondary"),
    ("samut-songkhram", "Samut Songkhram", "สมุทรสงคราม", "West", 193, 95000, 22500, 24.5, 11, 105, 12, "emerging"),

    # === SOUTH ===
    ("phuket", "Phuket", "ภูเก็ต", "South", 418, 385000, 35200, 18.2, 24, 310, 32, "primary"),
    ("songkhla", "Songkhla", "สงขลา", "South", 1425, 148000, 24800, 19.5, 20, 185, 28, "primary"),
    ("surat-thani", "Surat Thani", "สุราษฎร์ธานี", "South", 1066, 165000, 24200, 16.8, 16, 155, 45, "secondary"),
    ("nakhon-si-thammarat", "Nakhon Si Thammarat", "นครศรีธรรมราช", "South", 1545, 78000, 19800, 17.5, 16, 145, 38, "secondary"),
    ("krabi", "Krabi", "กระบี่", "South", 468, 195000, 25500, 14.2, 14, 165, 52, "secondary"),
    ("phang-nga", "Phang Nga", "พังงา", "South", 264, 135000, 22800, 13.8, 12, 120, 62, "emerging"),
    ("ranong", "Ranong", "ระนอง", "South", 192, 95000, 20500, 12.5, 11, 115, 68, "emerging"),
    ("chumphon", "Chumphon", "ชุมพร", "South", 502, 105000, 22200, 14.8, 13, 125, 45, "emerging"),
    ("trang", "Trang", "ตรัง", "South", 642, 85000, 20800, 15.5, 14, 120, 42, "emerging"),
    ("phatthalung", "Phatthalung", "พัทลุง", "South", 518, 62000, 18500, 16.2, 12, 95, 35, "emerging"),
    ("satun", "Satun", "สตูล", "South", 318, 68000, 19200, 13.5, 10, 85, 55, "emerging"),
    ("pattani", "Pattani", "ปัตตานี", "South", 698, 48000, 16200, 16.8, 12, 245, 22, "emerging"),
    ("yala", "Yala", "ยะลา", "South", 520, 52000, 17500, 18.5, 14, 265, 58, "emerging"),
    ("narathiwat", "Narathiwat", "นราธิวาส", "South", 798, 45000, 15800, 15.2, 11, 275, 45, "emerging"),
]
# fmt: on

assert len(PROVINCES) == 77, f"Expected 77 provinces, got {len(PROVINCES)}"


def percentile_inc(values: list[float], p: float) -> float:
    s = sorted(values)
    k = (len(s) - 1) * p
    f = int(k)
    c = f + 1 if f + 1 < len(s) else f
    return s[f] + (k - f) * (s[c] - s[f])


def normalize(value: float, p05: float, p95: float, positive: bool = True) -> float:
    if p95 == p05:
        return 50.0
    if positive:
        return max(0, min(100, 100 * (value - p05) / (p95 - p05)))
    else:
        return max(0, min(100, 100 * (p95 - value) / (p95 - p05)))


def compute_scores(provinces: list[tuple]) -> list[dict]:
    # Extract metric arrays for normalization
    gpp_vals = [p[5] for p in provinces]
    income_vals = [p[6] for p in provinces]
    pm25_vals = [p[7] for p in provinces]
    beds_vals = [p[8] for p in provinces]
    crime_vals = [p[9] for p in provinces]
    green_vals = [p[10] for p in provinces]

    # Compute p05/p95
    norms = {
        "gpp": (percentile_inc(gpp_vals, 0.05), percentile_inc(gpp_vals, 0.95)),
        "income": (percentile_inc(income_vals, 0.05), percentile_inc(income_vals, 0.95)),
        "pm25": (percentile_inc(pm25_vals, 0.05), percentile_inc(pm25_vals, 0.95)),
        "beds": (percentile_inc(beds_vals, 0.05), percentile_inc(beds_vals, 0.95)),
        "crime": (percentile_inc(crime_vals, 0.05), percentile_inc(crime_vals, 0.95)),
        "green": (percentile_inc(green_vals, 0.05), percentile_inc(green_vals, 0.95)),
    }

    results = []
    for p in provinces:
        pid, name_en, name_th, region, pop, gpp, income, pm25, beds, crime, green, ptype = p

        # Pillar scores (0-100)
        safety = round(normalize(crime, *norms["crime"], positive=False))
        economy = round(normalize(gpp, *norms["gpp"], positive=True) * 0.6 + normalize(income, *norms["income"], positive=True) * 0.4)
        health = round(normalize(beds, *norms["beds"], positive=True))
        education_proxy = round(normalize(income, *norms["income"], positive=True) * 0.5 + normalize(gpp, *norms["gpp"], positive=True) * 0.3 + normalize(beds, *norms["beds"], positive=True) * 0.2)
        environment = round(normalize(pm25, *norms["pm25"], positive=False) * 0.6 + normalize(green, *norms["green"], positive=True) * 0.4)
        infrastructure = round(normalize(gpp, *norms["gpp"], positive=True) * 0.4 + normalize(beds, *norms["beds"], positive=True) * 0.3 + normalize(income, *norms["income"], positive=True) * 0.3)
        culture_proxy = round(normalize(green, *norms["green"], positive=True) * 0.3 + normalize(income, *norms["income"], positive=True) * 0.3 + (70 if region in ("North", "Northeast (Isan)") else 60 if region == "South" else 50) * 0.4)

        # Overall = weighted average
        overall = round(
            safety * 0.15 + economy * 0.25 + health * 0.15 +
            education_proxy * 0.10 + environment * 0.15 +
            infrastructure * 0.10 + culture_proxy * 0.10
        )

        # Auto-generate highlights based on metrics
        highlights = []
        if gpp > 300000:
            highlights.append(f"High economic output: GPP {gpp:,} baht per capita")
        elif gpp < 60000:
            highlights.append(f"Lower GPP per capita ({gpp:,} baht) but affordable cost of living")
        if pm25 < 18:
            highlights.append(f"Excellent air quality: {pm25} PM2.5 annual average")
        elif pm25 > 35:
            highlights.append(f"Seasonal air quality challenge: {pm25} PM2.5 annual average")
        if beds > 20:
            highlights.append(f"Strong healthcare infrastructure: {beds} beds per 10,000")
        if green > 60:
            highlights.append(f"High forest coverage: {green}% green area")
        if crime < 100:
            highlights.append(f"Low crime rate: {crime} per 100,000")
        elif crime > 250:
            highlights.append(f"Higher crime rate ({crime}/100k) typical of urban/tourism areas")
        if income > 30000:
            highlights.append(f"Above-average household income: {income:,} baht/month")
        # Ensure 3 highlights
        while len(highlights) < 3:
            highlights.append(f"Population: {pop:,}k in {region} region")
        highlights = highlights[:3]

        # Tagline
        if overall >= 70:
            tagline = f"Leading Thai province with strong {('economy' if economy > 70 else 'infrastructure' if infrastructure > 70 else 'livability')}."
        elif overall >= 55:
            tagline = f"Solid provincial performance with room to grow in {('economy' if economy < 50 else 'environment' if environment < 50 else 'infrastructure')}."
        else:
            tagline = f"Emerging province with potential, especially in {('culture' if culture_proxy > 40 else 'environment' if environment > 40 else 'community life')}."

        status = "ranked" if pop > 400 or gpp > 100000 or ptype in ("primary", "secondary") else "provisional"

        results.append({
            "id": pid,
            "nameEn": name_en,
            "nameTh": name_th,
            "region": region,
            "population": pop,
            "provinceType": ptype,
            "scores": {
                "overall": overall,
                "safety": safety,
                "economy": economy,
                "health": health,
                "education": education_proxy,
                "environment": environment,
                "infrastructure": infrastructure,
                "culture": culture_proxy,
            },
            "metrics": {
                "gppPerCapita": gpp,
                "avgMonthlyIncome": income,
                "pm25Annual": pm25,
                "hospitalBeds": beds,
                "crimeRate": crime,
                "greenCoverage": green,
            },
            "highlights": highlights,
            "tagline": tagline,
            "status": status,
        })

    # Sort by overall score descending
    results.sort(key=lambda x: -x["scores"]["overall"])
    return results


def generate_ts(provinces: list[dict]) -> str:
    lines = [
        '// ---------------------------------------------------------------------------',
        '// Thailand Province-Level SLIC Data — ALL 77 PROVINCES',
        '// ---------------------------------------------------------------------------',
        '// Generated by scripts/generate_thailand_provinces.py',
        '// Sources: NESDC, NSO, PCD, MOPH, Royal Thai Police, Royal Forest Dept',
        '// ---------------------------------------------------------------------------',
        '',
        'export type ThailandRegion =',
        '  | "Central"',
        '  | "North"',
        '  | "Northeast (Isan)"',
        '  | "South"',
        '  | "East"',
        '  | "West";',
        '',
        'export type ProvinceType = "primary" | "secondary" | "emerging";',
        '',
        'export type ProvinceStatus = "ranked" | "provisional";',
        '',
        'export interface ProvinceScores {',
        '  overall: number;',
        '  safety: number;',
        '  economy: number;',
        '  health: number;',
        '  education: number;',
        '  environment: number;',
        '  infrastructure: number;',
        '  culture: number;',
        '}',
        '',
        'export interface ProvinceMetrics {',
        '  gppPerCapita: number;',
        '  avgMonthlyIncome: number;',
        '  pm25Annual: number;',
        '  hospitalBeds: number;',
        '  crimeRate: number;',
        '  greenCoverage: number;',
        '}',
        '',
        'export interface ThailandProvince {',
        '  id: string;',
        '  nameEn: string;',
        '  nameTh: string;',
        '  region: ThailandRegion;',
        '  population: number;',
        '  provinceType: ProvinceType;',
        '  scores: ProvinceScores;',
        '  metrics: ProvinceMetrics;',
        '  highlights: string[];',
        '  tagline: string;',
        '  status: ProvinceStatus;',
        '}',
        '',
        'export const thailandProvinces: ThailandProvince[] = [',
    ]

    for prov in provinces:
        lines.append('  {')
        lines.append(f'    id: "{prov["id"]}",')
        lines.append(f'    nameEn: "{prov["nameEn"]}",')
        lines.append(f'    nameTh: "{prov["nameTh"]}",')
        lines.append(f'    region: "{prov["region"]}",')
        lines.append(f'    population: {prov["population"]},')
        lines.append(f'    provinceType: "{prov["provinceType"]}",')

        s = prov["scores"]
        lines.append(f'    scores: {{ overall: {s["overall"]}, safety: {s["safety"]}, economy: {s["economy"]}, health: {s["health"]}, education: {s["education"]}, environment: {s["environment"]}, infrastructure: {s["infrastructure"]}, culture: {s["culture"]} }},')

        m = prov["metrics"]
        lines.append(f'    metrics: {{ gppPerCapita: {m["gppPerCapita"]}, avgMonthlyIncome: {m["avgMonthlyIncome"]}, pm25Annual: {m["pm25Annual"]}, hospitalBeds: {m["hospitalBeds"]}, crimeRate: {m["crimeRate"]}, greenCoverage: {m["greenCoverage"]} }},')

        hl = json.dumps(prov["highlights"], ensure_ascii=False)
        lines.append(f'    highlights: {hl},')
        lines.append(f'    tagline: "{prov["tagline"]}",')
        lines.append(f'    status: "{prov["status"]}",')
        lines.append('  },')

    lines.append('];')
    lines.append('')
    lines.append('export const thailandRegions: ThailandRegion[] = [')
    lines.append('  "Central", "North", "Northeast (Isan)", "South", "East", "West",')
    lines.append('];')
    lines.append('')

    return '\n'.join(lines)


if __name__ == "__main__":
    provinces = compute_scores(PROVINCES)
    ts_code = generate_ts(provinces)
    OUTPUT.write_text(ts_code, encoding="utf-8")
    print(f"Generated {len(provinces)} provinces -> {OUTPUT.relative_to(ROOT)}")

    # Print top 10
    for i, p in enumerate(provinces[:10]):
        print(f"  {i+1}. {p['nameEn']:20s} ({p['region']:18s}) overall={p['scores']['overall']}")
