"""
SLIC Index V3 — og:image generator
Produces: public/og-image.png  (1200 × 630)

Method: reportlab canvas at 1200×630 pt → PDF → sips (macOS) → PNG

Run from project root:
    python3 scripts/generate_og_image.py
"""

from __future__ import annotations
import math
import subprocess
import tempfile
from pathlib import Path

from reportlab.lib import colors
from reportlab.pdfgen import canvas as rl_canvas

ROOT   = Path(__file__).parent.parent
OUTPUT = ROOT / "public" / "og-image.png"
LOGOS  = ROOT / "public" / "Logos"

W, H = 1200, 630   # px / pt (1:1 at 72 dpi)

# ── Palette ───────────────────────────────────────────────────────────────────
BG      = colors.HexColor("#f8f5f0")
TEXT    = colors.HexColor("#1c1914")
ACCENT  = colors.HexColor("#b85c28")
MUTED   = colors.HexColor("#6b6459")
FAINT   = colors.HexColor("#9a9088")
RULE    = colors.HexColor("#d8d0c8")
WHITE   = colors.white

# Pillar colours (spider)
P_COLS = [
    colors.HexColor("#b85c28"),  # Growth
    colors.HexColor("#1a6b5a"),  # Viability
    colors.HexColor("#2a5a8c"),  # Capability
    colors.HexColor("#8c4a2a"),  # Community
    colors.HexColor("#a0382a"),  # Creative
]
P_LABELS = ["Growth", "Viability", "Capability", "Community", "Creative"]

# Representative pillar scores (top-ranked-city feel — not a specific city)
P_SCORES = [0.72, 0.85, 0.90, 0.68, 0.60]


def spider(c: rl_canvas.Canvas, cx: float, cy: float, r: float, scores: list[float]):
    """Draw a pentagon radar chart on the canvas."""
    n = 5
    angles = [math.pi / 2 + 2 * math.pi * i / n for i in range(n)]  # start top

    # Grid rings at 25 / 50 / 75 / 100
    for frac in (0.25, 0.50, 0.75, 1.0):
        pts = [(cx + r * frac * math.cos(a), cy + r * frac * math.sin(a)) for a in angles]
        c.setStrokeColor(RULE)
        c.setLineWidth(0.5 if frac < 1.0 else 0.8)
        path = c.beginPath()
        path.moveTo(*pts[0])
        for p in pts[1:]:
            path.lineTo(*p)
        path.close()
        c.drawPath(path, stroke=1, fill=0)

    # Spokes
    c.setStrokeColor(RULE)
    c.setLineWidth(0.5)
    for a in angles:
        c.line(cx, cy, cx + r * math.cos(a), cy + r * math.sin(a))

    # Score polygon — filled
    s_pts = [(cx + r * s * math.cos(a), cy + r * s * math.sin(a)) for a, s in zip(angles, scores)]
    fill_col = colors.HexColor("#b85c28")
    c.setFillColor(colors.Color(fill_col.red, fill_col.green, fill_col.blue, alpha=0.18))
    c.setStrokeColor(ACCENT)
    c.setLineWidth(1.5)
    path = c.beginPath()
    path.moveTo(*s_pts[0])
    for p in s_pts[1:]:
        path.lineTo(*p)
    path.close()
    c.drawPath(path, stroke=1, fill=1)

    # Score dots
    for p in s_pts:
        c.setFillColor(ACCENT)
        c.circle(p[0], p[1], 3.5, stroke=0, fill=1)

    # Pillar labels
    c.setFillColor(TEXT)
    label_r = r + 22
    for i, (a, label) in enumerate(zip(angles, P_LABELS)):
        lx = cx + label_r * math.cos(a)
        ly = cy + label_r * math.sin(a)
        # alignment: top spoke centred, others edge-anchored
        c.setFont("Helvetica-Bold", 9)
        # measure approximate text width
        tw = c.stringWidth(label, "Helvetica-Bold", 9)
        # nudge x so label doesn't clip
        if math.cos(a) < -0.3:
            lx -= tw
        elif abs(math.cos(a)) <= 0.3:
            lx -= tw / 2
        c.drawString(lx, ly - 4, label)


def draw(pdf_path: str):
    c = rl_canvas.Canvas(pdf_path, pagesize=(W, H))
    c.setPageCompression(0)

    # ── Background ────────────────────────────────────────────────────────────
    c.setFillColor(BG)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    # ── Left panel: text ──────────────────────────────────────────────────────
    margin_l = 64
    baseline = H / 2 + 10

    # Eyebrow
    c.setFillColor(FAINT)
    c.setFont("Helvetica", 10.5)
    c.drawString(margin_l, baseline + 148, "SMART AND LIVEABLE CITIES INDEX")

    # Main wordmark
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 76)
    c.drawString(margin_l, baseline + 68, "SLIC")

    # Version + year
    c.setFillColor(ACCENT)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(margin_l, baseline + 44, "V3  ·  2026")

    # Horizontal rule
    c.setStrokeColor(RULE)
    c.setLineWidth(0.8)
    c.line(margin_l, baseline + 34, margin_l + 460, baseline + 34)

    # Data chips
    chips = [("157", "CITIES"), ("35", "INDICATORS"), ("8", "INDICES COMPARED")]
    chip_x = margin_l
    for num, label in chips:
        c.setFillColor(ACCENT)
        c.setFont("Helvetica-Bold", 18)
        c.drawString(chip_x, baseline + 14, num)
        nw = c.stringWidth(num, "Helvetica-Bold", 18)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 9.5)
        c.drawString(chip_x + nw + 3, baseline + 16, label)
        total_w = nw + 3 + c.stringWidth(label, "Helvetica", 9.5)
        chip_x += total_w + 26

    # Tagline
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Oblique", 14)
    c.drawString(margin_l, baseline - 16, "Not a ranking. A reality check.")

    # Publisher line
    c.setFillColor(FAINT)
    c.setFont("Helvetica", 9)
    c.drawString(margin_l, baseline - 40, "A DEPA × PMU-A project  ·  reTL")

    # ── Vertical separator ────────────────────────────────────────────────────
    c.setStrokeColor(RULE)
    c.setLineWidth(0.6)
    c.line(580, 48, 580, H - 48)

    # ── Right panel: spider ───────────────────────────────────────────────────
    spider_cx = 580 + (W - 580) / 2      # 890
    spider_cy = H / 2 + 10               # 325
    spider_r  = 148
    spider(c, spider_cx, spider_cy, spider_r, P_SCORES)

    # ── Bottom strip ──────────────────────────────────────────────────────────
    c.setFillColor(ACCENT)
    c.rect(0, 0, W, 3, stroke=0, fill=1)

    c.setFillColor(FAINT)
    c.setFont("Helvetica", 9)
    c.drawCentredString(W / 2, 12, "slic.index  ·  depa.or.th  ·  retl.co")

    c.save()


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp_pdf = tmp.name

    draw(tmp_pdf)

    # Convert PDF → PNG using macOS sips (72dpi = 1pt per pixel → 1200×630)
    result = subprocess.run(
        ["sips", "-s", "format", "png", tmp_pdf, "--out", str(OUTPUT)],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"sips error: {result.stderr}")
        raise RuntimeError("sips conversion failed")

    Path(tmp_pdf).unlink(missing_ok=True)

    # Verify dimensions
    dim = subprocess.run(
        ["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(OUTPUT)],
        capture_output=True, text=True
    ).stdout
    print(f"✓ {OUTPUT}")
    print(f"  {dim.strip()}")


if __name__ == "__main__":
    main()
