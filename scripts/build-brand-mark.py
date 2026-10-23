#!/usr/bin/env python3
"""
Build the transparent SLIC Index brand mark from the 400x400 master.

The footer used to carry a black square with "SL" set in it — a placeholder
for a mark the site did not have. It now carries the real wordmark, keyed off
its paper so it sits on the cream ground instead of inside a white plate.

The master PNG is a square with a near-white ground that is NOT flat: the
corners sit around rgb(240,245,240), the middle around rgb(255,255,255), and
the file carries compression noise (4,700 distinct colours). A constant matte
would key the corners unevenly and leave a pale rim on the mark.

So the paper is fitted as a smooth surface instead: a degree-2 polynomial per
channel, fitted only to the near-white pixels. Residual on the paper is a
median of ~1/255, so the fit is tight.

Coverage is measured by projecting each pixel onto the ray from the local
paper colour toward each ink colour. A pixel that is a blend of paper and ink
f with coverage a satisfies C - B = a (f - B), so the projection is exactly a,
and the largest projection over the palette recovers the coverage even on
anti-aliased edges.

The recovered ink colour is the measured colour where coverage is solid, and
the palette colour at partial coverage. Un-matting a single blended pixel
back to its source colour amplifies the noise by 1/a, and it showed: the edge
pixels came out a median of 40/255 pale. The artwork is flat colour, so the
palette entry IS the truth at an edge.

Outputs
-------
public/Logos/slic-index-mark.png
    The full lockup, tight-cropped, with a transparent ground.

scripts/brand-mark.provenance.json
    The SHA-256 of the master it was derived from and of the bytes it wrote.
    `test/system-integrity.test.mjs` checks both, so changing the master
    without re-deriving the mark fails the build, and a hand-edited PNG fails
    it too. A derived asset that cannot say what it was derived from is just
    an opaque blob in the repository.

    It sits beside the script rather than in `public/` on purpose: nothing
    here is published, so the record cannot drift from the served asset by
    living in two trees.

Requires numpy and Pillow. Run from anywhere:

    python3 scripts/build-brand-mark.py
"""
import hashlib
import json
import pathlib

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "public/Logos/slic-index-full.png"
OUT = ROOT / "public/Logos/slic-index-mark.png"
OUT_MONO = ROOT / "public/Logos/slic-index-monogram.png"
PROVENANCE = ROOT / "scripts/brand-mark.provenance.json"


def sha256(path):
    return hashlib.sha256(pathlib.Path(path).read_bytes()).hexdigest()


im = Image.open(SRC).convert("RGBA")
arr = np.asarray(im).astype(np.float64)
h, w, _ = arr.shape
rgb = arr[:, :, :3]

ys, xs = np.mgrid[0:h, 0:w]
xf = (xs / (w - 1)).ravel()
yf = (ys / (h - 1)).ravel()


def basis(x, y, degree=2):
    cols = []
    for i in range(degree + 1):
        for j in range(degree + 1 - i):
            cols.append((x**i) * (y**j))
    return np.stack(cols, axis=1)


B0 = basis(xf, yf, 2)

# ── the paper surface ──────────────────────────────────────────────────────
paper = (rgb.min(axis=2) > 225) & (rgb.max(axis=2) < 255.02)
paper_idx = np.flatnonzero(paper.ravel())
if paper_idx.size > 30000:
    paper_idx = paper_idx[:: max(1, paper_idx.size // 30000)]

surface = np.empty((h, w, 3))
for c in range(3):
    coef, *_ = np.linalg.lstsq(B0[paper_idx], rgb[:, :, c].ravel()[paper_idx], rcond=None)
    surface[:, :, c] = (B0 @ coef).reshape(h, w)
# The fit overshoots 255 in places, and a float over 255 cast to uint8 wraps
# to 0 - a black hole in the paper. Clamp before it can wrap.
surface = np.clip(surface, 0, 255)
resid = np.abs(rgb - surface).max(axis=2)
print(f"paper fit residual: median {np.median(resid[paper]):.2f}  p99 {np.percentile(resid[paper], 99):.2f}")

# ── the ink palette ────────────────────────────────────────────────────────
sat = rgb.max(axis=2) - rgb.min(axis=2)
strong = rgb[sat > 60]
palette = []
for cond in [
    (strong[:, 2] > 120) & (strong[:, 0] < 80) & (strong[:, 1] < 110),        # blue
    (strong[:, 1] > 110) & (strong[:, 2] > 90) & (strong[:, 0] < 90),         # teal
    (strong[:, 1] > strong[:, 0] + 40) & (strong[:, 1] > strong[:, 2] + 40),  # green
]:
    sel = strong[cond]
    if sel.shape[0] < 50:
        continue
    palette.append(np.median(sel, axis=0))
palette = np.array(palette)
print("palette:", [f"#{int(c[0]):02x}{int(c[1]):02x}{int(c[2]):02x}" for c in palette])

# ── coverage by ray projection ─────────────────────────────────────────────
delta = rgb - surface
projs = []
for f in palette:
    v = f - surface                       # paper -> ink, per pixel
    denom = np.maximum((v * v).sum(axis=2), 1e-6)
    projs.append((delta * v).sum(axis=2) / denom)
projs = np.stack(projs, axis=0)
winner = projs.argmax(axis=0)
best = projs.max(axis=0)

alpha = np.clip(best, 0.0, 1.0)
alpha[paper & (resid < 12)] = 0.0

# ── the ink colour ─────────────────────────────────────────────────────────
fg = np.empty_like(rgb)
solid = alpha >= 0.98
fg[solid] = rgb[solid]                            # measured: median error 1.0
partial = (alpha > 0.0) & (~solid)
for i, f in enumerate(palette):
    fg[partial & (winner == i)] = f               # the truth at an edge
fg[alpha <= 0.0] = surface[alpha <= 0.0]

out = np.dstack([fg, alpha * 255.0]).astype(np.uint8)
mark = Image.fromarray(out)


def tight(img, alpha_map):
    """Crop to the ink's bounding box, with a hair of breathing room."""
    rows = np.where((alpha_map > 0.02).sum(axis=1) > 0)[0]
    cols = np.where((alpha_map > 0.02).sum(axis=0) > 0)[0]
    top, bottom = int(rows[0]), int(rows[-1])
    left, right = int(cols[0]), int(cols[-1])
    pad = 4
    box = (
        max(0, left - pad),
        max(0, top - pad),
        min(img.size[0], right + 1 + pad),
        min(img.size[1], bottom + 1 + pad),
    )
    return img.crop(box), box


mark_tight, mark_box = tight(mark, alpha)

# The mark is painted at 68px in the masthead and 72px in the footer. The
# master it is cut from is 400×400, so the cut is 389px wide — and 389px of
# file for 68px of mark is 5.7× more pixels than any screen can show, for a
# file the reader downloads on every route. The artwork is delivered at the
# size it is used: 160px, which is 2× the masthead's box.
#
# This is not a thumbnail made at request time. The mark is derived artwork,
# and what ships is the derived bytes — so the size is part of the derivation
# and the provenance below records it.
MARK_WIDTH = 160
if mark_tight.size[0] > MARK_WIDTH:
    height = max(1, round(mark_tight.size[1] * MARK_WIDTH / mark_tight.size[0]))
    mark_tight = mark_tight.resize((MARK_WIDTH, height), Image.LANCZOS)

mark_tight.save(OUT, optimize=True)
print(f"wrote {OUT.relative_to(ROOT)}  {mark_tight.size}  (ink box {mark_box})")

# ── the monogram ───────────────────────────────────────────────────────────
# The lockup stacks "SLIC" over "INDEX". A row of partner logos needs the
# wordmark on its own: the "INDEX" line is tracked caps under a 389px word,
# and at partner-strip size it turns to a grey smear.
#
# The divide is the widest EMPTY band of rows between the two lines — not a
# fraction of the height. A percentage guess cut the wrong side of the word
# and produced a monogram that still carried "INDEX".
row_ink = (alpha > 0.5).sum(axis=1)
ink_rows = np.where(row_ink > 0)[0]
top, bottom = int(ink_rows[0]), int(ink_rows[-1])
empty = row_ink <= 0
runs = []
x = 0
while x < len(empty):
    if empty[x]:
        y = x
        while y < len(empty) and empty[y]:
            y += 1
        runs.append((x, y - x))
        x = y
    else:
        x += 1
interior = [r for r in runs if r[0] > top and r[0] + r[1] <= bottom]
if not interior:
    raise SystemExit("no interior gap found: the lockup is one line, no monogram to cut")
cut, _ = max(interior, key=lambda r: r[1])
mono_alpha = alpha.copy()
mono_alpha[cut:, :] = 0.0
mono, mono_box = tight(mark, mono_alpha)

# The monogram is painted at 122px in the footer's supporter row and at 161px
# on a profile card. The cut is 389px wide, which is more than three times
# either box — so the delivery size is part of the derivation, exactly as it
# is for the wordmark above.
MONOGRAM_WIDTH = 336
if mono.size[0] > MONOGRAM_WIDTH:
    height = max(1, round(mono.size[1] * MONOGRAM_WIDTH / mono.size[0]))
    mono = mono.resize((MONOGRAM_WIDTH, height), Image.LANCZOS)

mono.save(OUT_MONO, optimize=True)
print(f"wrote {OUT_MONO.relative_to(ROOT)}  {mono.size}  (ink box {mono_box})")
print(f"  ink rows {top}..{bottom}, cut at {cut}")

# ── verify ─────────────────────────────────────────────────────────────────
check = np.asarray(mark).astype(float)
a = check[:, :, 3] / 255.0
edge = (a > 0.02) & (a < 0.98)
d = np.abs(check[:, :, :3][edge][:, None, :] - palette[None, :, :]).max(axis=2)
print(f"  edge pixels {int(edge.sum())}: distance to nearest ink "
      f"median {np.median(d.min(axis=1)):.1f}  max {d.min(axis=1).max():.1f}")
print(f"  solid pixels that are still paper-coloured: {int((solid & (check[:,:,:3].min(axis=2) > 235)).sum())}")
print(f"  transparent pixels that carry ink: {int(((a < 0.01) & (check[:,:,:3].max(axis=2) < 200)).sum())}")

# ── provenance ─────────────────────────────────────────────────────────────
PROVENANCE.write_text(
    json.dumps(
        {
            "source": "/Logos/slic-index-full.png",
            "sourceSha256": sha256(SRC),
            "output": "/Logos/slic-index-mark.png",
            "outputSha256": sha256(OUT),
            "monogram": "/Logos/slic-index-monogram.png",
            "monogramSha256": sha256(OUT_MONO),
            "width": mark_tight.size[0],
            "height": mark_tight.size[1],
            "monogramWidth": mono.size[0],
            "monogramHeight": mono.size[1],
            "tool": "scripts/build-brand-mark.py",
        },
        indent=2,
    )
    + "\n"
)
print(f"wrote {PROVENANCE.relative_to(ROOT)}")
